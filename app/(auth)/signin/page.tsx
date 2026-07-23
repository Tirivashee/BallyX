import type { Metadata } from "next";

import { Container } from "@/components/layout/container";
import { SigninForm } from "@/components/auth/signin-form";
import { auth } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Sign in",
  robots: { index: false, follow: false },
};

export default async function SigninPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; confirmed?: string }>;
}) {
  const { next, confirmed } = await searchParams;

  return (
    <section className="flex min-h-[calc(100vh-4.5rem)] items-center justify-center py-16">
      <Container className="max-w-md">
        <div className="rounded-lg border border-ink/10 bg-paper-soft p-8">
          <h1 className="font-heading text-2xl font-semibold tracking-tight text-ink">
            {auth.signin.heading}
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">{auth.signin.subhead}</p>

          <SigninForm
            next={next && next.startsWith("/") ? next : "/"}
            confirmed={confirmed === "1"}
          />
        </div>
      </Container>
    </section>
  );
}
