"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import type { EventDetails } from "@/data/events";

/**
 * Partners, from Figma 2279:20300: "Official sponsor" over a grid of square
 * cells divided by hairlines, five across the 1272 column at 254.4 each.
 *
 * There are more sponsors than the grid has room for, so the cells turn: each
 * one flips on its horizontal axis every few seconds and comes back showing
 * the next mark in the list. A wall of fifteen cells can carry any number of
 * partners that way, and none of them is stuck in the bottom corner.
 *
 * The cells do not all turn at once — each is offset by its position, so the
 * wall ripples rather than blinking. Under prefers-reduced-motion nothing
 * turns at all and the grid simply shows the first fifteen.
 *
 * The rules are drawn with a 1px gap over a lit background rather than borders
 * on the cells. Borders would need the first column and last row suppressed,
 * and those change with the breakpoint; a gap is internal by construction.
 */

/** The comp's cell, and 5 × 254.4 is exactly the 1272 column. */
const COLUMNS = 5;
const ROWS = 3;
const CELLS = COLUMNS * ROWS;
/** How long a mark stays up before its cell turns. */
const DWELL = 4200;

export function SponsorsSection({ event }: { event: EventDetails }) {
  const { sponsors } = event;
  /* How far round the list the wall has walked. Zero means it has not
     turned yet, which is also what says "do not animate" — the first paint
     should be still, and under reduced motion it never leaves zero. */
  const [turn, setTurn] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => setTurn((n) => n + 1), DWELL);
    return () => window.clearInterval(id);
  }, []);

  if (!sponsors.length) return null;

  return (
    <section id="sponsors" className="section-screen relative py-16 xl:py-24">
      <div className="shell flex flex-col items-center gap-8" data-reveal="up">
        <p className="m-0 text-center font-[family-name:var(--font-display)] text-2xl font-black uppercase leading-[46px] text-brand">
          Official sponsor
        </p>

        <ul className="m-0 grid w-full list-none grid-cols-2 gap-px bg-white/5 p-0 sm:grid-cols-3 xl:grid-cols-5">
          {Array.from({ length: CELLS }, (_, index) => {
            /* Each cell starts on a different mark and walks the list from
               there, so neighbours are never showing the same one. */
            const sponsor = sponsors[(index + turn) % sponsors.length];
            const column = index % COLUMNS;
            const row = Math.floor(index / COLUMNS);
            return (
              <li
                key={index}
                className="sponsor-cell flex aspect-square items-center justify-center bg-bg-primary p-6"
                /* Down and across, so the turn reads as one pass over the
                   wall rather than fifteen unrelated flips. */
                style={{ "--flip-delay": `${(column + row) * 90}ms` } as React.CSSProperties}
              >
                <span
                  key={sponsor.name}
                  className={turn > 0 ? "sponsor-face" : undefined}
                >
                  <Image
                    src={sponsor.logo}
                    /* Named on the first pass only. The wall shows the same
                       few marks over and over, and a screen reader listing
                       them fifteen times is noise. */
                    alt={index < sponsors.length ? sponsor.name : ""}
                    aria-hidden={index >= sponsors.length}
                    width={250}
                    height={50}
                    className="max-h-[50px] w-auto max-w-[250px] object-contain"
                  />
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
