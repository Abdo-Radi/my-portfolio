"use client";

import * as React from "react";
import Lenis from "lenis";

import { ScrollTrigger, gsap } from "@/lib/gsap";

/**
 * Mounts Lenis and drives it from GSAP's ticker so smooth scrolling and every
 * ScrollTrigger stay on the same clock (running two RAF loops causes the
 * classic one-frame jitter on scrubbed animations).
 *
 * Skipped entirely for reduced-motion users and for coarse pointers — hijacking
 * momentum scrolling on touch devices feels broken, not premium.
 */
export function SmoothScroll() {
  React.useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const coarse = window.matchMedia("(pointer: coarse)");
    if (reduced.matches || coarse.matches) return;

    const lenis = new Lenis({
      lerp: 0.1,
      wheelMultiplier: 1,
      touchMultiplier: 1.6,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      gsap.ticker.lagSmoothing(500, 33);
      lenis.destroy();
    };
  }, []);

  return null;
}
