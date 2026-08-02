"use client";

import * as React from "react";
import Link from "next/link";

import { Magnetic, RuleDraw, SplitLines } from "@/components/anim";
import { DUR, EASE, gsap, useGSAP } from "@/lib/gsap";
import { siteConfig } from "@/data/site";
import { EmailLink } from "@/components/EmailLink";

/**
 * (05) — the close.
 *
 * The address is the call to action: set in mono at title size, underlined on
 * hover by the drawn rule, with the arrow travelling up and to the right. Only
 * the availability dot carries the signal colour here.
 *
 * A client component because the arrow is hand-tweened; everything it renders is
 * plain markup that reads fine without scripting.
 */
export function Endnote() {
  const sectionRef = React.useRef<HTMLElement>(null);
  const linkRef = React.useRef<HTMLAnchorElement>(null);
  const arrowRef = React.useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const link = linkRef.current;
      const arrow = arrowRef.current;
      if (!link || !arrow) return;

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const moveX = gsap.quickTo(arrow, "x", {
          duration: DUR.micro,
          ease: EASE.micro,
        });
        const moveY = gsap.quickTo(arrow, "y", {
          duration: DUR.micro,
          ease: EASE.micro,
        });

        const engage = () => {
          moveX(10);
          moveY(-10);
        };
        const release = () => {
          moveX(0);
          moveY(0);
        };

        link.addEventListener("pointerenter", engage);
        link.addEventListener("pointerleave", release);
        link.addEventListener("focus", engage);
        link.addEventListener("blur", release);

        return () => {
          link.removeEventListener("pointerenter", engage);
          link.removeEventListener("pointerleave", release);
          link.removeEventListener("focus", engage);
          link.removeEventListener("blur", release);
        };
      });

      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} className="section" aria-label="Contact">
      <div className="shell">
        <p className="t-meta">(05) CONTACT</p>

        <div className="grid-12 items-end pt-[clamp(2rem,5vw,4rem)]">
          <SplitLines
            as="h2"
            onScroll
            className="t-headline col-span-4 md:col-span-7"
          >
            GET IN
            <br />
            TOUCH
          </SplitLines>

          <p className="t-body col-span-4 pt-10 md:col-span-4 md:col-start-9 md:pt-0 md:pb-1.5">
            Open to senior and lead roles. Email is the fastest route; use the
            form if you would rather type.
          </p>
        </div>

        <div className="pt-[clamp(3rem,7vw,5.5rem)]">
          <RuleDraw />
          <div className="pt-[clamp(1.75rem,3vw,2.75rem)]">
            <Magnetic strength={10}>
              <EmailLink
                ref={linkRef}
                className="inline-flex items-baseline gap-3 font-mono text-[clamp(1.05rem,3.4vw,2.5rem)] leading-none tracking-[-0.02em]"
              >
                <span className="link-draw">{siteConfig.email}</span>
                <span
                  ref={arrowRef}
                  aria-hidden="true"
                  className="inline-block will-change-transform"
                >
                  ↗
                </span>
              </EmailLink>
            </Magnetic>
          </div>
        </div>

        <div className="pt-[clamp(3rem,7vw,5.5rem)]">
          <RuleDraw />
          <div className="grid-12 gap-y-8 pt-6">
            <div className="col-span-2 md:col-span-3">
              <p className="t-meta">AVAILABILITY</p>
              <p className="t-meta mt-2.5 flex items-center gap-2.5 text-ink-2">
                <span className="dot-live shrink-0" aria-hidden="true" />
                OPEN — SENIOR ROLES
              </p>
            </div>

            <div className="col-span-2 md:col-span-3">
              <p className="t-meta">LOCATION</p>
              <p className="t-meta mt-2.5 text-ink-2">{siteConfig.location}</p>
            </div>

            <div className="col-span-2 md:col-span-3">
              <p className="t-meta">ENQUIRIES</p>
              <p className="t-meta mt-2.5 text-ink-2">
                <Link
                  href="/contact"
                  className="link-draw inline-flex items-center gap-2 hover:text-ink"
                >
                  CONTACT FORM
                  <span aria-hidden="true">→</span>
                </Link>
              </p>
            </div>

            <div className="col-span-2 md:col-span-3 md:text-right">
              <p className="t-meta">DOCUMENT</p>
              <p className="t-meta mt-2.5 text-ink-2">
                <a
                  href={siteConfig.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-draw inline-flex items-center gap-2 hover:text-ink"
                >
                  RESUME (PDF)
                  <span aria-hidden="true">↗</span>
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
