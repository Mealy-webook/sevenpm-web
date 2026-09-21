import Image from "next/image";
import Link from "next/link";

import styles from "./poster.module.css";
import { festivals, homeCopy } from "@/data/home";

/**
 * Option C hero: the page opens as a pasted bill rather than as a stage.
 *
 * One yellow sheet, tilted a degree and a half and taped at two corners,
 * carries the headline in the display face at poster scale. The intro is set
 * in the margin the way a printer sets the small copy — a rule above it, a
 * run of small caps, no more than a column wide.
 *
 * Three festival posters are pinned around it at angles. They are the same
 * artwork the rest of the page uses, so the hero is not decoration: it is the
 * first sight of what the page is about.
 */
export function PosterHero() {
  const pinned = festivals.slice(0, 3);

  return (
    <section className={`${styles.wall} relative isolate overflow-hidden`}>
      {/* The pinned bills, behind the sheet. Hidden on phones, where there is
          no wall to pin them to. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 hidden xl:block">
        {pinned.map((festival, index) => {
          const spots = [
            "left-[2%] top-[14%] w-[190px] -rotate-6",
            "right-[3%] top-[8%] w-[220px] rotate-[7deg]",
            "right-[9%] bottom-[6%] w-[170px] -rotate-[9deg]",
          ];
          return (
            <span
              key={festival.id}
              className={`${styles.pinned} absolute block ${spots[index]}`}
            >
              <Image
                src={festival.poster.src}
                alt=""
                width={festival.poster.width}
                height={festival.poster.height}
                className="h-auto w-full"
              />
            </span>
          );
        })}
      </div>

      <div className="shell relative flex min-h-[min(86svh,760px)] flex-col justify-center py-16 xl:py-24">
        <div
          className={`${styles.inked} ${styles.taped} relative mx-auto w-full max-w-[1020px] -rotate-[1.5deg] px-6 py-10 text-[#0b0b0e] sm:px-12 sm:py-14`}
        >
          {/* Printer's marks, top-left and bottom-right of the sheet. */}
          <span aria-hidden className={`${styles.crop} left-3 top-3 border-b-0 border-r-0`} />
          <span
            aria-hidden
            className={`${styles.crop} bottom-3 right-3 border-l-0 border-t-0`}
          />

          <p className="m-0 flex items-center gap-3 font-[family-name:var(--font-display)] text-[12px] font-bold uppercase leading-4 tracking-[3px]">
            Sevenpm
            <span aria-hidden className="h-px flex-1 bg-[#0b0b0e]/40" />
            Casablanca
          </p>

          <div className="mt-6 flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
            <h1 className="m-0 font-daltown text-[clamp(56px,9vw,148px)] uppercase leading-[0.84]">
              {homeCopy.heroLead}
              <br />
              {homeCopy.heroWords[0]}
              <br />
              <span className="text-[#0b0b0e]/35">{homeCopy.heroWords[1]}</span>
            </h1>

            {/* The bill's index: what is on this year, printed small in the
                margin the way a programme lists its nights. */}
            <ol className="m-0 flex w-full shrink-0 list-none flex-col gap-0 p-0 lg:w-[300px]">
              {festivals.map((festival, index) => (
                <li
                  key={festival.id}
                  className="flex items-baseline gap-3 border-t border-[#0b0b0e]/25 py-2 last:border-b"
                >
                  <span className="font-[family-name:var(--font-display)] text-[12px] font-bold leading-4 tracking-[2px] text-[#0b0b0e]/50">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="flex-1 font-[family-name:var(--font-display)] text-[15px] font-semibold uppercase leading-[22px] tracking-[0.5px]">
                    {festival.name}
                  </span>
                </li>
              ))}
            </ol>
          </div>

          <div className="mt-10 flex flex-col gap-6 border-t-2 border-[#0b0b0e]/25 pt-6 lg:flex-row lg:items-end lg:justify-between">
            <p className="m-0 max-w-[560px] font-[family-name:var(--font-display)] text-[15px] leading-[22px] text-[#0b0b0e]/80">
              {homeCopy.intro}
            </p>
            <Link
              href="#festivals"
              className="flex shrink-0 items-center justify-center bg-[#0b0b0e] px-6 py-4 font-[family-name:var(--font-display)] text-[15px] font-semibold uppercase leading-[22px] tracking-[1.5px] text-[#f4f1e8] transition-colors hover:bg-[#0b0b0e]/85"
            >
              See the festivals
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
