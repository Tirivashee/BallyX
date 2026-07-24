import type { Metadata } from "next";

import { Container } from "@/components/layout/container";
import { getCurrentUser } from "@/lib/auth/current-user";
import { logout } from "@/lib/actions/auth";

export const metadata: Metadata = {
  title: "Your account",
  robots: { index: false, follow: false },
};

// Access is already gated server-side by middleware.ts (sub === "user")
// before this page ever renders. getCurrentUser() re-checks anyway so the
// page has no path where it renders with a null user.
export default async function AccountPage() {
  const user = await getCurrentUser();

  return (
    <Container className="max-w-md py-16">
      <h1 className="font-heading text-2xl font-semibold tracking-tight text-ink">
        Your account
      </h1>
      <p className="mt-2 text-sm text-ink-soft">Signed in as {user?.email}</p>

      <form action={logout} className="mt-8">
        <button
          type="submit"
          className="rounded-md border border-ink/10 px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-ink/5"
        >
          Log out
        </button>
      </form>
    </Container>
  );
}
