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
        {/* Centred, with the loop drawn round NEWS itself: the word is its
            own box and the scribble is centred on it, sized in em, so it
            stays on the word at every width. It used to be placed at fixed
            pixel offsets from an older, left-aligned comp, and once the
            title was centred and scaled with the type it drifted off to the
            right of the word. */}
        <DisplayHeading reveal="clip" animate={false}>
          Latest{" "}
          <span className="relative inline-block">
            News
            <span aria-hidden className="pointer-events-none absolute inset-0">
              <Scribble />
            </span>
          </span>
        </DisplayHeading>

        <NewsHoverList items={items} />

        <Link
          href="/news"
          className="sweep flex items-center justify-center border-[1.5px] border-text-secondary p-6 font-[family-name:var(--font-display)] text-body font-semibold uppercase leading-none text-white transition-colors hover:border-white"
          data-magnetic="0.2"
        >
          <span className="relative z-10">Load more</span>
        </Link>
      </div>
    </section>
  );
}
