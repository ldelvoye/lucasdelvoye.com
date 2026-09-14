export type NowPlaying = {
  title: string;
  artist: string;
  album: string;
  cover: string;
  durationMs: number;
  progressMs: number;
  playing: boolean;
  at: number;
  playedAt: string | null;
};

export type TopArtist = {
  id: string;
  name: string;
  avatar: string;
};

export type Play = {
  playedAt: string;
  trackId: string;
  track: string;
  artist: string;
  artistId: string;
  album: string;
  durationMs: number;
  cover: string;
};

export type Week = {
  plays: number;
  ms: number;
  artists: number;
};

export type MixEntry = {
  artistId: string;
  name: string;
  percent: number;
};

export type TimelineDay = {
  label: string;
  bins: number[];
};

export type SpotifyWeek = {
  week: Week;
  mix: MixEntry[];
  timeline: TimelineDay[];
};

export type Clip = { src: string; width: number; height: number };
export type Language = { name: string; percent: number; tint: string | null };
export type Commit = { sha: string; subject: string };

export type Project = {
  name: string;
  url: string;
  description: string;
  install: string;
  run: string;
  clip: Clip | null;
  primary: string | null;
  languages: Language[];
  stars: number;
  forks: number;
  issues: number;
  license: string | null;
  release: string | null;
  createdAt: string;
  pushedAt: string;
  topics: string[];
  commits: Commit[];
  weeks: number[];
};

export type Smorg = { version: string };
export type Health = { ok: true };
export type ApiError = { error: string };

export const ROUTES = {
  health: "/health",
  spotifyNow: "/spotify/now",
  spotifyTop: "/spotify/top",
  spotifyRecent: "/spotify/recent",
  spotifyWeek: "/spotify/week",
  projects: "/projects",
  smorg: "/smorg",
} as const;

export const SMORG_FALLBACK_VERSION = "1.5.0";
