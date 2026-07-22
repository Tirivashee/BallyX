"use client";

import { useState } from "react";

import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import { ScreenshotFrame } from "@/components/sections/screenshot-frame";
import { Lightbox } from "@/components/ui/lightbox";

const shots = [
  {
    src: "/images/screenshots/checkout.png",
    alt: "Screenshot of the Pluto POS checkout screen",
    caption: "Checkout",
  },
  {
    src: "/images/screenshots/inventory.png",
    alt: "Screenshot of the Pluto inventory list",
    caption: "Inventory",
  },
  {
    src: "/images/screenshots/dashboard.png",
    alt: "Screenshot of the Pluto reports dashboard",
    caption: "Reports & dashboard",
  },
];

export function ScreenshotGallery() {
  const [index, setIndex] = useState<number | null>(null);

  return (
    <section className="border-y border-ink/10 bg-paper-dim py-24 md:py-32">
      <Container>
        <span className="font-mono-eyebrow text-xs uppercase tracking-wider text-accent-deep">
          Inside Pluto
        </span>
        <h2 className="mt-4 max-w-xl font-heading text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          A closer look at Pluto in action.
        </h2>

        <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-2">
          {shots.map((shot, i) => (
            <Reveal key={shot.caption} delay={i * 0.08}>
              <ScreenshotFrame
                src={shot.src}
                alt={shot.alt}
                onClick={() => setIndex(i)}
              />
              <p className="mt-3 font-mono-eyebrow text-xs uppercase tracking-wider text-ink-soft">
                {shot.caption}
              </p>
            </Reveal>
          ))}
        </div>
      </Container>

      <Lightbox images={shots} index={index} onClose={() => setIndex(null)} onNavigate={setIndex} />
    </section>
  );
}
