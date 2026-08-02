import { Reveal, RuleDraw, SplitLines } from "@/components/anim";
import { experience } from "@/data/experience";
import { siteConfig } from "@/data/site";

/**
 * (00) — the page-defining statement.
 *
 * A full-viewport spread: metadata pinned to the top and bottom edges, the
 * display statement holding the middle, one hairline between them. The type is
 * the only thing that is loud; everything else is 11px mono.
 *
 * Server component. The entrance choreography lives in the `anim/*` leaves,
 * which are client components in their own right.
 */

/** Every four-digit year mentioned in a *work* period. */
const workYears = experience
  .filter((item) => item.kind === "work")
  .flatMap((item) => item.period.match(/\d{4}/g) ?? [])
  .map((year) => Number.parseInt(year, 10));

const stillWorking = experience.some(
  (item) => item.kind === "work" && /present/i.test(item.period),
);

/** "2021 — 2026", derived from the CV rather than typed in by hand. */
function workingYears(): string {
  const now = new Date().getFullYear();
  if (workYears.length === 0) return String(now);
  const start = Math.min(...workYears);
  const end = stillWorking ? now : Math.max(...workYears);
  return `${start} — ${end}`;
}

export function Hero() {
  const current = experience[0];

  return (
    <section className="shell flex min-h-[100svh] flex-col justify-between pt-[clamp(7rem,14vh,10rem)] pb-10">
      <Reveal
        immediate
        delay={0.08}
        stagger={0.08}
        className="flex items-baseline justify-between gap-6"
      >
        <span className="t-meta">(00) INDEX</span>
        <span className="t-meta">{siteConfig.location}</span>
      </Reveal>

      {/* The statement spans the full measure — edge to edge is the whole
          point, and constraining it to 9 columns forced "FULL–STACK" to break
          after the en dash at common desktop widths. */}
      <div className="py-[clamp(2.5rem,6vh,5rem)]">
        <SplitLines as="h1" delay={0.18} className="t-display optical-left">
          FULL–STACK
          <br />
          ENGINEER
        </SplitLines>

        <div className="grid-12">
          <Reveal
            as="p"
            immediate
            delay={0.8}
            className="t-body col-span-4 mt-8 md:col-span-4 md:col-start-9 md:mt-7"
          >
            {siteConfig.tagline}
          </Reveal>
        </div>
      </div>

      <div>
        <RuleDraw immediate delay={0.5} />

        <Reveal
          immediate
          delay={0.72}
          stagger={0.07}
          className="grid-12 gap-y-7 pt-6"
        >
          <p className="t-meta col-span-2 flex items-center gap-2.5 md:col-span-3">
            <span className="dot-live shrink-0" aria-hidden="true" />
            AVAILABLE FOR SENIOR ROLES
          </p>

          <p className="t-meta col-span-2 leading-[1.7] md:col-span-3">
            {current
              ? `${current.role} — ${current.organization}`
              : siteConfig.role}
          </p>

          <p className="t-meta col-span-2 md:col-span-3">
            <a
              href="#work"
              className="link-draw inline-flex items-center gap-2 hover:text-ink"
            >
              SELECTED WORK
              <span aria-hidden="true">↓</span>
            </a>
          </p>

          <p className="t-meta col-span-2 md:col-span-3 md:text-right">
            {workingYears()}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
