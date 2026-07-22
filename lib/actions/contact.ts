"use server";

import { z } from "zod";
import { query } from "@/lib/db";

/**
 * All input is validated here, server-side, regardless of what the client
 * form does — never trust client-side validation alone.
 */
const ContactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Please enter your name.")
    .max(100, "That name is too long."),
  email: z.string().trim().email("Please enter a valid email address.").max(200),
  company: z
    .string()
    .trim()
    .max(150, "That company name is too long.")
    .optional()
    .or(z.literal("")),
  message: z
    .string()
    .trim()
    .min(10, "Tell us a little more — at least 10 characters.")
    .max(2000, "That message is too long."),
  // Honeypot: a real visitor never fills this in (it's hidden via CSS).
  // A bot filling every field usually fills this one too.
  website: z.string().max(0).optional().or(z.literal("")),
});

export type ContactFormState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Partial<Record<keyof z.infer<typeof ContactSchema>, string[]>>;
};

export async function submitContactForm(
  _prevState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  // TODO(rate-limiting): add IP- or session-based rate limiting here
  // before doing any validation/processing work (e.g. Upstash Ratelimit,
  // or a simple in-memory/Redis token bucket keyed on request IP).

  const raw = {
    name: formData.get("name"),
    email: formData.get("email"),
    company: formData.get("company"),
    message: formData.get("message"),
    website: formData.get("website"),
  };

  const parsed = ContactSchema.safeParse(raw);

  if (!parsed.success) {
    return {
      status: "error",
      message: "Please check the highlighted fields and try again.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { name, email, company, message, website } = parsed.data;

  // Honeypot tripped — pretend success so the bot doesn't learn anything,
  // but never actually process or forward the submission.
  if (website) {
    return { status: "success" };
  }

  try {
    await query(
      `INSERT INTO contact_submissions (name, email, company, message)
       VALUES ($1, $2, $3, $4)`,
      [name, email, company || null, message],
    );
  } catch (error) {
    // Don't fail the whole submission just because the DB log didn't
    // write — the email notification below is the primary delivery path.
    console.error("Failed to save contact submission to the database:", error);
  }

  const notifyEmail = process.env.CONTACT_NOTIFY_EMAIL;
  const resendApiKey = process.env.RESEND_API_KEY;

  if (resendApiKey && notifyEmail) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "BallyX Website <onboarding@resend.dev>",
          to: [notifyEmail],
          reply_to: email,
          subject: `New contact form submission from ${name}`,
          text: `Name: ${name}\nEmail: ${email}\nCompany: ${company || "—"}\n\n${message}`,
        }),
      });

      if (!res.ok) {
        throw new Error(`Resend API responded with ${res.status}`);
      }
    } catch (error) {
      console.error("Failed to send contact notification email:", error);
      return {
        status: "error",
        message:
          "Something went wrong sending your message. Please try WhatsApp or email instead.",
      };
    }
  } else {
    // No email backend configured — log so the form still "succeeds"
    // out of the box in local development.
    console.log("New contact form submission (no email backend configured):", {
      name,
      email,
      company,
      message,
    });
  }

  return {
    status: "success",
    message: "Thanks — we've received your message and will be in touch soon.",
  };
}
