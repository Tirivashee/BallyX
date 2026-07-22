import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { brand, nav } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <section className="flex min-h-[70vh] items-center py-20 md:py-28">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <span className="font-mono-eyebrow text-xs uppercase tracking-wider text-accent-deep">
            404
          </span>
          <h1 className="mt-4 font-heading text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
            This page doesn&apos;t exist.
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-ink-soft">
            The page you&apos;re looking for may have been moved, renamed, or
            never existed. Let&apos;s get you back on track.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Button asChild>
              <Link href="/">
                Back to homepage
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/contact">Contact {brand.shortName}</Link>
            </Button>
          </div>

          <nav className="mt-14 border-t border-ink/10 pt-8">
            <p className="text-xs font-medium uppercase tracking-wider text-ink-soft">
              Or try one of these
            </p>
            <ul className="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm font-medium text-ink transition-colors hover:text-accent-deep"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </Container>
    </section>
  );
}
