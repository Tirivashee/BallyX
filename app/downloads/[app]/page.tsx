import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { Boxes, Calculator, TrendingUp, type LucideIcon } from "lucide-react";

import { AppHero } from "@/components/sections/downloads/app-hero";
import { AppScreenshotGallery } from "@/components/sections/downloads/app-screenshot-gallery";
import { AppTestimonialsPlaceholder } from "@/components/sections/downloads/app-testimonials-placeholder";
import { ClosingCTA } from "@/components/sections/home/closing-cta";
import { DifferentiatorsDetail } from "@/components/sections/product/differentiators-detail";
import { FeatureGrid } from "@/components/sections/product/feature-grid";
import { ProductFaq } from "@/components/sections/product/product-faq";
import { downloads } from "@/lib/downloads";

// Positional icons for each app's `differentiators` (matched by array index).
// Add an entry here if another app grows a `differentiators` list.
const differentiatorIcons: Record<string, LucideIcon[]> = {
  mars: [Boxes, Calculator, TrendingUp],
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ app: string }>;
}): Promise<Metadata> {
  const { app: slug } = await params;
  const app = downloads.find((a) => a.id === slug);

  if (!app) return {};

  return {
    title: app.name,
    description: app.tagline,
    alternates: { canonical: `/downloads/${app.id}` },
  };
}

export default async function AppDetailPage({
  params,
}: {
  params: Promise<{ app: string }>;
}) {
  const { app: slug } = await params;
  const app = downloads.find((a) => a.id === slug);

  if (!app) {
    notFound();
  }

  // Pluto already has a full marketing page — send it there instead of
  // duplicating that content here.
  if (app.id === "pluto") {
    redirect("/product");
  }

  return (
    <>
      <AppHero app={app} />
      {app.differentiators && (
        <DifferentiatorsDetail
          eyebrow={`The three things that matter about ${app.name}`}
          heading={app.tagline}
          items={app.differentiators}
          icons={differentiatorIcons[app.id] ?? []}
        />
      )}
      {app.features && (
        <FeatureGrid eyebrow="Core capabilities" heading={`What ${app.name} does`} features={app.features} />
      )}
      <AppScreenshotGallery appName={app.name} screenshots={app.screenshots} />
      <AppTestimonialsPlaceholder appName={app.name} />
      {app.faq && <ProductFaq heading={`${app.name}, honestly`} faq={app.faq} />}
      <ClosingCTA />
    </>
  );
}
