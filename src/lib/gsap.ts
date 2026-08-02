"use client";

import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

/**
 * Single GSAP entry point for the whole app.
 *
 * Plugins are registered once, guarded for SSR. Import `gsap`, `ScrollTrigger`,
 * `SplitText` and `useGSAP` from here — never from "gsap" directly — so that
 * registration can't be skipped and so the easing/duration vocabulary below
 * stays consistent across every component.
 *
 * GSAP 3.13+ is fully free (Webflow), including SplitText and ScrollTrigger.
 */
if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);
  ScrollTrigger.config({ ignoreMobileResize: true });
}

/**
 * The motion vocabulary. Entrances are `expo.out` (fast start, long settle),
 * structural rules use `expo.inOut`, micro-interactions use `power2.out`.
 * Nothing bounces, nothing is elastic.
 */
export const EASE = {
  /** Entrances: text lines, blocks, plates. */
  out: "expo.out",
  /** Structure: hairlines drawing, pinned transitions. */
  inOut: "expo.inOut",
  /** Hover / cursor / micro-interaction. */
  micro: "power2.out",
} as const;

/** Durations. Slow and confident, or instant — nothing in between. */
export const DUR = {
  enter: 1.15,
  rule: 1,
  micro: 0.34,
} as const;

/** Standard scroll-entrance trigger config. */
export const ENTER_TRIGGER = { start: "top 82%", once: true } as const;

export { gsap, ScrollTrigger, SplitText, useGSAP };
