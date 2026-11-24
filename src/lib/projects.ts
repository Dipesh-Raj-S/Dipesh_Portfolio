import { extraSkillUsage } from "@/data/skills";
import type { Project, ProjectCategory, ProjectView, RepoInfo, Skill } from "@/types";
import { PROJECT_CATEGORIES } from "@/types";

const OTHER_ORDER = 1000;

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Merges authored project data with live repository data by repo name.
 * Public, non-fork, non-archived repos that aren't authored or excluded are
 * appended under the "other" category, so new repos show up without code changes.
 */
export function mergeProjects(
  authored: readonly Project[],
  repos: readonly RepoInfo[],
  excluded: readonly string[],
  username: string,
): ProjectView[] {
  const byName = new Map(repos.map((r) => [r.name.toLowerCase(), r]));
  const authoredNames = new Set(authored.map((p) => p.repo.toLowerCase()));
  const excludedNames = new Set(excluded.map((n) => n.toLowerCase()));

  const merged: ProjectView[] = authored.map((project) => {
    const repo = byName.get(project.repo.toLowerCase());
    return {
      ...project,
      description: project.description || repo?.description || "",
      url: repo?.htmlUrl ?? `https://github.com/${username}/${project.repo}`,
      language: repo?.language ?? null,
      stars: repo?.stars ?? null,
      pushedAt: repo?.pushedAt ?? null,
    };
  });

  const discovered: ProjectView[] = repos
    .filter((r) => {
      const key = r.name.toLowerCase();
      return !r.fork && !r.archived && !authoredNames.has(key) && !excludedNames.has(key);
    })
    .map((r) => ({
      slug: slugify(r.name),
      name: r.name,
      repo: r.name,
      description: r.description ?? "No description yet.",
      categories: ["other"],
      tech: r.language ? [r.language] : [],
      order: OTHER_ORDER,
      url: r.htmlUrl,
      language: r.language,
      stars: r.stars,
      pushedAt: r.pushedAt,
    }));

  return [...merged, ...discovered].sort(
    (a, b) =>
      (a.order ?? OTHER_ORDER) - (b.order ?? OTHER_ORDER) || a.name.localeCompare(b.name),
  );
}

export type CategoryFilter = "all" | ProjectCategory;

export function filterByCategory<T extends Pick<Project, "categories">>(
  items: readonly T[],
  category: CategoryFilter,
): T[] {
  return category === "all"
    ? [...items]
    : items.filter((p) => p.categories.includes(category));
}

export function countByCategory(
  items: readonly Pick<Project, "categories">[],
): Record<CategoryFilter, number> {
  const counts = { all: items.length } as Record<CategoryFilter, number>;
  for (const category of PROJECT_CATEGORIES) {
    counts[category] = items.filter((p) => p.categories.includes(category)).length;
  }
  return counts;
}

export function isCategoryFilter(
  value: string | null | undefined,
): value is CategoryFilter {
  return (
    value === "all" || (PROJECT_CATEGORIES as readonly string[]).includes(value ?? "")
  );
}

/** Names of projects whose tech (or known extra usage) matches a skill. */
export function projectsUsingSkill(
  skill: Skill,
  items: readonly Pick<Project, "slug" | "name" | "tech">[],
): string[] {
  const names = new Set(
    [skill.name, ...(skill.aliases ?? [])].map((n) => n.toLowerCase()),
  );
  return items
    .filter((p) => {
      const tech = [...p.tech, ...(extraSkillUsage[p.slug] ?? [])];
      return tech.some((t) => names.has(t.toLowerCase()));
    })
    .map((p) => p.name);
}
