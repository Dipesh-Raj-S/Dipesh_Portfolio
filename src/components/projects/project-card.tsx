import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { LanguageDot, StarCount } from "@/components/projects/meta";
import { Badge } from "@/components/ui/badge";
import { categoryLabels } from "@/data/projects";
import { formatDate } from "@/lib/utils";
import type { ProjectView } from "@/types";

export function ProjectCard({ project }: { project: ProjectView }) {
  const titleId = `project-${project.slug}`;
  return (
    <article
      aria-labelledby={titleId}
      className="group relative flex h-full flex-col rounded-2xl border border-border bg-card p-5 transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_24px_50px_-36px_var(--primary)]"
    >
      <div className="mb-3 flex flex-wrap items-center gap-1.5">
        {project.featured ? <Badge variant="accent">Featured</Badge> : null}
        {project.status ? <Badge variant="secondary">{project.status}</Badge> : null}
        {project.categories.map((c) => (
          <Badge key={c} variant="outline">
            {categoryLabels[c]}
          </Badge>
        ))}
      </div>

      <h3 id={titleId} className="text-lg font-semibold tracking-tight">
        {project.featured ? (
          <Link href={`/projects/${project.slug}`} className="hover:text-primary">
            {project.name}
          </Link>
        ) : (
          project.name
        )}
      </h3>
      <p className="mt-2 line-clamp-4 text-sm leading-relaxed text-pretty text-muted-foreground">
        {project.description}
      </p>

      {project.tech.length > 0 ? (
        <ul aria-label="Tech stack" className="mt-4 flex flex-wrap gap-1.5">
          {project.tech.slice(0, 6).map((t) => (
            <li key={t}>
              <Badge>{t}</Badge>
            </li>
          ))}
          {project.tech.length > 6 ? (
            <li>
              <Badge variant="outline">+{project.tech.length - 6}</Badge>
            </li>
          ) : null}
        </ul>
      ) : null}

      <div className="mt-auto flex items-center gap-4 pt-5 font-mono text-xs text-muted-foreground">
        <LanguageDot language={project.language} />
        <StarCount stars={project.stars} />
        {project.pushedAt ? (
          <span>
            <span className="sr-only">Last updated </span>
            <time dateTime={project.pushedAt}>{formatDate(project.pushedAt)}</time>
          </span>
        ) : null}
        <a
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-auto inline-flex items-center gap-1 text-foreground/80 transition-colors hover:text-primary"
        >
          GitHub
          <ArrowUpRight className="size-3.5" aria-hidden="true" />
          <span className="sr-only">: {project.name} repository</span>
        </a>
      </div>
    </article>
  );
}
