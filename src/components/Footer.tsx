import Link from "next/link";

import { siteConfig } from "@/data/site";
import { EmailLink } from "@/components/EmailLink";

const NAV = [
  { href: "/projects", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

const ELSEWHERE = [{ label: "LinkedIn", href: siteConfig.socials.linkedin }];

/**
 * Server component on purpose: the year is stamped on the server, so there is
 * no client `Date` and nothing to hydrate. The closing wordmark is set in the
 * display face and deliberately cropped by the bottom edge of the document.
 */
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-rule">
      <div className="shell pt-[clamp(3.5rem,9vw,7rem)] pb-[clamp(2rem,4vw,3rem)]">
        <div className="grid-12 gap-y-[clamp(2.75rem,5vw,4rem)]">
          {/* Cols 1–5: the direct line. */}
          <div className="col-span-4 md:col-span-6 lg:col-span-5">
            <p className="t-meta">Write to me</p>
            <EmailLink className="link-draw mt-4 inline-block font-mono text-[clamp(1rem,2.3vw,1.95rem)] leading-[1.15] tracking-[-0.02em] break-words text-ink">
              {siteConfig.email}
              <span aria-hidden="true" className="ml-2 text-[0.7em]">
                ↗
              </span>
            </EmailLink>
          </div>

          {/* Cols 7–9: the site index, repeated. */}
          <nav
            aria-label="Footer"
            className="col-span-2 md:col-span-3 md:col-start-7"
          >
            <p className="t-meta">Index</p>
            <ul className="mt-4 flex flex-col gap-2.5">
              {NAV.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="t-meta link-draw inline-flex items-baseline gap-2 text-ink-2 transition-colors duration-200 hover:text-ink"
                  >
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Cols 10–12: everywhere else. */}
          <div className="col-span-2 md:col-span-3 md:col-start-10">
            <p className="t-meta">Elsewhere</p>
            <ul className="mt-4 flex flex-col gap-2.5">
              {ELSEWHERE.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="t-meta link-draw inline-flex items-baseline gap-1.5 text-ink-2 transition-colors duration-200 hover:text-ink"
                  >
                    <span>{item.label}</span>
                    <span aria-hidden="true">↗</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-[clamp(3rem,7vw,5.5rem)] flex flex-col gap-2 border-t border-rule pt-5 sm:flex-row sm:items-baseline sm:justify-between">
          <p className="t-meta">
            © {year} {siteConfig.name}
          </p>
          <p className="t-meta">
            Written, designed and shipped in {siteConfig.location}
          </p>
        </div>
      </div>

      {/* The closing signature: full-bleed, set on the bottom edge. */}
      <div aria-hidden="true" className="mt-[clamp(2rem,4vw,3.5rem)]">
        {/*
          Set in SVG rather than CSS text so the fit is exact instead of
          estimated. `textLength` pins the rendered advance to the full 1000-unit
          viewBox, so the wordmark spans the viewport edge to edge whatever the
          real glyph widths turn out to be — no vw constant to tune, no headroom
          to leave, and nothing shears when the estimate is off.

          font-size 119 is 1000 / ~8.4em, the measure of thirteen uppercase
          Archivo glyphs at stretch 106% after the -0.045em tracking. That puts
          the natural width within a percent or so of 1000, so `spacingAndGlyphs`
          has almost nothing to correct — an error here costs a fraction of a
          percent of glyph width, never a clipped letter.

          Vertically: Archivo's ascent is 0.8896em and its caps run ~0.73em, so
          at this size the baseline sits at 90 and the cap tops land near 3. A
          93-unit box therefore holds the mark with ~3 units of air above and
          below — tight to both edges without touching a letterform.
        */}
        <svg
          viewBox="0 0 1000 93"
          className="block h-auto w-full text-ink select-none"
        >
          <text
            x="0"
            y="90"
            textLength="1000"
            lengthAdjust="spacingAndGlyphs"
            fill="currentColor"
            style={{
              fontFamily:
                "var(--font-sans), ui-sans-serif, system-ui, sans-serif",
              fontSize: 119,
              fontWeight: 800,
              fontStretch: "106%",
              letterSpacing: "-0.045em",
            }}
          >
            {siteConfig.name.toUpperCase()}
          </text>
        </svg>
      </div>
    </footer>
  );
}
