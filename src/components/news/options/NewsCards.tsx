"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import type { NewsArticle } from "@/data/news";
import { newsCategories } from "@/data/news";

/**
 * Option E — Filed.
 *
 * The archive as a drawer of index cards: warm stock, a category tab along
 * the top edge, a date stamped in the corner, the headline typed on it, and a
 * clipped photograph. Cards sit a degree or two off square and straighten
 * under the cursor.
 *
 * It is the artefact language the homepage option E uses, applied to the one
 * part of the site that really is an archive.
 */
export function NewsCards({ articles }: { articles: NewsArticle[] }) {
  const [category, setCategory] = useState<string>(newsCategories[0]);
  const shown =
    category === newsCategories[0]
      ? articles
      : articles.filter((a) => a.category === category);

  return (
    <div className="flex flex-col gap-10">
      <div
        role="tablist"
        aria-label="Article category"
        className="flex flex-wrap gap-2"
      >
        {newsCategories.map((label) => {
          const selected = category === label;
          return (
            <button
              key={label}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => setCategory(label)}
              /* The tabs sit on the drawer, so they read as tabs: attached
                 along the bottom, not floating chips. */
              className={`flex h-9 cursor-pointer items-center px-4 font-[family-name:var(--font-display)] text-[12px] font-bold uppercase leading-4 tracking-[1.5px] transition-colors ${
                selected
                  ? "bg-[#f2efe6] text-[#18181b]"
                  : "bg-white/5 text-content-secondary hover:bg-white/10"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      <ul className="m-0 grid list-none grid-cols-1 gap-x-8 gap-y-10 p-0 sm:grid-cols-2 xl:grid-cols-3">
        {shown.map((article, index) => {
          const tilt = ["-rotate-[1.5deg]", "rotate-1", "-rotate-[0.5deg]"];
          return (
            <li key={article.slug}>
              <Link
                href={`/news/${article.slug}`}
                data-cursor="Read"
                className={`news-card-filed flex h-full flex-col gap-4 bg-[#f2efe6] p-4 text-[#18181b] ${tilt[index % tilt.length]}`}
              >
                <span className="flex items-start justify-between gap-3">
                  <span className="bg-[#18181b] px-2 py-1 font-[family-name:var(--font-display)] text-[10px] font-bold uppercase leading-3 tracking-[1.5px] text-[#f2efe6]">
                    {article.category}
                  </span>
                  <span
                    aria-hidden
                    className="flex shrink-0 items-center border-2 border-[#18181b]/25 px-2 py-1 font-[family-name:var(--font-display)] text-[10px] font-bold uppercase leading-3 tracking-[1px] text-[#18181b]/55"
                  >
                    {article.dateLabel}
                  </span>
                </span>

                <span className="relative block aspect-[4/3] w-full overflow-hidden bg-[#18181b]">
                  <Image
                    src={article.image}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 90vw, 30vw"
                    className="object-cover grayscale-[0.35] transition-[filter] duration-500 group-hover:grayscale-0"
                  />
                </span>

                <span className="font-[family-name:var(--font-display)] text-[18px] font-bold uppercase leading-6 tracking-[-0.09px]">
                  {article.title}
                </span>

                <span className="font-[family-name:var(--font-display)] text-[13px] leading-5 text-[#18181b]/70">
                  {article.excerpt}
                </span>

                <span className="mt-auto flex items-center justify-between border-t border-[#18181b]/20 pt-3 font-[family-name:var(--font-display)] text-[11px] font-bold uppercase tracking-[1.5px]">
                  Read it
                  <span className="text-[#18181b]/50">
                    {article.readingTime}
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
