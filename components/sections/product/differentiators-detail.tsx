import type { LucideIcon } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";

export function DifferentiatorsDetail({
  eyebrow = "The three things that matter",
  heading = "Not retrofitted for Zimbabwe. Built for it.",
  items,
  icons,
}: {
  eyebrow?: string;
  heading?: string;
  items: readonly { id: string; eyebrow: string; title: string; detail: string }[];
  icons: LucideIcon[];
}) {
  return (
    <section id="features" className="py-24 md:py-32">
      <Container>
        <div className="max-w-2xl">
          <span className="font-mono-eyebrow text-xs uppercase tracking-wider text-accent-deep">
            {eyebrow}
          </span>
          <h2 className="mt-4 font-heading text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            {heading}
          </h2>
        </div>

        <div className="mt-16 space-y-16">
          {items.map((d, i) => {
            const Icon = icons[i];
            return (
              <Reveal key={d.id}>
                <div className="grid grid-cols-1 gap-8 border-t border-ink/10 pt-10 lg:grid-cols-[64px_1fr_1fr]">
                  <Icon className="h-8 w-8 text-accent-deep" strokeWidth={1.5} />
                  <div>
                    <span className="font-mono-eyebrow text-xs uppercase tracking-wider text-ink-soft">
                      {d.eyebrow}
                    </span>
                    <h3 className="mt-3 font-heading text-2xl font-medium tracking-tight text-ink">
                      {d.title}
                    </h3>
                  </div>
                  <p className="text-base leading-relaxed text-ink-soft">
                    {d.detail}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
