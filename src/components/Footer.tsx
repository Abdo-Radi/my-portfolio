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

        <p className="t-meta mt-[clamp(3rem,7vw,5.5rem)] border-t border-rule pt-6 leading-[1.7]">
          Designed and built by {siteConfig.name}. Next.js 16, Tailwind v4 and
          GSAP. Typeset in Archivo and IBM Plex Mono.
        </p>

        <div className="mt-5 flex flex-col gap-2 border-t border-rule pt-5 sm:flex-row sm:items-baseline sm:justify-between">
          <p className="t-meta">
            © {year} {siteConfig.name}
          </p>
          <p className="t-meta">
            Written, designed and shipped in {siteConfig.location}
          </p>
        </div>
      </div>

      {/* The closing signature: full-bleed, cropped by the bottom of the page. */}
      <div
        aria-hidden="true"
        className="shell mt-[clamp(2rem,4vw,3.5rem)] overflow-hidden"
      >
        {/*
          `leading-none` keeps the cap-tops safely inside the clipping box; the
          -0.3em bottom margin is what pulls the crop line up through the
          letterforms so roughly a fifth of them bleeds off the page.
        */}
        <p className="t-display -mb-[0.3em] optical-left w-full text-[clamp(2.4rem,11vw,12.5rem)] leading-none whitespace-nowrap text-ink select-none">
          {siteConfig.name}
        </p>
      </div>
    </footer>
  );
}
