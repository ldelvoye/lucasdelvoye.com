import { describe, expect, it } from "vitest";
import { formatDuration, logTime } from "../features/spotify/format";

const NOW = Date.parse("2026-06-15T00:00:00.000Z");
const HOUR = 60 * 60 * 1000;

function agoIso(ms: number): string {
  const at = NOW - ms;
  return new Date(at).toISOString();
}

describe("logTime", () => {
  it("shows a Los Angeles clock for today and prefixes the weekday otherwise", () => {
    expect(logTime(agoIso(1 * HOUR), NOW)).toBe("16:00");
    expect(logTime(agoIso(30 * HOUR), NOW)).toBe("sat 11:00");
  });
});

describe("formatDuration", () => {
  it("formats hours and minutes together, or minutes alone under an hour", () => {
    expect(formatDuration(552 * 60000)).toBe("9h 12m");
    expect(formatDuration(48 * 60000)).toBe("48m");
  });
});
