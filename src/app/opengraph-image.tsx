import { ImageResponse } from "next/og";

import { siteConfig } from "@/data/site";

// Route segment config + metadata for the generated OG image.
export const alt = `${siteConfig.name} — ${siteConfig.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "80px",
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
        color: "#f8fafc",
        fontFamily: "monospace",
      }}
    >
      <div style={{ fontSize: 32, color: "#38bdf8" }}>
        {siteConfig.url.replace(/^https?:\/\//, "")}
      </div>
      <div style={{ fontSize: 80, fontWeight: 700, marginTop: 24 }}>
        {siteConfig.name}
      </div>
      <div style={{ fontSize: 48, color: "#94a3b8", marginTop: 8 }}>
        {siteConfig.role}
      </div>
      <div
        style={{ fontSize: 28, color: "#cbd5e1", marginTop: 32, maxWidth: 900 }}
      >
        {siteConfig.tagline}
      </div>
    </div>,
    { ...size },
  );
}
