import * as Sentry from "@sentry/hono/node";
import { recentlyPlayed } from "./api.ts";
import { loadPlays, persistent, savePlays } from "./bucket.ts";
import { NotConfigured, spotifyEnv } from "./env.ts";
import { mergePlays } from "./history.ts";
import { error, info, warn } from "../log.ts";
import type { Play } from "contract";

type MonitorConfig = NonNullable<Parameters<typeof Sentry.withMonitor>[2]>;

const POLL_MS = 5 * 60 * 1000;
const MONITOR_SLUG = "spotify-history-poll";
const MONITOR: MonitorConfig = {
  schedule: { type: "interval", value: 5, unit: "minute" },
  checkinMargin: 2,
  maxRuntime: 2,
  failureIssueThreshold: 2,
  recoveryThreshold: 1,
};

let plays: Play[] = [];
let readiness: Promise<void> | null = null;
let timer: NodeJS.Timeout | null = null;

function countNew(previous: Play[], merged: Play[]): number {
  const oldTimes = new Set(previous.map((play) => play.playedAt));
  let count = 0;
  for (const play of merged) {
    if (!oldTimes.has(play.playedAt)) {
      count += 1;
    }
  }
  return count;
}

async function poll(): Promise<void> {
  const incoming = await recentlyPlayed();
  const merged = mergePlays(plays, incoming, Date.now());
  const fresh = countNew(plays, merged);
  const changed = fresh > 0 || merged.length !== plays.length;
  plays = merged;
  let written = false;
  if (changed) {
    written = await savePlays(plays);
  }
  Sentry.metrics.gauge("spotify.history.plays", plays.length);
  info("spotify history polled", {
    plays_fetched: incoming.length,
    plays_new: fresh,
    plays_kept: plays.length,
    bucket_written: written,
  });
}

async function pollSafely(): Promise<void> {
  try {
    await Sentry.withMonitor(MONITOR_SLUG, poll, MONITOR);
  } catch (cause) {
    error("spotify history poll failed", {}, cause);
  }
}

async function load(): Promise<void> {
  try {
    const stored = await loadPlays();
    plays = mergePlays(stored, [], Date.now());
    if (persistent()) {
      info("spotify history restored", { plays_kept: plays.length });
    }
  } catch (cause) {
    error("spotify history load failed", {}, cause);
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
  } catch (cause) {
    if (cause instanceof NotConfigured) {
      warn("spotify history poller not started", { reason: cause.message });
      return;
    }
    throw cause;
  }
  ready();
  timer = setInterval(pollSafely, POLL_MS);
}

export function stop(): void {
  if (timer === null) {
    return;
  }
  clearInterval(timer);
  timer = null;
}
