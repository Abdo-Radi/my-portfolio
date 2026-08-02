"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { DUR, EASE, ENTER_TRIGGER, gsap, useGSAP } from "@/lib/gsap";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
  delay?: number;
  /** Stagger direct children instead of animating the block as one unit. */
  stagger?: number;
  /** Play immediately on mount rather than on scroll. */
  immediate?: boolean;
};

/**
 * Generic block entrance: a bottom-up clip wipe plus a short lift. Deliberately
 * not a fade — content arrives from behind an edge, matching the line reveals.
 *
 * `clipPath` is cleared once the tween finishes so children that intentionally
 * overflow (hover plates, cursors) aren't clipped afterwards.
 */
export function Reveal({
  children,
  className,
  as = "div",
  delay = 0,
  stagger,
  immediate = false,
}: RevealProps) {
  const ref = React.useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      const targets: Element[] =
        stagger !== undefined ? Array.from(el.children) : [el];
      if (targets.length === 0) return;

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          targets,
          { clipPath: "inset(0% 0% 100% 0%)", y: 28 },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            y: 0,
            duration: DUR.enter,
            ease: EASE.out,
            delay,
            ...(stagger !== undefined ? { stagger } : {}),
            clearProps: "clipPath",
            ...(immediate
              ? {}
              : { scrollTrigger: { trigger: el, ...ENTER_TRIGGER } }),
          },
        );
      });

      return () => mm.revert();
    },
    { scope: ref },
  );

  const Tag = as as React.ElementType;

  return (
    <Tag ref={ref} className={cn(className)}>
      {children}
    </Tag>
  );
}
