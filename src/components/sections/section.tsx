import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionProps {
  id: string;
  /** Small mono label above the heading, e.g. "02 · skills". */
  eyebrow: string;
  title: string;
  intro?: ReactNode;
  children: ReactNode;
  className?: string;
  textured?: boolean;
}

export function Section({
  id,
  eyebrow,
  title,
  intro,
  children,
  className,
  textured,
}: SectionProps) {
  const headingId = `${id}-heading`;
  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className={cn("relative scroll-mt-20 py-20 sm:py-28", className)}
    >
      {textured ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-dots [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]"
        />
      ) : null}
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <header className="mb-10 max-w-2xl sm:mb-14">
          <p className="mb-3 font-mono text-xs tracking-wider text-primary uppercase">
            {eyebrow}
          </p>
          <h2
            id={headingId}
            className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl"
          >
            {title}
          </h2>
          {intro ? (
            <div className="mt-4 text-pretty text-muted-foreground">{intro}</div>
          ) : null}
        </header>
        {children}
      </div>
    </section>
  );
}
