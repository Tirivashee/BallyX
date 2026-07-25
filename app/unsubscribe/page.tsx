import type { Metadata } from "next";

import { Container } from "@/components/layout/container";
import { verifyUnsubscribeToken } from "@/lib/auth/unsubscribe-token";
import { query } from "@/lib/db";

export const metadata: Metadata = {
  title: "Unsubscribe",
  robots: { index: false, follow: false },
};

// No sign-in required — that's the entire point of a one-click unsubscribe
// link (see lib/auth/unsubscribe-token.ts). Re-visiting this URL is
// idempotent (just re-sets newsletter_subscribed = false), so it's safe
// for email clients/link scanners to fetch it ahead of a real click.
export default async function UnsubscribePage({
  searchParams,
}: {
  searchParams: Promise<{ u?: string; t?: string }>;
}) {
  const { u, t } = await searchParams;
  const userId = u ? Number(u) : NaN;

  let message = "That unsubscribe link is invalid or has expired.";
  if (Number.isInteger(userId) && t && (await verifyUnsubscribeToken(userId, t))) {
    await query(
      `UPDATE users SET newsletter_subscribed = false, newsletter_unsubscribed_at = now()
       WHERE id = $1 AND deleted_at IS NULL`,
      [userId],
    );
    message = "You've been unsubscribed from BallyX emails.";
  }

  return (
    <Container className="max-w-md py-24 text-center">
      <h1 className="font-heading text-2xl font-semibold tracking-tight text-ink">Unsubscribe</h1>
      <p className="mt-4 text-ink-soft">{message}</p>
    </Container>
  );
}
