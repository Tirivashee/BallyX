import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { hosting } from "@/lib/site-config";

export function HostingGuarantees() {
  return (
    <section className="border-y border-ink/10 bg-paper-dim py-24 md:py-32">
      <Container>
        <div className="max-w-2xl">
          <span className="font-mono-eyebrow text-xs uppercase tracking-wider text-teal">
            What you can count on
          </span>
          <h2 className="mt-4 font-heading text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            The basics, actually honoured
          </h2>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {hosting.guarantees.map((item, i) => (
            <Reveal key={item.title} delay={i * 0.06}>
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>{item.title}</CardTitle>
                  <CardDescription className="mt-3">
                    {item.description}
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
