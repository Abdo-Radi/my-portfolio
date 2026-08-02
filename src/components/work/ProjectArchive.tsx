"use client";

import * as React from "react";

import { RuleDraw } from "@/components/anim";
import { ProjectCard } from "@/components/ProjectCard";
import type { Project } from "@/data/projects";
import { EASE, ScrollTrigger, gsap, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";

const ALL = "All";

type ProjectArchiveProps = {
  projects: Project[];
};

/**
 * The archive list plus its stack filter.
 *
 * The filter is a row of plain buttons — no pills, no fills. The active one is
 * marked by a single vermilion hairline that slides between labels: the active
 * button is measured (`offsetLeft` / `offsetTop` / `offsetWidth`) and one
 * absolutely-positioned span is tweened to those numbers, so the marker is the
 * only signal-coloured thing on the page. A ResizeObserver re-measures when the
 * bar reflows or the webfont swaps in.
 */
export function ProjectArchive({ projects }: ProjectArchiveProps) {
  const rootRef = React.useRef<HTMLElement>(null);
  const barRef = React.useRef<HTMLDivElement>(null);
  const markerRef = React.useRef<HTMLSpanElement>(null);
  const listRef = React.useRef<HTMLDivElement>(null);

  // Set up once inside matchMedia; left null when the user asked for less
  // motion, in which case the marker is simply placed, never animated.
  const syncMarker = React.useRef<((animate: boolean) => void) | null>(null);
  const playRows = React.useRef<(() => void) | null>(null);
  const mounted = React.useRef(false);

  const [active, setActive] = React.useState(ALL);

  const tags = React.useMemo(() => {
    const set = new Set<string>();
    for (const project of projects) {
      for (const tag of project.tags) set.add(tag);
    }
    return [ALL, ...Array.from(set).sort((a, b) => a.localeCompare(b))];
  }, [projects]);

  const visible = React.useMemo(
    () =>
      active === ALL
        ? projects
        : projects.filter((project) => project.tags.includes(active)),
    [active, projects],
  );

  useGSAP(
    () => {
      const bar = barRef.current;
      const marker = markerRef.current;
      if (!bar || !marker) return;

      const measure = () => {
        const button = bar.querySelector<HTMLElement>(
          'button[aria-pressed="true"]',
        );
        if (!button) return null;
        return {
          x: button.offsetLeft,
          y: button.offsetTop + button.offsetHeight,
          width: button.offsetWidth,
        };
      };

      const mm = gsap.matchMedia();

      mm.add(
        {
          motion: "(prefers-reduced-motion: no-preference)",
          reduce: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const motion = context.conditions?.motion === true;

          const sync = (animate: boolean) => {
            const to = measure();
            if (!to) return;
            if (animate && motion) {
              gsap.to(marker, {
                ...to,
                duration: 0.5,
                ease: EASE.inOut,
                overwrite: "auto",
              });
            } else {
              gsap.set(marker, to);
            }
          };

          syncMarker.current = sync;
          playRows.current = motion
            ? () => {
                const list = listRef.current;
                if (!list) return;
                const rows = Array.from(list.children);
                if (rows.length === 0) return;
                gsap.from(rows, {
                  y: 16,
                  duration: 0.6,
                  stagger: 0.05,
                  ease: EASE.out,
                  overwrite: true,
                });
              }
            : null;

          sync(false);

          // The bar reflows on resize; individual labels change width when the
          // webfont swaps in. Watch both.
          const observer = new ResizeObserver(() => sync(false));
          observer.observe(bar);
          for (const button of Array.from(bar.querySelectorAll("button"))) {
            observer.observe(button);
          }

          return () => {
            observer.disconnect();
            syncMarker.current = null;
            playRows.current = null;
          };
        },
      );

      return () => mm.revert();
    },
    { scope: rootRef },
  );

  React.useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    // The list changed height, so every scroll trigger below it is stale.
    ScrollTrigger.refresh();
    syncMarker.current?.(true);
    playRows.current?.();
  }, [active]);

  const status =
    active === ALL
      ? `Showing all ${projects.length} projects`
      : `Showing ${visible.length} of ${projects.length} projects tagged ${active}`;

  return (
    <section
      ref={rootRef}
      aria-labelledby="archive-heading"
      className="shell pb-[clamp(4rem,10vw,7rem)]"
    >
      <h2 id="archive-heading" className="sr-only">
        Project index
      </h2>

      <div
        ref={barRef}
        role="group"
        aria-label="Filter projects by stack"
        className="relative flex flex-wrap items-baseline gap-x-6 gap-y-7 pb-8"
      >
        {tags.map((tag) => {
          const isActive = tag === active;
          return (
            <button
              key={tag}
              type="button"
              aria-pressed={isActive}
              onClick={() => setActive(tag)}
              className={cn(
                "t-meta cursor-pointer py-2 transition-colors duration-200",
                isActive ? "text-ink" : "text-ink-2 hover:text-ink",
              )}
            >
              {tag}
            </button>
          );
        })}

        <span
          ref={markerRef}
          aria-hidden="true"
          className="pointer-events-none absolute top-0 left-0 h-px w-0 bg-signal"
        />
      </div>

      <div aria-live="polite">
        <p className="t-meta pb-6 md:text-right">{status}</p>

        {visible.length > 0 ? (
          <div ref={listRef}>
            {visible.map((project, i) => (
              <ProjectCard key={project.slug} project={project} index={i} />
            ))}
          </div>
        ) : (
          <div className="border-t border-rule py-[clamp(3rem,8vw,5rem)]">
            <p className="t-meta">No projects match this filter</p>
            <button
              type="button"
              onClick={() => setActive(ALL)}
              className="link-draw t-meta mt-5 cursor-pointer text-ink"
            >
              Reset filter
            </button>
          </div>
        )}
      </div>

      <RuleDraw />
    </section>
  );
}
