import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import { BrandName } from "@/components/ui/brand-name";
import { brand } from "@/lib/site-config";

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-ink/10">
      {/* Single, restrained hue glow — used once, behind the hero only */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 right-[-10%] h-[560px] w-[560px] rounded-full bg-accent/20 blur-[140px]"
      />

      <Container className="relative grid items-center gap-12 py-24 md:grid-cols-2 md:py-32">
        <div>
          <span className="font-mono-eyebrow text-xs uppercase tracking-wider text-accent-deep">
            01 — {brand.location.display}
          </span>

          <h1 className="mt-6 max-w-3xl font-heading text-4xl font-semibold leading-[1.05] tracking-tight text-ink sm:text-5xl md:text-6xl">
            {brand.tagline}
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-soft">
            <BrandName text={brand.shortName} /> is a focused software studio
            building custom business systems and Pluto — a local-first
            point-of-sale platform designed for the way African SMEs actually
            trade.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/product">
                Explore Pluto
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/contact">Book a consultation</Link>
            </Button>
          </div>
        </div>

        <div className="relative order-first h-48 w-full sm:h-64 md:order-none md:h-[22rem] md:justify-self-end">
          <Image
            src="/images/logo/bx-logo.png"
            alt={`${brand.shortName} logo`}
            fill
            className="object-contain object-center md:object-right"
            sizes="(min-width: 768px) 480px, 90vw"
            priority
          />
        </div>
      </Container>
    </section>
  );
}
