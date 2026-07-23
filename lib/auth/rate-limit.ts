// Node-only (imports the pg pool) — never import this from middleware.ts.
import { headers } from "next/headers";

import { query } from "@/lib/db";

/**
 * Fixed-window (hourly) rate limiter backed by a single atomic UPSERT —
 * no read-then-increment, so concurrent requests can't race past the
 * limit. Accepted tradeoff, not solved here: a client can burst up to
 * ~2x `limit` across an hour boundary.
 */
export async function checkRateLimit(bucketKey: string, limit: number): Promise<boolean> {
  const rows = await query<{ count: number }>(
    `INSERT INTO rate_limits (bucket_key, window_start, count)
     VALUES ($1, date_trunc('hour', now()), 1)
     ON CONFLICT (bucket_key) DO UPDATE SET
       count = CASE
         WHEN rate_limits.window_start = date_trunc('hour', now())
         THEN rate_limits.count + 1
         ELSE 1
       END,
       window_start = date_trunc('hour', now())
     RETURNING count`,
    [bucketKey],
  );
  return (rows[0]?.count ?? 0) <= limit;
}

/**
 * Client IP for rate-limit bucketing. `x-forwarded-for` is only trusted
 * when a trusted proxy (Vercel) is known to be in front of us — same
 * `VERCEL === "1"` trust signal `lib/auth/session.ts` uses for the
 * cookie's `secure` flag. Off Vercel the header is attacker-controlled,
 * so it isn't used and every request shares one IP-bucket (the
 * per-email limit still applies).
 */
export async function getClientIp(): Promise<string> {
  if (process.env.VERCEL !== "1") return "unknown";
  const h = await headers();
  const forwardedFor = h.get("x-forwarded-for");
  return forwardedFor?.split(",")[0]?.trim() || "unknown";
}
