"use client";

import * as React from "react";

import { Reveal, RuleDraw } from "@/components/anim";
import { ProjectPlate } from "@/components/ProjectPlate";
import type { Project } from "@/data/projects";
import { EASE, gsap, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";

type ProjectCardProps = {
  project: Project;
  /**
   * Position in the archive. Drives the folio number and which way the band
   * is set: even rows run text-left / plate-right, odd rows reverse it. The
   * alternation is what keeps the archive off-balance page after page.
   */
  index?: number;
  className?: string;
};

/**
 * One project, set as a full-bleed editorial band — a hairline, a folio, a
 * column of type and a cover plate on the opposite side of the grid. Not a
 * card: no box, no border, no elevation.
 */
export function ProjectCard({
  project,
  index = 0,
  className,
}: ProjectCardProps) {
  const ref = React.useRef<HTMLElement>(null);

  const primaryUrl = project.liveUrl ?? project.sourceUrl;
  const folio = `(${String(index + 1).padStart(2, "0")})`;
  const flipped = index % 2 === 1;

  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;

      const plate = root.querySelector<HTMLElement>("[data-plate]");
      const title = root.querySelector<HTMLElement>("[data-title]");
      if (!plate || !title) return;

      const mm = gsap.matchMedia();

      // Hover is an enhancement only — the reduce branch never runs, and the
      // band is already in its final state, so nothing is left hidden.
      mm.add(
        "(prefers-reduced-motion: no-preference) and (hover: hover)",
        () => {
          const enter = () => {
            gsap.to(plate, {
              scale: 1.02,
              duration: 0.4,
              ease: EASE.micro,
              overwrite: "auto",
            });
            gsap.to(title, {
              x: 6,
              duration: 0.4,
              ease: EASE.micro,
              overwrite: "auto",
            });
          };

          const leave = () => {
            gsap.to(plate, {
              scale: 1,
              duration: 0.4,
              ease: EASE.micro,
              overwrite: "auto",
            });
            gsap.to(title, {
              x: 0,
              duration: 0.4,
              ease: EASE.micro,
              overwrite: "auto",
            });
          };

          // Keyboard users get the same state, but only when focus actually
          // leaves the band — not while it moves between the two footer links.
          const focusOut = (event: FocusEvent) => {
            const next = event.relatedTarget;
            if (next instanceof Node && root.contains(next)) return;
            leave();
          };

          root.addEventListener("pointerenter", enter);
          root.addEventListener("pointerleave", leave);
          root.addEventListener("focusin", enter);
          root.addEventListener("focusout", focusOut);

          return () => {
            root.removeEventListener("pointerenter", enter);
            root.removeEventListener("pointerleave", leave);
            root.removeEventListener("focusin", enter);
            root.removeEventListener("focusout", focusOut);
          };
        },
      );

      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <article ref={ref} className={cn("relative", className)}>
      {/* The band's top hairline draws itself in on scroll. */}
      <RuleDraw />

      <div className="grid-12 py-[clamp(2.5rem,6vw,5rem)]">
        <div
          className={cn(
            "col-span-4 md:col-span-5 md:row-start-1",
            flipped ? "md:col-start-8" : "md:col-start-1",
          )}
        >
          <Reveal stagger={0.06} className="flex flex-col gap-y-5">
            <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
              <span className="t-folio text-ink">{folio}</span>
              <ul
                className="t-meta flex flex-wrap gap-x-4 gap-y-2 text-ink-2"
                aria-label="Stack"
              >
                {project.tags.map((tag) => (
                  <li key={tag}>{tag}</li>
                ))}
              </ul>
            </div>

            <h3 className="t-title">
              {primaryUrl ? (
                <a
                  data-title=""
                  href={primaryUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-block text-ink"
                >
                  {project.title}
                </a>
              ) : (
                <span data-title="" className="inline-block">
                  {project.title}
                </span>
              )}
            </h3>

            <p className="t-body">{project.description}</p>

            {primaryUrl ? (
              <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
                {project.liveUrl ? (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label={`Open live site for ${project.title}`}
                    className="link-draw t-meta text-ink-2 transition-colors duration-200 hover:text-ink"
                  >
                    Live{" "}
                    <span aria-hidden="true" className="text-[0.875rem]">
                      ↗
                    </span>
                  </a>
                ) : null}

                {project.sourceUrl ? (
                  <a
                    href={project.sourceUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label={`View source code for ${project.title}`}
                    className="link-draw t-meta text-ink-2 transition-colors duration-200 hover:text-ink"
                  >
                    Source{" "}
                    <span aria-hidden="true" className="text-[0.875rem]">
                      ↗
                    </span>
                  </a>
                ) : null}
              </div>
            ) : null}
          </Reveal>
        </div>

        <div
          className={cn(
            "col-span-4 mt-10 md:col-span-6 md:row-start-1 md:mt-0",
            flipped ? "md:col-start-1" : "md:col-start-7",
          )}
        >
          {/* Deliberately NOT wrapped in <ParallaxPlate>: the plate is a
              typographic composition whose slug, folio and initials sit on its
              trim, and a parallax overscale crops exactly those edges. Motion
              here comes from the band's rule draw and the hover scale. */}
          <div data-plate="" className="aspect-[4/3] will-change-transform">
            <ProjectPlate
              project={project}
              index={index}
              className="size-full"
            />
          </div>
        </div>
      </div>
    </article>
  );
}
