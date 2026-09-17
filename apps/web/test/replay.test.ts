import { describe, expect, it } from "vitest";
import {
  CHAR_DELAY_MS,
  MAX_COMMAND_MS,
  REVEAL_MS,
  STAGGER_MS,
  commandOffsets,
  nextPlayed,
  serialDelays,
  staggeredDelay,
  typedAt,
  typingMs,
} from "../components/reveal/schedule";

const LONG_INSTALL = "git clone https://github.com/ldelvoye/lucasdelvoye.com";
const ABOUT = ["whoami", "cat bio", "ls links"];

describe("typingMs", () => {
  it("holds the intro's pace for short commands and caps the long ones", () => {
    expect(typingMs("whoami")).toBe(6 * CHAR_DELAY_MS);
    expect(typingMs("ls ~/code")).toBe(9 * CHAR_DELAY_MS);
    expect(LONG_INSTALL.length * CHAR_DELAY_MS).toBeGreaterThan(MAX_COMMAND_MS);
    expect(typingMs(LONG_INSTALL)).toBe(MAX_COMMAND_MS);
    expect(typingMs("")).toBe(0);
  });
});

describe("delays", () => {
  it("staggers grid commands by a fixed step", () => {
    expect(staggeredDelay(0)).toBe(0);
    expect(staggeredDelay(3)).toBe(3 * STAGGER_MS);
  });

  it("lays serial commands end to end so none overlaps its predecessor", () => {
    const delays = serialDelays(ABOUT);
    expect(delays[0]).toBe(0);
    for (let index = 1; index < delays.length; index++) {
      const previousEnd = delays[index - 1] + typingMs(ABOUT[index - 1]) + REVEAL_MS;
      expect(delays[index]).toBe(previousEnd);
    }
  });
});

describe("commandOffsets", () => {
  it("gives one jittered time per character, in order", () => {
    const offsets = commandOffsets("ls ~/code");
    expect(offsets).toHaveLength("ls ~/code".length);
    for (let index = 1; index < offsets.length; index++) {
      expect(offsets[index]).toBeGreaterThan(offsets[index - 1]);
    }
  });
});

describe("typedAt", () => {
  it("types nothing before the first character and everything after the last", () => {
    const offsets = commandOffsets("ls ~/code");
    const last = offsets[offsets.length - 1];
    expect(typedAt(offsets, -50)).toBe(0);
    expect(typedAt(offsets, 0)).toBe(0);
    expect(typedAt(offsets, offsets[0])).toBe(1);
    expect(typedAt(offsets, last)).toBe(offsets.length);
    expect(typedAt(offsets, last * 10)).toBe(offsets.length);
  });
});

describe("nextPlayed", () => {
  it("marks a tab once and leaves the list alone the second time", () => {
    const once = nextPlayed([], "about");
    expect(once).toEqual(["about"]);
    expect(nextPlayed(once, "about")).toBe(once);
    expect(nextPlayed(once, "projects")).toEqual(["about", "projects"]);
  });
});
