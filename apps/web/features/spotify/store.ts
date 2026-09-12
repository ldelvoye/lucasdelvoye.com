import { recentlyPlayed } from "./api";
import { loadPlays, persistent, savePlays } from "./bucket";
import { NotConfigured, spotifyEnv } from "./env";
import { mergePlays } from "./history";
import type { Play } from "./model";

const POLL_MS = 5 * 60 * 1000;

let plays: Play[] = [];
let readiness: Promise<void> | null = null;
let timer: NodeJS.Timeout | null = null;

function grewFrom(previous: Play[], merged: Play[]): boolean {
  if (merged.length !== previous.length) {
    return true;
  }
  const oldTimes = new Set(previous.map((play) => play.playedAt));
  for (const play of merged) {
    if (!oldTimes.has(play.playedAt)) {
      return true;
    }
  }
  return false;
}

async function poll(): Promise<void> {
  const incoming = await recentlyPlayed();
  const merged = mergePlays(plays, incoming, Date.now());
  const grew = grewFrom(plays, merged);
  plays = merged;
  if (grew) {
    await savePlays(plays);
  }
}

async function pollSafely(): Promise<void> {
  try {
    await poll();
  } catch (error) {
    console.error("spotify history poll failed", error);
  }
}

async function load(): Promise<void> {
  try {
    const stored = await loadPlays();
    plays = mergePlays(stored, [], Date.now());
  } catch (error) {
    console.error("spotify history load failed", error);
  }
  await pollSafely();
}

export function ready(): Promise<void> {
  if (readiness === null) {
    readiness = load();
  }
  return readiness;
}

export function history(): Play[] {
  return plays;
}

export function start(): void {
  if (timer !== null) {
    return;
  }
  try {
    spotifyEnv();
  } catch (error) {
    if (error instanceof NotConfigured) {
      console.warn(`spotify history poller not started: ${error.message}`);
      return;
    }
    throw error;
  }
  if (!persistent()) {
    console.warn("spotify history is memory only: no bucket configured");
  }
  ready();
  timer = setInterval(pollSafely, POLL_MS);
}
