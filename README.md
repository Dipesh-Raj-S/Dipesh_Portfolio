# dipesh.dev

Personal portfolio of **Dipesh Raj S** — Backend & Application Security Engineer.
_Build. Break. Learn. Repeat._

![Screenshot of the site](./docs/screenshot.png)
<!-- TODO: add a screenshot at docs/screenshot.png -->

A calm, late-night-coding themed site with an original animated SVG hero, an interactive
terminal, live GitHub data and statically generated case studies. The site is meant to
show engineering quality as much as content: strict TypeScript, validated API responses,
tests, CI, accessibility and security headers.

## Stack

| Area      | Choice                                                                     |
| --------- | -------------------------------------------------------------------------- |
| Framework | Next.js 15 (App Router, Server Components, ISR) · TypeScript `strict`      |
| Styling   | Tailwind CSS v4 · shadcn/ui-style primitives (Button, Badge, Sonner)       |
| Motion    | Framer Motion (`LazyMotion` + `m`, `reducedMotion="user"`) · CSS keyframes |
| Icons     | lucide-react + custom line icons                                           |
| Fonts     | Geist Sans, JetBrains Mono via `next/font`                                 |
| Data      | Typed content in `src/data/*.ts` · GitHub REST/GraphQL validated by Zod    |
| Code      | Shiki at build time (dual light/dark theme, zero client JS)                |
| Testing   | Vitest + React Testing Library · Playwright smoke test                     |
| CI        | GitHub Actions: lint → format → typecheck → unit tests → build → e2e       |

## Project structure

```
src/
├── app/                      # routes, metadata, OG image, sitemap, robots
│   ├── page.tsx              # home (ISR, revalidate 3600)
│   └── projects/[slug]/      # statically generated case studies
├── components/
│   ├── illustrations/        # NightDesk.tsx — the hero scene
│   ├── projects/             # cards, filter grid, architecture diagram, code block
│   ├── sections/             # one component per home-page section
│   └── ui/                   # shadcn-style primitives
├── data/                     # ALL editable content lives here
│   ├── site.ts               # name, links, email, nav
│   ├── projects.ts           # every project + categories + exclusions
│   ├── case-studies.ts       # featured project write-ups, diagrams, snippets
│   ├── skills.ts · profile.ts
│   └── github-snapshot.ts    # offline fallback for the GitHub API
├── lib/                      # github client, project merge, terminal parser, shiki
└── types/
tests/unit/                   # Vitest + RTL
e2e/                          # Playwright
```

## Running locally

Requires Node 20.11+.

```bash
npm install
npm run dev            # http://localhost:3000
```

| Script                      | What it does                                                                                     |
| --------------------------- | ------------------------------------------------------------------------------------------------ |
| `npm run lint`              | ESLint (Next + TypeScript rules)                                                                 |
| `npm run format` / `:check` | Prettier (with Tailwind class sorting)                                                           |
| `npm run typecheck`         | `tsc --noEmit`                                                                                   |
| `npm test`                  | Vitest unit tests                                                                                |
| `npm run build`             | Production build                                                                                 |
| `npm run test:e2e`          | Playwright smoke test (run `npm run build` first; first time: `npx playwright install chromium`) |

## Environment variables

All optional — `next build` succeeds with none set. Copy `.env.example` to `.env.local`.

| Variable               | Purpose                                                                                                                                                      |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `GITHUB_TOKEN`         | Raises the GitHub API limit (60 → 5,000 req/h) and **enables the contribution heatmap**, which needs GraphQL. A fine-grained token with no scopes is enough. |
| `NEXT_PUBLIC_SITE_URL` | Canonical URL for metadata, sitemap and OG. Falls back to `VERCEL_PROJECT_PRODUCTION_URL`, then `http://localhost:3000`.                                     |

### How GitHub data works

At build time (and at most hourly afterwards via ISR) the home page fetches your public
repos, validates the response with Zod, and merges stars, language and last-pushed date
into `src/data/projects.ts` by repo name. If the API fails or is rate-limited, the site
falls back to `src/data/github-snapshot.ts` and logs a warning — the build never fails on
it. Any **new** public, non-fork repo that isn't in `projects.ts` or `excludedRepos` shows
up automatically under the **Other** filter tab.

## Resume

Drop your resume at **`public/resume.pdf`**. The navbar's _Resume_ button links to
`/resume.pdf` and will 404 until the file exists.

## Deploy with Vercel

Zero config: import the repository at [vercel.com/new](https://vercel.com/new), optionally
add `GITHUB_TOKEN` and `NEXT_PUBLIC_SITE_URL`, and deploy.

## Security

Headers are set in `next.config.ts` for every route: `Content-Security-Policy`,
`Strict-Transport-Security`, `X-Content-Type-Options`, `X-Frame-Options`,
`Referrer-Policy`, `Permissions-Policy` and `Cross-Origin-Opener-Policy`.

The CSP allows only same-origin resources and blocks framing, plugins and foreign form
targets. `script-src` keeps `'unsafe-inline'` because the pages are statically generated
(per-request nonces would force dynamic rendering) and Next.js / next-themes emit small
inline bootstrap scripts. That trade-off is deliberate; switch to nonce-based CSP via
middleware if you later need A+.

## Accessibility & design notes

- Skip link, semantic landmarks, labelled sections, keyboard-operable terminal with
  visible focus, `aria-pressed` filter buttons and a live region announcing results.
- Every text/background token pair meets WCAG AA (≥ 4.5:1) in both themes.
- All motion — the hero's steam, stars, typing, lamp flicker and parallax, scroll
  reveals and counters — is disabled under `prefers-reduced-motion`.
- The hero illustration is a single original inline SVG (~18 KB source) using CSS
  variables, so the same markup renders the night scene and the daytime scene.
