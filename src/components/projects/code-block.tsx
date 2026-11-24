import { highlight } from "@/lib/highlight";

interface CodeBlockProps {
  code: string;
  lang: string;
  title: string;
  note: string;
}

/** Server component: code is highlighted at build time, zero client JS. */
export async function CodeBlock({ code, lang, title, note }: CodeBlockProps) {
  const html = await highlight(code, lang);
  return (
    <figure className="code-block overflow-hidden rounded-2xl border border-border bg-card">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border bg-background-2 px-4 py-2.5">
        <figcaption className="font-mono text-xs text-foreground/90">{title}</figcaption>
        <span className="rounded-md border border-primary/30 bg-primary/10 px-2 py-0.5 font-mono text-[11px] text-primary">
          illustrative
        </span>
      </div>
      {/* Shiki output is generated from our own static strings at build time. */}
      <div dangerouslySetInnerHTML={{ __html: html }} />
      <p className="border-t border-border px-4 py-2.5 text-xs text-muted-foreground">
        {note}
      </p>
    </figure>
  );
}
