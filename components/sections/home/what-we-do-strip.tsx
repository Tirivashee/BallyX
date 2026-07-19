import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";

const items = [
  {
    label: "Custom software",
    description: "Bespoke systems built around your actual workflow.",
  },
  {
    label: "Business systems",
    description: "Inventory, sales, invoicing & reporting tools.",
  },
  {
    label: "Flagship product",
    description: "Pluto — local-first POS for African SMEs.",
  },
];

export function WhatWeDoStrip() {
  return (
    <section className="bg-ink text-paper">
      <Container className="grid grid-cols-1 divide-y divide-border-on-ink md:grid-cols-3 md:divide-x md:divide-y-0">
        {items.map((item, i) => (
          <Reveal key={item.label} delay={i * 0.08} className="py-10 md:px-8 md:py-14">
            <span className="font-mono-eyebrow text-xs uppercase tracking-wider text-paper/50">
              0{i + 1}
            </span>
            <h3 className="mt-3 font-heading text-xl font-medium tracking-tight">
              {item.label}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-paper/70">
              {item.description}
            </p>
          </Reveal>
        ))}
      </Container>
    </section>
  );
}
