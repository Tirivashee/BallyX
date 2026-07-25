"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { createUnsubscribeToken } from "@/lib/auth/unsubscribe-token";
import { query } from "@/lib/db";
import { sendBatchEmail } from "@/lib/email/send";
import { brand } from "@/lib/site-config";

export type ActionState = {
  status: "idle" | "success" | "error";
  message?: string;
};

const TemplateSchema = z.object({
  name: z.string().trim().min(1, "Name is required.").max(200),
  subject: z.string().trim().min(1, "Subject is required.").max(300),
  bodyHtml: z.string().trim().min(1, "Body is required."),
  bodyText: z.string().trim().optional().or(z.literal("")),
});

function parseTemplateForm(formData: FormData) {
  return TemplateSchema.safeParse({
    name: formData.get("name"),
    subject: formData.get("subject"),
    bodyHtml: formData.get("bodyHtml"),
    bodyText: formData.get("bodyText"),
  });
}

export async function createTemplate(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = parseTemplateForm(formData);
  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? "Please check the highlighted fields.",
    };
  }
  const d = parsed.data;

  await query(
    `INSERT INTO email_templates (name, subject, body_html, body_text) VALUES ($1, $2, $3, $4)`,
    [d.name, d.subject, d.bodyHtml, d.bodyText || ""],
  );

  revalidatePath("/dashboard/newsletter");
  redirect("/dashboard/newsletter");
}

export async function updateTemplate(
  id: number,
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = parseTemplateForm(formData);
  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? "Please check the highlighted fields.",
    };
  }
  const d = parsed.data;

  await query(
    `UPDATE email_templates
     SET name = $1, subject = $2, body_html = $3, body_text = $4, updated_at = now()
     WHERE id = $5`,
    [d.name, d.subject, d.bodyHtml, d.bodyText || "", id],
  );

  revalidatePath("/dashboard/newsletter");
  redirect("/dashboard/newsletter");
}

export async function deleteTemplate(id: number): Promise<void> {
  await query(`DELETE FROM email_templates WHERE id = $1`, [id]);
  revalidatePath("/dashboard/newsletter");
}

const SendSchema = z.object({
  subject: z.string().trim().min(1, "Subject is required.").max(300),
  bodyHtml: z.string().trim().min(1, "Body is required."),
  templateId: z.string().trim().optional().or(z.literal("")),
});

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export async function sendNewsletter(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  // Fail fast rather than sending marketing email with no working
  // unsubscribe mechanism — same "refuse rather than degrade silently"
  // pattern as SESSION_SECRET elsewhere in this codebase.
  if (!process.env.UNSUBSCRIBE_SECRET) {
    return { status: "error", message: "UNSUBSCRIBE_SECRET is not configured." };
  }

  const parsed = SendSchema.safeParse({
    subject: formData.get("subject"),
    bodyHtml: formData.get("bodyHtml"),
    templateId: formData.get("templateId"),
  });
  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? "Please check the highlighted fields.",
    };
  }
  const { subject, bodyHtml } = parsed.data;
  const templateId = parsed.data.templateId ? Number(parsed.data.templateId) : null;

  const recipients = await query<{ id: number; email: string }>(
    `SELECT id, email FROM users WHERE newsletter_subscribed = true AND deleted_at IS NULL`,
  );
  if (recipients.length === 0) {
    return { status: "error", message: "No subscribed users to send to." };
  }

  const [sendRow] = await query<{ id: number }>(
    `INSERT INTO newsletter_sends (template_id, subject, status, total_recipients, started_at)
     VALUES ($1, $2, 'sending', $3, now())
     RETURNING id`,
    [templateId, subject, recipients.length],
  );
  const sendId = sendRow.id;

  // unnest() over parallel arrays keeps INSERT ... RETURNING row order
  // matching `recipients`' order, so recipientRows[i] lines up with
  // recipients[i] and, below, with results[i] from sendBatchEmail.
  const recipientRows = await query<{ id: number; user_id: number; email: string }>(
    `INSERT INTO newsletter_send_recipients (send_id, user_id, email)
     SELECT $1, uid, em FROM unnest($2::int[], $3::text[]) AS t(uid, em)
     RETURNING id, user_id, email`,
    [sendId, recipients.map((r) => r.id), recipients.map((r) => r.email)],
  );

  try {
    const emails = await Promise.all(
      recipients.map(async (recipient) => {
        const token = await createUnsubscribeToken(recipient.id);
        const unsubscribeUrl = `${brand.url}/unsubscribe?u=${recipient.id}&t=${token}`;
        const html = `${bodyHtml}<p style="margin-top:32px;font-size:12px;color:#888;">
          <a href="${unsubscribeUrl}">Unsubscribe</a> from BallyX emails.</p>`;
        const text = `${stripHtml(bodyHtml)}\n\nUnsubscribe: ${unsubscribeUrl}`;
        return { to: recipient.email, subject, html, text };
      }),
    );

    const results = await sendBatchEmail(emails);

    let sentCount = 0;
    let failedCount = 0;
    for (let i = 0; i < results.length; i++) {
      const result = results[i];
      const row = recipientRows[i];
      if (result.ok) sentCount++;
      else failedCount++;
      await query(
        `UPDATE newsletter_send_recipients SET status = $1, error = $2, sent_at = $3 WHERE id = $4`,
        [result.ok ? "sent" : "failed", result.error ?? null, result.ok ? new Date() : null, row.id],
      );
    }

    // 'completed' here means the batch finished, not that every recipient
    // succeeded — per-recipient outcomes are already tracked above; only
    // a thrown error (caught below) marks the whole send 'failed'.
    await query(
      `UPDATE newsletter_sends
       SET status = 'completed', sent_count = $1, failed_count = $2, completed_at = now()
       WHERE id = $3`,
      [sentCount, failedCount, sendId],
    );
  } catch (err) {
    console.error("Newsletter send failed:", err);
    await query(
      `UPDATE newsletter_sends SET status = 'failed', completed_at = now() WHERE id = $1`,
      [sendId],
    );
    return { status: "error", message: "Send failed partway through — check the send log." };
  }

  revalidatePath("/dashboard/newsletter");
  return { status: "success", message: `Sent to ${recipients.length} subscriber(s).` };
}
