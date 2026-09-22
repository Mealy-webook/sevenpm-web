"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import type { NewsArticle } from "@/data/news";

/**
 * Option F — Reader.
 *
 * The index and the story share a screen: headlines down the left, and the
 * one you pick opens on the right with its photograph, its standfirst and
 * the first paragraphs. Choosing a headline changes the pane; the full story
 * is a click away from there.
 *
 * It suits a newsroom with a handful of stories: nobody has to leave the
 * index to find out whether a piece is worth reading, which is the thing a
 * grid of cards makes you do eight times.
 *
 * Below `lg` there is no room for two panes, so the list carries its own
 * summaries and the pane is gone.
 */
export function NewsReader({ articles }: { articles: NewsArticle[] }) {
  const [active, setActive] = useState(0);
  const open = articles[active];

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,380px)_1fr] lg:items-start lg:gap-14">
      {/* The index */}
      <ul className="m-0 flex list-none flex-col p-0 lg:sticky lg:top-[calc(var(--header-h,0px)+32px)]">
        {articles.map((article, index) => {
          const selected = index === active;
          return (
            <li key={article.slug} className="border-b border-white/10">
              <button
                type="button"
                onClick={() => setActive(index)}
                aria-current={selected ? "true" : undefined}
                className={`flex w-full cursor-pointer flex-col items-start gap-1 py-4 text-left transition-colors ${
                  selected ? "text-white" : "text-content-secondary hover:text-white"
                }`}
              >
                <span className="flex w-full items-center gap-3 font-[family-name:var(--font-display)] text-[11px] font-bold uppercase leading-4 tracking-[2px]">
                  <span className={selected ? "text-brand" : ""}>
                    {article.category}
                  </span>
                  <span aria-hidden className="h-px flex-1 bg-white/10" />
                  {article.dateLabel}
                </span>
                <span className="font-[family-name:var(--font-display)] text-[17px] font-bold uppercase leading-6 tracking-[-0.09px]">
                  {article.title}
                </span>
                {/* No pane on a phone, so the summary rides in the list. */}
                <span className="font-[family-name:var(--font-display)] text-[13px] leading-5 text-content-secondary lg:hidden">
                  {article.excerpt}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      {/* The pane */}
      {open && (
        <article className="hidden flex-col gap-6 lg:flex">
          <span className="relative block aspect-[16/10] w-full overflow-hidden bg-ink-700">
            <Image
              key={open.slug}
              src={open.image}
              alt=""
              fill
              sizes="60vw"
              className="object-cover"
              priority
            />
          </span>

          <h2 className="m-0 font-daltown text-[clamp(30px,3.4vw,52px)] uppercase leading-[0.95] text-white">
            {open.title}
          </h2>

          <p className="m-0 font-[family-name:var(--font-display)] text-[17px] leading-7 text-content-primary">
            {open.excerpt}
          </p>

          {open.body.slice(1, 3).map((paragraph) => (
            <p
              key={paragraph.slice(0, 32)}
              className="m-0 font-[family-name:var(--font-display)] text-[15px] leading-7 text-content-secondary"
            >
              {paragraph}
            </p>
          ))}

          <Link
            href={`/news/${open.slug}`}
            className="flex w-fit items-center bg-white px-5 py-4 font-[family-name:var(--font-display)] text-[15px] font-semibold uppercase leading-[22px] tracking-[1.5px] text-[#18181b] transition-colors hover:bg-brand"
          >
            Read the full story
          </Link>
        </article>
      )}
    </div>
  );
}
