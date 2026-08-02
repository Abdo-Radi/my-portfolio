import { ImageResponse } from "next/og";

import { siteConfig } from "@/data/site";

// Route segment config + metadata for the generated OG image.
export const alt = `${siteConfig.name} — ${siteConfig.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * PRESSWORK, flattened for Satori.
 *
 * Satori implements a subset of CSS: no custom properties, no oklch, no
 * implicit block layout. Every colour below is a literal hex matched to the
 * light-mode tokens, and every container declares `display: flex`.
 *
 * Only the bundled font (weight 400) is available, so the identity is carried
 * by scale, tight tracking and one vermilion rule rather than by weight.
 */
const PAPER = "#F2F1EC";
const INK = "#14120F";
const INK_2 = "#6B665C";
const INK_3 = "#9A9488";
const SIGNAL = "#DF3D0B";

export default function OpengraphImage() {
  const [first = siteConfig.name, ...rest] = siteConfig.name.split(" ");
  const second = rest.join(" ");

  return new ImageResponse(
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "76px 88px",
        backgroundColor: PAPER,
        fontFamily: "sans-serif",
      }}
    >
      {/* Folio row */}
      <div
        style={{
          display: "flex",
          width: "100%",
          justifyContent: "space-between",
          fontSize: 21,
          letterSpacing: 5,
          color: INK_3,
        }}
      >
        <div style={{ display: "flex" }}>PORTFOLIO</div>
        <div style={{ display: "flex" }}>
          {siteConfig.location.toUpperCase()}
        </div>
      </div>

      {/* Masthead */}
      <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
        <div
          style={{
            display: "flex",
            fontSize: 132,
            letterSpacing: -6,
            lineHeight: 1,
            color: INK,
          }}
        >
          {first.toUpperCase()}
        </div>
        {second ? (
          <div
            style={{
              display: "flex",
              fontSize: 132,
              letterSpacing: -6,
              lineHeight: 1,
              color: INK,
            }}
          >
            {second.toUpperCase()}
          </div>
        ) : null}

        <div
          style={{
            display: "flex",
            marginTop: 34,
            fontSize: 32,
            letterSpacing: 7,
            color: INK_2,
          }}
        >
          {siteConfig.role.toUpperCase()}
        </div>
      </div>

      {/* The one vermilion rule, then the address */}
      <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
        <div
          style={{
            display: "flex",
            width: "100%",
            height: 3,
            backgroundColor: SIGNAL,
          }}
        />
        <div
          style={{
            display: "flex",
            width: "100%",
            justifyContent: "space-between",
            marginTop: 22,
            fontSize: 21,
            letterSpacing: 4,
            color: INK_3,
          }}
        >
          <div style={{ display: "flex" }}>
            {siteConfig.url.replace(/^https?:\/\//, "").replace(/\/$/, "")}
          </div>
          <div style={{ display: "flex" }}>TYPESCRIPT · NEXT.JS · GSAP</div>
        </div>
      </div>
    </div>,
    { ...size },
  );
}
