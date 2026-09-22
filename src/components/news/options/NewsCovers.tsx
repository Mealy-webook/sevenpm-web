"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import type { NewsArticle } from "@/data/news";
import { newsCategories } from "@/data/news";

/**
 * Option C — Covers.
 *
 * Image first: every story is a cover, the headline set over the photograph
 * and the date stamped in the corner. The tiles alternate between tall and
 * wide so the wall has a rhythm rather than a grid's regularity, and the
 * first one takes two columns because the newest story should look like it.
 *
 * The photographs are dimmed until the cursor is on them, which is what keeps
 * white type legible over a picture without a slab of scrim on every tile.
 */
export function NewsCovers({ articles }: { articles: NewsArticle[] }) {
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
        className="flex flex-wrap gap-3"
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
              className={`flex h-10 cursor-pointer items-center border px-4 font-[family-name:var(--font-display)] text-[13px] font-semibold uppercase leading-5 tracking-[1.3px] transition-colors ${
                selected
                  ? "border-brand bg-brand text-[#18181b]"
                  : "border-white/10 bg-white/5 text-content-secondary hover:text-white"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      <ul className="m-0 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2 xl:grid-cols-3">
        {shown.map((article, index) => {
          /* The newest is a double; after that, every third is tall. */
          const feature = index === 0;
          const tall = !feature && index % 3 === 1;
          return (
            <li
              key={article.slug}
              className={`${feature ? "sm:col-span-2" : ""}`}
            >
              <Link
                href={`/news/${article.slug}`}
                data-cursor="Read"
                className={`group relative block w-full overflow-hidden bg-ink-700 ${
                  feature
                    ? "aspect-[16/9]"
                    : tall
                      ? "aspect-[3/4]"
                      : "aspect-[4/3]"
                }`}
              >
                <Image
                  src={article.image}
                  alt=""
                  fill
                  sizes={
                    feature
                      ? "(max-width: 640px) 100vw, 66vw"
                      : "(max-width: 640px) 100vw, 33vw"
                  }
                  className="object-cover brightness-[0.55] transition-[scale,filter] duration-700 group-hover:scale-105 group-hover:brightness-75"
                />

                {/* A gradient only where the type sits, so the picture keeps
                    its top half. */}
                <span
                  aria-hidden
                  className="absolute inset-x-0 bottom-0 block h-2/3 bg-[linear-gradient(to_top,rgba(11,11,14,0.92),transparent)]"
                />

                <span className="absolute left-4 top-4 z-[1] flex items-center bg-[#0b0b0e]/70 px-2 py-1 font-[family-name:var(--font-display)] text-[11px] font-bold uppercase leading-4 tracking-[1.5px] text-brand">
                  {article.dateLabel}
                </span>

                <span className="absolute inset-x-4 bottom-4 z-[1] flex flex-col gap-2">
                  <span className="font-[family-name:var(--font-display)] text-[11px] font-bold uppercase leading-4 tracking-[2px] text-brand">
                    {article.category}
                  </span>
                  <span
                    className={`font-daltown uppercase leading-[0.95] text-white ${
                      feature
                        ? "text-[clamp(26px,3.4vw,48px)]"
                        : "text-[clamp(20px,2vw,28px)]"
                    }`}
                  >
                    {article.title}
                  </span>
                  {feature && (
                    <span className="max-w-[52ch] font-[family-name:var(--font-display)] text-[14px] leading-[22px] text-content-secondary">
                      {article.excerpt}
                    </span>
                  )}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
