import * as Sentry from "@sentry/hono/node";
import { serve } from "@hono/node-server";
import { createApp } from "./app.ts";
import { info } from "./log.ts";
import { githubEnv } from "./projects/env.ts";
import { projects } from "./projects/loader.ts";
import { smorgVersion } from "./smorg.ts";
import { persistent } from "./spotify/bucket.ts";
import { spotifyConfigured } from "./spotify/env.ts";
import { now, recent, topArtists, week } from "./spotify/loader.ts";
import { start, stop } from "./spotify/store.ts";

const DEFAULT_PORT = 8788;
const MAX_PORT = 65535;
const FLUSH_MS = 2000;

function port(): number {
  const raw = process.env.PORT;
  if (raw === undefined) {
    return DEFAULT_PORT;
  }
  if (raw === "") {
    return DEFAULT_PORT;
  }
  const parsed = Number(raw);
  if (!Number.isInteger(parsed)) {
    throw new Error(`PORT is not a number: ${raw}`);
  }
  if (parsed < 1) {
    throw new Error(`PORT is out of range: ${raw}`);
  }
  if (parsed > MAX_PORT) {
    throw new Error(`PORT is out of range: ${raw}`);
  }
  return parsed;
}

start();
const app = createApp({ now, topArtists, recent, week, projects, smorgVersion });
const listenPort = port();
const server = serve({ fetch: app.fetch, port: listenPort, hostname: "::" }, (listening) => {
  const github = githubEnv();
  info("api started", {
    port: listening.port,
    spotify: spotifyConfigured(),
    bucket: persistent(),
    github_token: github.token !== null,
    sentry: Sentry.isEnabled(),
  });
});

let stopping = false;

async function shutdown(signal: NodeJS.Signals): Promise<void> {
  if (stopping) {
    return;
  }
  stopping = true;
  info("api stopping", { signal });
  stop();
  server.close();
  await Sentry.flush(FLUSH_MS);
  process.exit(0);
}

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
