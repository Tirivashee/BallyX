import Link from "next/link";
import { ArrowRight, Globe2, ShieldCheck, Activity } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const previewRows = [
  { icon: Globe2, label: "shop.example.com", status: "Live" },
  { icon: ShieldCheck, label: "SSL certificate", status: "Valid" },
  { icon: Activity, label: "Uptime (30 days)", status: "99.98%" },
];

export function DashboardTeaser() {
  return (
    <section className="py-24 md:py-32">
      <Container className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
        <div>
          <span className="font-mono-eyebrow text-xs uppercase tracking-wider text-accent-deep">
            Client dashboard
          </span>
          <h2 className="mt-4 font-heading text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            See your site&apos;s status at a glance
          </h2>
          <p className="mt-4 max-w-md text-base leading-relaxed text-ink-soft">
            A dashboard is in the works for hosting clients — site status,
            domains &amp; SSL, and deployment history in one place.
            It&apos;s currently a front-end preview, not yet wired to real
            infrastructure data.
          </p>
          <Button asChild className="mt-8" size="lg">
            <Link href="/dashboard/login">
              Open the preview
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <Reveal>
          <div className="rounded-lg border border-ink/10 bg-paper-soft p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="font-heading text-sm font-medium tracking-tight text-ink">
                Overview
              </span>
              <Badge variant="teal">Preview — UI only</Badge>
            </div>
            <div className="mt-5 space-y-3">
              {previewRows.map((row) => (
                <div
                  key={row.label}
                  className="flex items-center justify-between rounded-md border border-ink/10 px-4 py-3"
                >
                  <span className="flex items-center gap-3 text-sm text-ink">
                    <row.icon className="h-4 w-4 text-ink-soft" />
                    {row.label}
                  </span>
                  <span className="text-sm font-medium text-teal">
                    {row.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
