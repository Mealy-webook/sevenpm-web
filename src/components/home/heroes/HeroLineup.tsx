"use client";

import Image from "next/image";
import { useState } from "react";

import { festivals, festivalsRowOrder } from "@/data/home";

/**
 * B · The line-up is the hero.
 *
 * No picture behind anything and no centred name: the four festivals are
 * four rows at display size filling the screen, ruled like a bill. Hovering
 * one floods it brand and brings its poster up on the right.
 *
 * The argument for it is that the first screen answers what SEVENPM is
 * putting on rather than what it feels like, and every row is a link — the
 * hero is also the navigation.
 *
 * The flood is a scaled pseudo-element rather than a background colour, the
 * same idiom the news rows use, so the fill wipes up from the baseline
 * instead of snapping on.
 */
export function HeroLineup() {
  const rows = festivalsRowOrder
    .map((id) => festivals.find((f) => f.id === id))
    .filter((f): f is (typeof festivals)[number] => Boolean(f));
  const [live, setLive] = useState<string | null>(null);
  const shown = rows.find((f) => f.id === live);

  return (
    <section className="relative flex h-svh w-full flex-col justify-center overflow-hidden bg-bg-primary">
      <ul className="m-0 flex list-none flex-col p-0">
        {rows.map((festival) => (
          <li
            key={festival.id}
            className="border-t border-white/12 last:border-b"
          >
            <a
              href={festival.href}
              onMouseEnter={() => setLive(festival.id)}
              onMouseLeave={() => setLive(null)}
              onFocus={() => setLive(festival.id)}
              onBlur={() => setLive(null)}
              className="news-row relative flex items-baseline justify-between gap-6 px-[var(--shell-gutter)] py-[clamp(10px,2.2vh,26px)]"
            >
              <span className="news-headline font-daltown text-[clamp(30px,7vw,104px)] uppercase leading-[0.86] tracking-[0.01em] text-white">
                {festival.name}
              </span>
              <span className="news-date shrink-0 font-[family-name:var(--font-display)] text-[13px] font-bold uppercase leading-5 tracking-[1.5px] text-content-secondary">
                {festival.when ?? festival.city}
              </span>
            </a>
          </li>
        ))}
      </ul>

      {/* The poster for whichever row is live, parked off to the right. */}
      <div
        aria-hidden
        className="pointer-events-none absolute right-[var(--shell-gutter)] top-1/2 hidden h-[52vh] w-[22vw] max-w-[300px] -translate-y-1/2 xl:block"
      >
        {rows.map((festival) => (
          <span
            key={festival.id}
            className="absolute inset-0 block transition-opacity duration-500"
            style={{ opacity: shown?.id === festival.id ? 1 : 0 }}
          >
            <Image
              src={festival.card ?? "/assets/gallery-2.jpg"}
              alt=""
              fill
              sizes="300px"
              className="object-cover"
            />
          </span>
        ))}
      </div>
    </section>
  );
}
