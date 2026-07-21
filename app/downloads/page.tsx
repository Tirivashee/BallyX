import type { Metadata } from "next";

import { Container } from "@/components/layout/container";
import { DownloadCard } from "@/components/sections/downloads/download-card";
import { ClosingCTA } from "@/components/sections/home/closing-cta";
import { downloads } from "@/lib/downloads";
import { brand } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Downloads",
  description: `Download ${brand.shortName} apps — version, platform, and file size for Pluto, Mars, and Venus.`,
  alternates: { canonical: "/downloads" },
};

export default function DownloadsPage() {
  return (
    <>
      <section className="border-b border-ink/10 py-20 md:py-28">
        <Container>
          <span className="font-mono-eyebrow text-xs uppercase tracking-wider text-accent-deep">
            Downloads
          </span>
          <h1 className="mt-4 max-w-2xl font-heading text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
            Get our apps
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-soft">
            Version, platform, and file size for every app we build.
            Download links go live as each one ships.
          </p>
        </Container>
      </section>

      <section className="py-20 md:py-28">
        <Container>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {downloads.map((app, i) => (
              <DownloadCard key={app.id} app={app} delay={i * 0.08} />
            ))}
          </div>
        </Container>
      </section>

      <ClosingCTA />
    </>
  );
}
