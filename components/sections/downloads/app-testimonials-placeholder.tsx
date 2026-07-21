import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";

export function AppTestimonialsPlaceholder({ appName }: { appName: string }) {
  return (
    <section className="py-24 md:py-32">
      <Container>
        <Reveal className="rounded-lg border border-dashed border-ink/25 bg-paper-dim/60 p-10 text-center md:p-16">
          <span className="font-mono-eyebrow text-xs uppercase tracking-wider text-ink-soft">
            Coming soon
          </span>
          <h2 className="mx-auto mt-4 max-w-xl font-heading text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
            Real user stories for {appName} will go here.
          </h2>
          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-ink-soft">
            We&apos;d rather wait for genuine feedback from real users than
            fill this space with anything else. Check back once{" "}
            {appName} has real users to hear from.
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
