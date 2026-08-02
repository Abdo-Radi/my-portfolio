"use client";

import * as React from "react";

import { EASE, gsap, useGSAP } from "@/lib/gsap";

const INTERACTIVE = 'a[href], button, [role="button"], input, textarea, label';

/**
 * A small ink ring that follows the pointer, drawn with `mix-blend-difference`
 * so it inverts against whatever it crosses — no colour, no blur, no trail.
 * It grows over interactive elements, which is the only hover affordance the
 * design needs.
 *
 * Rendered (invisible) on every device to keep SSR and client markup identical;
 * listeners only attach for fine pointers, and CSS hides it on coarse ones.
 */
export function CursorDot() {
  const ref = React.useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      if (!window.matchMedia("(pointer: fine)").matches) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const moveX = gsap.quickTo(el, "x", { duration: 0.4, ease: EASE.micro });
      const moveY = gsap.quickTo(el, "y", { duration: 0.4, ease: EASE.micro });

      const onMove = (event: PointerEvent) => {
        moveX(event.clientX);
        moveY(event.clientY);
        gsap.to(el, { autoAlpha: 1, duration: 0.2, overwrite: "auto" });
      };

      const onLeave = () =>
        gsap.to(el, { autoAlpha: 0, duration: 0.2, overwrite: "auto" });

      const onOver = (event: PointerEvent) => {
        const target = event.target as Element | null;
        const hit = target?.closest?.(INTERACTIVE);
        gsap.to(el, {
          scale: hit ? 2.1 : 1,
          duration: 0.32,
          ease: EASE.micro,
          overwrite: "auto",
        });
      };

      window.addEventListener("pointermove", onMove, { passive: true });
      window.addEventListener("pointerover", onOver, { passive: true });
      document.addEventListener("pointerleave", onLeave);

      return () => {
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerover", onOver);
        document.removeEventListener("pointerleave", onLeave);
      };
    },
    { scope: ref },
  );

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-[100] -mt-3 -ml-3 size-6 rounded-full border border-white opacity-0 mix-blend-difference [@media(pointer:coarse)]:hidden"
    />
  );
}
