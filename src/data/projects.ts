/** Keys into the diagram registry in `src/components/diagrams`. */
export type DiagramKey = "payment-console" | "factoring-flow";

export type Project = {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  /** Path under /public or absolute URL. */
  image?: string;
  /**
   * Diagram plate, drawn from tokens, for work whose interface cannot be
   * shown. Takes the place of a screenshot — never sits beside one.
   */
  diagram?: DiagramKey;
  liveUrl?: string;
  sourceUrl?: string;
  featured?: boolean;
  /**
   * Why this entry carries no link. Rendered where the Live/Source links
   * would sit, so the absence reads as a decision rather than an omission.
   */
  note?: string;
};

/**
 * Work, drawn from the roles in `src/data/experience.ts`. Every figure quoted
 * here is one the CV already makes. Publicly deployed work links its live
 * site; client work that was never published carries no URL, and a private
 * repository is never linked.
 */
export const projects: Project[] = [
  {
    slug: "yaluoza-luxury-marketplace",
    title: "Yaluoza Luxury Marketplace",
    description:
      "A French marketplace for selling luxury property owner to owner, without an agency. Next.js 16 renders search and listings on the server, and search itself lives in PostgreSQL: PostGIS resolves a radius query in one indexed pass, and 190,000 official sale records price a street rather than a region. Uploads go browser-to-storage on presigned URLs, AI drafts the listing copy, and React Native carries the same API to iOS and Android.",
    tags: [
      "Next.js",
      "TypeScript",
      "Express",
      "PostgreSQL",
      "PostGIS",
      "React Native",
    ],
    image: "/projects/yaluoza.jpg",
    liveUrl: "https://yaluoza.com",
    featured: true,
  },
  {
    slug: "payment-management-console",
    title: "Payment Management Console",
    description:
      "The management interface of a payment platform used by more than 5,000 professional clients. Refactoring the JavaScript layer and tightening DOM handling cut load times by 30%, and secure transaction APIs were integrated and tested directly with the backend team.",
    tags: ["JavaScript", "jQuery", "Bootstrap", "REST APIs", "SVN"],
    diagram: "payment-console",
    featured: true,
    note: "Client platform — internal. No public URL, no interface shown.",
  },
  {
    slug: "art-gallery-commerce",
    title: "Art Gallery Commerce",
    description:
      "A MERN e-commerce platform built end to end. RESTful Node and Express APIs with MongoDB index optimisation cut response times by 60%; the React storefront uses Redux for global state, behind JWT authentication with Bcrypt hashing and role-based access control. Now live as Horizons: a storefront and an artist studio on one Express API, serverless on Vercel, with on-the-fly image resizing and a demo that resets itself every night.",
    tags: ["React", "Redux", "Node.js", "Express", "MongoDB", "JWT"],
    image: "/projects/art-gallery-commerce.jpg",
    liveUrl: "https://horizons-gallery.vercel.app",
    sourceUrl: "https://github.com/Abdo-Radi/Art-Gallery-e-commerce",
    featured: true,
  },
  {
    slug: "factoring-flow-automation",
    title: "Factoring Flow Automation",
    description:
      "Automation of factoring data flows for a banking client. Python and Batch scripts replaced manual handling, PL/SQL queries drive incident diagnosis against SLAs, and the data-transfer interfaces between systems are maintained alongside the servers they run on.",
    tags: ["Python", "PL/SQL", "Batch", "Windows Server"],
    diagram: "factoring-flow",
    featured: true,
    note: "Banking client — internal. No public URL, no interface shown.",
  },
  {
    slug: "presswork-portfolio",
    title: "Presswork Portfolio",
    description:
      "This site. Next.js 16 App Router and Tailwind v4 on a twelve-column editorial grid, with GSAP driving the scroll and text choreography. TypeScript strict throughout, tested with Vitest, containerised and shipped through GitHub Actions.",
    tags: ["Next.js", "TypeScript", "Tailwind", "GSAP", "Vitest"],
    image: "/projects/presswork-portfolio.jpg",
  },
];
