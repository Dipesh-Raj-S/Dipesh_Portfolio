import { Star } from "lucide-react";
import { Fragment } from "react";

/** Muted, palette-friendly takes on GitHub's language colours. */
const LANGUAGE_COLORS: Record<string, string> = {
  Python: "#6f8fbf",
  TypeScript: "#5b86b8",
  JavaScript: "#d4b35a",
  "C++": "#c0708a",
  C: "#8f9aa8",
  HTML: "#d4805f",
  CSS: "#8c7bb8",
  "Jupyter Notebook": "#d99a5a",
  Java: "#b98a5a",
};

export function LanguageDot({ language }: { language: string | null }) {
  if (!language) return null;
  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        aria-hidden="true"
        className="size-2.5 rounded-full"
        style={{
          backgroundColor: LANGUAGE_COLORS[language] ?? "var(--muted-foreground)",
        }}
      />
      {language}
    </span>
  );
}

export function StarCount({ stars }: { stars: number | null }) {
  if (stars === null) return null;
  return (
    <span className="inline-flex items-center gap-1" aria-label={`${stars} GitHub stars`}>
      <Star className="size-3.5" aria-hidden="true" />
      <span className="tabular-nums">{stars}</span>
    </span>
  );
}

/** Renders text where {{numbers}} are highlighted in the accent colour. */
export function Highlighted({ text }: { text: string }) {
  const parts = text.split(/\{\{(.+?)\}\}/g);
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <strong key={i} className="font-mono font-medium text-primary">
            {part}
          </strong>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        ),
      )}
    </>
  );
}
