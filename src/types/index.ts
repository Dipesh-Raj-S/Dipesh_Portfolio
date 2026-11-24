export const PROJECT_CATEGORIES = [
  "full-stack",
  "backend",
  "ai-ml",
  "security",
  "iot-systems",
  "other",
] as const;

export type ProjectCategory = (typeof PROJECT_CATEGORIES)[number];

export type ProjectStatus = "In progress" | "Prototype";

/** A project as authored in `src/data/projects.ts`. */
export interface Project {
  slug: string;
  /** Display name. */
  name: string;
  /** Repository name under the GitHub user in `site.github.username`. */
  repo: string;
  description: string;
  categories: ProjectCategory[];
  tech: string[];
  status?: ProjectStatus;
  featured?: boolean;
  /** One-line pitch shown on featured cards. */
  pitch?: string;
  /** Impact bullets. Wrap numbers in {{double braces}} to highlight them. */
  highlights?: string[];
  /** Order within the "All projects" grid; lower comes first. */
  order?: number;
}

/** Live data for a repository, either from the GitHub API or the static snapshot. */
export interface RepoInfo {
  name: string;
  description: string | null;
  htmlUrl: string;
  language: string | null;
  stars: number;
  pushedAt: string;
  fork: boolean;
  archived: boolean;
}

/** A project merged with its live repository data, ready to render. */
export interface ProjectView extends Project {
  url: string;
  language: string | null;
  stars: number | null;
  pushedAt: string | null;
}

export interface ContributionDay {
  date: string;
  count: number;
}

export interface ContributionCalendar {
  total: number;
  weeks: ContributionDay[][];
}

export interface ArchitectureNode {
  id: string;
  label: string;
  sub?: string;
  col: number;
  row: number;
  tone?: "client" | "service" | "data" | "external";
}

export interface ArchitectureEdge {
  from: string;
  to: string;
  label?: string;
}

export interface CaseStudy {
  slug: string;
  problem: string[];
  approach: string[];
  architecture: {
    caption: string;
    nodes: ArchitectureNode[];
    edges: ArchitectureEdge[];
  };
  decisions: { title: string; body: string }[];
  results: { value: string; label: string }[];
  snippet: { title: string; lang: "python"; code: string; note: string };
  links: { label: string; href: string }[];
}

export interface SkillGroup {
  id: "languages" | "backend" | "databases" | "devops" | "security" | "ai" | "also";
  title: string;
  skills: Skill[];
}

export interface Skill {
  name: string;
  /** Extra names this skill appears under in project tech lists. */
  aliases?: string[];
}

export interface TimelineItem {
  org: string;
  role: string;
  period: string;
  stack?: string[];
  points: string[];
}
