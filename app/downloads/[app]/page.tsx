import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { AppHero } from "@/components/sections/downloads/app-hero";
import { AppScreenshotGallery } from "@/components/sections/downloads/app-screenshot-gallery";
import { AppTestimonialsPlaceholder } from "@/components/sections/downloads/app-testimonials-placeholder";
import { ClosingCTA } from "@/components/sections/home/closing-cta";
import { downloads } from "@/lib/downloads";

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
      <AppScreenshotGallery appName={app.name} screenshots={app.screenshots} />
      <AppTestimonialsPlaceholder appName={app.name} />
      <ClosingCTA />
    </>
  );
}
