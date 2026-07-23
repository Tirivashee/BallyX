// Every signup/signin/rate-limit path that touches an email must go
// through this — never pass a raw form value to SQL or a rate-limit
// bucket key. Trim + lowercase, matching the `CHECK (email = lower(email))`
// constraint on `users` in db/schema.sql.
export function normalizeEmail(raw: string): string {
  return raw.trim().toLowerCase();
}
