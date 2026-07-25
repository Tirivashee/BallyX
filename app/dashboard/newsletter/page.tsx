import type { Metadata } from "next";
import Link from "next/link";

import { NewsletterComposer } from "@/components/dashboard/newsletter/composer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { deleteTemplate } from "@/lib/actions/newsletter";
import { getRecentSends, getSubscriberCount, getTemplates } from "@/lib/newsletter-admin-data";

export const metadata: Metadata = {
  title: "Newsletter",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function NewsletterPage() {
  const [templates, sends, subscriberCount] = await Promise.all([
    getTemplates(),
    getRecentSends(),
    getSubscriberCount(),
  ]);

  return (
    <div className="space-y-12">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight text-ink">
          Newsletter
        </h1>
        <p className="mt-1 text-sm text-ink-soft">
          {subscriberCount} subscriber{subscriberCount === 1 ? "" : "s"} opted in to newsletter
          emails.
        </p>
      </div>

      <NewsletterComposer templates={templates} />

      <div>
        <div className="flex items-center justify-between gap-4">
          <h2 className="font-heading text-lg font-semibold tracking-tight text-ink">
            Saved templates
          </h2>
          <Button asChild variant="outline" size="sm">
            <Link href="/dashboard/newsletter/templates/new">New template</Link>
          </Button>
        </div>
        <div className="mt-4 space-y-3">
          {templates.length === 0 && (
            <p className="text-sm text-ink-soft">No saved templates yet.</p>
          )}
          {templates.map((t) => (
            <div
              key={t.id}
              className="flex items-center justify-between gap-4 rounded-md border border-ink/10 bg-paper-soft p-4"
            >
              <div>
                <p className="font-medium text-ink">{t.name}</p>
                <p className="text-xs text-ink-soft">{t.subject}</p>
              </div>
              <div className="flex items-center gap-2">
                <Button asChild variant="outline" size="sm">
                  <Link href={`/dashboard/newsletter/templates/${t.id}`}>Edit</Link>
                </Button>
                <form action={deleteTemplate.bind(null, t.id)}>
                  <Button type="submit" variant="ghost" size="sm">
                    Delete
                  </Button>
                </form>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="font-heading text-lg font-semibold tracking-tight text-ink">
          Recent sends
        </h2>
        <div className="mt-4 space-y-3">
          {sends.length === 0 && <p className="text-sm text-ink-soft">Nothing sent yet.</p>}
          {sends.map((s) => (
            <div
              key={s.id}
              className="flex items-center justify-between gap-4 rounded-md border border-ink/10 bg-paper-soft p-4"
            >
              <div>
                <p className="font-medium text-ink">{s.subject}</p>
                <p className="text-xs text-ink-soft">
                  {new Date(s.createdAt).toLocaleString()} · {s.sentCount}/{s.totalRecipients}{" "}
                  sent
                  {s.failedCount > 0 ? `, ${s.failedCount} failed` : ""}
                </p>
              </div>
              <Badge variant={s.status === "completed" ? "teal" : "outline"}>{s.status}</Badge>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
