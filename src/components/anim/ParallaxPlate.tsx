"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { gsap, useGSAP } from "@/lib/gsap";

type ParallaxPlateProps = {
  children: React.ReactNode;
  className?: string;
  /** Total travel across the whole scroll pass, in percent of own height. */
  distance?: number;
};

/**
 * Scrubbed vertical parallax for cover art. The inner element is scaled a touch
 * beyond its frame so the offset never exposes an edge.
 *
 * `scrub: 1` (smoothed over a second) rather than `true` — a hard-bound scrub
 * reads as jittery, especially alongside Lenis.
 */
export function ParallaxPlate({
  children,
  className,
  distance = 14,
}: ParallaxPlateProps) {
  const ref = React.useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      const inner = el?.firstElementChild;
      if (!el || !inner) return;

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          inner,
          { yPercent: -distance / 2 },
          {
            yPercent: distance / 2,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top bottom",
              end: "bottom top",
              scrub: 1,
            },
          },
        );
      });

      return () => mm.revert();
    },
    { scope: ref, dependencies: [distance] },
  );

  return (
    <div ref={ref} className={cn("overflow-hidden", className)}>
      {/* `relative` so `next/image` with `fill` resolves against this element. */}
      <div className="relative size-full scale-[1.12] will-change-transform">
        {children}
      </div>
    </div>
  );
}
