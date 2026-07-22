import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Cloud, Download } from "lucide-react";

import { Reveal } from "@/components/motion/reveal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { DownloadApp } from "@/lib/downloads";

export function DownloadCard({
  app,
  delay = 0,
}: {
  app: DownloadApp;
  delay?: number;
}) {
  const isCloud = app.deliveryType === "cloud";

  return (
    <Reveal delay={delay} className="h-full">
      <div className="flex h-full flex-col rounded-lg border border-ink/10 bg-paper-soft p-8">
        <Link href={app.detailHref} className="flex items-center gap-4">
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-ink/10 bg-paper">
            <Image
              src={app.icon}
              alt={`${app.name} icon`}
              fill
              className="object-cover"
              sizes="64px"
            />
          </div>
          <div>
            <h2 className="font-heading text-xl font-semibold tracking-tight text-ink hover:text-accent-deep">
              {app.name}
            </h2>
            {!app.downloadReady && (
              <Badge variant="outline" className="mt-1.5">
                Coming soon
              </Badge>
            )}
          </div>
        </Link>

        <p className="mt-5 text-sm leading-relaxed text-ink-soft">
          {app.description}
        </p>

        <dl className="mt-6 grid flex-1 grid-cols-2 content-start gap-x-4 gap-y-4 border-y border-ink/10 py-5 text-sm">
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
          <Button asChild size="lg" className="mt-6">
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
          <Button size="lg" className="mt-6" disabled>
            {isCloud ? (
              <Cloud className="h-4 w-4" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            Coming soon
          </Button>
        )}

        <Link
          href={app.detailHref}
          className="mt-4 inline-flex items-center justify-center gap-2 text-sm font-semibold text-accent-deep hover:underline"
        >
          View details & screenshots
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </Reveal>
  );
}
