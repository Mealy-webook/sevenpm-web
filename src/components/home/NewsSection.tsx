import Link from "next/link";

import type { NewsItem } from "@/data/home";
import { DisplayHeading } from "@/components/ui/DisplayHeading";
import { NewsHoverList } from "./NewsHoverList";
import { Scribble } from "./Scribble";

/**
 * "Latest news", from Figma 2231:12467 as redrawn in the 15:202 homepage.
 *
 * The photographs are gone. A row is now its number, the headline, the date
 * and a square arrow button — four of them, hairline-ruled, on the page's own
 * dark ground, with "Load more" underneath. A hand-drawn yellow loop circles
 * "NEWS" in the title.
 *
 * The photographs are not gone so much as moved: `NewsHoverList` carries them
 * on a thumbnail that rides the cursor, one frame per row. The standfirst went
 * with them — at this headline size every row would have been a paragraph.
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

        <NewsHoverList items={items} />

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
