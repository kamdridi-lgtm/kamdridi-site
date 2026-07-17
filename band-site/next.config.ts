import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname),
  async rewrites() {
    return [
      { source: "/games/war-machines/:path*", destination: "/games/war-machines/:path*" },
      { source: "/releases/echoes-un-live-in-brasil", destination: "/echoes-un-live-in-brasil/index.html" },
      { source: "/releases/echoes-un-live-in-brasil/", destination: "/echoes-un-live-in-brasil/index.html" },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com"
      }
    ]
  }
};

export default nextConfig;
