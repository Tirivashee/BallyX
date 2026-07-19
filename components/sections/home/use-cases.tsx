import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useCases } from "@/lib/site-config";

export function UseCases() {
  return (
    <section className="bg-paper-dim py-24 md:py-32">
      <Container>
        <div className="max-w-2xl">
          <span className="font-mono-eyebrow text-xs uppercase tracking-wider text-teal">
            Who Pluto is built for
          </span>
          <h2 className="mt-4 font-heading text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Illustrative examples, not a client list
          </h2>
          <p className="mt-4 text-base leading-relaxed text-ink-soft">
            Pluto is early — these are the kinds of businesses it&apos;s
            designed for, not companies currently using it. If your shop
            looks like one of these, we&apos;d like to hear from you.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2">
          {useCases.map((useCase, i) => (
            <Reveal key={useCase.title} delay={i * 0.06}>
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>{useCase.title}</CardTitle>
                  <CardDescription className="mt-3">
                    {useCase.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
