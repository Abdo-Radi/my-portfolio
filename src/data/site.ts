import { clientEnv } from "@/lib/env";

/**
 * Central site configuration. Edit this to personalize the portfolio.
 * Everything here is plain data so it can be imported by Server Components,
 * metadata, sitemap, and OG image generation.
 */
export const siteConfig = {
  name: "Abdellah Radi",
  role: "Full-Stack Developer",
  tagline: "I build fast, accessible web apps with TypeScript and React.",
  description:
    "Portfolio of Abdellah Radi — full-stack developer specializing in Next.js, TypeScript, and cloud-native delivery.",
  // Used for absolute URLs (sitemap, OG, canonical). Set via the validated
  // NEXT_PUBLIC_SITE_URL environment variable (see src/lib/env.ts).
  url: clientEnv.NEXT_PUBLIC_SITE_URL,
  email: "abdellahradi30@gmail.com",
  location: "Morocco",
  resumeUrl: "/resume.pdf",
  socials: {
    github: "https://github.com/yourusername",
    linkedin: "https://www.linkedin.com/in/yourusername",
  },
} as const;

export type SiteConfig = typeof siteConfig;
