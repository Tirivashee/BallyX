import type { Metadata } from "next";

import { Container } from "@/components/layout/container";
import { ConfirmButton } from "@/components/auth/confirm-button";
import { auth } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Confirm your email",
  robots: { index: false, follow: false },
};

// GET only reads the token from the URL and renders a button — it never
// touches the database itself. Mail security gateways prefetch every
// link in an email; if this page consumed the token on GET, the scanner
// would burn it before the user ever clicked. The POST from
// ConfirmButton (lib/actions/confirm.ts) is what actually consumes it.
export default async function ConfirmPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  return (
    <section className="flex min-h-[calc(100vh-4.5rem)] items-center justify-center py-16">
      <Container className="max-w-md">
        <div className="rounded-lg border border-ink/10 bg-paper-soft p-8">
          <h1 className="font-heading text-2xl font-semibold tracking-tight text-ink">
            {auth.confirm.heading}
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">{auth.confirm.subhead}</p>

          {token ? (
            <ConfirmButton token={token} />
          ) : (
            <div className="mt-6 space-y-2">
              <h2 className="font-heading text-lg font-semibold text-ink">
                {auth.confirm.invalidHeading}
              </h2>
              <p className="text-sm leading-relaxed text-ink-soft">{auth.confirm.invalidMessage}</p>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
