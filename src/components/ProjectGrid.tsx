"use client";

import * as React from "react";

import { projects } from "@/data/projects";
import { Button } from "@/components/ui/button";
import { ProjectCard } from "@/components/ProjectCard";

const ALL = "All";

export function ProjectGrid() {
  const tags = React.useMemo(() => {
    const set = new Set<string>();
    projects.forEach((project) => project.tags.forEach((tag) => set.add(tag)));
    return [ALL, ...Array.from(set).sort()];
  }, []);

  const [active, setActive] = React.useState(ALL);

  const filtered = React.useMemo(
    () =>
      active === ALL
        ? projects
        : projects.filter((project) => project.tags.includes(active)),
    [active],
  );

  return (
    <div className="space-y-8">
      <div
        className="flex flex-wrap gap-2"
        role="group"
        aria-label="Filter projects by technology"
      >
        {tags.map((tag) => (
          <Button
            key={tag}
            variant={active === tag ? "default" : "outline"}
            size="sm"
            onClick={() => setActive(tag)}
            aria-pressed={active === tag}
          >
            {tag}
          </Button>
        ))}
      </div>

      {filtered.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((project) => (
            <ProjectCard
              key={project.slug}
              project={project}
              className="animate-fade-in"
            />
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">No projects match this filter.</p>
      )}
    </div>
  );
}
