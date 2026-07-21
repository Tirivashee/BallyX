import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import { hosting } from "@/lib/site-config";

export function HowItWorks() {
  return (
    <section className="py-24 md:py-32">
      <Container>
        <div className="max-w-2xl">
          <span className="font-mono-eyebrow text-xs uppercase tracking-wider text-accent-deep">
            How it works
          </span>
          <h2 className="mt-4 font-heading text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            From first message to monitored & backed up
          </h2>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {hosting.steps.map((step, i) => (
            <Reveal key={step.title} delay={i * 0.08}>
              <span className="font-mono-eyebrow text-2xl text-ink-soft/40">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-3 font-heading text-lg font-medium tracking-tight text-ink">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                {step.description}
              </p>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
