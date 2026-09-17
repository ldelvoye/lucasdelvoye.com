import type { Step } from "@/components/intro/script";
import { schedule } from "@/components/intro/sequence";

export const CHAR_DELAY_MS = 45;
export const MAX_COMMAND_MS = 1200;
export const STAGGER_MS = 200;
export const REVEAL_MS = 220;
export const SETTLE_MS = 560;

export function charDelayFor(text: string): number {
  if (text.length === 0) {
    return CHAR_DELAY_MS;
  }
  const capped = MAX_COMMAND_MS / text.length;
  if (capped < CHAR_DELAY_MS) {
    return capped;
  }
  return CHAR_DELAY_MS;
}

export function typingMs(text: string): number {
  const delay = charDelayFor(text);
  return delay * text.length;
}

export function staggeredDelay(order: number): number {
  return order * STAGGER_MS;
}

export function serialDelays(texts: string[]): number[] {
  const delays: number[] = [];
  let at = 0;
  for (const text of texts) {
    delays.push(at);
    at = at + typingMs(text) + REVEAL_MS;
  }
  return delays;
}

export function commandOffsets(text: string): number[] {
  if (text.length === 0) {
    return [];
  }
  const delay = charDelayFor(text);
  const steps: Step[] = [{ kind: "type", text, charDelay: delay }];
  const events = schedule(steps);
  const offsets: number[] = [];
  for (const event of events) {
    if (event.kind === "print") {
      offsets.push(event.at);
    }
  }
  return offsets;
}

export function typedAt(offsets: number[], since: number): number {
  if (since <= 0) {
    return 0;
  }
  let count = 0;
  for (const offset of offsets) {
    if (offset > since) {
      return count;
    }
    count = count + 1;
  }
  return count;
}

export function nextPlayed(played: string[], tabId: string): string[] {
  if (played.includes(tabId)) {
    return played;
  }
  return [...played, tabId];
}
