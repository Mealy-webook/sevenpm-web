"use client";

import Image from "next/image";
import Link from "next/link";

import type { NewsArticle } from "@/data/news";

/**
 * Option D — Bands.
 *
 * No cards and no grid: each story is a band across the whole screen with the
 * headline set at display size, and the photograph lives behind it, revealed
 * only where the cursor is. At rest the page is a stack of headlines, which
 * is how a reader actually scans a newsroom.
 *
 * The reveal is a mask that follows the pointer, not an image that fades in:
 * the picture is already there, the band simply stops hiding it.
 */
export function NewsBands({ articles }: { articles: NewsArticle[] }) {
  return (
    <ul className="m-0 flex list-none flex-col p-0">
      {articles.map((article, index) => (
        <li key={article.slug} className="border-t border-white/10 last:border-b">
          <Link
            href={`/news/${article.slug}`}
            data-cursor="Read"
            className="news-band group relative flex w-full items-center gap-6 overflow-hidden px-1 py-8 xl:py-12"
            onPointerMove={(event) => {
              const el = event.currentTarget;
              const rect = el.getBoundingClientRect();
              el.style.setProperty("--x", `${event.clientX - rect.left}px`);
              el.style.setProperty("--y", `${event.clientY - rect.top}px`);
            }}
          >
            {/* The photograph, held behind a circle that follows the cursor. */}
            <span
              aria-hidden
              className="news-band-photo pointer-events-none absolute inset-0 block opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            >
              <Image
                src={article.image}
                alt=""
                fill
                sizes="100vw"
                className="object-cover brightness-[0.45]"
              />
            </span>

            <span
              aria-hidden
              className="relative z-[1] w-10 shrink-0 font-[family-name:var(--font-display)] text-[13px] font-bold leading-6 tracking-[1px] text-content-secondary"
            >
              {String(index + 1).padStart(2, "0")}
            </span>

            <span className="relative z-[1] flex min-w-0 flex-1 flex-col gap-2">
              <span className="font-daltown text-[clamp(26px,4vw,64px)] uppercase leading-[0.95] text-white transition-colors group-hover:text-brand">
                {article.title}
              </span>
              <span className="font-[family-name:var(--font-display)] text-[12px] font-bold uppercase leading-4 tracking-[2px] text-content-secondary">
                {article.category} · {article.dateLabel} · {article.readingTime}
              </span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
