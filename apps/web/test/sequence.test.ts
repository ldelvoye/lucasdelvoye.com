import { describe, expect, it } from "vitest";
import { EXPANSION_MS, INTRO_BUDGET_MS, introScript } from "../components/intro/script";
import { EMPTY_SCREEN, apply, resolve, schedule } from "../components/intro/sequence";

const STEADY = { charDelay: 45, jitter: () => 0 };
const INTRO_SCRIPT = introScript("1.5.0");

describe("schedule", () => {
  it("keeps events in script order even when jitter is negative", () => {
    const jitters = [() => 0, () => -1000];
    for (const jitter of jitters) {
      const events = schedule(INTRO_SCRIPT, { charDelay: 45, jitter });
      for (let index = 1; index < events.length; index++) {
        expect(events[index].at).toBeGreaterThanOrEqual(events[index - 1].at);
      }
    }
  });

  it("ends with done and leaves room for the expansion inside the budget", () => {
    const events = schedule(INTRO_SCRIPT, STEADY);
    const last = events[events.length - 1];
    expect(last.kind).toBe("done");
    expect(last.at + EXPANSION_MS).toBeLessThanOrEqual(INTRO_BUDGET_MS);
  });
});

describe("resolve", () => {
  it("reaches the same cleared screen from any point in the sequence", () => {
    const events = schedule(INTRO_SCRIPT, STEADY);
    const terminal = resolve(EMPTY_SCREEN, events);
    expect(terminal).toEqual({ lines: [], current: "", done: true });
    for (let cut = 0; cut < events.length; cut++) {
      let partial = EMPTY_SCREEN;
      for (const event of events.slice(0, cut)) {
        partial = apply(partial, event);
      }
      expect(resolve(partial, events.slice(cut))).toEqual(terminal);
    }
  });
});
