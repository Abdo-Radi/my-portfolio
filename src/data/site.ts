import { clientEnv } from "@/lib/env";

/**
 * Central site configuration. Everything here is plain data so it can be
 * imported by Server Components, metadata, sitemap, and OG image generation.
 *
 * Kept in sync with the CV in `public/resume.pdf` — if the two disagree, the
 * CV wins and this file should be corrected.
 */
export const siteConfig = {
  name: "Abdellah Radi",
  role: "Full-Stack Developer",
  /** The long-form title, as it reads on the CV. */
  specialism: "Java Spring · Angular · MERN · React Native · AI & Automation",
  tagline:
    "I build enterprise applications with Java, Spring Boot and the MERN stack, take them to iOS and Android with React Native — and wire AI into the workflows around them.",
  description:
    "Portfolio of Abdellah Radi — full-stack developer in Casablanca. Fintech interfaces at scale, Java/Spring Boot and MERN applications, React Native mobile apps, and AI integration with Gemini, OpenAI and n8n.",
  // Used for absolute URLs (sitemap, OG, canonical). Set via the validated
  // NEXT_PUBLIC_SITE_URL environment variable (see src/lib/env.ts).
  url: clientEnv.NEXT_PUBLIC_SITE_URL,
  email: "abdellahradi30@gmail.com",
  /** Display form; `tel:` links strip the spaces. */
  phone: "+212 693 185 212",
  location: "Casablanca, Morocco",
  resumeUrl: "/resume.pdf",
  socials: {
    linkedin: "https://www.linkedin.com/in/abdellah-radi/",
  },
} as const;

/** `+212 693 185 212` → `+212693185212`, for `tel:` hrefs. */
export const phoneHref = `tel:${siteConfig.phone.replace(/\s+/g, "")}`;

export type SiteConfig = typeof siteConfig;
