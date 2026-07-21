import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import { BrandName } from "@/components/ui/brand-name";
import { timeline } from "@/lib/site-config";

export function Timeline() {
  return (
    <section className="border-b border-ink/10 py-20 md:py-28">
      <Container className="max-w-3xl">
        <span className="font-mono-eyebrow text-xs uppercase tracking-wider text-accent-deep">
          So far
        </span>
        <h2 className="mt-4 font-heading text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          A short, honest timeline
        </h2>

        <div className="mt-12 space-y-0">
          {timeline.map((item, i) => (
            <Reveal key={item.title} delay={i * 0.08}>
              <div className="flex gap-6 border-t border-ink/10 py-6 first:border-t-0">
                <span className="w-16 shrink-0 font-mono-eyebrow text-sm text-ink-soft">
                  {item.year}
                </span>
                <div>
                  <h3 className="font-heading text-lg font-medium tracking-tight text-ink">
                    <BrandName text={item.title} />
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-ink-soft">
                    {item.description}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
