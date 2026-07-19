import type { Metadata } from "next";

import { Container } from "@/components/layout/container";
import { ServiceRow } from "@/components/sections/services/service-row";
import { ClosingCTA } from "@/components/sections/home/closing-cta";
import { services } from "@/lib/services";
import { brand } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Services",
  description: `What ${brand.shortName} actually delivers: custom software, business systems, web & mobile apps, and secure development consulting.`,
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <>
      <section className="border-b border-ink/10 py-20 md:py-28">
        <Container>
          <span className="font-mono-eyebrow text-xs uppercase tracking-wider text-accent-deep">
            Services
          </span>
          <h1 className="mt-4 max-w-2xl font-heading text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
            What we actually deliver
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-soft">
            A short, honest list. We&apos;d rather be excellent at four
            things than mediocre at ten — this is what {brand.shortName} can
            build for you today.
          </p>
        </Container>
      </section>

      {/*
        Rendered directly from lib/services.ts — a typed, deliberately
        short list. Only add an entry here once the team can actually
        deliver it; this file is the honest record of real capability,
        not an aspirational one.
      */}
      <div>
        {services.map((service) => (
          <ServiceRow key={service.id} service={service} />
        ))}
      </div>

      <ClosingCTA />
    </>
  );
}
