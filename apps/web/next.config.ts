import path from "node:path";
import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs/config";

const nextConfig: NextConfig = {
  output: "standalone",
  transpilePackages: ["contract"],
  outputFileTracingRoot: path.join(__dirname, "../../"),
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.lucasdelvoye.com" }],
        destination: "https://lucasdelvoye.com/:path*",
        permanent: true,
      },
    ];
  },
};

export default withSentryConfig(nextConfig, {
  org: "ldelvoye",
  project: "lucasdelvoye-com",
  authToken: process.env.SENTRY_AUTH_TOKEN,
  release: { name: process.env.RAILWAY_GIT_COMMIT_SHA },
  widenClientFileUpload: true,
  sourcemaps: { deleteSourcemapsAfterUpload: true },
});
