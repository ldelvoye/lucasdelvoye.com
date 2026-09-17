import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Loaders } from "../src/app.ts";
import { createApp } from "../src/app.ts";
import * as log from "../src/log.ts";

vi.mock("@sentry/hono/node", () => ({
  sentry: () => async (_context: unknown, next: () => Promise<void>) => next(),
}));
vi.mock("../src/log.ts");

const HEALTHY: Loaders = {
  now: async () => null,
  topArtists: async () => [],
  recent: async () => [],
  week: async () => ({ week: { plays: 0, ms: 0, artists: 0 }, mix: [], timeline: [] }),
  projects: async () => [],
  smorgVersion: async () => "1.5.0",
};

describe("api routes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("answers health", async () => {
    const app = createApp(HEALTHY);
    const response = await app.request("/health");
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true });
  });

  it("rejects a bad query with 400 and does not report it", async () => {
    const app = createApp(HEALTHY);
    const response = await app.request("/spotify/now?cover=abc");
    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: "cover must be a positive integer" });
    expect(log.error).not.toHaveBeenCalled();
  });

  it("turns a failing loader into a 502 and reports it once", async () => {
    const failure = new Error("github /repos failed: 503");
    const failing: Loaders = {
      ...HEALTHY,
      projects: async () => {
        throw failure;
      },
    };
    const app = createApp(failing);
    const response = await app.request("/projects");
    expect(response.status).toBe(502);
    expect(await response.json()).toEqual({ error: "github /repos failed: 503" });
    expect(log.error).toHaveBeenCalledTimes(1);
    expect(log.error).toHaveBeenCalledWith("request failed", { method: "GET", path: "/projects" }, failure);
  });
});
