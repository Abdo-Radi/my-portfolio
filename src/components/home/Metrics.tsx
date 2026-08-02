import { Counter, RuleDraw } from "@/components/anim";

/**
 * (04) — four figures, ruled like a table.
 *
 * Every number is traceable to a highlight in `src/data/experience.ts`: the
 * XPI client base, the interface and API speed-ups, and the three languages.
 * No colour, and no claim the CV doesn't already make.
 */
const figures = [
  { value: 5000, suffix: "+", label: "CLIENTS SERVED" },
  { value: 30, suffix: "%", label: "FASTER INTERFACE" },
  { value: 60, suffix: "%", label: "FASTER API RESPONSES" },
  { value: 3, suffix: "", label: "LANGUAGES SPOKEN" },
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
                suffix={figure.suffix}
                className="block font-mono text-[clamp(2.5rem,6vw,5.25rem)] leading-[0.85] font-medium tracking-[-0.045em]"
              />
              <figcaption className="t-meta pt-5">{figure.label}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
