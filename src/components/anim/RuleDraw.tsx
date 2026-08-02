"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { DUR, EASE, gsap, useGSAP } from "@/lib/gsap";

type RuleDrawProps = {
  className?: string;
  /** Draw top-to-bottom as a 1px column instead of left-to-right. */
  vertical?: boolean;
  delay?: number;
  /** Play on mount instead of on scroll. */
  immediate?: boolean;
};

/**
 * A hairline that draws itself in. Hairlines are the structure of this layout,
 * so animating them makes the page look like it's being *set*, not faded in.
 *
 * Purely decorative — always aria-hidden.
 */
export function RuleDraw({
  className,
  vertical = false,
  delay = 0,
  immediate = false,
}: RuleDrawProps) {
  const ref = React.useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(el, {
          ...(vertical ? { scaleY: 0 } : { scaleX: 0 }),
          duration: DUR.rule,
          ease: EASE.inOut,
          delay,
          ...(immediate
            ? {}
            : { scrollTrigger: { trigger: el, start: "top 92%", once: true } }),
        });
      });

      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <span
      ref={ref}
      aria-hidden="true"
      className={cn(
        "block bg-rule",
        vertical ? "h-full w-px origin-top" : "h-px w-full origin-left",
        className,
      )}
    />
  );
}
