import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

import { Reveal } from "@/components/motion/reveal";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Project } from "@/lib/projects";

export function ProjectCard({ project, delay = 0 }: { project: Project; delay?: number }) {
  return (
    <Reveal delay={delay}>
      <Card className="h-full overflow-hidden">
        <div className="relative aspect-[16/10] w-full border-b border-ink/10 bg-paper">
          <Image
            src={project.image}
            alt={`${project.name} preview`}
            fill
            unoptimized
            className="object-cover"
            sizes="(min-width: 640px) 50vw, 100vw"
          />
        </div>
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
