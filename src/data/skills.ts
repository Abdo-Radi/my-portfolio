export type SkillGroup = {
  category: string;
  items: string[];
};

export const skills: SkillGroup[] = [
  {
    category: "Languages",
    items: ["TypeScript", "JavaScript", "Python", "SQL", "Go"],
  },
  {
    category: "Frontend",
    items: ["React", "Next.js", "Tailwind CSS", "shadcn/ui", "Redux"],
  },
  {
    category: "Backend",
    items: ["Node.js", "Express", "Prisma", "PostgreSQL", "REST", "GraphQL"],
  },
  {
    category: "DevOps & Tooling",
    items: ["Docker", "GitHub Actions", "Vercel", "Vitest", "Linux"],
  },
];
