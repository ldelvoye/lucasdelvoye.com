import { bucket, defineRailway, github, preserve, project, ref, service } from "railway/iac";

export default defineRailway(() => {
  const history = bucket("history", { region: "sjc" });

  const web = service("web", {
    source: github("ldelvoye/lucasdelvoye.com", { branch: "main" }),
    build: {
      watchPatterns: ["apps/web/**", "package.json", "package-lock.json", ".dockerignore"],
    },
    healthcheck: "/",
    env: {
      RAILWAY_DOCKERFILE_PATH: "apps/web/Dockerfile",
      NEXT_TELEMETRY_DISABLED: "1",
      SPOTIFY_CLIENT_ID: preserve(),
      SPOTIFY_CLIENT_SECRET: preserve(),
      SPOTIFY_REFRESH_TOKEN: preserve(),
      SPOTIFY_HISTORY_BUCKET: ref(history, "BUCKET"),
      SPOTIFY_HISTORY_ENDPOINT: ref(history, "ENDPOINT"),
      SPOTIFY_HISTORY_REGION: ref(history, "REGION"),
      SPOTIFY_HISTORY_ACCESS_KEY_ID: ref(history, "ACCESS_KEY_ID"),
      SPOTIFY_HISTORY_SECRET_ACCESS_KEY: ref(history, "SECRET_ACCESS_KEY"),
    },
    domains: ["lucasdelvoye.com", "www.lucasdelvoye.com"],
  });

  return project("lucasdelvoye.com", { resources: [web, history] });
});
