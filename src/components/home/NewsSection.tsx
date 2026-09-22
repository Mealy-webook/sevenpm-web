import Image from "next/image";
import Link from "next/link";

import type { NewsItem } from "@/data/home";
import { DisplayHeading } from "@/components/ui/DisplayHeading";
import { Scribble } from "./Scribble";

/**
 * "Latest news", from Figma 2231:12467 as redrawn in the 15:202 homepage.
 *
 * The photographs are gone. A row is now its number, the headline, the date
 * and a square arrow button — four of them, hairline-ruled, on the page's own
 * dark ground, with "Load more" underneath. A hand-drawn yellow loop circles
 * "NEWS" in the title.
 *
 * The headline carries the row: 30/34 bold and uppercase, the same size as
 * the number, so the list reads as a contents page rather than as cards. The
 * standfirst went with the photograph — at this size it would have made each
 * row a paragraph.
 */
export function NewsSection({ items }: { items: NewsItem[] }) {
  return (
    <section id="news" className="relative py-16 xl:py-24">
      <div className="shell flex flex-col items-center gap-12">
        <div className="relative w-full">
          <DisplayHeading reveal="clip">Latest news</DisplayHeading>
          {/* Scribble: 422.63 × 275.1 box at (749.38, 53.11) in the 1512
              frame → 629.38 from the column's left edge, −42.9 from the
              heading's top (the heading sits at y 96). */}
          <div
            className="pointer-events-none absolute hidden xl:block"
            style={{ left: 629.38, top: -42.89, width: 422.63, height: 275.1 }}
            aria-hidden
          >
            <Scribble />
          </div>
        </div>

        <ul className="m-0 flex w-full list-none flex-col p-0">
          {items.map((item, index) => (
            <li key={item.href} className="border-b border-white/10">
              <a
                href={item.href}
                data-cursor="Read"
                data-reveal="up"
                className="news-row group relative flex w-full items-center gap-6 py-6 transition-colors sm:gap-8 sm:p-8"
              >
                <span className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
                  <span
                    aria-hidden
                    className="news-index shrink-0 font-[family-name:var(--font-display)] text-[22px] font-bold uppercase leading-[34px] tracking-[-0.15px] text-content-secondary xl:text-[30px]"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="min-w-0 flex-1 font-[family-name:var(--font-display)] text-[20px] font-bold uppercase leading-[26px] tracking-[-0.15px] text-content-primary transition-colors group-hover:text-brand xl:text-[30px] xl:leading-[34px]">
                    {item.title}
                  </span>
                  <time className="shrink-0 whitespace-nowrap font-[family-name:var(--font-display)] text-[15px] leading-6 tracking-[0.085px] text-content-secondary xl:text-[17px]">
                    {item.date}
                  </time>
                </span>

                {/* 56 square: a 24px arrow in 16 of padding, on the comp's
                    30%-white hairline. */}
                <span
                  aria-hidden
                  className="flex size-14 shrink-0 items-center justify-center border border-white/30 transition-colors group-hover:border-white group-hover:bg-white/5"
                >
                  <Image
                    src="/assets/ic-arrow-right-24.svg"
                    alt=""
                    width={24}
                    height={24}
                    className="size-6"
                  />
                </span>
              </a>
            </li>
          ))}
        </ul>

        <Link
          href="/news"
          className="sweep flex items-center justify-center border-[1.5px] border-text-secondary p-6 font-[family-name:var(--font-display)] text-[16px] font-semibold uppercase leading-none text-white transition-colors hover:border-white"
          data-magnetic="0.2"
        >
          <span className="relative z-10">Load more</span>
        </Link>
      </div>
    </section>
  );
}
