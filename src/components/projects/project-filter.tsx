"use client";

import { AnimatePresence, LayoutGroup, m } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";
import { ProjectCard } from "@/components/projects/project-card";
import { categoryLabels } from "@/data/projects";
import {
  countByCategory,
  filterByCategory,
  isCategoryFilter,
  type CategoryFilter,
} from "@/lib/projects";
import { cn } from "@/lib/utils";
import type { ProjectView } from "@/types";

const TABS: CategoryFilter[] = [
  "all",
  "full-stack",
  "backend",
  "ai-ml",
  "security",
  "iot-systems",
  "other",
];

function tabLabel(tab: CategoryFilter) {
  return tab === "all" ? "All" : categoryLabels[tab];
}

/** Filterable grid. The active category lives in `?category=` so it can be shared. */
export function ProjectFilter({ projects }: { projects: ProjectView[] }) {
  const params = useSearchParams();
  const raw = params.get("category");
  const active: CategoryFilter = isCategoryFilter(raw) ? raw : "all";

  const counts = useMemo(() => countByCategory(projects), [projects]);
  const visible = useMemo(() => filterByCategory(projects, active), [projects, active]);

  const select = useCallback((tab: CategoryFilter) => {
    const url = new URL(window.location.href);
    if (tab === "all") url.searchParams.delete("category");
    else url.searchParams.set("category", tab);
    // Next.js syncs useSearchParams with native history; no server round-trip needed.
    window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
  }, []);

  return (
    <ProjectGridView
      projects={visible}
      counts={counts}
      active={active}
      onSelect={select}
    />
  );
}

/** Static fallback rendered on the server before search params are known. */
export function ProjectGridStatic({ projects }: { projects: ProjectView[] }) {
  return (
    <ProjectGridView
      projects={projects}
      counts={countByCategory(projects)}
      active="all"
    />
  );
}

interface GridViewProps {
  projects: ProjectView[];
  counts: Record<CategoryFilter, number>;
  active: CategoryFilter;
  onSelect?: (tab: CategoryFilter) => void;
}

function ProjectGridView({ projects, counts, active, onSelect }: GridViewProps) {
  const tabs = TABS.filter((t) => t !== "other" || counts.other > 0);

  return (
    <LayoutGroup>
      <div
        role="group"
        aria-label="Filter projects by category"
        className="-mx-4 mb-8 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0"
      >
        {tabs.map((tab) => {
          const isActive = tab === active;
          return (
            <button
              key={tab}
              type="button"
              aria-pressed={isActive}
              disabled={!onSelect}
              onClick={() => onSelect?.(tab)}
              className={cn(
                "relative inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-1.5 text-sm transition-colors disabled:cursor-default",
                isActive
                  ? "border-primary/50 text-foreground"
                  : "border-border text-muted-foreground hover:border-primary/30 hover:text-foreground",
              )}
            >
              {isActive ? (
                <m.span
                  layoutId="project-filter-pill"
                  aria-hidden="true"
                  className="absolute inset-0 -z-10 rounded-full bg-primary/12"
                  transition={{ type: "spring", stiffness: 420, damping: 36 }}
                />
              ) : null}
              {tabLabel(tab)}
              <span className="font-mono text-xs text-muted-foreground tabular-nums">
                {counts[tab]}
              </span>
            </button>
          );
        })}
      </div>

      <p className="sr-only" aria-live="polite">
        Showing {projects.length} {projects.length === 1 ? "project" : "projects"} in{" "}
        {tabLabel(active)}
      </p>

      <m.ul layout className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout" initial={false}>
          {projects.map((project) => (
            <m.li
              key={project.slug}
              layout
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.25, ease: [0.2, 0.7, 0.2, 1] }}
            >
              <ProjectCard project={project} />
            </m.li>
          ))}
        </AnimatePresence>
      </m.ul>
    </LayoutGroup>
  );
}
