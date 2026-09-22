import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    /**
     * Next 16 allows only the qualities listed here and coerces anything else
     * to the nearest one — including the component's own default of 75, which
     * is what every photograph on this site was being served at. One entry of
     * 90 therefore raises the whole site without touching 187 call sites.
     *
     * 90 rather than 100: above about 92 a JPEG's file size climbs steeply
     * for differences nobody sees, and these are dark concert photographs
     * where the artefacts would show first in the gradients.
     */
    qualities: [90],
    /**
     * AVIF first, WebP behind it. AVIF is roughly a fifth smaller than WebP
     * at the same quality, which is what pays for the quality rise above.
     */
    formats: ["image/avif", "image/webp"],
    // Album art for the hero deck comes from the iTunes Search API.
    remotePatterns: [{ protocol: "https", hostname: "**.mzstatic.com" }],
  },
};

export default nextConfig;
