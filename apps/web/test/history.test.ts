import { describe, expect, it } from "vitest";
import {
  formatDuration,
  logTime,
  mergePlays,
  mixOf,
  timelineOf,
  weekOf,
} from "../features/spotify/history";
import type { Play } from "../features/spotify/model";

const NOW = Date.parse("2026-06-15T00:00:00.000Z");
const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;

function agoIso(ms: number): string {
  const at = NOW - ms;
  return new Date(at).toISOString();
}

function play(playedAt: string, artistId: string, durationMs: number): Play {
  return {
    playedAt,
    trackId: "track-1",
    track: "Track",
    artist: "Artist",
    artistId,
    album: "Album",
    durationMs,
    cover: "",
  };
}

describe("mergePlays", () => {
  it("dedupes on playedAt with the incoming copy winning, sorts newest first, and trims past 90 days", () => {
    const tooOld = agoIso(91 * DAY);
    const kept = agoIso(89 * DAY);
    const duplicate = agoIso(5 * DAY);
    const newest = agoIso(1 * DAY);
    const existing = [play(tooOld, "old", 100), play(kept, "kept", 200), play(duplicate, "dup", 300)];
    const incoming = [play(duplicate, "dup", 999), play(newest, "new", 400)];

    const merged = mergePlays(existing, incoming, NOW);

    expect(merged.map((entry) => entry.playedAt)).toEqual([newest, duplicate, kept]);
    const dupEntry = merged.find((entry) => entry.playedAt === duplicate);
    expect(dupEntry?.durationMs).toBe(999);
    expect(merged.some((entry) => entry.playedAt === tooOld)).toBe(false);
  });
});

describe("weekOf", () => {
  it("counts plays and distinct artists and sums durations over the last 7 days only", () => {
    const inWindow = agoIso(6 * DAY + 23 * HOUR);
    const outOfWindow = agoIso(7 * DAY + 1 * HOUR);
    const plays = [play(inWindow, "a1", 100000), play(outOfWindow, "a2", 200000)];

    const result = weekOf(plays, NOW);

    expect(result.plays).toBe(1);
    expect(result.ms).toBe(100000);
    expect(result.artists).toBe(1);
  });
});

describe("mixOf", () => {
  it("ranks by count, rounds each share of the week's plays, caps at ten entries, and returns [] when empty", () => {
    const recentTime = agoIso(1 * DAY);
    const weekPlays = [
      play(recentTime, "A", 1000),
      play(recentTime, "A", 1000),
      play(recentTime, "A", 1000),
      play(recentTime, "B", 1000),
      play(recentTime, "C", 1000),
    ];

    const mix = mixOf(weekPlays, NOW);

    expect(mix).toEqual([
      { artistId: "A", name: "Artist", percent: 60 },
      { artistId: "B", name: "Artist", percent: 20 },
      { artistId: "C", name: "Artist", percent: 20 },
    ]);

    const artistIds = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l"];
    const manyArtists = artistIds.map((artistId) => play(recentTime, artistId, 1000));
    expect(mixOf(manyArtists, NOW)).toHaveLength(10);

    expect(mixOf([], NOW)).toEqual([]);
  });
});

describe("timelineOf", () => {
  it("bins seven Los Angeles days ending today into four-hour slots, oldest first", () => {
    const today = agoIso(1 * HOUR);
    const yesterday = agoIso(30 * HOUR);
    const tooOld = agoIso(8 * DAY);
    const plays = [play(today, "a", 1000), play(yesterday, "b", 1000), play(tooOld, "c", 1000)];

    const days = timelineOf(plays, NOW);

    expect(days.map((day) => day.label)).toEqual(["mon", "tue", "wed", "thu", "fri", "sat", "sun"]);
    expect(days.map((day) => day.bins.length)).toEqual([6, 6, 6, 6, 6, 6, 6]);
    expect(days[6]?.bins).toEqual([0, 0, 0, 0, 1, 0]);
    expect(days[5]?.bins).toEqual([0, 0, 1, 0, 0, 0]);
    expect(days[0]?.bins).toEqual([0, 0, 0, 0, 0, 0]);
  });
});

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
