"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Container } from "@/components/layout/container";
import { ScreenshotFrame } from "@/components/sections/screenshot-frame";
import { Reveal } from "@/components/motion/reveal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Lightbox } from "@/components/ui/lightbox";
import { pluto } from "@/lib/site-config";

const shot = {
  src: "/images/screenshots/checkout.png",
  alt: "Screenshot of the Pluto point-of-sale checkout screen",
};

export function PlutoFlagship() {
  const [open, setOpen] = useState(false);

  return (
    <section id="pluto" className="border-b border-ink/10 py-24 md:py-32">
      <Container>
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:gap-12">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <Badge variant="accent">Flagship product</Badge>
            <h2 className="mt-5 font-heading text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
              {pluto.name}
            </h2>
            <p className="mt-4 max-w-md text-base leading-relaxed text-ink-soft">
              {pluto.tagline}
            </p>
            <div className="mt-8">
              <ScreenshotFrame
                src={shot.src}
                alt={shot.alt}
                priority
                onClick={() => setOpen(true)}
              />
            </div>
            <div className="mt-8">
              <Button asChild>
                <Link href="/product">
                  See the full breakdown
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="divide-y divide-ink/10">
            {pluto.differentiators.map((d, i) => (
              <Reveal key={d.id} delay={i * 0.1} className="py-8 first:pt-0">
                <span className="font-mono-eyebrow text-xs uppercase tracking-wider text-accent-deep">
                  {d.eyebrow}
                </span>
                <h3 className="mt-3 font-heading text-2xl font-medium tracking-tight text-ink">
                  {d.title}
                </h3>
                <p className="mt-3 text-base leading-relaxed text-ink-soft">
                  {d.summary}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </Container>

      <Lightbox
        images={[shot]}
        index={open ? 0 : null}
        onClose={() => setOpen(false)}
        onNavigate={() => {}}
      />
    </section>
  );
}
