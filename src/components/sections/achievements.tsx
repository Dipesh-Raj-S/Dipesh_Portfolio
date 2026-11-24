import { Code2, GraduationCap, Rocket } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { Section } from "@/components/sections/section";
import { achievements } from "@/data/profile";

const icons = [Code2, Rocket, GraduationCap] as const;

export function Achievements() {
  return (
    <Section
      id="achievements"
      eyebrow="06 · achievements"
      title="A few milestones."
      textured
    >
      <ul className="grid gap-4 md:grid-cols-3">
        {achievements.map((a, i) => {
          const Icon = icons[i % icons.length] ?? Code2;
          return (
            <Reveal as="li" key={a.title} delay={i * 0.06}>
              <div className="h-full rounded-2xl border border-border bg-card p-6">
                <Icon className="size-5 text-primary" aria-hidden="true" />
                <p className="mt-4 font-mono text-3xl font-medium tracking-tight">
                  {a.value}
                </p>
                <h3 className="mt-1 font-medium">{a.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {a.body}
                </p>
              </div>
            </Reveal>
          );
        })}
      </ul>
    </Section>
  );
}
