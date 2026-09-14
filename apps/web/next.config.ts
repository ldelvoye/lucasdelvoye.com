import path from "node:path";
import type { NextConfig } from "next";

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

export default nextConfig;
