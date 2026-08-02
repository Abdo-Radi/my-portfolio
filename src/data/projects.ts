export type Project = {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  /** Path under /public or absolute URL. */
  image?: string;
  liveUrl?: string;
  sourceUrl?: string;
  featured?: boolean;
};

/**
 * Work, drawn from the roles in `src/data/experience.ts`. Client engagements
 * carry no public URL — every figure quoted here is one the CV already makes.
 */
export const projects: Project[] = [
  {
    slug: "payment-management-console",
    title: "Payment Management Console",
    description:
      "The management interface of a payment platform used by more than 5,000 professional clients. Refactoring the JavaScript layer and tightening DOM handling cut load times by 30%, and secure transaction APIs were integrated and tested directly with the backend team.",
    tags: ["JavaScript", "jQuery", "Bootstrap", "REST APIs", "SVN"],
    featured: true,
  },
  {
    slug: "art-gallery-commerce",
    title: "Art Gallery Commerce",
    description:
      "A MERN e-commerce platform built end to end. RESTful Node and Express APIs with MongoDB index optimisation cut response times by 60%; the React storefront uses Redux for global state, behind JWT authentication with Bcrypt hashing and role-based access control.",
    tags: ["React", "Redux", "Node.js", "Express", "MongoDB", "JWT"],
    featured: true,
  },
  {
    slug: "factoring-flow-automation",
    title: "Factoring Flow Automation",
    description:
      "Automation of factoring data flows for a banking client. Python and Batch scripts replaced manual handling, PL/SQL queries drive incident diagnosis against SLAs, and the data-transfer interfaces between systems are maintained alongside the servers they run on.",
    tags: ["Python", "PL/SQL", "Batch", "Windows Server"],
    featured: true,
  },
  {
    slug: "presswork-portfolio",
    title: "Presswork Portfolio",
    description:
      "This site. Next.js 16 App Router and Tailwind v4 on a twelve-column editorial grid, with GSAP driving the scroll and text choreography. TypeScript strict throughout, tested with Vitest, containerised and shipped through GitHub Actions.",
    tags: ["Next.js", "TypeScript", "Tailwind", "GSAP", "Vitest"],
  },
];
