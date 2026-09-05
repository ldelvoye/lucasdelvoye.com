import { defineRailway, github, project, service } from "railway/iac";

export default defineRailway(() => {
  const web = service("web", {
    source: github("ldelvoye/lucasdelvoye.com", { branch: "main" }),
    healthcheck: "/",
    env: {
      RAILWAY_DOCKERFILE_PATH: "apps/web/Dockerfile",
      NEXT_TELEMETRY_DISABLED: "1",
    },
    domains: ["lucasdelvoye.com", "www.lucasdelvoye.com"],
  });

  return project("lucasdelvoye.com", { resources: [web] });
});
