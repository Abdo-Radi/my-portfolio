"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { DUR, EASE, ENTER_TRIGGER, SplitText, gsap, useGSAP } from "@/lib/gsap";

type SplitLinesProps = {
  children: React.ReactNode;
  /** Rendered element. Defaults to a <span> so callers control semantics. */
  as?: React.ElementType;
  className?: string;
  /** Seconds to wait before the first line moves. */
  delay?: number;
  /** Seconds between consecutive lines. */
  stagger?: number;
  /** Trigger on scroll into view instead of on mount. */
  onScroll?: boolean;
};

/**
 * Masked line-by-line text reveal — the signature entrance of the site.
 *
 * SplitText (3.13+) does the heavy lifting: `mask: "lines"` wraps every line in
 * an overflow-hidden element so the type slides up from behind a hard edge
 * rather than fading in, `autoSplit` re-splits (and replays) when fonts finish
 * loading or the line count changes on resize, and `aria: "auto"` keeps an
 * accessible label on the host element while hiding the split fragments.
 *
 * The "from" state is set in JS, never in CSS, so server-rendered text stays
 * readable if JavaScript never runs.
 */
export function SplitLines({
  children,
  as = "span",
  className,
  delay = 0,
  stagger = 0.075,
  onScroll = false,
}: SplitLinesProps) {
  const ref = React.useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const split = SplitText.create(el, {
          type: "lines",
          mask: "lines",
          autoSplit: true,
          linesClass: "split-line",
          onSplit: (self) =>
            gsap.from(self.lines, {
              yPercent: 108,
              duration: DUR.enter,
              ease: EASE.out,
              stagger,
              delay,
              ...(onScroll
                ? { scrollTrigger: { trigger: el, ...ENTER_TRIGGER } }
                : {}),
            }),
        });

        return () => split.revert();
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
