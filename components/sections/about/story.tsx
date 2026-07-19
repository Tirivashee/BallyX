import { Container } from "@/components/layout/container";
import { brand } from "@/lib/site-config";

export function Story() {
  return (
    <section className="border-b border-ink/10 py-20 md:py-28">
      <Container>
        <span className="font-mono-eyebrow text-xs uppercase tracking-wider text-accent-deep">
          About {brand.shortName}
        </span>
        <h1 className="mt-4 max-w-2xl font-heading text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
          A small studio, built to last, not to look big.
        </h1>

        <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-2">
          <div>
            <h2 className="font-mono-eyebrow text-xs uppercase tracking-wider text-ink-soft">
              Mission
            </h2>
            <p className="mt-3 text-lg leading-relaxed text-ink">
              To build software that African SMEs can genuinely rely on —
              designed for the conditions they operate in, not adapted from
              somewhere else.
            </p>
          </div>
          <div>
            <h2 className="font-mono-eyebrow text-xs uppercase tracking-wider text-ink-soft">
              Vision
            </h2>
            <p className="mt-3 text-lg leading-relaxed text-ink">
              A future where the systems running Africa&apos;s small
              businesses are as sound, secure, and well-engineered as
              anything built anywhere else in the world.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
