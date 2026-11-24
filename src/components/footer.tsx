import { site } from "@/data/site";
import { formatDate } from "@/lib/utils";

export function Footer() {
  const built = process.env.NEXT_PUBLIC_BUILD_DATE;
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>
          Built with Next.js, deployed on Vercel ·{" "}
          <a
            href={site.sourceRepo}
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-border underline-offset-4 transition-colors hover:text-foreground hover:decoration-primary"
          >
            view source
          </a>
        </p>
        <p className="font-mono text-xs">
          {built ? (
            <>
              last deployed <time dateTime={built}>{formatDate(built)}</time>
            </>
          ) : null}
          <span className="mx-2 text-border" aria-hidden="true">
            /
          </span>
          {site.tagline}
        </p>
      </div>
    </footer>
  );
}
