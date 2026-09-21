"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
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
  const lenisRef = React.useRef<Lenis | null>(null);
  const pathname = usePathname();

  React.useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const coarse = window.matchMedia("(pointer: coarse)");
    if (reduced.matches || coarse.matches) return;

    const lenis = new Lenis({
      lerp: 0.1,
      wheelMultiplier: 1,
      touchMultiplier: 1.6,
    });
    lenisRef.current = lenis;

    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      gsap.ticker.lagSmoothing(500, 33);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  /**
   * Re-measure on every client-side navigation.
   *
   * ScrollTrigger caches each trigger's start/end against the page height it
   * saw when the trigger was created. An App Router navigation swaps the page
   * under it without a resize event, so those numbers still describe the
   * *previous* route. Components that hide their own content until a trigger
   * fires — `ExperienceTable` sets `scaleX: 0` and `yPercent: 100` before
   * building its batch — then never get the callback, and the content stays
   * invisible for as long as you stay on the page. It looks like the scroll
   * has jammed, because you are scrolling through a tall band of nothing.
   * Reloading fixes it, which is the tell that this is measurement and not
   * layout.
   *
   * This effect lives in the root layout, and React flushes child effects
   * before parent ones, so by the time it runs every trigger on the new page
   * has already been created and is waiting to be re-measured. Lenis is told
   * to re-measure too: it caches the scroll limit the same way.
   *
   * Two passes: one after the browser has painted the new route, and one after
   * webfonts settle, since a font swap changes text height and therefore every
   * trigger position below it.
   */
  React.useEffect(() => {
    let cancelled = false;

    const remeasure = () => {
      if (cancelled) return;
      lenisRef.current?.resize();
      ScrollTrigger.refresh();
    };

    // Double rAF: the first fires before the new route has painted.
    const outer = requestAnimationFrame(() => {
      requestAnimationFrame(remeasure);
    });

    void document.fonts?.ready.then(remeasure).catch(() => {});

    return () => {
      cancelled = true;
      cancelAnimationFrame(outer);
    };
  }, [pathname]);

  return null;
}
