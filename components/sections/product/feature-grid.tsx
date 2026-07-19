import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import { pluto } from "@/lib/site-config";

export function FeatureGrid() {
  return (
    <section className="border-y border-ink/10 bg-paper-dim py-24 md:py-32">
      <Container>
        <div className="max-w-2xl">
          <span className="font-mono-eyebrow text-xs uppercase tracking-wider text-teal">
            Core capabilities
          </span>
          <h2 className="mt-4 font-heading text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Everything the counter needs, nothing it doesn&apos;t.
          </h2>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {pluto.features.map((feature, i) => (
            <Reveal key={feature.title} delay={(i % 3) * 0.08}>
              <h3 className="font-heading text-lg font-medium tracking-tight text-ink">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                {feature.description}
              </p>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
