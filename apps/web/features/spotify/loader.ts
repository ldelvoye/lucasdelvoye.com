import { memo } from "@/lib/memo";
import { coverUrl, currentlyPlaying, topArtistsShort } from "./api";
import { mixOf, timelineOf, weekOf } from "./history";
import type { MixEntry, NowPlaying, Play, TimelineDay, TopArtist, Week } from "./model";
import { history, ready } from "./store";

const NOW_TTL_MS = 20 * 1000;
const TOP_TTL_MS = 60 * 60 * 1000;
const AVATAR_WIDTH = 160;

const current = memo(NOW_TTL_MS, async () => {
  const at = Date.now();
  const playing = await currentlyPlaying();
  return { at, playing };
});

const top = memo(TOP_TTL_MS, topArtistsShort);

export async function now(coverWidth: number): Promise<NowPlaying | null> {
  const observed = await current();
  if (observed.playing !== null) {
    const track = observed.playing.track;
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
      progressMs: observed.playing.progressMs,
      playing: observed.playing.playing,
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
  const artists = await top();
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

export async function week(): Promise<{ week: Week; mix: MixEntry[]; timeline: TimelineDay[] }> {
  await ready();
  const plays = history();
  const at = Date.now();
  return { week: weekOf(plays, at), mix: mixOf(plays, at), timeline: timelineOf(plays, at) };
}
