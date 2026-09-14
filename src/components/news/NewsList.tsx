"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import type { NewsArticle } from "@/data/news";
import { newsCategories, newsCopy } from "@/data/news";

/**
 * The newsroom index: category chips (the account screens' chip) over a grid
 * of article cards. Cards are the homepage's paper cards, shrunk to two
 * columns and given the image on top.
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
        className="m-0 grid list-none grid-cols-1 gap-8 p-0 md:grid-cols-2"
        data-reveal="up"
        data-reveal-stagger
      >
        {shown.map((article) => (
          <li key={article.slug}>
            <Link
              href={`/news/${article.slug}`}
              data-cursor="Read"
              className="news-card group relative flex h-full flex-col gap-4 bg-white p-6"
            >
              <span className="relative block aspect-[16/10] w-full overflow-hidden bg-[#27272a]">
                <Image
                  src={article.image}
                  alt=""
                  fill
                  sizes="(min-width: 768px) 45vw, 90vw"
                  className="news-image object-cover"
                />
              </span>
              <span className="relative flex flex-1 flex-col gap-3">
                <span className="flex items-center gap-3 font-[family-name:var(--font-display)] text-[13px] font-semibold uppercase leading-5 tracking-[1.56px] text-[#56565d]">
                  {article.category}
                  <span aria-hidden>·</span>
                  <time dateTime={article.date}>{article.dateLabel}</time>
                </span>
                <span className="font-[family-name:var(--font-display)] text-[22px] font-bold uppercase leading-7 tracking-[-0.11px] text-[#18181b]">
                  {article.title}
                </span>
                <span className="font-[family-name:var(--font-display)] text-[17px] leading-6 tracking-[0.085px] text-[#56565d]">
                  {article.excerpt}
                </span>
                <span className="mt-auto pt-2 font-[family-name:var(--font-display)] text-[13px] font-semibold uppercase leading-5 tracking-[1.56px] text-[#18181b] underline decoration-transparent underline-offset-4 transition-colors group-hover:decoration-current">
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
