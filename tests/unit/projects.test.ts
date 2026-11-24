import { describe, expect, it } from "vitest";
import { excludedRepos, projects } from "@/data/projects";
import {
  countByCategory,
  filterByCategory,
  isCategoryFilter,
  mergeProjects,
  projectsUsingSkill,
} from "@/lib/projects";
import type { Project, RepoInfo } from "@/types";

const repo = (overrides: Partial<RepoInfo> & { name: string }): RepoInfo => ({
  description: null,
  htmlUrl: `https://github.com/u/${overrides.name}`,
  language: "Python",
  stars: 0,
  pushedAt: "2026-01-01T00:00:00Z",
  fork: false,
  archived: false,
  ...overrides,
});

const authored: Project[] = [
  {
    slug: "alpha",
    name: "Alpha",
    repo: "Alpha",
    description: "authored",
    categories: ["backend"],
    tech: ["FastAPI"],
    order: 1,
  },
];

describe("mergeProjects", () => {
  it("merges live stars and language by repo name (case-insensitive)", () => {
    const [alpha] = mergeProjects(authored, [repo({ name: "alpha", stars: 7 })], [], "u");
    expect(alpha).toMatchObject({ slug: "alpha", stars: 7, language: "Python" });
  });

  it("keeps authored projects even if the API doesn't return them", () => {
    const [alpha] = mergeProjects(authored, [], [], "u");
    expect(alpha).toMatchObject({ url: "https://github.com/u/Alpha", stars: null });
  });

  it("puts new public repos under 'other' and skips excluded, forked and archived ones", () => {
    const merged = mergeProjects(
      authored,
      [
        repo({ name: "Alpha" }),
        repo({ name: "Brand-New", description: "fresh" }),
        repo({ name: "HTML" }),
        repo({ name: "SomeFork", fork: true }),
        repo({ name: "Old", archived: true }),
      ],
      ["html"],
      "u",
    );
    expect(merged.map((p) => p.name)).toEqual(["Alpha", "Brand-New"]);
    expect(merged[1]).toMatchObject({
      slug: "brand-new",
      categories: ["other"],
      description: "fresh",
    });
  });
});

describe("category helpers", () => {
  const items = [
    { categories: ["backend", "security"] },
    { categories: ["security"] },
    { categories: ["ai-ml"] },
  ] as Pick<Project, "categories">[];

  it("counts projects per category, including multi-category ones", () => {
    expect(countByCategory(items)).toMatchObject({
      all: 3,
      security: 2,
      backend: 1,
      "ai-ml": 1,
      other: 0,
    });
  });

  it("filters by category", () => {
    expect(filterByCategory(items, "security")).toHaveLength(2);
    expect(filterByCategory(items, "all")).toHaveLength(3);
  });

  it("validates URL category values", () => {
    expect(isCategoryFilter("security")).toBe(true);
    expect(isCategoryFilter("<script>")).toBe(false);
    expect(isCategoryFilter(null)).toBe(false);
  });
});

describe("site data integrity", () => {
  it("has unique slugs and repos, and never lists an excluded repo", () => {
    const slugs = projects.map((p) => p.slug);
    const repos = projects.map((p) => p.repo.toLowerCase());
    expect(new Set(slugs).size).toBe(slugs.length);
    expect(new Set(repos).size).toBe(repos.length);
    for (const excluded of excludedRepos)
      expect(repos).not.toContain(excluded.toLowerCase());
  });

  it("derives skill usage from project tech and aliases", () => {
    expect(projectsUsingSkill({ name: "Redis" }, projects)).toEqual(
      expect.arrayContaining(["JailbreakOps", "EventCheckIn"]),
    );
    expect(projectsUsingSkill({ name: "eBPF", aliases: ["BPF LSM"] }, projects)).toEqual([
      "Cerberus",
    ]);
  });
});
