import { afterEach, describe, expect, it, vi } from "vitest";
import { repoSnapshot } from "@/data/github-snapshot";
import { fetchContributionCalendar, fetchUserRepos, getRepos } from "@/lib/github";

const apiRepo = {
  name: "JailbreakOps",
  description: "CTF backend",
  html_url: "https://github.com/Dipesh-Raj-S/JailbreakOps",
  language: "Python",
  stargazers_count: 3,
  pushed_at: "2026-08-29T18:08:08Z",
  fork: false,
  archived: false,
  // extra fields from the real API must be ignored
  watchers_count: 3,
};

function jsonResponse(body: unknown, init: ResponseInit = {}) {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { "content-type": "application/json" },
    ...init,
  });
}

function mockFetch(response: Response | Error) {
  return vi.fn<typeof fetch>(async () => {
    if (response instanceof Error) throw response;
    return response;
  });
}

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("fetchUserRepos", () => {
  it("returns validated, camel-cased repositories", async () => {
    const fetchImpl = mockFetch(jsonResponse([apiRepo]));
    const result = await fetchUserRepos("Dipesh-Raj-S", { fetchImpl, token: "" });

    expect(result).toEqual({
      ok: true,
      data: [
        {
          name: "JailbreakOps",
          description: "CTF backend",
          htmlUrl: "https://github.com/Dipesh-Raj-S/JailbreakOps",
          language: "Python",
          stars: 3,
          pushedAt: "2026-08-29T18:08:08Z",
          fork: false,
          archived: false,
        },
      ],
    });
    const [url, init] = fetchImpl.mock.calls[0]!;
    expect(String(url)).toContain("/users/Dipesh-Raj-S/repos");
    expect(init?.next).toEqual({ revalidate: 3600 });
  });

  it("sends a bearer token only when one is configured", async () => {
    const withToken = mockFetch(jsonResponse([]));
    await fetchUserRepos("u", { fetchImpl: withToken, token: "secret" });
    expect(withToken.mock.calls[0]![1]?.headers).toMatchObject({
      Authorization: "Bearer secret",
    });

    vi.stubEnv("GITHUB_TOKEN", "");
    const withoutToken = mockFetch(jsonResponse([]));
    await fetchUserRepos("u", { fetchImpl: withoutToken });
    expect(withoutToken.mock.calls[0]![1]?.headers).not.toHaveProperty("Authorization");
  });

  it("reports rate limiting as an error instead of throwing", async () => {
    const fetchImpl = mockFetch(
      jsonResponse(
        { message: "API rate limit exceeded" },
        { status: 403, headers: { "x-ratelimit-remaining": "0" } },
      ),
    );
    const result = await fetchUserRepos("u", { fetchImpl });
    expect(result).toEqual({ ok: false, error: expect.stringContaining("rate limited") });
  });

  it("rejects payloads that fail schema validation", async () => {
    const fetchImpl = mockFetch(jsonResponse([{ ...apiRepo, stargazers_count: "lots" }]));
    const result = await fetchUserRepos("u", { fetchImpl });
    expect(result.ok).toBe(false);
  });

  it("catches network errors", async () => {
    const fetchImpl = mockFetch(new TypeError("fetch failed"));
    const result = await fetchUserRepos("u", { fetchImpl });
    expect(result).toEqual({ ok: false, error: expect.stringContaining("fetch failed") });
  });
});

describe("getRepos", () => {
  it("uses live data when the API succeeds", async () => {
    const fetchImpl = mockFetch(jsonResponse([apiRepo]));
    const { repos, source } = await getRepos("u", { fetchImpl });
    expect(source).toBe("live");
    expect(repos).toHaveLength(1);
  });

  it("falls back to the static snapshot when the API fails", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const fetchImpl = mockFetch(jsonResponse({}, { status: 500 }));
    const { repos, source } = await getRepos("u", { fetchImpl });
    expect(source).toBe("snapshot");
    expect(repos).toBe(repoSnapshot);
    expect(warn).toHaveBeenCalledOnce();
  });
});

describe("fetchContributionCalendar", () => {
  it("does not call GraphQL without a token", async () => {
    vi.stubEnv("GITHUB_TOKEN", "");
    const fetchImpl = mockFetch(jsonResponse({}));
    const result = await fetchContributionCalendar("u", { fetchImpl });
    expect(result.ok).toBe(false);
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it("maps the contribution calendar when a token is set", async () => {
    const fetchImpl = mockFetch(
      jsonResponse({
        data: {
          user: {
            contributionsCollection: {
              contributionCalendar: {
                totalContributions: 5,
                weeks: [
                  {
                    contributionDays: [
                      { date: "2026-11-22", contributionCount: 2 },
                      { date: "2026-11-23", contributionCount: 3 },
                    ],
                  },
                ],
              },
            },
          },
        },
      }),
    );
    const result = await fetchContributionCalendar("u", { fetchImpl, token: "t" });
    expect(result).toEqual({
      ok: true,
      data: {
        total: 5,
        weeks: [
          [
            { date: "2026-11-22", count: 2 },
            { date: "2026-11-23", count: 3 },
          ],
        ],
      },
    });
    expect(fetchImpl.mock.calls[0]![1]?.method).toBe("POST");
  });

  it("handles an unknown user (null) gracefully", async () => {
    const fetchImpl = mockFetch(jsonResponse({ data: { user: null } }));
    const result = await fetchContributionCalendar("nobody", { fetchImpl, token: "t" });
    expect(result.ok).toBe(false);
  });
});
