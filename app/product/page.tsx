import type { Metadata } from "next";
import { Coins, ShieldCheck, WifiOff } from "lucide-react";

import { ProductHero } from "@/components/sections/product/product-hero";
import { DifferentiatorsDetail } from "@/components/sections/product/differentiators-detail";
import { FeatureGrid } from "@/components/sections/product/feature-grid";
import { ScreenshotGallery } from "@/components/sections/product/screenshot-gallery";
import { TestimonialsPlaceholder } from "@/components/sections/home/testimonials-placeholder";
import { Roadmap } from "@/components/sections/product/roadmap";
import { ProductFaq } from "@/components/sections/product/product-faq";
import { PricingEarlyAccess } from "@/components/sections/product/pricing-early-access";
import { brand, pluto } from "@/lib/site-config";

export const metadata: Metadata = {
  title: `${pluto.name} — Local-first POS for African SMEs`,
  description: pluto.subhead,
  alternates: { canonical: "/product" },
  openGraph: {
    title: `${pluto.name} — Local-first POS for African SMEs`,
    description: pluto.subhead,
  },
};

const softwareApplicationJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: pluto.name,
  applicationCategory: "BusinessApplication",
  operatingSystem: "Windows",
  description: pluto.subhead,
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
    availability: "https://schema.org/PreOrder",
  },
  publisher: {
    "@type": "Organization",
    name: brand.name,
    url: brand.url,
  },
};

export default function ProductPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(softwareApplicationJsonLd),
        }}
      />
      <ProductHero />
      <DifferentiatorsDetail items={pluto.differentiators} icons={[WifiOff, Coins, ShieldCheck]} />
      <FeatureGrid features={pluto.features} />
      <ScreenshotGallery />
      <TestimonialsPlaceholder />
      <Roadmap />
      <ProductFaq faq={pluto.faq} />
      <PricingEarlyAccess />
    </>
  );
}
