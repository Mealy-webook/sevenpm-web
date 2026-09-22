"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import type { NewsArticle } from "@/data/news";
import { newsCategories, newsCopy } from "@/data/news";

/**
 * The newsroom index: category chips (the account screens' chip) over a grid
 * of article cards.
 *
 * The cards used to be white paper, borrowed from the homepage. On a site
 * this dark a block of white is a hole in the page, so they sit on the
 * elevated fill with a hairline instead, and the brand edge that used to be
 * implied by the paper is drawn along the top on hover.
 *
 * Three columns from 1280 up, which lands each card at 403px on the 1272
 * column — the same width the homepage gives a news photograph. At two columns
 * a card was over 600px wide with a 390px image, which read as a feature
 * rather than as one item in an index.
 */
export function NewsList({ articles }: { articles: NewsArticle[] }) {
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
        data-reveal="up"
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
              className={`flex h-10 cursor-pointer items-center justify-center border p-3 font-[family-name:var(--font-display)] text-[15px] font-semibold leading-[22px] tracking-[0.19px] text-content-primary transition-colors ${
                selected
                  ? "border-content-primary bg-white/10"
                  : "border-white/10 bg-white/5 hover:bg-white/10"
              }`}
            >
              <span className="px-1">{label}</span>
            </button>
          );
        })}
      </div>

      <ul
        className="m-0 grid list-none grid-cols-1 gap-6 p-0 md:grid-cols-2 xl:grid-cols-3"
        data-reveal="up"
        data-reveal-stagger
      >
        {shown.map((article) => (
          <li key={article.slug}>
            <Link
              href={`/news/${article.slug}`}
              data-cursor="Read"
              className="news-card group relative flex h-full flex-col gap-4 border border-white/10 bg-bg-secondary p-5 transition-colors hover:border-white/25"
            >
              <span className="relative block aspect-[16/10] w-full overflow-hidden bg-[#27272a]">
                <Image
                  src={article.image}
                  alt=""
                  fill
                  sizes="(min-width: 1280px) 30vw, (min-width: 768px) 45vw, 90vw"
                  className="news-image object-cover"
                />
              </span>
              <span className="relative flex flex-1 flex-col gap-3">
                <span className="flex items-center gap-3 font-[family-name:var(--font-display)] text-[13px] font-semibold uppercase leading-5 tracking-[1.56px] text-brand">
                  {article.category}
                  <span aria-hidden>·</span>
                  <time dateTime={article.date}>{article.dateLabel}</time>
                </span>
                <span className="font-[family-name:var(--font-display)] text-[18px] font-bold uppercase leading-6 tracking-[-0.09px] text-white transition-colors group-hover:text-brand">
                  {article.title}
                </span>
                {/* Clamped so a long standfirst cannot make one card in a row
                    taller than the rest of it. */}
                <span className="line-clamp-3 font-[family-name:var(--font-display)] text-[15px] leading-[22px] tracking-[0.15px] text-content-secondary">
                  {article.excerpt}
                </span>
                <span className="mt-auto pt-2 font-[family-name:var(--font-display)] text-[13px] font-semibold uppercase leading-5 tracking-[1.56px] text-content-primary underline decoration-transparent underline-offset-4 transition-colors group-hover:decoration-current">
                  {newsCopy.readMore}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
