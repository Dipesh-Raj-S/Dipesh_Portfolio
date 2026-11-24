import { About } from "@/components/sections/about";
import { Achievements } from "@/components/sections/achievements";
import { AllProjects } from "@/components/sections/all-projects";
import { Contact } from "@/components/sections/contact";
import { Experience } from "@/components/sections/experience";
import { FeaturedProjects } from "@/components/sections/featured-projects";
import { GitHubActivity } from "@/components/sections/github-activity";
import { Hero } from "@/components/sections/hero";
import { Skills } from "@/components/sections/skills";
import { Stats } from "@/components/sections/stats";
import { TerminalSection } from "@/components/sections/terminal-section";
import { buildStats } from "@/data/profile";
import { site } from "@/data/site";
import { getProjectData } from "@/lib/data";
import { fetchContributionCalendar } from "@/lib/github";

// Incremental Static Regeneration: refresh GitHub data at most once an hour.
export const revalidate = 3600;

export default async function Home() {
  const [{ projects, publicRepoCount }, contributions] = await Promise.all([
    getProjectData(),
    fetchContributionCalendar(site.github.username),
  ]);
  const featured = projects.filter((p) => p.featured);

  return (
    <>
      <Hero />
      <TerminalSection projects={projects} />
      <Stats stats={buildStats(publicRepoCount)} />
      <About />
      <Skills projects={projects} />
      <FeaturedProjects projects={featured} />
      <AllProjects projects={projects} />
      <Experience />
      <Achievements />
      {contributions.ok ? <GitHubActivity calendar={contributions.data} /> : null}
      <Contact />
    </>
  );
}
