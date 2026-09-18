import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { memo } from "../src/memo.ts";

vi.mock("@sentry/hono/node", () => ({
  logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn() },
  captureException: vi.fn(),
}));

const TTL_MS = 1_000;
const STALE_MS = 5_000;
const OPTIONS = { name: "test", ttlMs: TTL_MS, staleMs: STALE_MS };

describe("memo", () => {
  let clock = 0;

  function tick(ms: number): void {
    clock += ms;
    vi.setSystemTime(clock);
  }

  beforeEach(() => {
    clock = 0;
    vi.useFakeTimers();
    vi.setSystemTime(clock);
    vi.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("serves the last good value while a refresh fails, until the stale window closes", async () => {
    let attempts = 0;
    const load = async (): Promise<string> => {
      attempts += 1;
      if (attempts === 1) {
        return "first";
      }
      if (attempts === 4) {
        return "second";
      }
      throw new Error("upstream down");
    };
    const cache = memo(OPTIONS, load);

    expect(await cache.get()).toBe("first");

    tick(TTL_MS / 2);
    expect(await cache.get()).toBe("first");
    expect(attempts).toBe(1);

    tick(TTL_MS);
    expect(await cache.get()).toBe("first");
    expect(attempts).toBe(2);

    tick(TTL_MS + STALE_MS);
    await expect(cache.get()).rejects.toThrow("upstream down");

    expect(await cache.get()).toBe("second");
  });

  it("throws when the first load fails and there is nothing to fall back to", async () => {
    const load = async (): Promise<string> => {
      throw new Error("upstream down");
    };
    const cache = memo(OPTIONS, load);

    await expect(cache.get()).rejects.toThrow("upstream down");
  });
});
