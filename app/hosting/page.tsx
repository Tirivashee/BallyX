import type { Metadata } from "next";

import { HostingHero } from "@/components/sections/hosting/hosting-hero";
import { HostingFeatures } from "@/components/sections/hosting/hosting-features";
import { HowItWorks } from "@/components/sections/hosting/how-it-works";
import { HostingPlans } from "@/components/sections/hosting/hosting-plans";
import { HostingGuarantees } from "@/components/sections/hosting/hosting-guarantees";
import { HostingPricing } from "@/components/sections/hosting/hosting-pricing";
import { HostingFaq } from "@/components/sections/hosting/hosting-faq";
import { ClosingCTA } from "@/components/sections/home/closing-cta";
import { hosting } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Hosting",
  description: hosting.subhead,
  alternates: { canonical: "/hosting" },
};

export default function HostingPage() {
  return (
    <>
      <HostingHero />
      <HostingFeatures />
      <HowItWorks />
      <HostingPlans />
      <HostingGuarantees />
      <HostingPricing />
      <HostingFaq />
      <ClosingCTA />
    </>
  );
}
