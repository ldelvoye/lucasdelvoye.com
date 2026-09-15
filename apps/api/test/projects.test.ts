import { afterEach, describe, expect, it, vi } from "vitest";
import { projects } from "../src/projects/loader.ts";
import { languagesOf } from "../src/projects/shape.ts";

describe("languagesOf", () => {
  it("orders by bytes, rounds to whole percents summing to 100, and tints known languages", () => {
    const languages = languagesOf({ Shell: 1000, Python: 2000, Makefile: 1000 });
    expect(languages.map((language) => language.name)).toEqual(["Python", "Shell", "Makefile"]);
    const total = languages.reduce((sum, language) => sum + language.percent, 0);
    expect(total).toBe(100);
    expect(languages[0]?.percent).toBe(50);
    expect(languages[0]?.tint).toBe("mint");
    expect(languages[1]?.tint).toBeNull();
    expect(languagesOf({})).toEqual([]);
    const trace = languagesOf({ Python: 1000, Ruby: 1 });
    expect(trace.map((language) => language.name)).toEqual(["Python"]);
  });
});

const REPO = {
  description: "A tool",
  html_url: "https://github.com/ldelvoye/x",
  stargazers_count: 3,
  forks_count: 0,
  open_issues_count: 1,
  license: { spdx_id: "MIT" },
  created_at: "2026-01-01T00:00:00Z",
  pushed_at: "2026-06-01T00:00:00Z",
  topics: ["cli"],
  language: "Python",
};

function reply(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });
}

function stubGithub(missing: string): void {
  vi.stubGlobal("fetch", async (input: string | URL | Request) => {
    const url = String(input);
    const path = url.replace("http://stub", "");
    const [, , , name, rest] = path.split("/");
    if (name === missing) {
      return reply(404, { message: "Not Found" });
    }
    if (rest === undefined) {
      return reply(200, REPO);
    }
    if (rest === "languages") {
      return reply(200, { Python: 100 });
    }
    if (rest.startsWith("releases")) {
      return reply(404, { message: "Not Found" });
    }
    if (rest.startsWith("commits")) {
      return reply(200, [{ sha: "abcdef0123456", commit: { message: "first\n\nbody" } }]);
    }
    if (rest.startsWith("stats")) {
      return reply(202, {});
    }
    return reply(500, {});
  });
}

describe("projects loader", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("keeps the curated order and drops a repository GitHub does not have", async () => {
    process.env.GITHUB_API_ORIGIN = "http://stub";
    stubGithub("taco-shells");
    const loaded = await projects();
    expect(loaded.map((project) => project.name)).toEqual(["smorg", "lucasdelvoye.com"]);
    expect(loaded[0]?.release).toBeNull();
    expect(loaded[0]?.weeks).toEqual([]);
    expect(loaded[0]?.commits).toEqual([{ sha: "abcdef0", subject: "first" }]);
  });
});
