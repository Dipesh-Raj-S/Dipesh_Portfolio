import { Terminal } from "@/components/sections/terminal";
import { about } from "@/data/profile";
import { site } from "@/data/site";
import { skillGroups } from "@/data/skills";
import type { TerminalContext } from "@/lib/terminal";
import type { ProjectView } from "@/types";

export function buildTerminalContext(projects: ProjectView[]): TerminalContext {
  const links = [
    { label: "GitHub", href: site.github.url },
    ...(site.links.linkedin ? [{ label: "LinkedIn", href: site.links.linkedin }] : []),
    ...(site.links.leetcode ? [{ label: "LeetCode", href: site.links.leetcode }] : []),
    ...(site.links.tryhackme ? [{ label: "TryHackMe", href: site.links.tryhackme }] : []),
  ];
  return {
    name: site.name,
    role: site.role,
    email: site.email,
    githubUrl: site.github.url,
    about: site.summary,
    focus: about.focus,
    skills: skillGroups.map((g) => ({
      title: g.title,
      skills: g.skills.map((s) => s.name),
    })),
    projects: projects.map((p) => ({
      name: p.name,
      slug: p.slug,
      description: p.description,
      featured: p.featured,
    })),
    links,
  };
}

export function TerminalSection({ projects }: { projects: ProjectView[] }) {
  return (
    <section aria-labelledby="terminal-heading" className="relative">
      <div className="mx-auto max-w-4xl px-4 pb-20 sm:px-6">
        <div className="mb-4 flex items-baseline justify-between gap-4">
          <h2 id="terminal-heading" className="font-mono text-sm text-muted-foreground">
            <span className="text-primary">$</span> ./explore --interactive
          </h2>
          <p className="hidden font-mono text-xs text-muted-foreground sm:block">
            try <kbd className="text-foreground">help</kbd> or{" "}
            <kbd className="text-foreground">sudo hire-me</kbd>
          </p>
        </div>
        <Terminal ctx={buildTerminalContext(projects)} />
      </div>
    </section>
  );
}
