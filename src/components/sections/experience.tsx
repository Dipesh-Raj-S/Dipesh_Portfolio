import { Reveal } from "@/components/motion/reveal";
import { Section } from "@/components/sections/section";
import { Badge } from "@/components/ui/badge";
import { experience } from "@/data/profile";

export function Experience() {
  return (
    <Section
      id="experience"
      eyebrow="05 · experience"
      title="Involvement"
      intro="Where I build alongside other people."
    >
      <ol className="relative ml-2 border-l border-border sm:ml-3">
        {experience.map((item, i) => (
          <Reveal
            as="li"
            key={item.org}
            delay={i * 0.05}
            className="relative pb-10 pl-8 last:pb-0 sm:pl-10"
          >
            <span
              aria-hidden="true"
              className="absolute top-1.5 -left-[7px] size-3.5 rounded-full border-2 border-primary bg-background"
            />
            <p className="font-mono text-xs text-muted-foreground">{item.period}</p>
            <h3 className="mt-1 text-lg font-semibold tracking-tight">{item.org}</h3>
            <p className="text-sm text-primary">{item.role}</p>
            <ul className="mt-3 max-w-2xl list-disc space-y-1.5 pl-4 text-sm leading-relaxed text-muted-foreground marker:text-border">
              {item.points.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
            {item.stack ? (
              <ul aria-label="Tools" className="mt-3 flex flex-wrap gap-1.5">
                {item.stack.map((s) => (
                  <li key={s}>
                    <Badge>{s}</Badge>
                  </li>
                ))}
              </ul>
            ) : null}
          </Reveal>
        ))}
      </ol>
    </Section>
  );
}
