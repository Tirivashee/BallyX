import Image from "next/image";
import { ArrowRight, Cloud, Download } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { DownloadApp } from "@/lib/downloads";

export function AppHero({ app }: { app: DownloadApp }) {
  const isCloud = app.deliveryType === "cloud";

  return (
    <section className="border-b border-ink/10 py-20 md:py-28">
      <Container>
        <div className="flex items-center gap-5">
          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-ink/10 bg-paper-soft">
            <Image
              src={app.icon}
              alt={`${app.name} icon`}
              fill
              className="object-cover"
              sizes="80px"
              priority
            />
          </div>
          <div>
            {!app.downloadReady && (
              <Badge variant="outline" className="mb-2">
                Coming soon
              </Badge>
            )}
            <h1 className="font-heading text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
              {app.name}
            </h1>
          </div>
        </div>

        <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-soft">
          {app.tagline}
        </p>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-ink-soft">
          {app.description}
        </p>

        <dl className="mt-8 grid max-w-xl grid-cols-2 gap-x-4 gap-y-5 border-y border-ink/10 py-6 text-sm sm:grid-cols-4">
          <div>
            <dt className="font-mono-eyebrow text-xs uppercase tracking-wider text-ink-soft/70">
              Version
            </dt>
            <dd className="mt-1 font-medium text-ink">{app.version}</dd>
          </div>
          <div>
            <dt className="font-mono-eyebrow text-xs uppercase tracking-wider text-ink-soft/70">
              Release date
            </dt>
            <dd className="mt-1 font-medium text-ink">{app.releaseDate}</dd>
          </div>
          <div>
            <dt className="font-mono-eyebrow text-xs uppercase tracking-wider text-ink-soft/70">
              Platform
            </dt>
            <dd className="mt-1 font-medium text-ink">
              {app.platforms.join(", ")}
            </dd>
          </div>
          <div>
            <dt className="font-mono-eyebrow text-xs uppercase tracking-wider text-ink-soft/70">
              {isCloud ? "Access" : "File size"}
            </dt>
            <dd className="mt-1 font-medium text-ink">
              {isCloud ? app.access : app.fileSize}
            </dd>
          </div>
        </dl>

        {app.downloadReady && app.downloadUrl ? (
          <Button asChild size="lg" className="mt-8">
            <a
              href={app.downloadUrl}
              {...(isCloud ? {} : { download: true })}
            >
              {isCloud ? (
                <ArrowRight className="h-4 w-4" />
              ) : (
                <Download className="h-4 w-4" />
              )}
              {isCloud ? "Get started" : `Download for ${app.platforms[0]}`}
            </a>
          </Button>
        ) : (
          <Button size="lg" className="mt-8" disabled>
            {isCloud ? (
              <Cloud className="h-4 w-4" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            Coming soon
          </Button>
        )}
      </Container>
    </section>
  );
}
