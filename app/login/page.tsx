import type { Metadata } from "next";

import { Container } from "@/components/layout/container";
import { BrandName } from "@/components/ui/brand-name";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Sign in",
  robots: { index: false, follow: false },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;

  return (
    <section className="flex min-h-[calc(100vh-4.5rem)] items-center justify-center py-16">
      <Container className="max-w-md">
        <div className="rounded-lg border border-ink/10 bg-paper-soft p-8">
          <h1 className="font-heading text-2xl font-semibold tracking-tight text-ink">
            <BrandName text="Sign in to BallyX" />
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">
            Admin access to the client dashboard and invoice generator.
          </p>

          <LoginForm next={next && next.startsWith("/") ? next : "/dashboard"} />
        </div>
      </Container>
    </section>
  );
}
