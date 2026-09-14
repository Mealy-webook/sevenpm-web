import Image from "next/image";

import type { NewsItem } from "@/data/home";
import { DisplayHeading } from "@/components/ui/DisplayHeading";
import { NewsStack } from "./NewsStack";
import { Scribble } from "./Scribble";

/**
 * "Latest news", from Figma 15:584. Three paper cards (white with the ticket
 * paper texture, as in the comp) with a 403 × 227 image tile, and a "Load
 * more" outline button. A hand-drawn yellow loop circles "NEWS" in the title.
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

        <NewsStack>
          {items.map((item, index) => (
            <article
              key={index}
              className="news-card relative flex w-full flex-col gap-6 border-b border-border-tertiary bg-white p-6 shadow-[0_-12px_40px_rgba(0,0,0,0.35)] md:flex-row md:items-center md:gap-8"
            >
              <div className="relative flex min-w-0 flex-1 flex-col items-start justify-center gap-3">
                <time className="font-[family-name:var(--font-display)] text-[17px] leading-6 tracking-[0.085px] text-[#56565d]">
                  {item.date}
                </time>
                <h3 className="m-0 font-[family-name:var(--font-display)] text-[22px] font-bold uppercase leading-7 tracking-[-0.11px] text-[#18181b]">
                  <a href={item.href} className="news-title-link">
                    {item.title}
                  </a>
                </h3>
                <p className="m-0 font-[family-name:var(--font-display)] text-[17px] leading-6 tracking-[0.085px] text-[#56565d]">
                  {item.excerpt}
                </p>
              </div>
              <div className="relative h-[227px] w-full shrink-0 overflow-hidden bg-[#27272a] md:w-[403px]">
                {item.image && (
                  <Image
                    src={item.image}
                    alt=""
                    fill
                    sizes="(min-width: 768px) 403px, 100vw"
                    className="news-image object-cover"
                  />
                )}
              </div>
            </article>
          ))}
        </NewsStack>

        <a
          href="#news"
          className="sweep flex items-center justify-center border-[1.5px] border-text-secondary p-6 font-[family-name:var(--font-display)] text-[16px] font-semibold uppercase leading-none text-white transition-colors hover:border-white"
          data-magnetic="0.2"
        >
          <span className="relative z-10">Load more</span>
        </a>
      </div>
    </section>
  );
}
