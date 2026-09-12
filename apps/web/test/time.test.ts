import { describe, expect, it } from "vitest";
import { relativeTime } from "../lib/time";

const NOW = Date.parse("2026-06-15T00:00:00.000Z");
const HOUR = 60 * 60 * 1000;

function agoIso(ms: number): string {
  const at = NOW - ms;
  return new Date(at).toISOString();
}

describe("relativeTime", () => {
  it("crosses the just-now, minute, hour, and day boundaries", () => {
    expect(relativeTime(agoIso(30 * 1000), NOW)).toBe("just now");
    expect(relativeTime(agoIso(59 * 60 * 1000), NOW)).toBe("59m ago");
    expect(relativeTime(agoIso(60 * 60 * 1000), NOW)).toBe("1h ago");
    expect(relativeTime(agoIso(23 * HOUR + 59 * 60 * 1000), NOW)).toBe("23h ago");
    expect(relativeTime(agoIso(24 * HOUR), NOW)).toBe("1d ago");
  });
});
