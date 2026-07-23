"use server";

import { hash as hashPassword } from "@node-rs/argon2";
import { z } from "zod";

import { normalizeEmail } from "@/lib/auth/email";
import { checkRateLimit, getClientIp } from "@/lib/auth/rate-limit";
import { EMAIL_VERIFICATION_TOKEN_TTL_MS, generateRawToken, hashToken } from "@/lib/auth/tokens";
import { query } from "@/lib/db";
import { confirmSignupEmail, existingAccountNoticeEmail } from "@/lib/email/templates/confirm-signup";
import { sendEmail } from "@/lib/email/send";
import { auth, brand } from "@/lib/site-config";

const SignupSchema = z.object({
  email: z.string().trim().email("Please enter a valid email address.").max(200),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .max(200, "That password is too long."),
  // Honeypot — see lib/actions/contact.ts for the convention this follows.
  website: z.string().max(0).optional().or(z.literal("")),
});

export type SignupState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Partial<Record<"email" | "password", string[]>>;
};

// Every non-validation outcome (new account, existing account, rate
// limited, honeypot tripped) returns this exact state — see invariant 3
// in the plan: the response must not reveal which case happened.
const NEUTRAL_STATE: SignupState = { status: "success", message: auth.signup.neutralMessage };

export async function submitSignup(
  _prevState: SignupState,
  formData: FormData,
): Promise<SignupState> {
  const parsed = SignupSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    website: formData.get("website"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Please check the highlighted fields and try again.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { password, website } = parsed.data;
  const email = normalizeEmail(parsed.data.email);

  // Honeypot tripped — pretend success, do nothing else.
  if (website) {
    return NEUTRAL_STATE;
  }

  const ip = await getClientIp();
  const [ipAllowed, emailAllowed] = await Promise.all([
    checkRateLimit(`signup:ip:${ip}`, 5),
    checkRateLimit(`signup:email:${email}`, 3),
  ]);
  if (!ipAllowed || !emailAllowed) {
    return NEUTRAL_STATE;
  }

  // Hash BEFORE the duplicate-email check: short-circuiting on a
  // duplicate would skip ~100ms of argon2 work, and that timing delta is
  // a reliable account-enumeration oracle regardless of response text.
  const passwordHash = await hashPassword(password);

  try {
    const inserted = await query<{ id: number }>(
      `INSERT INTO users (email, password_hash) VALUES ($1, $2)
       ON CONFLICT (email) DO NOTHING
       RETURNING id`,
      [email, passwordHash],
    );

    if (inserted.length > 0) {
      const userId = inserted[0].id;
      const rawToken = generateRawToken();
      const expiresAt = new Date(Date.now() + EMAIL_VERIFICATION_TOKEN_TTL_MS);

      await query(
        `INSERT INTO email_verification_tokens (token_hash, user_id, expires_at)
         VALUES ($1, $2, $3)`,
        [hashToken(rawToken), userId, expiresAt],
      );

      const confirmUrl = `${brand.url}/auth/confirm?token=${rawToken}`;
      const { html, text } = confirmSignupEmail({ confirmUrl, email });
      await sendEmail({ to: email, subject: auth.email.confirmSubject, html, text });
    } else {
      // Email already registered — only the inbox owner is entitled to
      // know that; the requester gets the same neutral response either way.
      const signinUrl = `${brand.url}/signin`;
      const { html, text } = existingAccountNoticeEmail({ signinUrl });
      await sendEmail({ to: email, subject: auth.email.existingAccountSubject, html, text });
    }
  } catch (error) {
    console.error("Signup failed:", error);
    return { status: "error", message: auth.signup.genericError };
  }

  return NEUTRAL_STATE;
}
