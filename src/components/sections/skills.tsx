import { SkillIcon } from "@/components/icons/skill-icons";
import { Reveal } from "@/components/motion/reveal";
import { Section } from "@/components/sections/section";
import { skillGroups } from "@/data/skills";
import { projectsUsingSkill } from "@/lib/projects";
import type { ProjectView } from "@/types";

export function Skills({ projects }: { projects: ProjectView[] }) {
  return (
    <Section
      id="skills"
      eyebrow="02 · skills"
      title="Tools I reach for."
      intro="Hover or focus a skill to see which of my projects put it to work."
      textured
    >
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {skillGroups.map((group, gi) => (
          <Reveal as="li" key={group.id} delay={(gi % 3) * 0.06}>
            <div className="h-full rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary/30">
              <div className="mb-4 flex items-center gap-3">
                <span className="inline-flex size-9 items-center justify-center rounded-lg border border-border bg-background-2 text-primary">
                  <SkillIcon id={group.id} className="size-5" />
                </span>
                <h3 className="font-medium">{group.title}</h3>
              </div>
              <ul className="flex flex-wrap gap-2">
                {group.skills.map((skill) => {
                  const usedIn = projectsUsingSkill(skill, projects);
                  const tipId = `skill-${group.id}-${skill.name.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}`;
                  return (
                    <li key={skill.name} className="group/chip relative">
                      <span
                        tabIndex={usedIn.length > 0 ? 0 : undefined}
                        aria-describedby={usedIn.length > 0 ? tipId : undefined}
                        className="inline-flex cursor-default items-center gap-1.5 rounded-md border border-border bg-background-2 px-2.5 py-1 text-sm text-foreground/90 transition-colors group-hover/chip:border-primary/40 group-hover/chip:text-foreground"
                      >
                        {skill.name}
                        {usedIn.length > 0 ? (
                          <span
                            className="font-mono text-[10px] text-muted-foreground"
                            aria-hidden="true"
                          >
                            {usedIn.length}
                          </span>
                        ) : null}
                      </span>
                      {usedIn.length > 0 ? (
                        <span
                          id={tipId}
                          role="tooltip"
                          className="pointer-events-none absolute bottom-full left-0 z-20 mb-2 hidden w-max max-w-[min(16rem,80vw)] rounded-lg border border-border bg-card px-3 py-2 text-xs leading-relaxed text-muted-foreground shadow-lg group-focus-within/chip:block group-hover/chip:block"
                        >
                          <span className="mb-0.5 block font-mono text-[10px] tracking-wider text-primary uppercase">
                            Used in
                          </span>
                          {usedIn.join(", ")}
                        </span>
                      ) : null}
                    </li>
                  );
                })}
              </ul>
            </div>
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}
