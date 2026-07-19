import type { Metadata } from "next";

import { Story } from "@/components/sections/about/story";
import { ValuesGrid } from "@/components/sections/about/values-grid";
import { Timeline } from "@/components/sections/about/timeline";
import { Team } from "@/components/sections/about/team";
import { ClosingCTA } from "@/components/sections/home/closing-cta";
import { brand } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "About",
  description: `The story, mission, and values behind ${brand.shortName}, a software studio based in ${brand.location.display}.`,
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <Story />
      <ValuesGrid />
      <Timeline />
      <Team />
      <ClosingCTA />
    </>
  );
}
