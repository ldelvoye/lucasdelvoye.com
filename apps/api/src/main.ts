import { serve } from "@hono/node-server";
import { createApp } from "./app.ts";
import { projects } from "./projects/loader.ts";
import { smorgVersion } from "./smorg.ts";
import { now, recent, topArtists, week } from "./spotify/loader.ts";
import { start } from "./spotify/store.ts";

const DEFAULT_PORT = 8788;
const MAX_PORT = 65535;

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
serve({ fetch: app.fetch, port: listenPort, hostname: "::" }, (info) => {
  console.log(`api listening on [${info.address}]:${info.port}`);
});
