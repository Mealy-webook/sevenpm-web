"use client";

import Link from "next/link";

import { PhotoSlot } from "@/components/pages/PhotoSlot";
import { hospitalityPackages, hospitalityCopy } from "@/data/hospitality";

/**
 * Direction P — chapters.
 *
 * One package per screen, snapping as you scroll: the picture full-bleed
 * behind, the name and the terms over it, nothing else competing. The
 * closest thing here to how the festival itself is sold — one act at a time,
 * at full size.
 *
 * Scroll snapping is applied to this section only, not the document, and
 * `proximity` rather than `mandatory`: a mandatory snap on a long page
 * fights anyone trying to scroll past it, and on a trackpad it feels like
 * the page is holding on to you. Proximity settles a screen you have nearly
 * landed on and lets you fly past if you meant to.
 *
 * Each chapter is `svh` rather than `vh` so a phone's shrinking address bar
 * does not leave the terms cropped off the bottom.
 */
export function SnapChapters() {
  return (
    <section
      id="packages"
      className="relative scroll-mt-24 snap-y snap-proximity"
    >
      {hospitalityPackages.map((entry, index) => (
        <article
          key={entry.slug}
          className="relative flex h-[88svh] min-h-[520px] snap-start items-end overflow-hidden"
        >
          <PhotoSlot
            caption={entry.photo}
            src={entry.image}
            rounded={false}
            priority={index === 0}
            sizes="100vw"
            className="absolute inset-0 size-full"
          />

          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 block bg-[linear-gradient(to_top,rgba(11,11,14,0.95),rgba(11,11,14,0.4)_38%,rgba(11,11,14,0.1)_70%)]"
          />

          <div className="shell relative w-full pb-14 xl:pb-20">
            <div className="flex flex-col gap-5">
              <span className="font-[family-name:var(--font-display)] text-[12px] font-bold uppercase leading-4 tracking-[3px] text-brand">
                {String(index + 1).padStart(2, "0")} /{" "}
                {String(hospitalityPackages.length).padStart(2, "0")} ·{" "}
                {entry.festival}
              </span>

              <h3 className="m-0 font-daltown text-[clamp(34px,7.65vw,119px)] uppercase leading-[0.86] text-white">
                {entry.name}
              </h3>

              <p className="m-0 max-w-[560px] font-[family-name:var(--font-ui)] text-[15px] leading-[1.7] text-white/80">
                {entry.summary}
              </p>

              {/* The terms on one rule, so the chapter carries everything a
                  decision needs without a panel. */}
              <div className="flex flex-wrap items-end gap-x-10 gap-y-4 border-t border-white/25 pt-5">
                <span className="flex flex-col gap-0.5">
                  <span className="font-[family-name:var(--font-ui)] text-[13px] leading-5 text-white/50">
                    {hospitalityCopy.packages.from}
                  </span>
                  <span className="font-[family-name:var(--font-display)] text-[21px] font-black leading-7 text-brand">
                    {entry.price}
                  </span>
                  <span className="font-[family-name:var(--font-ui)] text-[13px] leading-5 text-white/50">
                    {entry.perUnit}
                  </span>
                </span>

                <span className="flex flex-col gap-0.5">
                  <span className="font-[family-name:var(--font-ui)] text-[13px] leading-5 text-white/50">
                    Capacity
                  </span>
                  <span className="font-[family-name:var(--font-display)] text-[16px] font-semibold leading-7 text-white">
                    {entry.capacity}
                  </span>
                </span>

                <Link
                  href={`/hospitality/${entry.slug}`}
                  className="sweep flex items-center bg-brand px-5 py-3.5 font-[family-name:var(--font-display)] text-[14px] font-semibold leading-6 text-[#0b0b0e]"
                >
                  <span className="relative z-10">
                    {hospitalityCopy.packages.discover}
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </article>
      ))}

      <div className="shell py-7">
        <p className="m-0 font-[family-name:var(--font-ui)] text-[13px] leading-[1.6] text-white/45">
          {hospitalityCopy.priceNote}
        </p>
      </div>
    </section>
  );
}
