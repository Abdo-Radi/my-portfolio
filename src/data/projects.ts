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

export const projects: Project[] = [
  {
    slug: "devops-portfolio",
    title: "DevOps Portfolio",
    description:
      "This very site — Next.js 16 App Router, Tailwind v4, shadcn/ui, containerized with Docker and shipped through a GitHub Actions CI/CD pipeline to Vercel.",
    tags: ["Next.js", "TypeScript", "Tailwind", "Docker", "GitHub Actions"],
    liveUrl: "https://example.com",
    sourceUrl: "https://github.com/yourusername/my-portfolio",
    featured: true,
  },
  {
    slug: "task-api",
    title: "Task Management API",
    description:
      "REST API with JWT auth, role-based access control, and a fully typed Prisma data layer. 95% test coverage with CI-gated deploys.",
    tags: ["Node.js", "PostgreSQL", "Prisma", "Vitest"],
    sourceUrl: "https://github.com/yourusername/task-api",
    featured: true,
  },
  {
    slug: "realtime-chat",
    title: "Realtime Chat",
    description:
      "WebSocket-based chat with presence, typing indicators, and optimistic UI. Scales horizontally behind a Redis pub/sub backplane.",
    tags: ["React", "WebSocket", "Redis"],
    liveUrl: "https://example.com",
    sourceUrl: "https://github.com/yourusername/realtime-chat",
    featured: true,
  },
];
