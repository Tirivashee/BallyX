// Read-side queries for /dashboard/newsletter. See lib/apps-admin-data.ts
// for why these live outside the "use server" lib/actions/newsletter.ts.
import { query } from "@/lib/db";

export type EmailTemplate = {
  id: number;
  name: string;
  subject: string;
  bodyHtml: string;
  bodyText: string;
};

type TemplateRow = {
  id: number;
  name: string;
  subject: string;
  body_html: string;
  body_text: string;
};

function rowToTemplate(row: TemplateRow): EmailTemplate {
  return {
    id: row.id,
    name: row.name,
    subject: row.subject,
    bodyHtml: row.body_html,
    bodyText: row.body_text,
  };
}

export async function getTemplates(): Promise<EmailTemplate[]> {
  const rows = await query<TemplateRow>(
    `SELECT id, name, subject, body_html, body_text FROM email_templates ORDER BY name`,
  );
  return rows.map(rowToTemplate);
}

export async function getTemplateById(id: number): Promise<EmailTemplate | null> {
  const rows = await query<TemplateRow>(
    `SELECT id, name, subject, body_html, body_text FROM email_templates WHERE id = $1`,
    [id],
  );
  return rows[0] ? rowToTemplate(rows[0]) : null;
}

export type NewsletterSendSummary = {
  id: number;
  subject: string;
  status: "queued" | "sending" | "completed" | "failed";
  totalRecipients: number;
  sentCount: number;
  failedCount: number;
  createdAt: string;
};

type SendRow = {
  id: number;
  subject: string;
  status: "queued" | "sending" | "completed" | "failed";
  total_recipients: number;
  sent_count: number;
  failed_count: number;
  created_at: string;
};

export async function getRecentSends(): Promise<NewsletterSendSummary[]> {
  const rows = await query<SendRow>(
    `SELECT id, subject, status, total_recipients, sent_count, failed_count, created_at
     FROM newsletter_sends ORDER BY created_at DESC LIMIT 20`,
  );
  return rows.map((row) => ({
    id: row.id,
    subject: row.subject,
    status: row.status,
    totalRecipients: row.total_recipients,
    sentCount: row.sent_count,
    failedCount: row.failed_count,
    createdAt: row.created_at,
  }));
}

export async function getSubscriberCount(): Promise<number> {
  const rows = await query<{ count: string }>(
    `SELECT count(*)::text AS count FROM users WHERE newsletter_subscribed = true AND deleted_at IS NULL`,
  );
  return Number(rows[0]?.count ?? 0);
}
