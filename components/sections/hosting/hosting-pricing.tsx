import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { hosting } from "@/lib/site-config";

export function HostingPricing() {
  return (
    <section className="border-t border-border-on-ink bg-ink text-paper">
      <Container className="py-24 md:py-32">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          <div>
            <span className="font-mono-eyebrow text-xs uppercase tracking-wider text-paper/50">
              Something bigger or unusual?
            </span>
            <h2 className="mt-4 font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
              {hosting.pricingDisplay}
            </h2>
            <p className="mt-4 max-w-md text-base leading-relaxed text-paper/70">
              The plans above cover most cases. If what you need doesn&apos;t
              fit neatly into one of them, we&apos;ll scope something
              specific to it rather than force a fit.
            </p>
          </div>

          <div className="rounded-lg border border-paper/15 bg-paper/[0.04] p-8">
            <h3 className="font-heading text-xl font-medium tracking-tight">
              Get your site hosted with us
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-paper/70">
              Tell us what you need hosted — a marketing site, a web app,
              or a system we&apos;ve already built you — and we&apos;ll
              scope a plan around it.
            </p>
            <Button asChild className="mt-6" size="lg">
              <Link href="/contact">
                Ask about hosting
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
