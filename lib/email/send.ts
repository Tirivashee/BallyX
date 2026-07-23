// Thin wrapper around the same Resend call lib/actions/contact.ts already
// makes (no `resend` package — @node-rs/argon2 is the only new dependency
// this auth work adds). Node-only: reads RESEND_API_KEY.
type SendEmailInput = {
  to: string;
  subject: string;
  html: string;
  text: string;
};

/**
 * With no RESEND_API_KEY configured, logs the email instead of sending it
 * — same "works out of the box in dev" fallback the contact form uses, so
 * the confirmation URL is readable straight from the server console.
 */
export async function sendEmail({ to, subject, html, text }: SendEmailInput): Promise<void> {
  const resendApiKey = process.env.RESEND_API_KEY;

  if (!resendApiKey) {
    console.log("Email (no RESEND_API_KEY configured):", { to, subject, text });
    return;
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "BallyX <onboarding@resend.dev>",
      to: [to],
      subject,
      html,
      text,
    }),
  });

  if (!res.ok) {
    throw new Error(`Resend API responded with ${res.status}`);
  }
}
