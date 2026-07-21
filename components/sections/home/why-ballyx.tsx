import { ShieldCheck, MapPinned, WifiOff, Users } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import { BrandName } from "@/components/ui/brand-name";
import { whyBallyX } from "@/lib/site-config";

const icons = [ShieldCheck, MapPinned, WifiOff, Users];

export function WhyBallyX() {
  return (
    <section className="py-24 md:py-32">
      <Container>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,320px)_1fr] lg:gap-16">
          <div>
            <span className="font-mono-eyebrow text-xs uppercase tracking-wider text-accent-deep">
              Why <BrandName text="BallyX" className="text-accent" />
            </span>
            <h2 className="mt-4 font-heading text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
              Engineered for how business actually happens here.
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-x-10 gap-y-10 sm:grid-cols-2">
            {whyBallyX.map((item, i) => {
              const Icon = icons[i];
              return (
                <Reveal key={item.title} delay={i * 0.08}>
                  <Icon className="h-6 w-6 text-accent-deep" strokeWidth={1.75} />
                  <h3 className="mt-4 font-heading text-xl font-medium tracking-tight text-ink">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                    {item.description}
                  </p>
                </Reveal>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}
