export type ExperienceItem = {
  role: string;
  organization: string;
  /** Human-readable period, e.g. "2024 — 2025". */
  period: string;
  description: string;
  highlights: string[];
  kind: "work" | "education";
};

/**
 * Roles and education, reverse chronological. Taken from the CV in
 * `public/resume.pdf` — every figure quoted elsewhere on the site should be
 * traceable back to a highlight here.
 */
export const experience: ExperienceItem[] = [
  {
    role: "Senior Full-Stack Developer",
    organization: "Birdman",
    period: "May 2026 — Present",
    kind: "work",
    description:
      "Lead developer on Yaluoza — a French marketplace for selling luxury property directly, without an agency.",
    highlights: [
      "Lead developer on Yaluoza, a French luxury-property marketplace — Next.js 16, Express and PostgreSQL, containerised end to end.",
      "Loaded 190,000 official sale records into PostGIS, pricing property street by street and serving map search as one indexed query.",
      "Cut the API into 22 route-service-data modules and hardened 90+ endpoints with Zod validation, argon2 hashing and JWT sessions.",
      "Wired AI into the listing pipeline for generated copy and photo enhancement, then took the product to iOS and Android with React Native, Expo and EAS.",
    ],
  },
  {
    role: "Application Support & Automation Consultant",
    organization: "Bank of Africa (via Procheck)",
    period: "Feb — Avr 2026",
    kind: "work",
    description:
      "External contractor on the factoring platform — keeping the business tools running and automating the data flows around them.",
    highlights: [
      "Automate factoring data flows with Python and Batch scripting, replacing manual handling.",
      "Diagnose and resolve production incidents against SLAs, querying PL/SQL directly.",
      "Maintain servers, network cabling, and the data-transfer interfaces between systems.",
    ],
  },
  {
    role: "R&D Engineer",
    organization: "Expanded Payment International (XPI)",
    period: "2024 — 2025",
    kind: "work",
    description:
      "Permanent contract on a payment platform used by more than 5,000 professional clients.",
    highlights: [
      "Cut load times on the management interface by 30% through JavaScript refactoring and tighter DOM handling.",
      "Integrated and tested secure transaction APIs in direct collaboration with the backend team.",
      "Maintained a high-availability codebase under SVN, shipping evolutionary changes without downtime.",
    ],
  },
  {
    role: "Full-Stack MERN Developer — Operational Internship",
    organization: "ARK-X Talent Factory",
    period: "Jan — Jun 2024",
    kind: "work",
    description:
      "Built an e-commerce platform end to end, from the data model to the storefront.",
    highlights: [
      "Designed and deployed RESTful APIs on Node.js and Express, cutting response times 60% with MongoDB index optimisation.",
      "Built an art-gallery storefront in React with Redux for global state.",
      "Implemented JWT authentication with Bcrypt hashing and role-based access control.",
    ],
  },
  {
    role: "Full-Stack MERN Developer — Qualification Certification",
    organization: "JobInTech",
    period: "Jan — Jun 2024",
    kind: "education",
    description:
      "Intensive qualification programme covering the MERN stack end to end.",
    highlights: ["Certified Full-Stack MERN Developer."],
  },
  {
    role: "B.Sc. Physical Matter Sciences — Energy",
    organization: "Ain Chock Faculty of Sciences",
    period: "2020 — 2023",
    kind: "education",
    description:
      "Physics degree with an energy specialisation — the analytical grounding under the engineering work.",
    highlights: [],
  },
  {
    role: "International Baccalaureate — Physical Sciences, French option",
    organization: "Lycée Taha Houssein",
    period: "2019 — 2020",
    kind: "education",
    description: "French-track scientific baccalaureate.",
    highlights: [],
  },
];
