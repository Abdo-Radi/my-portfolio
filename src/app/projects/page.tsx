import type { Metadata } from "next";

import { RuleDraw, SplitLines } from "@/components/anim";
import { ProjectArchive } from "@/components/work/ProjectArchive";
import { projects } from "@/data/projects";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Archive of shipped projects — the stack, the source and the deployment path for each one.",
};

export default function ProjectsPage() {
  const total = projects.length;
  const live = projects.filter((project) => project.liveUrl).length;

  return (
    <>
      <header className="shell pt-[clamp(7rem,14vh,10rem)] pb-[clamp(2.5rem,6vw,4rem)]">
        <div className="flex items-baseline justify-between gap-6">
          <span className="t-meta">(01) Archive</span>
          <span className="t-meta">
            {String(total).padStart(2, "0")} entries
          </span>
        </div>

        <SplitLines
          as="h1"
          className="t-display mt-[clamp(1.25rem,4vw,2.5rem)] optical-left"
        >
          Work
        </SplitLines>

        <div className="grid-12 mt-[clamp(2rem,5vw,3rem)]">
          <p className="t-meta col-span-4 md:col-span-3 md:col-start-1">
            Selected work, 2021—2026
          </p>
          <p className="t-lead col-span-4 mt-6 md:col-span-5 md:col-start-8 md:mt-0">
            <span className="font-mono tabular-nums">{total}</span> projects,{" "}
            <span className="font-mono tabular-nums">{live}</span> of them live
            — filter by stack below.
          </p>
        </div>

        <RuleDraw
          immediate
          delay={0.4}
          className="mt-[clamp(2.5rem,6vw,4rem)]"
        />
      </header>

      <ProjectArchive projects={projects} />
    </>
  );
}
