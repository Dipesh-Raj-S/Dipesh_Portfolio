import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { GitHubIcon } from "@/components/icons/brand";
import { Reveal } from "@/components/motion/reveal";
import { Highlighted, LanguageDot, StarCount } from "@/components/projects/meta";
import { Section } from "@/components/sections/section";
import { Badge } from "@/components/ui/badge";
import type { ProjectView } from "@/types";

export function FeaturedProjects({ projects }: { projects: ProjectView[] }) {
  return (
    <Section
      id="projects"
      eyebrow="03 · featured work"
      title="Systems built to hold up under pressure."
      intro="Three projects where the interesting part is what happens under load, under attack, or offline."
    >
      <ol className="grid gap-6">
        {projects.map((project, i) => (
          <Reveal as="li" key={project.slug}>
            <article
              aria-labelledby={`featured-${project.slug}`}
              className="group relative overflow-hidden rounded-3xl border border-border bg-card p-6 transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_30px_60px_-40px_var(--primary)] sm:p-8"
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-24 -right-24 size-72 rounded-full bg-primary/5 blur-3xl transition-opacity duration-500 group-hover:bg-primary/10"
              />
              <div className="relative grid gap-8 lg:grid-cols-[1.25fr_1fr]">
                <div>
                  <p className="mb-2 font-mono text-xs text-muted-foreground">
                    {String(i + 1).padStart(2, "0")} /{" "}
                    {String(projects.length).padStart(2, "0")}
                  </p>
                  <h3
                    id={`featured-${project.slug}`}
                    className="text-2xl font-semibold tracking-tight sm:text-3xl"
                  >
                    {project.name}
                  </h3>
                  <p className="mt-3 text-pretty text-muted-foreground">
                    {project.pitch}
                  </p>
                  <ul aria-label="Tech stack" className="mt-5 flex flex-wrap gap-1.5">
                    {project.tech.map((t) => (
                      <li key={t}>
                        <Badge>{t}</Badge>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm">
                    <Link
                      href={`/projects/${project.slug}`}
                      aria-label={`Read case study: ${project.name}`}
                      className="inline-flex items-center gap-1.5 font-medium text-primary underline-offset-4 hover:underline"
                    >
                      Read case study
                      <ArrowRight
                        className="size-4 transition-transform group-hover:translate-x-0.5"
                        aria-hidden="true"
                      />
                    </Link>
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground"
                    >
                      <GitHubIcon className="size-4" />
                      Source
                      <span className="sr-only"> code for {project.name} on GitHub</span>
                    </a>
                    <span className="flex items-center gap-4 font-mono text-xs text-muted-foreground">
                      <LanguageDot language={project.language} />
                      <StarCount stars={project.stars} />
                    </span>
                  </div>
                </div>

                <ul className="space-y-3 self-center">
                  {project.highlights?.map((h) => (
                    <li
                      key={h}
                      className="rounded-xl border border-border bg-background-2/70 px-4 py-3 text-sm leading-relaxed text-pretty text-foreground/90"
                    >
                      <Highlighted text={h} />
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          </Reveal>
        ))}
      </ol>
    </Section>
  );
}
