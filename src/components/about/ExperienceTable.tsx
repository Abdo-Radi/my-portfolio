"use client";

import * as React from "react";

import { RuleDraw } from "@/components/anim";
import type { ExperienceItem } from "@/data/experience";
import { DUR, EASE, ScrollTrigger, gsap, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";

/** Column widths in twelfths: period 2, role 4, organization 3, highlights 3. */
const COLUMNS = ["16.6667%", "33.3333%", "25%", "25%"] as const;
const HEADINGS = ["Period", "Role", "Organization", "Highlights"] as const;

/**
 * Shared cell geometry. Below `md` the table is restyled to stacked blocks —
 * every table part carries an explicit ARIA role so blockifying the layout
 * doesn't strip the table semantics out of the accessibility tree.
 */
const CELL = "relative block align-top md:table-cell md:pt-10 md:pb-14";

/**
 * A row's top hairline, one segment per cell. Because the cells are contiguous
 * the four segments read as a single rule; drawing them in sequence from
 * `origin-left` sweeps the rule across the row. Each segment is positioned
 * against its own cell, so this never depends on `position: relative` working
 * on a `<tr>`.
 */
function RuleSegment({ desktopOnly = false }: { desktopOnly?: boolean }) {
  return (
    <span
      aria-hidden="true"
      data-rule=""
      className={cn(
        "absolute top-0 left-0 h-px w-full origin-left bg-rule",
        desktopOnly ? "hidden md:block" : "block",
      )}
    />
  );
}

/** Overflow mask the cell content lifts out from. */
function Mask({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-hidden">
      <div data-lift="" className="will-change-transform">
        {children}
      </div>
    </div>
  );
}

/**
 * The experience index, set as a real table.
 *
 * Motion: `ScrollTrigger.batch` collects the rows entering the viewport
 * together and builds one timeline per row, offset by 0.08s. Each timeline
 * draws the row's hairline left to right, then lifts the cell contents out
 * from behind it. Both "from" states are set in JS inside `gsap.matchMedia()`,
 * so with JavaScript off — or reduced motion on — the table renders complete.
 */
export function ExperienceTable({ items }: { items: ExperienceItem[] }) {
  const ref = React.useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;

      const rows = gsap.utils.toArray<HTMLElement>("[data-row]", root);
      if (rows.length === 0) return;

      const rules = gsap.utils.toArray<HTMLElement>("[data-rule]", root);
      const lifts = gsap.utils.toArray<HTMLElement>("[data-lift]", root);

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.set(rules, { scaleX: 0 });
        gsap.set(lifts, { yPercent: 100 });

        const triggers = ScrollTrigger.batch(rows, {
          start: "top 88%",
          once: true,
          onEnter: (batch) => {
            batch.forEach((row, index) => {
              const rowRules = row.querySelectorAll("[data-rule]");
              const rowLifts = row.querySelectorAll("[data-lift]");
              const tl = gsap.timeline({ delay: index * 0.08 });

              if (rowRules.length > 0) {
                tl.to(
                  rowRules,
                  {
                    scaleX: 1,
                    duration: DUR.rule,
                    ease: EASE.inOut,
                    stagger: 0.055,
                  },
                  0,
                );
              }

              if (rowLifts.length > 0) {
                tl.to(
                  rowLifts,
                  {
                    yPercent: 0,
                    duration: DUR.enter,
                    ease: EASE.out,
                    stagger: 0.06,
                  },
                  0.14,
                );
              }
            });
          },
        });

        return () => {
          triggers.forEach((trigger) => trigger.kill());
        };
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set([...rules, ...lifts], { clearProps: "all" });
      });

      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <div ref={ref}>
      <table
        role="table"
        className="block w-full border-collapse md:table md:table-fixed"
      >
        <caption className="sr-only">
          Work and education history, most recent first. Columns: period, role,
          organization, highlights.
        </caption>

        <colgroup className="hidden md:table-column-group">
          {COLUMNS.map((width, index) => (
            <col key={index} style={{ width }} />
          ))}
        </colgroup>

        <thead role="rowgroup" className="sr-only md:not-sr-only">
          <tr role="row">
            {HEADINGS.map((heading) => (
              <th
                key={heading}
                scope="col"
                role="columnheader"
                className="t-meta text-left align-bottom"
              >
                <span className="block pb-5">{heading}</span>
              </th>
            ))}
          </tr>
        </thead>

        <tbody role="rowgroup" className="block md:table-row-group">
          {items.map((item) => (
            <tr
              key={`${item.organization}-${item.period}`}
              role="row"
              data-row=""
              className="block md:table-row"
            >
              <td role="cell" className={cn(CELL, "pt-9 pb-3 md:pr-6")}>
                <RuleSegment />
                <Mask>
                  <span className="font-mono text-xs tracking-[0.08em] text-ink uppercase tabular-nums">
                    {item.period}
                  </span>
                </Mask>
              </td>

              <th
                scope="row"
                role="rowheader"
                className={cn(CELL, "pb-4 text-left md:pr-8")}
              >
                <RuleSegment desktopOnly />
                <Mask>
                  <span className="t-title block text-[clamp(1.125rem,1.9vw,1.625rem)] text-ink">
                    {item.role}
                  </span>
                </Mask>
              </th>

              <td role="cell" className={cn(CELL, "pb-6 md:pr-8")}>
                <RuleSegment desktopOnly />
                <Mask>
                  <span className="block text-[0.9375rem] leading-tight font-medium text-ink">
                    {item.organization}
                  </span>
                  <span className="t-meta mt-2 block">{item.kind}</span>
                </Mask>
              </td>

              <td role="cell" className={cn(CELL, "pb-10")}>
                <RuleSegment desktopOnly />
                <Mask>
                  <ul className="space-y-2.5">
                    {item.highlights.map((highlight) => (
                      <li
                        key={highlight}
                        className="flex gap-3 text-[0.8125rem] leading-[1.5] text-ink-2"
                      >
                        <span
                          aria-hidden="true"
                          className="mt-[0.72em] h-px w-3 shrink-0 bg-rule-strong"
                        />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </Mask>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Closes the index. */}
      <RuleDraw />
    </div>
  );
}
