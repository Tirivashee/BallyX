import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import { Badge } from "@/components/ui/badge";
import { pluto } from "@/lib/site-config";

export function Roadmap() {
  return (
    <section className="py-24 md:py-32">
      <Container>
        <div className="max-w-2xl">
          <Badge variant="outline">Roadmap — not yet shipped</Badge>
          <h2 className="mt-4 font-heading text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            What&apos;s next for Pluto
          </h2>
          <p className="mt-4 text-base leading-relaxed text-ink-soft">
            These are planned, not available today. We&apos;d rather tell you
            what&apos;s coming honestly than let a feature list blur the line
            with what already works.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-3">
          {pluto.roadmap.map((item, i) => (
            <Reveal key={item.title} delay={i * 0.08}>
              <div className="h-full rounded-lg border border-dashed border-ink/25 p-6">
                <h3 className="font-heading text-base font-medium tracking-tight text-ink">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                  {item.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
