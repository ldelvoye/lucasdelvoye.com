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
