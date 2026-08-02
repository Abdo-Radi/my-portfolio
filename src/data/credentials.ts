export type Certification = {
  title: string;
  issuer: string;
  year: string;
};

export type Language = {
  name: string;
  level: string;
};

/** Courses and programmes completed, most recent first. */
export const certifications: Certification[] = [
  {
    title:
      "JavaScript, Node.js, Express, TypeScript, React, MongoDB, SQL, Spring & Java REST APIs",
    issuer: "Codecademy",
    year: "2024 — 2025",
  },
  {
    title: "Full-Stack JS MERN",
    issuer: "ARK-X Academy",
    year: "2024",
  },
  {
    title: "Adopt an Agile Culture",
    issuer: "ARK-X Academy",
    year: "2024",
  },
];

export const languages: Language[] = [
  { name: "Arabic", level: "Native" },
  { name: "French", level: "Advanced — C1" },
  { name: "English", level: "Advanced — C1" },
];

/** Off the clock. Here because a portfolio should read like a person. */
export const interests: string[] = [
  "Chess",
  "Algorithm solving",
  "Logic & puzzle games",
  "Reading",
  "Basketball",
  "Billiards",
];
