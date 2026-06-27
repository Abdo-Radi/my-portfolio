import type { Metadata } from "next";

import { ProjectGrid } from "@/components/ProjectGrid";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "A selection of projects I've designed, built, and shipped — filterable by technology.",
};

export default function ProjectsPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:py-20">
      <header className="mb-10 space-y-3">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Projects
        </h1>
        <p className="max-w-2xl text-muted-foreground">
          A selection of things I&apos;ve built. Filter by technology to find
          what you&apos;re interested in.
        </p>
      </header>

      <ProjectGrid />
    </div>
  );
}
