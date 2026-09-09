import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Album art for the hero deck comes from the iTunes Search API.
    remotePatterns: [{ protocol: "https", hostname: "**.mzstatic.com" }],
  },
};

export default nextConfig;
