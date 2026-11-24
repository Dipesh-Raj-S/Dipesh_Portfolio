import { ArrowDown, Mail } from "lucide-react";
import { GitHubIcon, LinkedInIcon } from "@/components/icons/brand";
import { NightDesk } from "@/components/illustrations/NightDesk";
import { Button } from "@/components/ui/button";
import { site } from "@/data/site";

export function Hero() {
  return (
    <section aria-labelledby="hero-heading" className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 lamp-glow"
      />
      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 pt-12 pb-16 sm:px-6 md:pt-16 lg:min-h-[calc(100svh-4rem)] lg:grid-cols-[1.05fr_1fr] lg:gap-10 lg:py-16">
        <div>
          <p className="mb-7 inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 font-mono text-xs text-muted-foreground">
            <span className="size-1.5 rounded-full bg-primary" aria-hidden="true" />
            Open to SWE internships · Summer 2027
          </p>

          {/* Display name: written in normal case so screen readers say it naturally. */}
          <h1
            id="hero-heading"
            className="text-[clamp(2.125rem,9vw,4.25rem)] leading-none font-bold tracking-[-0.045em] whitespace-nowrap uppercase lg:text-[clamp(2.75rem,4.9vw,4.5rem)]"
          >
            <span className="bg-gradient-to-r from-primary via-[color-mix(in_oklab,var(--primary)_70%,var(--foreground))] to-secondary bg-clip-text pb-[0.08em] text-transparent">
              {site.name}
            </span>
            <span
              aria-hidden="true"
              className="ml-[0.12em] inline-block h-[0.09em] w-[0.42em] rounded-[2px] bg-secondary motion-safe:animate-[nd-blink_1.1s_steps(1)_infinite]"
            />
          </h1>

          <p className="mt-7 flex flex-wrap items-center gap-x-3 gap-y-2">
            <span className="text-xl font-medium tracking-tight sm:text-2xl">
              {site.role}
            </span>
            <span aria-hidden="true" className="hidden h-5 w-px bg-border sm:block" />
            <span className="font-mono text-sm text-muted-foreground">
              {site.focus.map((f, i) => (
                <span key={f}>
                  {i > 0 ? <span className="mx-1.5 text-primary">/</span> : null}
                  {f.toLowerCase()}
                </span>
              ))}
            </span>
          </p>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-pretty text-muted-foreground sm:text-lg">
            {site.summary}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button asChild size="lg">
              <a href="#projects">
                View Projects
                <ArrowDown />
              </a>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href={site.github.url} target="_blank" rel="noopener noreferrer">
                <GitHubIcon />
                GitHub
              </a>
            </Button>
            {site.links.linkedin ? (
              <Button asChild size="lg" variant="outline">
                <a href={site.links.linkedin} target="_blank" rel="noopener noreferrer">
                  <LinkedInIcon />
                  LinkedIn
                </a>
              </Button>
            ) : null}
            <Button asChild size="lg" variant="ghost">
              <a href={`mailto:${site.email}`}>
                <Mail />
                Email
              </a>
            </Button>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[560px] lg:max-w-none">
          <div className="overflow-hidden rounded-3xl border border-border shadow-[0_30px_80px_-45px_rgba(80,55,30,0.35)] dark:shadow-[0_30px_80px_-40px_rgba(0,0,0,0.6)]">
            <NightDesk className="block h-auto w-full" />
          </div>
        </div>
      </div>
    </section>
  );
}
