"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { gsap, useGSAP } from "@/lib/gsap";

type MarqueeProps = {
  children: React.ReactNode;
  className?: string;
  /** Seconds for one full pass of a single copy. Higher is slower. */
  duration?: number;
  reverse?: boolean;
};

/**
 * Seamless ticker: two identical copies of the children slide by exactly half
 * the track width, so the loop point is invisible. Driven by GSAP (not a CSS
 * keyframe) so it shares the ticker with everything else and pauses cleanly.
 *
 * The duplicate copy is aria-hidden; screen readers read the content once.
 */
export function Marquee({
  children,
  className,
  duration = 38,
  reverse = false,
}: MarqueeProps) {
  const ref = React.useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const track = ref.current?.firstElementChild;
      if (!track) return;

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tween = gsap.to(track, {
          xPercent: reverse ? 50 : -50,
          duration,
          ease: "none",
          repeat: -1,
        });
        if (reverse) gsap.set(track, { xPercent: -50 });
        return () => tween.kill();
      });

      return () => mm.revert();
    },
    { scope: ref, dependencies: [duration, reverse] },
  );

  return (
    <div ref={ref} className={cn("w-full overflow-hidden", className)}>
      <div className="flex w-max will-change-transform">
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}
