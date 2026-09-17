import { bucket, defineRailway, github, preserve, project, ref, service } from "railway/iac";

const REPO = "ldelvoye/lucasdelvoye.com";
const API_PORT = "8080";
const SENTRY_DSN = "https://be3c796b9e2543e8cfe65b0af7b19cfd@o4512082698960896.ingest.us.sentry.io/4512099568844800";

export default defineRailway(() => {
  const history = bucket("history", { region: "sjc" });

  const api = service("api", {
    source: github(REPO, { branch: "main" }),
    build: {
      watchPatterns: ["apps/api/**", "packages/contract/**", "package.json", "package-lock.json", ".dockerignore"],
    },
    healthcheck: "/health",
    env: {
      RAILWAY_DOCKERFILE_PATH: "apps/api/Dockerfile",
      PORT: API_PORT,
      SPOTIFY_CLIENT_ID: preserve(),
      SPOTIFY_CLIENT_SECRET: preserve(),
      SPOTIFY_REFRESH_TOKEN: preserve(),
      GITHUB_TOKEN: preserve(),
      SENTRY_DSN: SENTRY_DSN,
      SPOTIFY_HISTORY_BUCKET: ref(history, "BUCKET"),
      SPOTIFY_HISTORY_ENDPOINT: ref(history, "ENDPOINT"),
      SPOTIFY_HISTORY_REGION: ref(history, "REGION"),
      SPOTIFY_HISTORY_ACCESS_KEY_ID: ref(history, "ACCESS_KEY_ID"),
      SPOTIFY_HISTORY_SECRET_ACCESS_KEY: ref(history, "SECRET_ACCESS_KEY"),
    },
  });

  const web = service("web", {
    source: github(REPO, { branch: "main" }),
    build: {
      watchPatterns: ["apps/web/**", "packages/contract/**", "package.json", "package-lock.json", ".dockerignore"],
    },
    healthcheck: "/",
    env: {
      RAILWAY_DOCKERFILE_PATH: "apps/web/Dockerfile",
      NEXT_TELEMETRY_DISABLED: "1",
      API_ORIGIN: `http://\${{api.RAILWAY_PRIVATE_DOMAIN}}:${API_PORT}`,
      SENTRY_DSN: SENTRY_DSN,
      NEXT_PUBLIC_SENTRY_DSN: SENTRY_DSN,
      SENTRY_AUTH_TOKEN: preserve(),
    },
    domains: ["lucasdelvoye.com", "www.lucasdelvoye.com"],
  });

  return project("lucasdelvoye.com", { resources: [api, web, history] });
});
