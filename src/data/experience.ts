export type ExperienceItem = {
  role: string;
  organization: string;
  /** Human-readable period, e.g. "2023 — Present". */
  period: string;
  description: string;
  highlights: string[];
  kind: "work" | "education";
};

export const experience: ExperienceItem[] = [
  {
    role: "Senior Full-Stack Developer",
    organization: "Birdman",
    period: "2023 — Present",
    kind: "work",
    description:
      "Lead development of customer-facing web products and the CI/CD platform behind them.",
    highlights: [
      "Cut production deploy time from 25 min to under 4 min with a containerized GitHub Actions pipeline.",
      "Migrated the marketing stack to Next.js App Router, improving Lighthouse performance from 68 to 98.",
      "Mentored 3 engineers and introduced trunk-based development with automated quality gates.",
    ],
  },
  {
    role: "Full-Stack Developer",
    organization: "Freelance",
    period: "2021 — 2023",
    kind: "work",
    description:
      "Delivered end-to-end web applications for startups and small businesses.",
    highlights: [
      "Shipped 12+ production apps across e-commerce, SaaS, and content domains.",
      "Standardized a reusable Next.js + Tailwind starter that halved project kickoff time.",
    ],
  },
  {
    role: "B.Sc. Computer Science",
    organization: "University",
    period: "2017 — 2021",
    kind: "education",
    description:
      "Focus on software engineering, distributed systems, and algorithms.",
    highlights: [
      "Graduated with honors.",
      "Led the student developer society.",
    ],
  },
];
