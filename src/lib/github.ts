import { z } from "zod";
import { repoSnapshot } from "@/data/github-snapshot";
import type { ContributionCalendar, RepoInfo } from "@/types";

const API = "https://api.github.com";
const REVALIDATE_SECONDS = 3600;
const TIMEOUT_MS = 8000;

export type GitHubResult<T> = { ok: true; data: T } | { ok: false; error: string };

export interface GitHubClientOptions {
  /** Defaults to process.env.GITHUB_TOKEN. Optional for REST, required for GraphQL. */
  token?: string;
  /** Injected in tests. */
  fetchImpl?: typeof fetch;
}

/* ----------------------------------------------------------------------------
 * Response schemas: only the fields we use, validated so a changed or
 * truncated API response can never crash the build.
 * ------------------------------------------------------------------------- */

const repoSchema = z.object({
  name: z.string().min(1),
  description: z.string().nullable(),
  html_url: z.url(),
  language: z.string().nullable(),
  stargazers_count: z.number().int().nonnegative(),
  pushed_at: z.string(),
  fork: z.boolean(),
  archived: z.boolean(),
});

const reposSchema = z.array(repoSchema);

const contributionsSchema = z.object({
  data: z.object({
    user: z
      .object({
        contributionsCollection: z.object({
          contributionCalendar: z.object({
            totalContributions: z.number().int().nonnegative(),
            weeks: z.array(
              z.object({
                contributionDays: z.array(
                  z.object({
                    date: z.string(),
                    contributionCount: z.number().int().nonnegative(),
                  }),
                ),
              }),
            ),
          }),
        }),
      })
      .nullable(),
  }),
});

function resolveOptions(options: GitHubClientOptions) {
  const token = options.token ?? process.env.GITHUB_TOKEN ?? undefined;
  return { token: token || undefined, fetchImpl: options.fetchImpl ?? fetch };
}

function headers(token: string | undefined): HeadersInit {
  return {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "portfolio-site",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

function describeError(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

/** Fetches the public repositories owned by `username` (first 100). */
export async function fetchUserRepos(
  username: string,
  options: GitHubClientOptions = {},
): Promise<GitHubResult<RepoInfo[]>> {
  const { token, fetchImpl } = resolveOptions(options);
  const url = `${API}/users/${encodeURIComponent(username)}/repos?per_page=100&type=owner&sort=pushed`;

  try {
    const res = await fetchImpl(url, {
      headers: headers(token),
      next: { revalidate: REVALIDATE_SECONDS },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });

    if (!res.ok) {
      const remaining = res.headers.get("x-ratelimit-remaining");
      const reason = remaining === "0" ? "rate limited" : `HTTP ${res.status}`;
      return { ok: false, error: `GitHub repos request failed: ${reason}` };
    }

    const parsed = reposSchema.safeParse(await res.json());
    if (!parsed.success) {
      return {
        ok: false,
        error: `Unexpected GitHub repos payload: ${parsed.error.message}`,
      };
    }

    return {
      ok: true,
      data: parsed.data.map((r) => ({
        name: r.name,
        description: r.description,
        htmlUrl: r.html_url,
        language: r.language,
        stars: r.stargazers_count,
        pushedAt: r.pushed_at,
        fork: r.fork,
        archived: r.archived,
      })),
    };
  } catch (error) {
    return { ok: false, error: `GitHub repos request errored: ${describeError(error)}` };
  }
}

export interface ReposWithSource {
  repos: RepoInfo[];
  source: "live" | "snapshot";
}

/**
 * Live repositories when the API cooperates; otherwise the static snapshot in
 * `src/data/github-snapshot.ts`. Never throws, so the build never fails on it.
 */
export async function getRepos(
  username: string,
  options: GitHubClientOptions = {},
): Promise<ReposWithSource> {
  const result = await fetchUserRepos(username, options);
  if (result.ok) return { repos: result.data, source: "live" };

  console.warn(`[github] ${result.error} — using static snapshot.`);
  return { repos: repoSnapshot, source: "snapshot" };
}

const CONTRIBUTIONS_QUERY = `
  query ($login: String!) {
    user(login: $login) {
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks { contributionDays { date contributionCount } }
        }
      }
    }
  }
`;

/**
 * Last year of contributions via GraphQL. GitHub's GraphQL API always needs a
 * token, so without one this resolves to an error and the section hides itself.
 */
export async function fetchContributionCalendar(
  username: string,
  options: GitHubClientOptions = {},
): Promise<GitHubResult<ContributionCalendar>> {
  const { token, fetchImpl } = resolveOptions(options);
  if (!token) return { ok: false, error: "GITHUB_TOKEN not set" };

  try {
    const res = await fetchImpl(`${API}/graphql`, {
      method: "POST",
      headers: { ...headers(token), "Content-Type": "application/json" },
      body: JSON.stringify({
        query: CONTRIBUTIONS_QUERY,
        variables: { login: username },
      }),
      next: { revalidate: REVALIDATE_SECONDS },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!res.ok) return { ok: false, error: `GitHub GraphQL failed: HTTP ${res.status}` };

    const parsed = contributionsSchema.safeParse(await res.json());
    if (!parsed.success || !parsed.data.data.user) {
      return { ok: false, error: "Unexpected GitHub GraphQL payload" };
    }

    const calendar = parsed.data.data.user.contributionsCollection.contributionCalendar;
    return {
      ok: true,
      data: {
        total: calendar.totalContributions,
        weeks: calendar.weeks.map((w) =>
          w.contributionDays.map((d) => ({ date: d.date, count: d.contributionCount })),
        ),
      },
    };
  } catch (error) {
    return { ok: false, error: `GitHub GraphQL errored: ${describeError(error)}` };
  }
}
