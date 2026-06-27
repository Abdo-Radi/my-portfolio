import Image from "next/image";
import { ExternalLink, Github } from "lucide-react";

import type { Project } from "@/data/projects";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type ProjectCardProps = {
  project: Project;
  className?: string;
};

export function ProjectCard({ project, className }: ProjectCardProps) {
  return (
    <article
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-xl border border-border/60 bg-card/60 shadow-sm backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-border hover:shadow-lg",
        className,
      )}
    >
      {project.image && (
        <div className="relative aspect-video w-full overflow-hidden border-b border-border/60 bg-muted">
          <Image
            src={project.image}
            alt={`${project.title} preview`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      )}

      <div className="flex flex-1 flex-col gap-4 p-6">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">{project.title}</h3>
          <p className="text-sm text-muted-foreground">{project.description}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="mt-auto flex gap-2 pt-2">
          {project.liveUrl && (
            <Button asChild size="sm">
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer noopener"
              >
                <ExternalLink className="size-4" />
                Live
              </a>
            </Button>
          )}
          {project.sourceUrl && (
            <Button asChild size="sm" variant="outline">
              <a
                href={project.sourceUrl}
                target="_blank"
                rel="noreferrer noopener"
              >
                <Github className="size-4" />
                Code
              </a>
            </Button>
          )}
        </div>
      </div>
    </article>
  );
}
