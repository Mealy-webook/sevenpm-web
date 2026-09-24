/**
 * Where the site is served from.
 *
 * Empty at the domain root — local dev, and any host that gives the site its
 * own domain. GitHub Pages serves a project repo from `/<repo>/` instead, so
 * the Pages build sets `NEXT_PUBLIC_BASE_PATH=/sevenpm-web` and every URL the
 * app writes has to carry that prefix.
 *
 * `next/image`, `next/link` and the router prefix it themselves from
 * `basePath` in next.config. This constant is for the places they cannot
 * reach: CSS `url()` (see the root layout, which rewrites the `--asset-*`
 * variables) and any URL handed to a browser API directly.
 */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/**
 * Prefix a root-relative asset path with the deployment's base path. Absolute
 * URLs pass through: the deck's album art is remote.
 */
export function asset(path: string) {
  if (/^(https?:)?\/\//.test(path) || path.startsWith("data:")) return path;
  return `${BASE_PATH}${path}`;
}
