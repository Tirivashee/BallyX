import { Lightbulb, ShieldCheck, Feather, CheckCircle2, TrendingUp } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import { values } from "@/lib/site-config";

const icons = [Lightbulb, ShieldCheck, Feather, CheckCircle2, TrendingUp];

export function ValuesGrid() {
  return (
    <section id="values" className="border-b border-ink/10 bg-paper-dim py-20 md:py-28">
      <Container>
        <span className="font-mono-eyebrow text-xs uppercase tracking-wider text-teal">
          Our values
        </span>
        <h2 className="mt-4 max-w-xl font-heading text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          What we hold ourselves to
        </h2>

        <div className="mt-12 grid grid-cols-1 gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-5">
          {values.map((value, i) => {
            const Icon = icons[i];
            return (
              <Reveal key={value.title} delay={(i % 5) * 0.06}>
                <Icon className="h-6 w-6 text-accent-deep" strokeWidth={1.75} />
                <h3 className="mt-4 font-heading text-lg font-medium tracking-tight text-ink">
                  {value.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                  {value.description}
                </p>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
