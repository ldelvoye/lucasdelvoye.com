import { Hono } from "hono";
import type { ApiError, Health, NowPlaying, Play, Project, Smorg, SpotifyWeek, TopArtist } from "contract";
import { ROUTES } from "contract";

export type Loaders = {
  now: (coverWidth: number) => Promise<NowPlaying | null>;
  topArtists: () => Promise<TopArtist[]>;
  recent: (limit: number) => Promise<Play[]>;
  week: () => Promise<SpotifyWeek>;
  projects: () => Promise<Project[]>;
  smorgVersion: () => Promise<string>;
};

class BadQuery extends Error {}

function positiveInt(raw: string | undefined, name: string): number {
  if (raw === undefined) {
    throw new BadQuery(`${name} is required`);
  }
  const value = Number(raw);
  if (!Number.isInteger(value)) {
    throw new BadQuery(`${name} must be a positive integer`);
  }
  if (value <= 0) {
    throw new BadQuery(`${name} must be a positive integer`);
  }
  return value;
}

export function createApp(loaders: Loaders): Hono {
  const app = new Hono();

  app.onError((error, c) => {
    const body: ApiError = { error: error.message };
    if (error instanceof BadQuery) {
      return c.json(body, 400);
    }
    console.error(`${c.req.method} ${c.req.path} failed`, error);
    return c.json(body, 502);
  });

  app.get(ROUTES.health, (c) => {
    const body: Health = { ok: true };
    return c.json(body);
  });

  app.get(ROUTES.spotifyNow, async (c) => {
    const cover = positiveInt(c.req.query("cover"), "cover");
    const body: NowPlaying | null = await loaders.now(cover);
    return c.json(body);
  });

  app.get(ROUTES.spotifyTop, async (c) => {
    const body: TopArtist[] = await loaders.topArtists();
    return c.json(body);
  });

  app.get(ROUTES.spotifyRecent, async (c) => {
    const limit = positiveInt(c.req.query("limit"), "limit");
    const body: Play[] = await loaders.recent(limit);
    return c.json(body);
  });

  app.get(ROUTES.spotifyWeek, async (c) => {
    const body: SpotifyWeek = await loaders.week();
    return c.json(body);
  });

  app.get(ROUTES.projects, async (c) => {
    const body: Project[] = await loaders.projects();
    return c.json(body);
  });

  app.get(ROUTES.smorg, async (c) => {
    const version = await loaders.smorgVersion();
    const body: Smorg = { version };
    return c.json(body);
  });

  return app;
}
