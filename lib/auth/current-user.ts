import { cookies } from "next/headers";

import { query } from "@/lib/db";
import { SESSION_COOKIE, getSessionSubject } from "@/lib/auth/session";

export type CurrentUser = {
  id: number;
  email: string;
  displayName: string | null;
  avatarKey: string | null;
  newsletterSubscribed: boolean;
};

/**
 * Server-only — reads the httpOnly session cookie, so it can't be called
 * from a client component (see components/layout/header.tsx, which takes
 * the result as a prop from the root layout instead). Returns null for an
 * admin session (which has no `users` row) or a deleted account, not just
 * a signed-out visitor — every caller should treat those the same way.
 */
export async function getCurrentUser(): Promise<CurrentUser | null> {
  const jar = await cookies();
  const subject = await getSessionSubject(jar.get(SESSION_COOKIE)?.value);
  if (subject?.sub !== "user" || !subject.uid) return null;

  const rows = await query<{
    id: number;
    email: string;
    display_name: string | null;
    avatar_key: string | null;
    newsletter_subscribed: boolean;
  }>(
    `SELECT id, email, display_name, avatar_key, newsletter_subscribed
     FROM users WHERE id = $1 AND deleted_at IS NULL`,
    [subject.uid],
  );
  const row = rows[0];
  if (!row) return null;

  return {
    id: row.id,
    email: row.email,
    displayName: row.display_name,
    avatarKey: row.avatar_key,
    newsletterSubscribed: row.newsletter_subscribed,
  };
}
