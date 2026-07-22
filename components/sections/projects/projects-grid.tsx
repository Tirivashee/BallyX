"use client";

import { useState } from "react";

import { Container } from "@/components/layout/container";
import { ProjectCard } from "@/components/sections/projects/project-card";
import { Lightbox } from "@/components/ui/lightbox";
import { projects } from "@/lib/projects";

export function ProjectsGrid() {
  const [index, setIndex] = useState<number | null>(null);

  const images = projects.map((project) => ({
    src: project.image,
    alt: `${project.name} preview`,
    caption: project.name,
  }));

  return (
    <section className="py-20 md:py-28">
      <Container>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {projects.map((project, i) => (
            <ProjectCard
              key={project.id}
              project={project}
              delay={i * 0.06}
              onImageClick={() => setIndex(i)}
            />
          ))}
        </div>
      </Container>

      <Lightbox images={images} index={index} onClose={() => setIndex(null)} onNavigate={setIndex} />
    </section>
  );
}
