import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import type { Service } from "@/lib/services";

export function ServiceRow({ service }: { service: Service }) {
  return (
    <div id={service.id} className="border-t border-ink/10 py-14 first:border-t-0 md:py-16">
      <Container>
        <Reveal className="grid grid-cols-1 gap-8 lg:grid-cols-[100px_1fr_1fr] lg:gap-12">
          <span className="font-mono-eyebrow text-2xl text-ink-soft/40">
            {service.eyebrow}
          </span>

          <div>
            <h2 className="font-heading text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
              {service.title}
            </h2>
            <p className="mt-4 max-w-md text-base leading-relaxed text-ink-soft">
              {service.description}
            </p>
            {service.href && (
              <Link
                href={service.href}
                className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-accent-deep hover:underline"
              >
                Learn more
                <ArrowRight className="h-4 w-4" />
              </Link>
            )}
          </div>

          <ul className="space-y-3">
            {service.capabilities.map((capability) => (
              <li key={capability} className="flex items-start gap-3 text-sm text-ink-soft">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-teal" strokeWidth={2} />
                {capability}
              </li>
            ))}
          </ul>
        </Reveal>
      </Container>
    </div>
  );
}
