import type { Metadata } from "next";

import { Hero } from "@/components/sections/home/hero";
import { WhatWeDoStrip } from "@/components/sections/home/what-we-do-strip";
import { PlutoFlagship } from "@/components/sections/home/pluto-flagship";
import { UseCases } from "@/components/sections/home/use-cases";
import { WhyBallyX } from "@/components/sections/home/why-ballyx";
import { FounderNote } from "@/components/sections/home/founder-note";
import { TestimonialsPlaceholder } from "@/components/sections/home/testimonials-placeholder";
import { ClosingCTA } from "@/components/sections/home/closing-cta";
import { brand } from "@/lib/site-config";

export const metadata: Metadata = {
  title: `${brand.name} — ${brand.tagline}`,
  description: brand.description,
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <WhatWeDoStrip />
      <PlutoFlagship />
      <UseCases />
      <WhyBallyX />
      <FounderNote />
      <TestimonialsPlaceholder />
      <ClosingCTA />
    </>
  );
}
