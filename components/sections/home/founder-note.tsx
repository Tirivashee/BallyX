import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import { founderNote } from "@/lib/site-config";

export function FounderNote() {
  return (
    <section className="border-y border-ink/10 bg-paper-dim py-24 md:py-32">
      <Container>
        <Reveal className="mx-auto max-w-2xl">
          <span className="font-mono-eyebrow text-xs uppercase tracking-wider text-teal">
            {founderNote.heading}
          </span>

          <div className="mt-6 space-y-5">
            {founderNote.body.map((paragraph) => (
              <p
                key={paragraph.slice(0, 24)}
                className="text-lg leading-relaxed text-ink"
              >
                {paragraph}
              </p>
            ))}
          </div>

          <div className="mt-8 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-dashed border-ink/25 text-xs font-medium text-ink-soft">
              {/* Placeholder avatar — replace with a real photo */}
              FN
            </div>
            <div>
              <p className="text-sm font-medium text-ink">
                {founderNote.name}
              </p>
              <p className="text-sm text-ink-soft">{founderNote.title}</p>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
