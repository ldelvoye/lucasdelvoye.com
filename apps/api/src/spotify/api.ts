import * as Sentry from "@sentry/hono/node";
import { spotifyEnv } from "./env.ts";
import { info } from "../log.ts";
import type { Play } from "contract";

export type ApiImage = { url: string; width: number; height: number };
export type ApiArtist = { id: string; name: string; images?: ApiImage[] };
export type ApiTrack = {
  id: string;
  name: string;
  duration_ms: number;
  artists: ApiArtist[];
  album: { name: string; images: ApiImage[] };
};
export type Current = { playing: boolean; progressMs: number; track: ApiTrack };

type TokenResponse = { access_token: string; expires_in: number };
type CurrentResponse = {
  is_playing: boolean;
  progress_ms: number | null;
  currently_playing_type: string;
  item: ApiTrack | null;
};
type RecentResponse = { items: { played_at: string; track: ApiTrack }[] };
type TopResponse = { items: ApiArtist[] };

const TOKEN_MARGIN_MS = 60 * 1000;
const RECENT_LIMIT = 50;
const TOP_LIMIT = 5;
const UPSTREAM_TIMEOUT_MS = 4000;

type Token = { value: string; until: number };

const UPSTREAM_METRIC = "spotify.upstream.duration";

const NO_RESPONSE = 0;

function observe(path: string, status: number, startedAt: number): void {
  const elapsed = Date.now() - startedAt;
  Sentry.metrics.distribution(UPSTREAM_METRIC, elapsed, {
    unit: "millisecond",
    attributes: { path, status },
  });
}

async function timedFetch(path: string, url: string, init: RequestInit): Promise<Response> {
  const startedAt = Date.now();
  try {
    const response = await fetch(url, init);
    observe(path, response.status, startedAt);
    return response;
  } catch (cause) {
    observe(path, NO_RESPONSE, startedAt);
    throw cause;
  }
}

let token: Token | null = null;
let refreshing: Promise<Token> | null = null;

async function refreshToken(): Promise<Token> {
  const env = spotifyEnv();
  const basic = Buffer.from(`${env.clientId}:${env.clientSecret}`).toString("base64");
  const body = new URLSearchParams({ grant_type: "refresh_token", refresh_token: env.refreshToken });
  const signal = AbortSignal.timeout(UPSTREAM_TIMEOUT_MS);
  const response = await timedFetch("/api/token", `${env.accountsOrigin}/api/token`, {
    method: "POST",
    headers: { Authorization: `Basic ${basic}`, "Content-Type": "application/x-www-form-urlencoded" },
    body,
    signal,
  });
  if (!response.ok) {
    throw new Error(`token refresh failed: ${response.status}`);
  }
  const json = (await response.json()) as TokenResponse;
  info("spotify token refreshed", { expires_in_s: json.expires_in });
  const until = Date.now() + json.expires_in * 1000 - TOKEN_MARGIN_MS;
  return { value: json.access_token, until };
}

async function accessToken(): Promise<string> {
  if (token !== null) {
    if (Date.now() < token.until) {
      return token.value;
    }
  }
  if (refreshing === null) {
    refreshing = refreshToken();
  }
  try {
    token = await refreshing;
  } finally {
    refreshing = null;
  }
  return token.value;
}

async function get<T>(path: string): Promise<{ status: number; json: T | null }> {
  const env = spotifyEnv();
  const bearer = await accessToken();
  const signal = AbortSignal.timeout(UPSTREAM_TIMEOUT_MS);
  const requested = `${env.apiOrigin}${path}`;
  const parsed = new URL(requested);
  const response = await timedFetch(parsed.pathname, requested, {
    headers: { Authorization: `Bearer ${bearer}` },
    signal,
  });
  if (response.status === 204) {
    return { status: 204, json: null };
  }
  if (!response.ok) {
    throw new Error(`spotify ${path} failed: ${response.status}`);
  }
  const json = (await response.json()) as T;
  return { status: response.status, json };
}

export async function currentlyPlaying(): Promise<Current | null> {
  const result = await get<CurrentResponse>("/v1/me/player/currently-playing");
  if (result.json === null) {
    return null;
  }
  if (result.json.currently_playing_type !== "track") {
    return null;
  }
  const track = result.json.item;
  if (track === null) {
    return null;
  }
  let progressMs = 0;
  if (result.json.progress_ms !== null) {
    progressMs = result.json.progress_ms;
  }
  return { playing: result.json.is_playing, progressMs, track };
}

export function coverUrl(images: ApiImage[], minWidth: number): string {
  const wide = images.filter((image) => image.width >= minWidth);
  wide.sort((a, b) => a.width - b.width);
  const smallest = wide[0];
  if (smallest !== undefined) {
    return smallest.url;
  }
  const largest = images[images.length - 1];
  if (largest !== undefined) {
    return largest.url;
  }
  return "";
}

export function toPlay(playedAt: string, track: ApiTrack): Play {
  const first = track.artists[0];
  let artist = "";
  let artistId = "";
  if (first !== undefined) {
    artist = first.name;
    artistId = first.id;
  }
  const cover = coverUrl(track.album.images, 300);
  return {
    playedAt,
    trackId: track.id,
    track: track.name,
    artist,
    artistId,
    album: track.album.name,
    durationMs: track.duration_ms,
    cover,
  };
}

export async function recentlyPlayed(): Promise<Play[]> {
  const result = await get<RecentResponse>(`/v1/me/player/recently-played?limit=${RECENT_LIMIT}`);
  if (result.json === null) {
    return [];
  }
  return result.json.items.map((item) => toPlay(item.played_at, item.track));
}

export async function topArtistsShort(): Promise<ApiArtist[]> {
  const result = await get<TopResponse>(`/v1/me/top/artists?time_range=short_term&limit=${TOP_LIMIT}`);
  if (result.json === null) {
    return [];
  }
  return result.json.items;
}
