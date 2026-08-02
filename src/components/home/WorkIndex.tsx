"use client";

import * as React from "react";
import Link from "next/link";

import { Magnetic, RuleDraw } from "@/components/anim";
import { ProjectPlate } from "@/components/ProjectPlate";
import { Button } from "@/components/ui/button";
import { DUR, EASE, gsap, useGSAP } from "@/lib/gsap";
import { projects, type Project } from "@/data/projects";

/**
 * (02) — the selected work, set as a ruled index rather than a card grid.
 *
 * The signature interaction lives here. On a fine pointer, hovering a row slides
 * its title, marks its folio with the signal colour, and lerps a single cover
 * plate toward the cursor with `gsap.quickTo` — one interpolated setter per
 * axis, never a tween per mousemove. React state only decides *which* project
 * the plate renders; the motion itself never touches the render cycle.
 *
 * On touch and with reduced motion the plate never appears and the rows are
 * plain links — which is all they ever were.
 */

const featured = projects.filter((project) => project.featured);

/** Plate anchoring: right of the cursor, mostly above it. */
const OFFSET_X = 28;
const OFFSET_Y = -8;
const EDGE = 8;

function hrefFor(project: Project): string {
  return project.liveUrl ?? project.sourceUrl ?? "/projects";
}

export function WorkIndex() {
  const sectionRef = React.useRef<HTMLElement>(null);
  const stageRef = React.useRef<HTMLDivElement>(null);
  const plateRef = React.useRef<HTMLDivElement>(null);
  const [plateIndex, setPlateIndex] = React.useState<number | null>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const stage = stageRef.current;
      const plate = plateRef.current;
      if (!section || !stage || !plate) return;

      // Resting state is set here, in JS, on every device — never in CSS — so
      // the server-rendered markup is complete and readable without scripting.
      gsap.set(plate, {
        autoAlpha: 0,
        scale: 0.92,
        yPercent: -80,
        transformOrigin: "0% 100%",
      });

      const mm = gsap.matchMedia();

      mm.add(
        "(prefers-reduced-motion: no-preference) and (pointer: fine)",
        () => {
          const moveX = gsap.quickTo(plate, "x", {
            duration: 0.55,
            ease: "power3",
          });
          const moveY = gsap.quickTo(plate, "y", {
            duration: 0.55,
            ease: "power3",
          });

          let plateW = plate.offsetWidth;
          let plateH = plate.offsetHeight;

          /** Cursor position in section space, clamped so the plate stays in. */
          const target = (event: PointerEvent) => {
            const box = section.getBoundingClientRect();
            const maxX = Math.max(EDGE, box.width - plateW - EDGE);
            const minY = Math.min(plateH * 0.8 + EDGE, box.height);
            const maxY = Math.max(minY, box.height - plateH * 0.2 - EDGE);
            return {
              x: gsap.utils.clamp(
                EDGE,
                maxX,
                event.clientX - box.left + OFFSET_X,
              ),
              y: gsap.utils.clamp(
                minY,
                maxY,
                event.clientY - box.top + OFFSET_Y,
              ),
            };
          };

          const onMove = (event: PointerEvent) => {
            const { x, y } = target(event);
            moveX(x);
            moveY(y);
          };

          const onEnter = (event: PointerEvent) => {
            plateW = plate.offsetWidth;
            plateH = plate.offsetHeight;
            // Jump to the cursor first, so the plate grows where you are
            // instead of flying in from the corner.
            gsap.set(plate, target(event));
            gsap.to(plate, {
              autoAlpha: 1,
              scale: 1,
              duration: 0.4,
              ease: EASE.micro,
            });
          };

          const onLeave = () => {
            gsap.to(plate, {
              autoAlpha: 0,
              scale: 0.92,
              duration: 0.4,
              ease: EASE.micro,
            });
          };

          stage.addEventListener("pointerenter", onEnter);
          stage.addEventListener("pointermove", onMove);
          stage.addEventListener("pointerleave", onLeave);

          // Row titles nudge right under the pointer. Keyboard users get the
          // same treatment from :focus-within in CSS, on an inner span, so the
          // two never fight over the same transform.
          const teardown = gsap.utils
            .toArray<HTMLElement>(stage.querySelectorAll("[data-row]"))
            .map((row) => {
              const title = row.querySelector("[data-title]");
              if (!title) return () => {};
              const slide = gsap.quickTo(title, "x", {
                duration: DUR.micro,
                ease: EASE.micro,
              });
              const rowEnter = () => slide(10);
              const rowLeave = () => slide(0);
              row.addEventListener("pointerenter", rowEnter);
              row.addEventListener("pointerleave", rowLeave);
              return () => {
                row.removeEventListener("pointerenter", rowEnter);
                row.removeEventListener("pointerleave", rowLeave);
              };
            });

          return () => {
            stage.removeEventListener("pointerenter", onEnter);
            stage.removeEventListener("pointermove", onMove);
            stage.removeEventListener("pointerleave", onLeave);
            teardown.forEach((off) => off());
          };
        },
      );

      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  /** Only a fine pointer ever gets a plate, so only it costs a render. */
  const showPlate = (index: number) => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    setPlateIndex(index);
  };

  const plateProject = plateIndex === null ? null : featured[plateIndex];

  return (
    <section
      ref={sectionRef}
      id="work"
      className="section relative border-t-0"
      aria-labelledby="work-label"
    >
      <div className="shell">
        <div className="flex items-baseline justify-between gap-6 pb-5">
          <h2 id="work-label" className="t-meta">
            (02) SELECTED WORK
          </h2>
          <p className="t-meta">
            {String(featured.length).padStart(2, "0")} PROJECTS
          </p>
        </div>
        <RuleDraw />

        <div ref={stageRef}>
          <ol role="list">
            {featured.map((project, index) => {
              const href = hrefFor(project);
              const external = href.startsWith("http");

              return (
                <li
                  key={project.slug}
                  data-row="true"
                  onPointerEnter={() => showPlate(index)}
                  className="group grid-12 items-baseline gap-y-3 border-b border-rule py-[clamp(1.5rem,3.5vw,2.75rem)]"
                >
                  <span className="t-folio col-span-1 transition-colors duration-300 group-focus-within:text-signal group-hover:text-signal">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <h3 className="t-title col-span-3 md:col-span-6 md:col-start-2">
                    <span
                      data-title="true"
                      className="inline-block will-change-transform"
                    >
                      <span className="inline-block transition-transform duration-300 ease-out group-focus-within:translate-x-2.5">
                        {external ? (
                          <a
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {project.title}
                          </a>
                        ) : (
                          <Link href={href}>{project.title}</Link>
                        )}
                      </span>
                    </span>
                  </h3>

                  <p className="t-meta col-span-4 leading-[1.8] md:col-span-3 md:col-start-8">
                    {project.tags.slice(1).join(" · ")}
                  </p>

                  <p className="t-meta col-span-3 md:col-span-1 md:col-start-11">
                    {project.tags[0] ?? ""}
                  </p>

                  <span
                    aria-hidden="true"
                    className="t-meta col-span-1 justify-self-end text-base leading-none transition-colors group-focus-within:text-ink group-hover:text-ink md:col-start-12"
                  >
                    ↗
                  </span>
                </li>
              );
            })}
          </ol>
        </div>

        <div className="flex justify-end pt-[clamp(2.5rem,5vw,4rem)]">
          <Magnetic strength={10}>
            <Button asChild variant="ghost" className="link-draw px-0">
              <Link href="/projects">
                ALL WORK
                <span aria-hidden="true">↗</span>
              </Link>
            </Button>
          </Magnetic>
        </div>
      </div>

      {/* One plate for the whole index — it follows the cursor, it is never
          duplicated per row, and it carries no information of its own. It stays
          empty until a fine pointer asks for it, so with scripting off there is
          nothing here to see. */}
      <div
        ref={plateRef}
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-0 z-10 aspect-[4/5] w-[clamp(220px,20vw,320px)]"
      >
        {plateProject ? (
          <ProjectPlate
            project={plateProject}
            index={plateIndex ?? 0}
            className="border border-rule"
          />
        ) : null}
      </div>
    </section>
  );
}
