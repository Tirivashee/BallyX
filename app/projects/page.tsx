import type { Metadata } from "next";

import { Container } from "@/components/layout/container";
import { ProjectsGrid } from "@/components/sections/projects/projects-grid";
import { ClosingCTA } from "@/components/sections/home/closing-cta";
import { brand } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Projects",
  description: `A showcase of software ${brand.shortName} has built for other companies.`,
  alternates: { canonical: "/projects" },
};

export default function ProjectsPage() {
  return (
    <>
      <section className="border-b border-ink/10 py-20 md:py-28">
        <Container>
          <span className="font-mono-eyebrow text-xs uppercase tracking-wider text-accent-deep">
            Projects
          </span>
          <h1 className="mt-4 max-w-2xl font-heading text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
            Software we&apos;ve built for other businesses
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-soft">
            A selection of the systems and sites {brand.shortName} has
            delivered for clients — alongside Pluto, our own product.
          </p>
        </Container>
      </section>

      <ProjectsGrid />

      <ClosingCTA />
    </>
  );
}
