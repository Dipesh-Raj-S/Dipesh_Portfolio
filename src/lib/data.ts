import { cache } from "react";
import { excludedRepos, projects } from "@/data/projects";
import { site } from "@/data/site";
import { getRepos } from "@/lib/github";
import { mergeProjects } from "@/lib/projects";

/** Projects merged with live GitHub data; deduplicated per render pass. */
export const getProjectData = cache(async () => {
  const { repos, source } = await getRepos(site.github.username);
  const views = mergeProjects(projects, repos, excludedRepos, site.github.username);
  const publicRepoCount = repos.filter((r) => !r.fork).length;
  return { projects: views, publicRepoCount, source };
});
