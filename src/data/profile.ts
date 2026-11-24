import type { TimelineItem } from "@/types";

export const about = {
  paragraphs: [
    "I'm a Computer Science undergrad at VIT Chennai (B.Tech CSE, 2025–2029) who likes the parts of software most people never see: the transaction that has to hold under fifty simultaneous requests, the rate limiter that must fail closed, the guardrail standing between an LLM and its secrets.",
    "I build things end to end — design the API, containerise it, load-test it, then try to break it. That loop of building, breaking and learning is how I approach backend engineering and application security alike.",
  ],
  focus: ["Backend Development", "Application Security", "AI / LLM Security"],
  learning: ["FastAPI internals", "OWASP Top 10", "eBPF & Linux security", "Kubernetes"],
};

export const experience: TimelineItem[] = [
  {
    org: "Microsoft Innovations Club, VIT Chennai",
    role: "Web Development Member · DevPulse",
    period: "Sept 2026 – Present",
    stack: ["Next.js", "TypeScript", "PostgreSQL", "Prisma"],
    points: [
      "Building secure quiz APIs with server-side scoring against an 80% pass threshold, question randomisation and retry handling.",
      "Automatic module unlocking once a learner passes, enforced on the server rather than the client.",
    ],
  },
  {
    org: "Google Developer Groups, VIT Chennai",
    role: "Cloud & DevOps Member",
    period: "Sept 2026 – Present",
    stack: ["Docker", "Kubernetes", "GitHub Actions"],
    points: [
      "Containerisation, Kubernetes deployments and CI/CD pipelines for club projects.",
    ],
  },
  {
    org: "Bionary Club, VIT Chennai",
    role: "AI Automation Member",
    period: "Sept 2025 – Present",
    stack: ["n8n", "Google Calendar", "Gmail", "Instagram"],
    points: [
      "Built an n8n workflow that automates event scheduling, alerts and social posts across Google Calendar, Gmail and Instagram.",
    ],
  },
];

export const achievements = [
  {
    title: "LeetCode",
    value: "170+",
    body: "Data-structures and algorithms problems solved.",
  },
  {
    title: "ISRO YUVIKA 2022",
    value: "Selected",
    body: "Selected for ISRO's national Young Scientist Programme at VSSC, Thiruvananthapuram.",
  },
  {
    title: "CGPA",
    value: "9.56",
    body: "B.Tech Computer Science & Engineering, VIT Chennai.",
  },
] as const;

export interface Stat {
  /** Numeric value to count up to. */
  value: number;
  decimals?: number;
  suffix?: string;
  label: string;
  /** Rendered instead of the counter (for non-numeric stats). */
  text?: string;
}

export function buildStats(publicRepoCount: number): Stat[] {
  return [
    { value: 9.56, decimals: 2, label: "CGPA" },
    { value: 170, suffix: "+", label: "LeetCode problems" },
    { value: 58, label: "Automated tests · JailbreakOps" },
    { value: publicRepoCount, suffix: "+", label: "Public repositories" },
    { value: 2022, label: "ISRO YUVIKA", text: "2022" },
  ];
}
