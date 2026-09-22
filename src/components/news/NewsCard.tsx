import Image from "next/image";
import Link from "next/link";

import type { NewsArticle } from "@/data/news";
import { newsCopy } from "@/data/news";

/**
 * One story in an index (Figma 2467:23287).
 *
 * The comp gives it a 3:2 photograph, the date, a headline clipped at two
 * lines and an inline "Read article" link — no card, no border, no fill. The
 * whole tile is the link; the inline button is the affordance, not a second
 * target, so it is a span rather than a nested anchor.
 *
 * Shared by `/news` and by the related row under an article, which the comp
 * draws identically.
 */
export function NewsCard({
  article,
  sizes = "(min-width: 1280px) 403px, (min-width: 640px) 45vw, 90vw",
  priority = false,
}: {
  article: NewsArticle;
  sizes?: string;
  priority?: boolean;
}) {
  return (
    <Link
      href={`/news/${article.slug}`}
      data-cursor="Read"
      className="news-tile group flex h-full flex-col gap-4"
    >
      <span className="relative block aspect-[3/2] w-full overflow-hidden bg-[#27272a]">
        <Image
          src={article.image}
          alt=""
          fill
          sizes={sizes}
          priority={priority}
          className="news-tile-image object-cover"
        />
      </span>

      <span className="flex flex-col gap-2">
        <time
          dateTime={article.date}
          className="font-[family-name:var(--font-display)] text-[17px] leading-6 tracking-[0.085px] text-content-secondary"
        >
          {article.dateLabel}
        </time>
        {/* Two lines, ellipsised — the comp clips every headline at the same
            depth so a row of tiles keeps one baseline. */}
        <span className="line-clamp-2 font-[family-name:var(--font-display)] text-[22px] font-bold uppercase leading-7 tracking-[-0.11px] text-white transition-colors group-hover:text-brand">
          {article.title}
        </span>
      </span>

      <span className="mt-auto flex items-center gap-2 font-[family-name:var(--font-display)] text-[17px] font-semibold leading-6 text-content-primary transition-colors group-hover:text-brand">
        {newsCopy.readMore}
        <span aria-hidden className="news-tile-arrow" />
      </span>
    </Link>
  );
}
