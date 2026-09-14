import { afterEach, describe, expect, it, vi } from "vitest";
import { fetchJson } from "../lib/api";

describe("fetchJson", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    delete process.env.API_ORIGIN;
  });

  it("throws with the path and status on a non-2xx answer", async () => {
    process.env.API_ORIGIN = "http://stub";
    vi.stubGlobal("fetch", async () => new Response("{}", { status: 502 }));
    await expect(fetchJson("/spotify/now", { cover: 64 })).rejects.toThrow("api /spotify/now failed: 502");
  });

  it("builds the query and returns the parsed body", async () => {
    process.env.API_ORIGIN = "http://stub";
    let seen = "";
    vi.stubGlobal("fetch", async (input: URL) => {
      seen = String(input);
      return new Response(JSON.stringify({ ok: true }), { status: 200 });
    });
    const body = await fetchJson<{ ok: boolean }>("/spotify/recent", { limit: 10 });
    expect(seen).toBe("http://stub/spotify/recent?limit=10");
    expect(body).toEqual({ ok: true });
  });

  it("attaches an abort signal as the request deadline", async () => {
    process.env.API_ORIGIN = "http://stub";
    let seen: unknown;
    vi.stubGlobal("fetch", async (_input: URL, init: RequestInit) => {
      seen = init.signal;
      return new Response("{}", { status: 200 });
    });
    await fetchJson("/spotify/now");
    expect(seen).toBeInstanceOf(AbortSignal);
  });
});
