import { ArrowUpRight } from "lucide-react";
import { Suspense } from "react";
import { GitHubIcon } from "@/components/icons/brand";
import { ProjectFilter, ProjectGridStatic } from "@/components/projects/project-filter";
import { Section } from "@/components/sections/section";
import { Button } from "@/components/ui/button";
import { site } from "@/data/site";
import type { ProjectView } from "@/types";

export function AllProjects({ projects }: { projects: ProjectView[] }) {
  return (
    <Section
      id="all-projects"
      eyebrow="04 · everything else"
      title="All projects"
      intro="Every public project, from kernel-level eBPF to RAG pipelines. Filters are shareable — the URL keeps your selection."
      textured
      className="pt-4 sm:pt-8"
    >
      <Suspense fallback={<ProjectGridStatic projects={projects} />}>
        <ProjectFilter projects={projects} />
      </Suspense>

      <div className="mt-10 flex justify-center">
        <Button asChild variant="outline" size="lg">
          <a
            href={`${site.github.url}?tab=repositories`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <GitHubIcon />
            View all repositories on GitHub
            <ArrowUpRight />
          </a>
        </Button>
      </div>
    </Section>
  );
}
