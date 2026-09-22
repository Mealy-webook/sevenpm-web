"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import type { NewsArticle } from "@/data/news";
import { newsCategories } from "@/data/news";

/**
 * Option A — Broadsheet.
 *
 * A front page rather than a grid: the most recent story runs the width of
 * the column with its photograph and standfirst, and everything after it is
 * an index — numbered, ruled, dated, two to a row. The lead earns its size by
 * being the only thing at that size.
 *
 * The filter is the same chip set, because the categories are the paper's
 * sections and a front page still has them.
 */
export function NewsBroadsheet({ articles }: { articles: NewsArticle[] }) {
  const [category, setCategory] = useState<string>(newsCategories[0]);
  const shown =
    category === newsCategories[0]
      ? articles
      : articles.filter((a) => a.category === category);

  const [lead, ...rest] = shown;

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
                  ? "border-content-primary bg-white/10 text-white"
                  : "border-white/10 bg-white/5 text-content-secondary hover:text-white"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {lead && (
        <Link
          href={`/news/${lead.slug}`}
          className="group flex flex-col gap-6 border-b border-white/10 pb-10 lg:flex-row lg:items-end"
          data-cursor="Read"
        >
          <span className="relative block aspect-[16/9] w-full overflow-hidden bg-ink-700 lg:w-[62%]">
            <Image
              src={lead.image}
              alt=""
              fill
              sizes="(max-width: 1024px) 100vw, 62vw"
              className="object-cover transition-[scale] duration-700 group-hover:scale-[1.03]"
              priority
            />
          </span>

          <span className="flex min-w-0 flex-1 flex-col gap-4">
            <span className="flex items-center gap-3 font-[family-name:var(--font-display)] text-[12px] font-bold uppercase leading-4 tracking-[2px] text-brand">
              {lead.category}
              <span aria-hidden className="h-px flex-1 bg-white/15" />
              <span className="text-content-secondary">{lead.dateLabel}</span>
            </span>
            <span className="font-daltown text-[clamp(32px,4.4vw,64px)] uppercase leading-[0.92] text-white transition-colors group-hover:text-brand">
              {lead.title}
            </span>
            <span className="font-[family-name:var(--font-display)] text-[15px] leading-[24px] text-content-secondary">
              {lead.excerpt}
            </span>
            <span className="font-[family-name:var(--font-display)] text-[12px] font-bold uppercase leading-4 tracking-[2px] text-content-secondary">
              {lead.readingTime}
            </span>
          </span>
        </Link>
      )}

      <ul className="m-0 grid list-none grid-cols-1 gap-x-12 p-0 lg:grid-cols-2">
        {rest.map((article, index) => (
          <li key={article.slug} className="border-b border-white/10">
            <Link
              href={`/news/${article.slug}`}
              className="group flex items-start gap-5 py-6"
              data-cursor="Read"
            >
              <span
                aria-hidden
                className="shrink-0 font-[family-name:var(--font-display)] text-[13px] font-bold leading-6 tracking-[1px] text-content-secondary"
              >
                {String(index + 2).padStart(2, "0")}
              </span>
              <span className="flex min-w-0 flex-1 flex-col gap-2">
                <span className="font-[family-name:var(--font-display)] text-[19px] font-bold uppercase leading-7 tracking-[-0.1px] text-white transition-colors group-hover:text-brand">
                  {article.title}
                </span>
                <span className="flex flex-wrap items-center gap-x-3 font-[family-name:var(--font-display)] text-[12px] uppercase leading-4 tracking-[1.5px] text-content-secondary">
                  {article.category}
                  <span aria-hidden className="size-[3px] bg-white/30" />
                  {article.dateLabel}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
