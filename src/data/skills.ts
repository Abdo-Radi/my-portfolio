export type SkillGroup = {
  category: string;
  items: string[];
};

export const skills: SkillGroup[] = [
  {
    category: "Backend & AI Orchestration",
    items: [
      "Java (Spring Boot / Security)",
      "Python (FastAPI, Flask, scripting)",
      "Node.js (Express.js)",
      "Gemini & OpenAI API integration",
      "LangChain",
      "RESTful APIs",
    ],
  },
  {
    category: "Frontend & AI Interfaces",
    items: [
      "Angular",
      "React",
      "TypeScript",
      "JavaScript (ES6+)",
      "Vercel AI SDK",
      "HTML5",
      "CSS3",
      "Tailwind CSS",
      "Bootstrap",
    ],
  },
  {
    category: "Mobile",
    items: ["React Native", "Expo", "EAS (Build / Submit / Update)"],
  },
  {
    category: "Databases",
    items: [
      "MongoDB",
      "PostgreSQL",
      "MySQL",
      "PL/SQL",
      "Vector search (Pinecone, Milvus)",
    ],
  },
  {
    category: "Automation & DevOps",
    items: [
      "Python automation scripts",
      "n8n (AI agent workflows)",
      "Docker",
      "Git",
      "CI/CD pipelines",
    ],
  },
  {
    category: "Methodologies",
    items: [
      "Agile (Scrum)",
      "System architecture",
      "IT support optimisation",
      "Prompt engineering",
      "RAG architecture",
    ],
  },
];
