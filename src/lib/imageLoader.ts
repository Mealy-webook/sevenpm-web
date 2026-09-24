/**
 * Image loader for the static export.
 *
 * The export has no server, so there is no optimiser to route through: every
 * photograph is served as the file that is in `public/`. `unoptimized: true`
 * would do that too, but it bypasses the loader entirely and hands the `src`
 * to the browser untouched — which drops the deployment's base path and
 * breaks every image on GitHub Pages. Going through a loader keeps the
 * prefix.
 *
 * Remote art (the deck's album covers from the iTunes Search API) is already
 * absolute and passes through.
 */
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export default function imageLoader({ src }: { src: string }) {
  if (/^https?:\/\//.test(src)) return src;
  return `${BASE_PATH}${src}`;
}
