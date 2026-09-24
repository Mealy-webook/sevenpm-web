import type { NextConfig } from "next";

/**
 * GitHub Pages serves static files only and serves a project repo from
 * `/<repo>/`, so the Pages build sets both of these. Everything else — local
 * dev, and any host that can run Next — is untouched by them.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const staticExport = process.env.STATIC_EXPORT === "true";

const nextConfig: NextConfig = {
  ...(staticExport ? { output: "export" as const } : {}),
  ...(basePath ? { basePath, assetPrefix: basePath } : {}),
  /**
   * Pages has no server, so a request for `/news/` has to find a file. This
   * writes `news/index.html` instead of `news.html`.
   */
  ...(staticExport ? { trailingSlash: true } : {}),
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
     *
     * Neither applies to the static export: the optimiser is a server, and a
     * Pages build has none, so those photographs go out as the original
     * JPEGs. The preview is therefore heavier than the real site would be.
     */
    formats: ["image/avif", "image/webp"],
    ...(staticExport
      ? { loader: "custom" as const, loaderFile: "./src/lib/imageLoader.ts" }
      : {}),
    // Album art for the hero deck comes from the iTunes Search API.
    remotePatterns: [{ protocol: "https", hostname: "**.mzstatic.com" }],
  },
};

export default nextConfig;
