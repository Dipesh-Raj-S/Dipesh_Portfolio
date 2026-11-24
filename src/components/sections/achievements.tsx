import { Code2, GraduationCap, Rocket } from "lucide-react";
import Image from "next/image";
import { Reveal } from "@/components/motion/reveal";
import { Section } from "@/components/sections/section";
import { achievements, featuredAchievement as yuvika } from "@/data/profile";

const icons = [Code2, GraduationCap] as const;

export function Achievements() {
  return (
    <Section
      id="achievements"
      eyebrow="06 · achievements"
      title="A few milestones."
      textured
    >
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Reveal className="md:col-span-2 lg:row-span-2">
          <article
            aria-labelledby="yuvika-heading"
            className="group grid h-full overflow-hidden rounded-3xl border border-border bg-card md:grid-cols-[1.15fr_1fr] lg:grid-cols-1 xl:grid-cols-[1.15fr_1fr]"
          >
            <figure className="relative aspect-[3/2] overflow-hidden md:aspect-auto md:h-full lg:aspect-[3/2] lg:h-auto xl:aspect-auto xl:h-full">
              <Image
                src={yuvika.image.src}
                alt={yuvika.image.alt}
                width={yuvika.image.width}
                height={yuvika.image.height}
                sizes="(min-width: 1280px) 34rem, (min-width: 1024px) 40rem, (min-width: 768px) 24rem, 100vw"
                className="size-full object-cover object-[35%_45%] transition-transform duration-700 ease-out group-hover:scale-[1.03]"
              />
              {/* soft lamp-light vignette so the photo sits in the warm palette */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent"
              />
              <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-black/55 px-3 py-1 font-mono text-xs text-[#f3d3a8] backdrop-blur-sm">
                <Rocket className="size-3.5" aria-hidden="true" />
                {yuvika.badge}
              </span>
            </figure>

            <div className="flex flex-col p-6 sm:p-7">
              <p className="font-mono text-xs tracking-wider text-primary uppercase">
                {yuvika.eyebrow}
              </p>
              <h3
                id="yuvika-heading"
                className="mt-2 text-2xl font-semibold tracking-tight"
              >
                {yuvika.title}
              </h3>
              <div className="mt-3 space-y-3 text-sm leading-relaxed text-pretty text-muted-foreground">
                {yuvika.paragraphs.map((p) => (
                  <p key={p.slice(0, 24)}>{p}</p>
                ))}
              </div>
              <ul aria-label="Topics" className="mt-5 flex flex-wrap gap-1.5">
                {yuvika.points.map((p) => (
                  <li
                    key={p}
                    className="rounded-md border border-border bg-background-2 px-2 py-0.5 font-mono text-[11px] text-muted-foreground"
                  >
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          </article>
        </Reveal>

        {achievements.map((a, i) => {
          const Icon = icons[i % icons.length] ?? Code2;
          return (
            <Reveal key={a.title} delay={(i + 1) * 0.06}>
              <article className="h-full rounded-2xl border border-border bg-card p-6">
                <Icon className="size-5 text-primary" aria-hidden="true" />
                <p className="mt-4 font-mono text-3xl font-medium tracking-tight">
                  {a.value}
                </p>
                <h3 className="mt-1 font-medium">{a.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {a.body}
                </p>
              </article>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
