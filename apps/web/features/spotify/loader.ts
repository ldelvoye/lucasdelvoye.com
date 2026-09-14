import type { NowPlaying, Play, SpotifyWeek, TopArtist } from "contract";
import { ROUTES } from "contract";
import { fetchJson } from "@/lib/api";

export function now(coverWidth: number): Promise<NowPlaying | null> {
  return fetchJson(ROUTES.spotifyNow, { cover: coverWidth });
}

export function topArtists(): Promise<TopArtist[]> {
  return fetchJson(ROUTES.spotifyTop);
}

export function recent(limit: number): Promise<Play[]> {
  return fetchJson(ROUTES.spotifyRecent, { limit });
}

export function week(): Promise<SpotifyWeek> {
  return fetchJson(ROUTES.spotifyWeek);
}
