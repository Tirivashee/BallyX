import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import { BrandName } from "@/components/ui/brand-name";
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
                <BrandName text={paragraph} />
              </p>
            ))}
          </div>

          <div className="mt-8 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-ink text-sm font-medium text-paper">
              TC
            </div>
            <div>
              <p className="text-sm font-medium text-ink">
                {founderNote.name}
              </p>
              <p className="text-sm text-ink-soft">
                <BrandName text={founderNote.title} />
              </p>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
