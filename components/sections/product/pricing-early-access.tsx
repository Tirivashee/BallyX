import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { pluto } from "@/lib/site-config";

export function PricingEarlyAccess() {
  return (
    <section id="pricing" className="border-t border-border-on-ink bg-ink text-paper">
      <Container className="py-24 md:py-32">
        <div id="early-access" className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          <div>
            <span className="font-mono-eyebrow text-xs uppercase tracking-wider text-paper/50">
              Pricing
            </span>
            <h2 className="mt-4 font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
              {pluto.pricingDisplay}
            </h2>
            <p className="mt-4 max-w-md text-base leading-relaxed text-paper/70">
              Pluto is in {pluto.statusDisplay.toLowerCase()}. Founding
              customers who come on now keep this price for as long as
              they&apos;re subscribed, even after it changes at wider release.
            </p>
          </div>

          <div className="rounded-lg border border-paper/15 bg-paper/[0.04] p-8">
            <h3 className="font-heading text-xl font-medium tracking-tight">
              Become a founding customer
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-paper/70">
              We&apos;re onboarding a small number of businesses ahead of a
              wider release — direct input into what we build next, and
              preferential pricing for coming in early.
            </p>
            <Button asChild className="mt-6" size="lg">
              <Link href="/contact">
                Request early access
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
