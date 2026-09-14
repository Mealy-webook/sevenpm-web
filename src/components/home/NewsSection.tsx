import Image from "next/image";
import Link from "next/link";

import type { NewsItem } from "@/data/home";
import { DisplayHeading } from "@/components/ui/DisplayHeading";
import { Scribble } from "./Scribble";

/**
 * "Latest news", from Figma 2231:12467. Three rows on the page's own dark
 * ground: a 403 × 227 photograph on the left, then the date, the headline and
 * the standfirst, with a hairline between rows and a "Load more" outline
 * button underneath. A hand-drawn yellow loop circles "NEWS" in the title.
 *
 * This replaces the white stacking cards the earlier comp used; the updated
 * frame is a flat list.
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
            <li
              key={index}
              className={
                index > 0 ? "border-t-[0.5px] border-white/10" : undefined
              }
            >
              <a
                href={item.href}
                data-cursor="Read"
                data-reveal="up"
                className="news-row group relative flex w-full flex-col gap-6 py-6 transition-colors md:flex-row md:items-center md:gap-8"
              >
                <span className="relative block h-[227px] w-full shrink-0 overflow-hidden bg-[#27272a] md:w-[403px]">
                  {item.image && (
                    <Image
                      src={item.image}
                      alt=""
                      fill
                      sizes="(min-width: 768px) 403px, 100vw"
                      className="news-image object-cover"
                    />
                  )}
                </span>

                <span
                  aria-hidden
                  className="news-index hidden shrink-0 self-start pt-1 font-daltown text-[40px] leading-none text-white/20 xl:block"
                >
                  {String(index + 1).padStart(2, "0")}
                </span>

                <span className="flex min-w-0 flex-1 flex-col justify-center gap-3">
                  <time className="font-[family-name:var(--font-display)] text-[12px] leading-6 tracking-[0.12px] text-content-secondary">
                    {item.date}
                  </time>
                  <span className="font-[family-name:var(--font-display)] text-[20px] font-bold uppercase leading-7 tracking-[-0.11px] text-white transition-colors group-hover:text-brand xl:text-[22px]">
                    {item.title}
                  </span>
                  <span className="font-[family-name:var(--font-display)] text-[15px] leading-6 tracking-[0.15px] text-content-secondary">
                    {item.excerpt}
                  </span>
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
