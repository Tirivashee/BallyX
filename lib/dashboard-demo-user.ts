/**
 * There's a single admin session (see lib/auth/session.ts), not a real
 * accounts table, so the signed-in "user" shown in the dashboard chrome
 * stays a static placeholder rather than a DB row. Kept in its own module
 * (no `lib/db` import) so client components can use it without pulling the
 * Postgres driver into the browser bundle.
 */
export const demoUser = {
  name: "Demo Client",
  email: "demo.client@example.com",
  plan: "Standard",
} as const;
