import { Container } from "@/components/layout/container";
import { ProjectCard } from "@/components/sections/projects/project-card";
import { projects } from "@/lib/projects";

export function ProjectsGrid() {
  return (
    <section className="py-20 md:py-28">
      <Container>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {projects.map((project, i) => (
            <ProjectCard key={project.id} project={project} delay={i * 0.06} />
          ))}
        </div>
      </Container>
    </section>
  );
}
