import { afterEach, describe, expect, it, vi } from "vitest";
import * as Sentry from "@sentry/hono/node";
import { error, info, warn } from "../src/log.ts";

vi.mock("@sentry/hono/node", () => ({
  logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn() },
  captureException: vi.fn(),
}));

function lastLine(spy: ReturnType<typeof vi.spyOn>): Record<string, unknown> {
  const calls = spy.mock.calls;
  const last = calls[calls.length - 1];
  return JSON.parse(String(last[0])) as Record<string, unknown>;
}

describe("log helper", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.clearAllMocks();
  });

  it("writes one json line with the level, the message and the attributes", () => {
    const out = vi.spyOn(console, "log").mockImplementation(() => {});
    info("spotify history polled", { plays_new: 3, bucket_written: true });
    expect(out).toHaveBeenCalledTimes(1);
    expect(lastLine(out)).toEqual({
      level: "info",
      message: "spotify history polled",
      plays_new: 3,
      bucket_written: true,
    });
    expect(Sentry.logger.info).toHaveBeenCalledWith("spotify history polled", { plays_new: 3, bucket_written: true });
  });

  it("captures the cause as an issue and names it in the line", () => {
    const err = vi.spyOn(console, "error").mockImplementation(() => {});
    const cause = new Error("github /repos failed: 503");
    error("request failed", { method: "GET", path: "/projects" }, cause);
    expect(lastLine(err)).toEqual({
      level: "error",
      message: "request failed",
      method: "GET",
      path: "/projects",
      error: "github /repos failed: 503",
    });
    expect(Sentry.captureException).toHaveBeenCalledTimes(1);
    expect(vi.mocked(Sentry.captureException).mock.calls[0][0]).toBe(cause);
  });

  it("does not capture a warning that carries no cause", () => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
    warn("project not on github, skipping it", { project: "smorg" });
    expect(Sentry.captureException).not.toHaveBeenCalled();
  });
});
