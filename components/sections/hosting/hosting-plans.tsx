import Link from "next/link";
import { Check } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { hosting } from "@/lib/site-config";

export function HostingPlans() {
  return (
    <section id="plans" className="py-24 md:py-32">
      <Container>
        <div className="max-w-2xl">
          <span className="font-mono-eyebrow text-xs uppercase tracking-wider text-accent-deep">
            Plans
          </span>
          <h2 className="mt-4 font-heading text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Sized to what you&apos;re actually hosting
          </h2>
          <p className="mt-4 text-base leading-relaxed text-ink-soft">
            Indicative tiers below — final pricing is confirmed once we
            scope your site or system with you.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {hosting.plans.map((plan, i) => (
            <Reveal key={plan.id} delay={i * 0.08} className="h-full">
              <div
                className={cn(
                  "flex h-full flex-col rounded-lg border p-8",
                  plan.highlighted
                    ? "border-accent-deep/40 bg-accent-soft/40"
                    : "border-ink/10 bg-paper-soft",
                )}
              >
                {plan.highlighted && (
                  <Badge className="w-fit">Most common</Badge>
                )}
                <h3 className="mt-4 font-heading text-xl font-semibold tracking-tight text-ink">
                  {plan.name}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                  {plan.tagline}
                </p>
                <p className="mt-6 font-heading text-2xl font-semibold tracking-tight text-ink">
                  {plan.price}
                </p>

                <ul className="mt-6 flex-1 space-y-3">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-3 text-sm text-ink-soft"
                    >
                      <Check
                        className="mt-0.5 h-4 w-4 shrink-0 text-teal"
                        strokeWidth={2}
                      />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button
                  asChild
                  variant={plan.highlighted ? "primary" : "outline"}
                  className="mt-8"
                >
                  <Link href="/contact">Ask about {plan.name}</Link>
                </Button>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
