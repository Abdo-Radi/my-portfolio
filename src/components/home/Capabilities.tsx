import { RuleDraw } from "@/components/anim";
import { cn } from "@/lib/utils";

/**
 * (03) — three blocks, drawn from the highlights in `src/data/experience.ts`.
 *
 * The columns are stepped rather than aligned: three identical blocks on a
 * shared baseline is the look this design exists to avoid. Each one opens with
 * its own hairline, so the rules land at three heights and the section reads as
 * typeset rather than templated.
 */
const blocks = [
  {
    folio: "(A)",
    title: "Product",
    offset: "",
    body: "I lead customer-facing web products at Birdman, from data model to interface. Before that, 12 production apps as a freelancer across e-commerce, SaaS, and content, built on a reusable Next.js and Tailwind starter that halved project kickoff.",
  },
  {
    folio: "(B)",
    title: "Platform",
    offset: "md:mt-[clamp(2rem,5vw,4.5rem)]",
    body: "I own the pipeline the work ships through. A containerized GitHub Actions build took production deploys from 25 min to under 4 min. Trunk-based development with automated quality gates keeps main releasable, and 3 engineers now work the same way.",
  },
  {
    folio: "(C)",
    title: "Performance",
    offset: "md:mt-[clamp(4rem,10vw,9rem)]",
    body: "Performance is a budget, not a final pass. Moving the marketing stack to the Next.js App Router took Lighthouse from 68 to 98 — measured, not estimated. Accessibility and bundle size sit inside the same budget.",
  },
] as const;

export function Capabilities() {
  return (
    <section className="section" aria-labelledby="capabilities-label">
      <div className="shell">
        <div className="flex items-baseline justify-between gap-6 pb-[clamp(2.5rem,6vw,5rem)]">
          <h2 id="capabilities-label" className="t-meta">
            (03) CAPABILITIES
          </h2>
          <p className="t-meta">A / B / C</p>
        </div>

        <div className="grid-12 gap-y-14 md:gap-y-0">
          {blocks.map((block) => (
            <div key={block.folio} className={cn("col-span-4", block.offset)}>
              <RuleDraw />
              <p className="t-folio pt-5">{block.folio}</p>
              <h3 className="t-title pt-3">{block.title}</h3>
              <p className="t-body pt-5">{block.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
