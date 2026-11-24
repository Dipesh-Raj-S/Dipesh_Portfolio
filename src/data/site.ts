/**
 * Site-wide configuration. Edit text and links here, not in components.
 * Links set to `null` are hidden everywhere until you fill them in.
 */
export const site = {
  name: "Dipesh Raj S",
  shortName: "dipesh.dev",
  role: "Software Engineer",
  /** Shown as small chips under the role in the hero. */
  focus: ["Backend", "Production", "Security"],
  summary:
    "I build scalable backend systems and production-ready applications, with a focus on performance, reliability, and security. Passionate about designing robust APIs, distributed systems, and secure software infrastructure.",
  tagline: "Build. Break. Learn. Repeat.",
  email: "dipeshraj.suresh@gmail.com",
  location: "Chennai, India",
  resumePath: "/resume.pdf",
  github: {
    username: "Dipesh-Raj-S",
    url: "https://github.com/Dipesh-Raj-S",
  },
  // Set any of these to null to hide that link everywhere.
  links: {
    linkedin: "https://www.linkedin.com/in/dipesh-raj-s-5a4a62261/" as string | null,
    leetcode: "https://leetcode.com/u/Dipesh_Raj_S/" as string | null,
    tryhackme: "https://tryhackme.com/p/dipeshraj.suresh" as string | null,
  },
  // TODO: confirm — the repository that holds this site's source.
  sourceRepo: "https://github.com/Dipesh-Raj-S/portfolio",
  education: {
    school: "VIT Chennai",
    degree: "B.Tech Computer Science & Engineering",
    period: "2025 – 2029",
  },
} as const;

export function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return `https://${vercel}`;
  return "http://localhost:3000";
}

export const navLinks = [
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#projects", label: "Projects" },
  { href: "#experience", label: "Experience" },
  { href: "#contact", label: "Contact" },
] as const;
