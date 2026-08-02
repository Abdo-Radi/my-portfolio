"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { EASE, ENTER_TRIGGER, gsap, useGSAP } from "@/lib/gsap";

type CounterProps = {
  to: number;
  className?: string;
  /** Rendered before the animation runs and for reduced-motion users. */
  prefix?: string;
  suffix?: string;
  /** Pad with leading zeros, e.g. `pad={2}` renders 4 as "04". */
  pad?: number;
  duration?: number;
};

function format(value: number, pad: number) {
  const rounded = Math.round(value).toString();
  return pad > 0 ? rounded.padStart(pad, "0") : rounded;
}

/**
 * Counts up when scrolled into view by tweening a plain proxy object and
 * writing the formatted result to the DOM — no React re-renders, and no
 * reliance on GSAP's text plugins.
 *
 * The final value is server-rendered, so the number is correct with JS off and
 * for reduced-motion users; the animation only rewinds it to zero to play.
 */
export function Counter({
  to,
  className,
  prefix = "",
  suffix = "",
  pad = 0,
  duration = 1.6,
}: CounterProps) {
  const ref = React.useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const proxy = { value: 0 };
        el.textContent = format(0, pad);

        gsap.to(proxy, {
          value: to,
          duration,
          ease: EASE.micro,
          onUpdate: () => {
            el.textContent = format(proxy.value, pad);
          },
          scrollTrigger: { trigger: el, ...ENTER_TRIGGER },
        });

        return () => {
          el.textContent = format(to, pad);
        };
      });

      return () => mm.revert();
    },
    { scope: ref, dependencies: [to, pad, duration] },
  );

  return (
    <span className={cn("tabular-nums", className)}>
      {prefix}
      <span ref={ref}>{format(to, pad)}</span>
      {suffix}
    </span>
  );
}
