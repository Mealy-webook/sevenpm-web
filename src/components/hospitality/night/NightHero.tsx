import Link from "next/link";

import { PhotoSlot } from "@/components/pages/PhotoSlot";
import { WordWindow } from "./WordWindow";
import { hospitalityCopy, nightCopy } from "@/data/hospitality";

/**
 * The page opens the way the night does.
 *
 * Full-bleed photograph, a time stamp in the corner, and HOSPITALITY set at
 * display size with a window cut through its O — the homepage hero's device,
 * which is what ties this page to the site rather than leaving it looking
 * like a section bolted on. Behind the word, the same picture again, darker:
 * the window looks through the type onto what is already there.
 */
export function NightHero() {
  const { stamp, title, windowAt, standfirst, primary, secondary } =
    nightCopy.hero;

  return (
    <section className="relative flex min-h-[86svh] flex-col justify-end overflow-hidden">
      <PhotoSlot
        caption={hospitalityCopy.heroPhoto}
        src={hospitalityCopy.heroImage}
        rounded={false}
        priority
        sizes="100vw"
        className="absolute inset-0 size-full"
      />

      {/* Heavy enough that white type holds anywhere on it, light enough that
          the photograph is still the thing you see first. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 block bg-[linear-gradient(to_top,rgba(11,11,14,0.94),rgba(11,11,14,0.55)_38%,rgba(11,11,14,0.25))]"
      />

      {/* The clock, top right, where a ticket prints its time. */}
      <span className="shell absolute inset-x-0 top-7 flex justify-end">
        <span className="font-[family-name:var(--font-display)] text-[12px] font-bold uppercase leading-4 tracking-[3px] text-brand">
          {stamp}
        </span>
      </span>

      <div className="shell relative flex flex-col gap-7 pb-14 xl:pb-20">
        <h1 className="sr-only">{title}</h1>

        {/* Wrapped rather than given `aria-hidden` directly: `WordWindow`
            does not spread unknown props, so the attribute would have been
            dropped and the word read out after the heading above it. */}
        <span aria-hidden className="block">
        <WordWindow
          word={title}
          at={windowAt}
          src={hospitalityCopy.heroImage}
          priority
          sizes="(min-width: 1024px) 30vw, 55vw"
          className="justify-start text-[clamp(44px,11vw,180px)] text-white"
        />
        </span>

        <p
          className="m-0 max-w-[620px] font-[family-name:var(--font-ui)] text-[17px] leading-[1.75] text-white/85 sm:text-[19px]"
          data-split="lines"
        >
          {standfirst}
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href={primary.href}
            data-magnetic="0.2"
            className="sweep flex items-center bg-brand px-5 py-4 font-[family-name:var(--font-display)] text-[16px] font-semibold leading-6 text-[#0b0b0e]"
          >
            <span className="relative z-10">{primary.label}</span>
          </Link>
          <Link
            href={secondary.href}
            className="btn-secondary flex items-center border border-white/35 px-5 py-4 font-[family-name:var(--font-display)] text-[16px] font-semibold leading-6 text-white backdrop-blur-sm transition-colors hover:border-white"
          >
            {secondary.label}
          </Link>
        </div>
      </div>
    </section>
  );
}
