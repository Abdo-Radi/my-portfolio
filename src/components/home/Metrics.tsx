import { Counter, RuleDraw } from "@/components/anim";

/**
 * (04) — four figures, ruled like a table.
 *
 * Every number here is taken straight from `src/data/experience.ts`: deploy
 * time under 4 min, Lighthouse 68 → 98, 12 production apps, 3 engineers
 * mentored. No suffixes, no colour, no claim the CV doesn't already make.
 */
const figures = [
  { value: 4, label: "MIN DEPLOY" },
  { value: 98, label: "LIGHTHOUSE" },
  { value: 12, label: "APPS SHIPPED" },
  { value: 3, label: "ENGINEERS MENTORED" },
];

export function Metrics() {
  return (
    <section className="section" aria-labelledby="figures-label">
      <div className="shell">
        <h2 id="figures-label" className="t-meta pb-[clamp(2.5rem,6vw,5rem)]">
          (04) FIGURES
        </h2>

        <div className="grid-12 gap-y-12">
          {figures.map((figure) => (
            <figure
              key={figure.label}
              className="relative col-span-2 pl-[clamp(0.875rem,1.5vw,1.75rem)] md:col-span-3"
            >
              <RuleDraw vertical className="absolute inset-y-0 left-0" />
              <Counter
                to={figure.value}
                pad={2}
                className="block font-mono text-[clamp(3rem,7vw,6rem)] leading-[0.85] font-medium tracking-[-0.045em]"
              />
              <figcaption className="t-meta pt-5">{figure.label}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
