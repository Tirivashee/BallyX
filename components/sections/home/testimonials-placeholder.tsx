import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";

export function TestimonialsPlaceholder() {
  return (
    <section className="py-24 md:py-32">
      <Container>
        <Reveal className="rounded-lg border border-dashed border-ink/25 bg-paper-dim/60 p-10 text-center md:p-16">
          <span className="font-mono-eyebrow text-xs uppercase tracking-wider text-ink-soft">
            Coming soon
          </span>
          <h2 className="mx-auto mt-4 max-w-xl font-heading text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
            Founding-customer stories will go here.
          </h2>
          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-ink-soft">
            We&apos;re early, and we&apos;d rather wait for real feedback from
            real founding customers than fill this space with anything else.
            Check back once Pluto&apos;s early access customers have had time
            to put it to work.
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
