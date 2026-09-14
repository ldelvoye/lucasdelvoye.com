import { describe, expect, it } from "vitest";
import type { Loaders } from "../src/app.ts";
import { createApp } from "../src/app.ts";

const HEALTHY: Loaders = {
  now: async () => null,
  topArtists: async () => [],
  recent: async () => [],
  week: async () => ({ week: { plays: 0, ms: 0, artists: 0 }, mix: [], timeline: [] }),
  projects: async () => [],
  smorgVersion: async () => "1.5.0",
};

describe("api routes", () => {
  it("answers health", async () => {
    const app = createApp(HEALTHY);
    const response = await app.request("/health");
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true });
  });

  it("rejects a bad query with 400", async () => {
    const app = createApp(HEALTHY);
    const response = await app.request("/spotify/now?cover=abc");
    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: "cover must be a positive integer" });
  });

  it("turns a failing loader into a 502 with an error body", async () => {
    const failing: Loaders = {
      ...HEALTHY,
      projects: async () => {
        throw new Error("github /repos failed: 503");
      },
    };
    const app = createApp(failing);
    const response = await app.request("/projects");
    expect(response.status).toBe(502);
    expect(await response.json()).toEqual({ error: "github /repos failed: 503" });
  });
});
