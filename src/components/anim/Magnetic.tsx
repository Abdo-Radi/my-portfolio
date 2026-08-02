"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { EASE, gsap, useGSAP } from "@/lib/gsap";

type MagneticProps = {
  children: React.ReactNode;
  className?: string;
  /** How far the element is allowed to travel toward the pointer, in px. */
  strength?: number;
};

/**
 * Pulls its child toward the pointer while hovered and springs it back on exit.
 * `gsap.quickTo` keeps this to a single interpolated setter per axis rather than
 * a new tween per mousemove event.
 */
export function Magnetic({
  children,
  className,
  strength = 14,
}: MagneticProps) {
  const ref = React.useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      if (!window.matchMedia("(pointer: fine)").matches) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const moveX = gsap.quickTo(el, "x", { duration: 0.5, ease: EASE.micro });
      const moveY = gsap.quickTo(el, "y", { duration: 0.5, ease: EASE.micro });

      const onMove = (event: PointerEvent) => {
        const rect = el.getBoundingClientRect();
        const dx = event.clientX - (rect.left + rect.width / 2);
        const dy = event.clientY - (rect.top + rect.height / 2);
        moveX(gsap.utils.clamp(-strength, strength, dx * 0.4));
        moveY(gsap.utils.clamp(-strength, strength, dy * 0.4));
      };

      const onLeave = () => {
        moveX(0);
        moveY(0);
      };

      el.addEventListener("pointermove", onMove);
      el.addEventListener("pointerleave", onLeave);

      return () => {
        el.removeEventListener("pointermove", onMove);
        el.removeEventListener("pointerleave", onLeave);
      };
    },
    { scope: ref, dependencies: [strength] },
  );

  return (
    <span
      ref={ref}
      className={cn("inline-block will-change-transform", className)}
    >
      {children}
    </span>
  );
}
