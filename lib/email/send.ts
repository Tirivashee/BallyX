// Thin wrapper around the same Resend call lib/actions/contact.ts already
// makes (no `resend` package — @node-rs/argon2 is the only new dependency
// this auth work adds). Node-only: reads RESEND_API_KEY.
import { brand } from "@/lib/site-config";

// Requires ballyx.co.zw to be added and verified as a sending domain in
// Resend (SPF/DKIM records) — see README. Sends fail with a 403 until
// that's done.
const FROM_ADDRESS = `${brand.name} <${brand.email}>`;

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
      from: FROM_ADDRESS,
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

export type BatchSendResult = { to: string; ok: boolean; error?: string };

/**
 * Sends independently-generated emails (each needs its own unsubscribe
 * link — see lib/actions/newsletter.ts) via Resend's batch endpoint,
 * chunked at 100/call (Resend's documented cap) and sent sequentially
 * rather than in parallel to stay comfortably under rate limits. Fine at
 * the "hundreds of subscribers" scale this is built for — revisit with a
 * queue if the list grows into the low thousands.
 */
export async function sendBatchEmail(
  emails: { to: string; subject: string; html: string; text: string }[],
): Promise<BatchSendResult[]> {
  const resendApiKey = process.env.RESEND_API_KEY;

  if (!resendApiKey) {
    for (const email of emails) {
      console.log("Email (no RESEND_API_KEY configured):", {
        to: email.to,
        subject: email.subject,
      });
    }
    return emails.map((e) => ({ to: e.to, ok: true }));
  }

  const CHUNK_SIZE = 100;
  const results: BatchSendResult[] = [];

  for (let i = 0; i < emails.length; i += CHUNK_SIZE) {
    const chunk = emails.slice(i, i + CHUNK_SIZE);
    const res = await fetch("https://api.resend.com/emails/batch", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(
        chunk.map((email) => ({
          from: FROM_ADDRESS,
          to: [email.to],
          subject: email.subject,
          html: email.html,
          text: email.text,
        })),
      ),
    });

    if (!res.ok) {
      // The whole chunk failed at the transport/auth level — mark every
      // recipient in it as failed rather than silently dropping them.
      const message = `Resend batch API responded with ${res.status}`;
      results.push(...chunk.map((e) => ({ to: e.to, ok: false, error: message })));
      continue;
    }

    const body = (await res.json()) as { data?: { id?: string }[] };
    const data = body.data ?? [];
    chunk.forEach((email, idx) => {
      results.push({ to: email.to, ok: Boolean(data[idx]?.id) });
    });
  }

  return results;
}
