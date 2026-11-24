import { GraduationCap } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { Section } from "@/components/sections/section";
import { about } from "@/data/profile";
import { site } from "@/data/site";

export function About() {
  return (
    <Section
      id="about"
      eyebrow="01 · about"
      title="Backend engineer who likes to break things on purpose."
    >
      <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
        <Reveal className="space-y-5 text-base leading-relaxed text-pretty text-muted-foreground sm:text-lg">
          {about.paragraphs.map((p) => (
            <p key={p.slice(0, 24)}>{p}</p>
          ))}
        </Reveal>

        <Reveal delay={0.1} className="space-y-6">
          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-start gap-3">
              <GraduationCap
                className="mt-0.5 size-5 shrink-0 text-primary"
                aria-hidden="true"
              />
              <div>
                <p className="font-medium">{site.education.degree}</p>
                <p className="text-sm text-muted-foreground">
                  {site.education.school} ·{" "}
                  <span className="font-mono">{site.education.period}</span>
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="mb-3 font-mono text-xs tracking-wider text-muted-foreground uppercase">
              Focus areas
            </h3>
            <ul className="flex flex-wrap gap-2">
              {about.focus.map((f) => (
                <li
                  key={f}
                  className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-sm text-primary"
                >
                  {f}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-3 font-mono text-xs tracking-wider text-muted-foreground uppercase">
              Currently learning
            </h3>
            <ul className="flex flex-wrap gap-2">
              {about.learning.map((f) => (
                <li
                  key={f}
                  className="rounded-full border border-border bg-card px-3 py-1 text-sm text-foreground/90"
                >
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
