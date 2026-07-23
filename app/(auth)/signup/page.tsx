import type { Metadata } from "next";

import { Container } from "@/components/layout/container";
import { SignupForm } from "@/components/auth/signup-form";
import { auth } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Sign up",
  robots: { index: false, follow: false },
};

export default function SignupPage() {
  return (
    <section className="flex min-h-[calc(100vh-4.5rem)] items-center justify-center py-16">
      <Container className="max-w-md">
        <div className="rounded-lg border border-ink/10 bg-paper-soft p-8">
          <h1 className="font-heading text-2xl font-semibold tracking-tight text-ink">
            {auth.signup.heading}
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">{auth.signup.subhead}</p>

          <SignupForm />
        </div>
      </Container>
    </section>
  );
}
