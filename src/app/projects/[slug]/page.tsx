import { ArrowLeft, ArrowUpRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArchitectureDiagram } from "@/components/projects/architecture-diagram";
import { CodeBlock } from "@/components/projects/code-block";
import { LanguageDot, StarCount } from "@/components/projects/meta";
import { Badge } from "@/components/ui/badge";
import { caseStudies, getCaseStudy } from "@/data/case-studies";
import { getProjectBySlug } from "@/data/projects";
import { getProjectData } from "@/lib/data";

export const revalidate = 3600;
export const dynamicParams = false;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return caseStudies.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return {};
  const description = project.pitch ?? project.description;
  return {
    title: `${project.name} — case study`,
    description,
    alternates: { canonical: `/projects/${slug}` },
    openGraph: {
      title: `${project.name} — case study`,
      description,
      url: `/projects/${slug}`,
    },
  };
}

function Block({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section aria-labelledby={id} className="scroll-mt-24">
      <h2 id={id} className="mb-5 text-2xl font-semibold tracking-tight">
        {title}
      </h2>
      {children}
    </section>
  );
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  const { projects } = await getProjectData();
  const project = projects.find((p) => p.slug === slug);
  if (!study || !project) notFound();

  return (
    <article className="relative">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[480px] lamp-glow"
      />
      <div className="relative mx-auto max-w-4xl px-4 pt-10 pb-24 sm:px-6 sm:pt-16">
        <Link
          href="/#projects"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          All projects
        </Link>

        <header className="mt-8">
          <p className="font-mono text-xs tracking-wider text-primary uppercase">
            Case study
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
            {project.name}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-pretty text-muted-foreground">
            {project.pitch}
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-xs text-muted-foreground">
            <LanguageDot language={project.language} />
            <StarCount stars={project.stars} />
            {study.links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-foreground/90 transition-colors hover:text-primary"
              >
                {l.label}
                <ArrowUpRight className="size-3.5" aria-hidden="true" />
              </a>
            ))}
          </div>
        </header>

        <dl className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-4">
          {study.results.map((r) => (
            <div key={r.label} className="flex flex-col-reverse gap-1 bg-card p-4">
              <dt className="text-xs leading-snug text-muted-foreground">{r.label}</dt>
              <dd className="font-mono text-2xl font-medium text-primary">{r.value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-16 space-y-16">
          <Block id="problem" title="Problem">
            <div className="space-y-4 leading-relaxed text-pretty text-muted-foreground">
              {study.problem.map((p) => (
                <p key={p.slice(0, 32)}>{p}</p>
              ))}
            </div>
          </Block>

          <Block id="approach" title="Approach">
            <ul className="space-y-3 leading-relaxed text-pretty text-muted-foreground">
              {study.approach.map((p) => (
                <li key={p.slice(0, 32)} className="flex gap-3">
                  <span
                    aria-hidden="true"
                    className="mt-2.5 size-1.5 shrink-0 rounded-full bg-primary"
                  />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </Block>

          <Block id="architecture" title="Architecture">
            <ArchitectureDiagram
              title={project.name}
              nodes={study.architecture.nodes}
              edges={study.architecture.edges}
              caption={study.architecture.caption}
            />
          </Block>

          <Block id="decisions" title="Key engineering decisions">
            <ol className="grid gap-4 sm:grid-cols-2">
              {study.decisions.map((d, i) => (
                <li
                  key={d.title}
                  className="rounded-2xl border border-border bg-card p-5"
                >
                  <p className="font-mono text-xs text-primary">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-2 font-medium">{d.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {d.body}
                  </p>
                </li>
              ))}
            </ol>
          </Block>

          <Block id="code" title="A representative idea">
            <CodeBlock
              code={study.snippet.code}
              lang={study.snippet.lang}
              title={study.snippet.title}
              note={study.snippet.note}
            />
          </Block>

          <Block id="stack" title="Tech stack">
            <ul className="flex flex-wrap gap-2">
              {project.tech.map((t) => (
                <li key={t}>
                  <Badge className="px-2.5 py-1 text-xs">{t}</Badge>
                </li>
              ))}
            </ul>
          </Block>
        </div>

        <nav aria-label="More case studies" className="mt-20 border-t border-border pt-8">
          <p className="mb-4 font-mono text-xs tracking-wider text-muted-foreground uppercase">
            More case studies
          </p>
          <ul className="flex flex-wrap gap-3">
            {caseStudies
              .filter((c) => c.slug !== slug)
              .map((c) => {
                const other = projects.find((p) => p.slug === c.slug);
                return other ? (
                  <li key={c.slug}>
                    <Link
                      href={`/projects/${c.slug}`}
                      className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm transition-colors hover:border-primary/40 hover:text-primary"
                    >
                      {other.name}
                      <ArrowUpRight className="size-3.5" aria-hidden="true" />
                    </Link>
                  </li>
                ) : null;
              })}
          </ul>
        </nav>
      </div>
    </article>
  );
}
