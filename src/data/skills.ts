import type { SkillGroup } from "@/types";

export const skillGroups: SkillGroup[] = [
  {
    id: "languages",
    title: "Languages",
    skills: [
      { name: "Python" },
      { name: "C/C++", aliases: ["C", "C++"] },
      { name: "Java" },
      { name: "JavaScript" },
      { name: "SQL", aliases: ["PostgreSQL", "Cypher"] },
      { name: "HTML" },
      { name: "CSS", aliases: ["Tailwind CSS"] },
    ],
  },
  {
    id: "backend",
    title: "Backend & APIs",
    skills: [
      { name: "FastAPI" },
      { name: "Flask", aliases: ["Flask-Smorest"] },
      { name: "SQLAlchemy" },
      { name: "Alembic" },
      { name: "REST", aliases: ["FastAPI", "Flask", "Flask-Smorest"] },
      { name: "WebSockets", aliases: ["Socket.IO"] },
      { name: "Swagger/OpenAPI", aliases: ["Flask-Smorest"] },
    ],
  },
  {
    id: "databases",
    title: "Databases",
    skills: [{ name: "PostgreSQL" }, { name: "Redis" }, { name: "Oracle SQL" }],
  },
  {
    id: "devops",
    title: "DevOps & Cloud",
    skills: [
      { name: "Docker" },
      { name: "Docker Compose" },
      { name: "Kubernetes (Kind)", aliases: ["Kubernetes"] },
      { name: "GitHub Actions" },
      { name: "Linux" },
      { name: "Render" },
      { name: "Nginx" },
    ],
  },
  {
    id: "security",
    title: "Security",
    skills: [
      { name: "OWASP" },
      { name: "JWT" },
      { name: "OAuth 2.0" },
      { name: "LLM prompt-injection defense", aliases: ["Gemini API"] },
      { name: "Security guardrails" },
      { name: "eBPF", aliases: ["BPF LSM"] },
    ],
  },
  {
    id: "ai",
    title: "AI & Automation",
    skills: [
      { name: "LangChain (RAG)", aliases: ["LangChain"] },
      { name: "Gemini API" },
      { name: "n8n" },
    ],
  },
  {
    id: "also",
    title: "Also",
    skills: [
      { name: "Next.js" },
      { name: "TypeScript" },
      { name: "React" },
      { name: "Prisma" },
    ],
  },
];

/**
 * Skills that aren't visible as a tech chip but are known to be used by a
 * project (keyed by project slug). Keeps the hover "used in" lists honest.
 */
export const extraSkillUsage: Record<string, string[]> = {
  jailbreakops: ["Render", "Security guardrails", "Swagger/OpenAPI"],
  eventcheckin: ["Security guardrails"],
  "lassi-house": ["Swagger/OpenAPI"],
  organlink: ["Swagger/OpenAPI"],
  "cerberus-ebpf": ["Linux"],
};
