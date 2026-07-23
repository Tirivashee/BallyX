"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { hash as hashPassword, verify as verifyPasswordHash } from "@node-rs/argon2";
import { z } from "zod";

import { normalizeEmail } from "@/lib/auth/email";
import { safeNextPath } from "@/lib/auth/next-path";
import { checkRateLimit, getClientIp } from "@/lib/auth/rate-limit";
import { createSessionToken, sessionCookieOptions, SESSION_COOKIE } from "@/lib/auth/session";
import { query } from "@/lib/db";
import { auth } from "@/lib/site-config";

const SigninSchema = z.object({
  email: z.string().trim().email("Please enter a valid email address.").max(200),
  password: z.string().min(1, "Please enter your password.").max(200),
});

export type SigninState = {
  status: "idle" | "error";
  message?: string;
};

// A fixed hash, computed once per server lifetime rather than per
// request, that a lookup-miss is verified against — so a request for an
// email that doesn't exist takes the same argon2-verify time as one that
// does, closing the same class of timing oracle invariant 2 closes at
// signup (see lib/actions/signup.ts).
let dummyHashPromise: Promise<string> | null = null;
function getDummyHash(): Promise<string> {
  if (!dummyHashPromise) {
    dummyHashPromise = hashPassword("ballyx-signin-dummy-password-for-timing-safety");
  }
  return dummyHashPromise;
}

export async function submitSignin(
  _prevState: SigninState,
  formData: FormData,
): Promise<SigninState> {
  const parsed = SigninSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { status: "error", message: auth.signin.errorInvalidCredentials };
  }

  const { password } = parsed.data;
  const email = normalizeEmail(parsed.data.email);

  const ip = await getClientIp();
  const allowed = await checkRateLimit(`signin:ip:${ip}`, 10);
  if (!allowed) {
    return { status: "error", message: auth.signin.errorRateLimited };
  }

  const rows = await query<{ id: number; password_hash: string; email_verified_at: string | null }>(
    `SELECT id, password_hash, email_verified_at FROM users WHERE email = $1`,
    [email],
  );
  const user = rows[0];

  const valid = user
    ? await verifyPasswordHash(user.password_hash, password)
    : await verifyPasswordHash(await getDummyHash(), password);

  if (!user || !valid) {
    return { status: "error", message: auth.signin.errorInvalidCredentials };
  }

  if (!user.email_verified_at) {
    return { status: "error", message: auth.signin.errorUnverified };
  }

  const token = await createSessionToken(user.id);
  if (!token) {
    console.error("SESSION_SECRET is not configured.");
    return { status: "error", message: auth.signup.genericError };
  }

  const jar = await cookies();
  jar.set(SESSION_COOKIE, token, sessionCookieOptions);

  redirect(safeNextPath(formData.get("next"), "/"));
}
