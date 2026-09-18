import { memo } from "../memo.ts";
import { coverUrl, currentlyPlaying, topArtistsShort, type Current } from "./api.ts";
import { mixOf, timelineOf, weekOf } from "./history.ts";
import type { NowPlaying, Play, SpotifyWeek, TopArtist } from "contract";
import { history, ready } from "./store.ts";

const NOW_TTL_MS = 5 * 1000;
const NOW_STALE_MS = 60 * 1000;
const TOP_TTL_MS = 60 * 60 * 1000;
const TOP_STALE_MS = 24 * 60 * 60 * 1000;
const AVATAR_WIDTH = 160;

type Observed = { at: number; playing: Current | null };

const current = memo(
  { name: "spotify.now", ttlMs: NOW_TTL_MS, staleMs: NOW_STALE_MS },
  async (): Promise<Observed> => {
    const at = Date.now();
    const playing = await currentlyPlaying();
    return { at, playing };
  },
);

const top = memo(
  { name: "spotify.top", ttlMs: TOP_TTL_MS, staleMs: TOP_STALE_MS },
  topArtistsShort,
);

function hasEnded(observed: Observed): boolean {
  if (observed.playing === null) {
    return false;
  }
  if (!observed.playing.playing) {
    return false;
  }
  const remaining = observed.playing.track.duration_ms - observed.playing.progressMs;
  const endsAt = observed.at + remaining;
  return Date.now() >= endsAt;
}

export async function now(coverWidth: number): Promise<NowPlaying | null> {
  let observed = await current.get();
  if (hasEnded(observed)) {
    observed = await current.renew();
  }
  const playing = observed.playing;
  if (playing !== null && !hasEnded(observed)) {
    const track = playing.track;
    const cover = coverUrl(track.album.images, coverWidth);
    const first = track.artists[0];
    let artist = "";
    if (first !== undefined) {
      artist = first.name;
    }
    return {
      title: track.name,
      artist,
      album: track.album.name,
      cover,
      durationMs: track.duration_ms,
      progressMs: playing.progressMs,
      playing: playing.playing,
      at: observed.at,
      playedAt: null,
    };
  }
  await ready();
  const last = history()[0];
  if (last === undefined) {
    return null;
  }
  return {
    title: last.track,
    artist: last.artist,
    album: last.album,
    cover: last.cover,
    durationMs: last.durationMs,
    progressMs: 0,
    playing: false,
    at: observed.at,
    playedAt: last.playedAt,
  };
}

export async function topArtists(): Promise<TopArtist[]> {
  const artists = await top.get();
  return artists.map((artist) => {
    let images: { url: string; width: number; height: number }[] = [];
    if (artist.images !== undefined) {
      images = artist.images;
    }
    const avatar = coverUrl(images, AVATAR_WIDTH);
    return { id: artist.id, name: artist.name, avatar };
  });
}

export async function recent(limit: number): Promise<Play[]> {
  await ready();
  return history().slice(0, limit);
}

export async function week(): Promise<SpotifyWeek> {
  await ready();
  const plays = history();
  const at = Date.now();
  return { week: weekOf(plays, at), mix: mixOf(plays, at), timeline: timelineOf(plays, at) };
}
