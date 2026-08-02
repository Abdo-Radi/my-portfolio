import { Marquee } from "@/components/anim";
import { skills } from "@/data/skills";

/**
 * (01) — the stack, running between two hairlines.
 *
 * Texture rather than content: every skill flattened into one quiet mono band,
 * masked at both edges so it reads as an endless strip of type instead of a
 * list that happens to move.
 */
const stack = skills.flatMap((group) => group.items);

export function Ticker() {
  return (
    <section aria-label="Stack" className="border-y border-rule py-5">
      <Marquee duration={46} className="mask-fade-x">
        {stack.map((item) => (
          <span key={item} className="flex items-center">
            <span className="t-meta text-[0.8125rem] text-ink-2">{item}</span>
            <span
              aria-hidden="true"
              className="mx-[clamp(1.25rem,3vw,2.75rem)] block size-[3px] bg-rule-strong"
            />
          </span>
        ))}
      </Marquee>
    </section>
  );
}
