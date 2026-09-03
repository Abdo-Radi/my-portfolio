export type CertificateProof = {
  /** Short label — the course or module the certificate covers. */
  label: string;
  /** Path under /public to the certificate PDF. */
  href: string;
};

export type Certification = {
  title: string;
  issuer: string;
  year: string;
  /** Downloadable certificates backing this entry. */
  proofs?: CertificateProof[];
};

export type Language = {
  name: string;
  level: string;
};

/**
 * Courses and programmes completed, most recent first.
 *
 * `proofs` point at the real certificate PDFs in `public/certificates`, so
 * every claim on this page can be opened and checked.
 */
export const certifications: Certification[] = [
  {
    title:
      "JavaScript, TypeScript, React, Next.js, Node.js, Express, MongoDB, SQL, Spring & Java REST APIs",
    issuer: "Codecademy",
    year: "2024 — 2025",
    proofs: [
      { label: "JavaScript", href: "/certificates/codecademy-javascript.pdf" },
      { label: "TypeScript", href: "/certificates/codecademy-typescript.pdf" },
      { label: "React", href: "/certificates/codecademy-react.pdf" },
      { label: "Next.js", href: "/certificates/codecademy-nextjs.pdf" },
      { label: "Node.js", href: "/certificates/codecademy-nodejs.pdf" },
      { label: "Express", href: "/certificates/codecademy-express.pdf" },
      { label: "MongoDB", href: "/certificates/codecademy-mongodb.pdf" },
      { label: "Java", href: "/certificates/codecademy-java.pdf" },
      {
        label: "Spring & Java REST APIs",
        href: "/certificates/codecademy-spring-java-rest-apis.pdf",
      },
    ],
  },
  {
    title: "Full-Stack JS MERN",
    issuer: "ARK-X Academy",
    year: "2024",
  },
  {
    title: "Adopt an Agile Culture",
    issuer: "ARK-X Academy",
    year: "May 2024",
    proofs: [
      {
        label: "Certificate",
        href: "/certificates/arkx-adopt-an-agile-culture.pdf",
      },
    ],
  },
  {
    title: "Advanced Git & GitHub",
    issuer: "ARK-X Academy",
    year: "Feb 2024",
    proofs: [
      {
        label: "Certificate",
        href: "/certificates/arkx-advanced-git-github.pdf",
      },
    ],
  },
];

/** Total certificate files on record — quoted in the section header. */
export const certificateCount = certifications.reduce(
  (total, certification) => total + (certification.proofs?.length ?? 0),
  0,
);

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
