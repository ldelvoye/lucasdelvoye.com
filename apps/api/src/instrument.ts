import * as Sentry from "@sentry/hono/node";

let environment = "development";
if (process.env.NODE_ENV !== undefined) {
  environment = process.env.NODE_ENV;
}

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment,
  release: process.env.RAILWAY_GIT_COMMIT_SHA,
  tracesSampleRate: 1,
});
Sentry.setTag("service", "api");
Sentry.setAttribute("service", "api");
