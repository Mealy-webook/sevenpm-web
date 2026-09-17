import Image from "next/image";

import type { EventDetails } from "@/data/events";

/**
 * Partners, from Figma 2279:20300: "Official sponsor" over a grid of square
 * cells divided by hairlines, five across the 1272 column at 254.4 each.
 *
 * The comp fills fifteen cells from four sponsors by repeating them, so the
 * grid is tiled from the list rather than ending after one short row. It
 * always completes whole rows, which is the only way the hairlines read as a
 * grid instead of as a torn edge.
 *
 * The rules are drawn with a 1px gap over a lit background rather than borders
 * on the cells. Borders would need the first column and last row suppressed,
 * and those change with the breakpoint; a gap is internal by construction.
 */

/** The comp's cell, and 5 × 254.4 is exactly the 1272 column. */
const COLUMNS = 5;
const ROWS = 3;

export function SponsorsSection({ event }: { event: EventDetails }) {
  const { sponsors } = event;
  if (!sponsors.length) return null;

  const cells = Array.from(
    { length: COLUMNS * ROWS },
    (_, i) => sponsors[i % sponsors.length],
  );

  return (
    <section id="sponsors" className="section-screen relative py-16 xl:py-24">
      <div className="shell flex flex-col items-center gap-8" data-reveal="up">
        <p className="m-0 text-center font-[family-name:var(--font-display)] text-2xl font-black uppercase leading-[46px] text-brand">
          Official sponsor
        </p>

        <ul className="m-0 grid w-full list-none grid-cols-2 gap-px bg-white/5 p-0 sm:grid-cols-3 xl:grid-cols-5">
          {cells.map((sponsor, index) => (
            <li
              key={`${sponsor.name}-${index}`}
              className="flex aspect-square items-center justify-center bg-bg-primary p-6"
            >
              <Image
                src={sponsor.logo}
                /* Named once. The repeats are the same four marks over again,
                   and a screen reader listing them fifteen times is noise. */
                alt={index < sponsors.length ? sponsor.name : ""}
                aria-hidden={index >= sponsors.length}
                width={250}
                height={50}
                className="max-h-[50px] w-auto max-w-[250px] object-contain"
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
