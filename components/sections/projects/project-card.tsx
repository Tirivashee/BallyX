import Image from "next/image";
import { ArrowUpRight, Expand } from "lucide-react";

import { Reveal } from "@/components/motion/reveal";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Project } from "@/lib/projects";

export function ProjectCard({
  project,
  delay = 0,
  onImageClick,
}: {
  project: Project;
  delay?: number;
  onImageClick?: () => void;
}) {
  return (
    <Reveal delay={delay}>
      <Card className="h-full overflow-hidden">
        <button
          type="button"
          onClick={onImageClick}
          aria-label={`Expand: ${project.name} preview`}
          className="group relative aspect-video w-full cursor-zoom-in border-b border-ink/10 bg-paper-dim"
        >
          <Image
            src={project.image}
            alt={`${project.name} preview`}
            fill
            unoptimized
            className="object-cover"
            sizes="(min-width: 640px) 50vw, 100vw"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-ink/0 opacity-0 transition-all group-hover:bg-ink/20 group-hover:opacity-100">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-paper/90 text-ink">
              <Expand className="h-5 w-5" />
            </span>
          </div>
        </button>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <CardTitle>{project.name}</CardTitle>
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Visit ${project.name}`}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-ink/10 text-ink-soft transition-colors hover:border-accent-deep hover:text-accent-deep"
            >
              <ArrowUpRight className="h-4 w-4" strokeWidth={2} />
            </a>
          </div>

          <span className="mt-1 block font-mono-eyebrow text-xs uppercase tracking-wider text-teal">
            {project.category}
          </span>

          <CardDescription className="mt-4">
            {project.description}
          </CardDescription>

          <div className="mt-5 flex flex-wrap gap-2">
            {project.services.map((service) => (
              <Badge key={service} variant="outline">
                {service}
              </Badge>
            ))}
          </div>
        </CardHeader>
      </Card>
    </Reveal>
  );
}
