import { Section } from "@/components/sections/section";
import { site } from "@/data/site";
import type { ContributionCalendar } from "@/types";

const CELL = 11;
const GAP = 3;
const LEVEL_OPACITY = [0, 0.3, 0.5, 0.75, 1] as const;

function level(count: number, max: number): number {
  if (count === 0 || max === 0) return 0;
  return Math.min(4, Math.ceil((count / max) * 4));
}

/** Contribution heatmap. Rendered only when a calendar could be fetched. */
export function GitHubActivity({ calendar }: { calendar: ContributionCalendar }) {
  const max = Math.max(0, ...calendar.weeks.flat().map((d) => d.count));
  const width = calendar.weeks.length * (CELL + GAP) - GAP;
  const height = 7 * (CELL + GAP) - GAP;

  return (
    <Section
      id="activity"
      eyebrow="07 · activity"
      title="Shipping, week after week."
      intro={
        <>
          <span className="font-mono text-foreground">{calendar.total}</span>{" "}
          contributions on{" "}
          <a
            href={site.github.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline-offset-4 hover:underline"
          >
            GitHub
          </a>{" "}
          in the last year.
        </>
      }
    >
      <div className="overflow-x-auto rounded-2xl border border-border bg-card p-5">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          width={width}
          height={height}
          role="img"
          aria-label={`Contribution heatmap: ${calendar.total} contributions in the last year.`}
          className="max-w-none"
        >
          {calendar.weeks.map((week, wi) =>
            week.map((day) => {
              const lvl = level(day.count, max);
              const dow = new Date(`${day.date}T00:00:00Z`).getUTCDay();
              return (
                <rect
                  key={day.date}
                  x={wi * (CELL + GAP)}
                  y={dow * (CELL + GAP)}
                  width={CELL}
                  height={CELL}
                  rx={2.5}
                  fill={lvl === 0 ? "var(--border)" : "var(--secondary)"}
                  fillOpacity={lvl === 0 ? 0.6 : LEVEL_OPACITY[lvl]}
                >
                  <title>{`${day.count} contributions on ${day.date}`}</title>
                </rect>
              );
            }),
          )}
        </svg>
        <div className="mt-4 flex items-center justify-end gap-1.5 font-mono text-xs text-muted-foreground">
          less
          {LEVEL_OPACITY.map((o, i) => (
            <span
              key={o}
              aria-hidden="true"
              className="size-2.5 rounded-[3px]"
              style={{
                backgroundColor: i === 0 ? "var(--border)" : "var(--secondary)",
                opacity: i === 0 ? 0.6 : o,
              }}
            />
          ))}
          more
        </div>
      </div>
    </Section>
  );
}
