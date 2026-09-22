"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import type { NewsArticle } from "@/data/news";

/**
 * Option B — Timeline.
 *
 * A newsroom is a chronology, so this one is dated rather than filtered: the
 * stories run down a rail grouped by month, each row carrying its day, its
 * category and its headline.
 *
 * The photograph is not in the row. It sits in a panel on the right that
 * changes to whichever row is under the cursor, which keeps the list dense
 * and still shows the picture — the one thing a headline cannot do.
 *
 * Below `lg` there is no room for the panel and no cursor to drive it, so
 * each row carries its own thumbnail instead.
 */

const MONTH = new Intl.DateTimeFormat("en-GB", {
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});
const DAY = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  timeZone: "UTC",
});

export function NewsTimeline({ articles }: { articles: NewsArticle[] }) {
  const [active, setActive] = useState(0);

  /* Grouped in order: the data is already newest first. */
  const groups: { month: string; items: NewsArticle[] }[] = [];
  articles.forEach((article) => {
    const month = MONTH.format(new Date(article.date));
    const last = groups.at(-1);
    if (last && last.month === month) last.items.push(article);
    else groups.push({ month, items: [article] });
  });

  let running = -1;

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_400px] lg:items-start lg:gap-16">
      <div className="flex flex-col gap-10">
        {groups.map((group) => (
          <section key={group.month} className="flex flex-col gap-2">
            <h2 className="m-0 flex items-center gap-4 font-[family-name:var(--font-display)] text-[12px] font-bold uppercase leading-4 tracking-[3px] text-brand">
              {group.month}
              <span aria-hidden className="h-px flex-1 bg-white/15" />
            </h2>

            <ul className="m-0 flex list-none flex-col p-0">
              {group.items.map((article) => {
                running += 1;
                const index = running;
                return (
                  <li key={article.slug} className="border-b border-white/10">
                    <Link
                      href={`/news/${article.slug}`}
                      onMouseEnter={() => setActive(index)}
                      onFocus={() => setActive(index)}
                      className="group flex items-start gap-5 py-5"
                      data-cursor="Read"
                    >
                      <span
                        aria-hidden
                        className="w-8 shrink-0 font-daltown text-[28px] leading-7 text-content-secondary transition-colors group-hover:text-brand"
                      >
                        {DAY.format(new Date(article.date))}
                      </span>

                      {/* The picture travels with the row on a phone. */}
                      <span className="relative block h-16 w-20 shrink-0 overflow-hidden bg-ink-700 lg:hidden">
                        <Image
                          src={article.image}
                          alt=""
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      </span>

                      <span className="flex min-w-0 flex-1 flex-col gap-1">
                        <span className="font-[family-name:var(--font-display)] text-[17px] font-bold uppercase leading-6 tracking-[-0.09px] text-white transition-colors group-hover:text-brand lg:text-[20px] lg:leading-7">
                          {article.title}
                        </span>
                        <span className="font-[family-name:var(--font-display)] text-[12px] uppercase leading-4 tracking-[1.5px] text-content-secondary">
                          {article.category} · {article.readingTime}
                        </span>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>

      {/* The panel: one frame per story, the active one on top. */}
      <div className="sticky top-[calc(var(--header-h,0px)+32px)] hidden lg:block">
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-ink-700">
          {articles.map((article, index) => (
            <span
              key={article.slug}
              className="absolute inset-0 block transition-opacity duration-500"
              style={{ opacity: index === active ? 1 : 0 }}
            >
              <Image
                src={article.image}
                alt=""
                fill
                sizes="400px"
                className="object-cover"
              />
            </span>
          ))}
        </div>
        <p className="m-0 mt-4 font-[family-name:var(--font-display)] text-[13px] leading-5 text-content-secondary">
          {articles[active]?.excerpt}
        </p>
      </div>
    </div>
  );
}
