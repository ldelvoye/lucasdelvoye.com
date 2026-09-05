import type { Step } from "./script";

export type Event =
  | { at: number; kind: "print"; text: string }
  | { at: number; kind: "enter" }
  | { at: number; kind: "clear" }
  | { at: number; kind: "done" };

export type Screen = { lines: string[]; current: string; done: boolean };

export const EMPTY_SCREEN: Screen = { lines: [], current: "", done: false };

export type Timing = { charDelay: number; jitter: () => number };

function centeredJitter(): number {
  const centered = Math.random() - 0.5;
  const scaled = centered * 30;
  return Math.round(scaled);
}

export const DEFAULT_TIMING: Timing = {
  charDelay: 45,
  jitter: centeredJitter,
};

export function schedule(steps: Step[], timing: Timing = DEFAULT_TIMING): Event[] {
  const events: Event[] = [];
  let at = 0;
  for (const step of steps) {
    if (step.kind === "type") {
      let delay = timing.charDelay;
      if (step.charDelay !== undefined) {
        delay = step.charDelay;
      }
      for (const char of step.text) {
        const jittered = delay + timing.jitter();
        const gap = Math.max(1, jittered);
        at += gap;
        events.push({ at, kind: "print", text: char });
      }
    } else if (step.kind === "pause") {
      at += step.ms;
    } else if (step.kind === "print") {
      events.push({ at, kind: "print", text: step.text });
    } else if (step.kind === "enter") {
      events.push({ at, kind: "enter" });
    } else {
      events.push({ at, kind: "clear" });
    }
  }
  events.push({ at, kind: "done" });
  return events;
}

export function apply(screen: Screen, event: Event): Screen {
  if (event.kind === "print") {
    return { ...screen, current: screen.current + event.text };
  }
  if (event.kind === "enter") {
    const lines = [...screen.lines, screen.current];
    return { ...screen, lines, current: "" };
  }
  if (event.kind === "clear") {
    return { ...screen, lines: [], current: "" };
  }
  return { ...screen, done: true };
}

export function resolve(screen: Screen, events: Event[]): Screen {
  let next = screen;
  for (const event of events) {
    next = apply(next, event);
  }
  return next;
}
