"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { siteConfig } from "@/data/site";
import { cn } from "@/lib/utils";
import { EASE, ScrollTrigger, gsap, useGSAP } from "@/lib/gsap";
import { ThemeToggle } from "@/components/ThemeToggle";
import { EmailLink } from "@/components/EmailLink";

const NAV = [
  { href: "/projects", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

const OVERLAY_ID = "site-menu";

/** Bar height. Kept in one place so the overlay can clear it exactly. */
const BAR_H = "clamp(3.5rem,7vh,4.5rem)";

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export function Navbar() {
  const pathname = usePathname();
  const headerRef = React.useRef<HTMLElement>(null);
  const overlayRef = React.useRef<HTMLDivElement>(null);
  const triggerRef = React.useRef<HTMLButtonElement>(null);

  /**
   * The menu stores the route it was opened on rather than a plain boolean.
   * A navigation therefore closes it *derivationally* — no `setState` inside an
   * effect, which the `react-hooks/set-state-in-effect` rule forbids.
   */
  const [openedOn, setOpenedOn] = React.useState<string | null>(null);
  const open = openedOn !== null && openedOn === pathname;

  /** Read by the ScrollTrigger callback, which lives outside React's render. */
  const openRef = React.useRef(false);
  React.useEffect(() => {
    openRef.current = open;
  }, [open]);

  const dismiss = React.useCallback(() => setOpenedOn(null), []);
  const closeAndRestoreFocus = React.useCallback(() => {
    setOpenedOn(null);
    triggerRef.current?.focus();
  }, []);

  /* --------------------------------------------------------------------- */
  /* Hide on scroll down, show on scroll up                                 */
  /* --------------------------------------------------------------------- */

  useGSAP(
    () => {
      const el = headerRef.current;
      if (!el) return;

      const mm = gsap.matchMedia();

      // Reduced motion keeps the bar pinned and visible — nothing to revert.
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        let hidden = false;

        const slide = (next: boolean) => {
          if (hidden === next) return;
          hidden = next;
          gsap.to(el, {
            yPercent: next ? -100 : 0,
            duration: 0.45,
            ease: EASE.inOut,
            overwrite: true,
          });
        };

        // A single always-on trigger: cheaper and steadier than a scroll
        // listener, and it shares ScrollTrigger's (Lenis-driven) clock.
        ScrollTrigger.create({
          start: 0,
          end: "max",
          onUpdate: (self) => {
            // Near the top, or with the menu open, the bar is always present.
            if (openRef.current || self.scroll() < 96) {
              slide(false);
              return;
            }
            slide(self.direction === 1);
          },
        });
      });

      return () => mm.revert();
    },
    { scope: headerRef },
  );

  /* --------------------------------------------------------------------- */
  /* Overlay: scroll lock, Escape, focus handoff                            */
  /* --------------------------------------------------------------------- */

  React.useEffect(() => {
    if (!open) return;

    // Locking <html> (not <body>) is what actually stops the window scroll
    // that Lenis drives.
    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    root.style.overflow = "hidden";

    // Everything behind the overlay leaves the tab order and the a11y tree.
    const behind = [
      document.getElementById("main"),
      document.querySelector("footer"),
    ].filter((el): el is HTMLElement => el !== null);
    for (const el of behind) el.setAttribute("inert", "");

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeAndRestoreFocus();
    };
    document.addEventListener("keydown", onKeyDown);

    overlayRef.current?.querySelector<HTMLElement>("a, button")?.focus();

    return () => {
      root.style.overflow = previousOverflow;
      for (const el of behind) el.removeAttribute("inert");
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, closeAndRestoreFocus]);

  useGSAP(
    () => {
      if (!open) return;

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from("[data-menu-item]", {
          y: 40,
          opacity: 0,
          duration: 0.7,
          ease: EASE.out,
          stagger: 0.06,
        });
      });

      return () => mm.revert();
    },
    { scope: overlayRef, dependencies: [open] },
  );

  /* --------------------------------------------------------------------- */

  return (
    <>
      <header
        ref={headerRef}
        className="fixed inset-x-0 top-0 z-50 border-b border-rule bg-paper will-change-transform"
        style={{ height: BAR_H }}
      >
        <div className="shell flex h-full items-center justify-between gap-4">
          <Link
            href="/"
            aria-label={`${siteConfig.name} — home`}
            className="t-meta inline-flex shrink-0 items-center gap-2.5 text-[0.75rem] tracking-[0.1em] text-ink md:text-[0.8125rem] md:tracking-[0.16em]"
          >
            <span className="dot-live shrink-0" aria-hidden="true" />
            <span className="link-draw">{siteConfig.name}</span>
          </Link>

          <nav
            aria-label="Main"
            className="hidden md:flex md:items-center md:gap-[clamp(1.5rem,2.6vw,2.75rem)]"
          >
            {NAV.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "t-meta relative inline-flex items-baseline gap-2 py-1 transition-colors duration-200",
                    active ? "text-ink" : "link-draw text-ink-3 hover:text-ink",
                  )}
                >
                  <span>{item.label}</span>
                  {active ? (
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-0 -bottom-0.5 h-px bg-signal"
                    />
                  ) : null}
                </Link>
              );
            })}
          </nav>

          <div className="flex shrink-0 items-center gap-4 md:gap-6">
            <ThemeToggle />
            <button
              ref={triggerRef}
              type="button"
              onClick={() =>
                open ? closeAndRestoreFocus() : setOpenedOn(pathname)
              }
              aria-expanded={open}
              aria-controls={OVERLAY_ID}
              className="t-meta py-1 text-[0.625rem] tracking-[0.14em] text-ink md:hidden"
            >
              {open ? "Close" : "Menu"}
            </button>
          </div>
        </div>
      </header>

      {open ? (
        <div
          id={OVERLAY_ID}
          ref={overlayRef}
          // Sits *below* the bar so the single Menu/Close control stays live.
          className="fixed inset-0 z-40 bg-ink text-paper md:hidden"
        >
          <div
            className="shell flex h-full flex-col justify-between pb-[clamp(2rem,6vh,3.5rem)]"
            style={{ paddingTop: `calc(${BAR_H} + clamp(2rem,7vh,3.5rem))` }}
          >
            <nav aria-label="Site">
              <ul className="border-b border-paper/20">
                {NAV.map((item) => (
                  <li
                    key={item.href}
                    data-menu-item
                    className="border-t border-paper/20"
                  >
                    <Link
                      href={item.href}
                      onClick={dismiss}
                      aria-current={
                        isActive(pathname, item.href) ? "page" : undefined
                      }
                      className={cn(
                        "flex items-baseline gap-4 py-[clamp(0.9rem,3.2vh,1.75rem)] transition-colors duration-200",
                        isActive(pathname, item.href)
                          ? "text-paper"
                          : "text-paper/55",
                      )}
                    >
                      <span className="t-headline">{item.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div data-menu-item className="flex flex-col gap-2">
              <EmailLink
                onClick={dismiss}
                className="t-meta link-draw w-fit text-paper"
              >
                {siteConfig.email}
              </EmailLink>
              <p className="t-meta text-paper/50">
                {siteConfig.location} — available for new work
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
