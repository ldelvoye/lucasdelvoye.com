import type { MixEntry, Play, TimelineDay, Week } from "./model";

export const RETENTION_MS = 90 * 24 * 60 * 60 * 1000;
export const WEEK_MS = 7 * 24 * 60 * 60 * 1000;
const HOUR_MS = 60 * 60 * 1000;
const DAY_MS = 24 * HOUR_MS;
const MIX_SIZE = 10;
const DAYS_SHOWN = 7;
const BIN_HOURS = 4;
const BINS_PER_DAY = 24 / BIN_HOURS;
const TIME_ZONE = "America/Los_Angeles";

const clockFormat = new Intl.DateTimeFormat("en-US", {
  timeZone: TIME_ZONE,
  hourCycle: "h23",
  hour: "numeric",
  minute: "numeric",
  second: "numeric",
});

const weekdayFormat = new Intl.DateTimeFormat("en-US", { timeZone: TIME_ZONE, weekday: "short" });

const dayKeyFormat = new Intl.DateTimeFormat("en-CA", {
  timeZone: TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

const hourMinuteFormat = new Intl.DateTimeFormat("en-US", {
  timeZone: TIME_ZONE,
  hourCycle: "h23",
  hour: "2-digit",
  minute: "2-digit",
});

const clockDisplayFormat = new Intl.DateTimeFormat("en-US", {
  timeZone: TIME_ZONE,
  hourCycle: "h23",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
});

function clockPart(parts: Intl.DateTimeFormatPart[], type: string): number {
  const found = parts.find((part) => part.type === type);
  if (found === undefined) {
    return 0;
  }
  return Number(found.value);
}

function localMidnight(time: number): number {
  const parts = clockFormat.formatToParts(time);
  const hours = clockPart(parts, "hour");
  const minutes = clockPart(parts, "minute");
  const seconds = clockPart(parts, "second");
  const sinceMidnight = hours * HOUR_MS + minutes * 60 * 1000 + seconds * 1000;
  return time - sinceMidnight;
}

export function mergePlays(existing: Play[], incoming: Play[], now: number): Play[] {
  const byTime = new Map<string, Play>();
  for (const play of existing) {
    byTime.set(play.playedAt, play);
  }
  for (const play of incoming) {
    byTime.set(play.playedAt, play);
  }
  const cutoff = now - RETENTION_MS;
  const kept: Play[] = [];
  for (const play of byTime.values()) {
    const time = Date.parse(play.playedAt);
    if (time >= cutoff) {
      kept.push(play);
    }
  }
  kept.sort((a, b) => Date.parse(b.playedAt) - Date.parse(a.playedAt));
  return kept;
}

export function playsSince(plays: Play[], cutoff: number): Play[] {
  return plays.filter((play) => Date.parse(play.playedAt) >= cutoff);
}

export function weekOf(plays: Play[], now: number): Week {
  const recent = playsSince(plays, now - WEEK_MS);
  let ms = 0;
  const artists = new Set<string>();
  for (const play of recent) {
    ms += play.durationMs;
    artists.add(play.artistId);
  }
  return { plays: recent.length, ms, artists: artists.size };
}

export function mixOf(plays: Play[], now: number): MixEntry[] {
  const recent = playsSince(plays, now - WEEK_MS);
  if (recent.length === 0) {
    return [];
  }
  const counts = new Map<string, { name: string; count: number }>();
  for (const play of recent) {
    const found = counts.get(play.artistId);
    if (found === undefined) {
      counts.set(play.artistId, { name: play.artist, count: 1 });
    } else {
      found.count += 1;
    }
  }
  const ranked = [...counts.entries()];
  ranked.sort((a, b) => b[1].count - a[1].count);
  const top = ranked.slice(0, MIX_SIZE);
  return top.map(([artistId, entry]) => {
    const share = (entry.count / recent.length) * 100;
    const percent = Math.round(share);
    return { artistId, name: entry.name, percent };
  });
}

export function timelineOf(plays: Play[], now: number): TimelineDay[] {
  const today = localMidnight(now);
  const start = today - (DAYS_SHOWN - 1) * DAY_MS;
  const binMs = BIN_HOURS * HOUR_MS;
  const binCount = DAYS_SHOWN * BINS_PER_DAY;
  const counts = new Array<number>(binCount).fill(0);
  for (const play of plays) {
    const offset = Date.parse(play.playedAt) - start;
    if (offset < 0) {
      continue;
    }
    const bin = Math.floor(offset / binMs);
    if (bin >= binCount) {
      continue;
    }
    counts[bin] += 1;
  }
  const days: TimelineDay[] = [];
  for (let index = 0; index < DAYS_SHOWN; index += 1) {
    const dayStart = start + index * DAY_MS;
    const weekday = weekdayFormat.format(dayStart);
    const label = weekday.toLowerCase();
    const first = index * BINS_PER_DAY;
    const bins = counts.slice(first, first + BINS_PER_DAY);
    days.push({ label, bins });
  }
  return days;
}

export function logTime(iso: string, now: number): string {
  const time = Date.parse(iso);
  const clock = hourMinuteFormat.format(time);
  if (dayKeyFormat.format(time) === dayKeyFormat.format(now)) {
    return clock;
  }
  const weekday = weekdayFormat.format(time);
  return `${weekday.toLowerCase()} ${clock}`;
}

export function clockTime(time: number): string {
  const weekday = weekdayFormat.format(time);
  const clock = clockDisplayFormat.format(time);
  return `${weekday.toLowerCase()} ${clock}`;
}

export function relativeTime(iso: string, now: number): string {
  const elapsed = now - Date.parse(iso);
  const minutes = Math.floor(elapsed / 60000);
  if (minutes < 1) {
    return "just now";
  }
  if (minutes < 60) {
    return `${minutes}m ago`;
  }
  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours}h ago`;
  }
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function formatDuration(ms: number): string {
  const minutes = Math.floor(ms / 60000);
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  if (hours === 0) {
    return `${rest}m`;
  }
  return `${hours}h ${rest}m`;
}
