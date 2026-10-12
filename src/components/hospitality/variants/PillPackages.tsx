"use client";

import Image from "next/image";
import Link from "next/link";

import { DisplayHeading } from "@/components/ui/DisplayHeading";
import { hospitalityCopy, hospitalityPackages } from "@/data/hospitality";

/**
 * Direction C — the hero's motif carried down the page.
 *
 * Every package name is set in Daltown with a pill-shaped window cut through
 * the line and its picture dropped into the hole, exactly as MORE carries the
 * crowd in the homepage hero. The window is sized as a multiple of the type,
 * so it holds its place in the word at any width — the same arithmetic the
 * hero uses.
 *
 * The rows alternate the window's side so the page does not march, and the
 * price sits under the name rather than in a panel: this direction has no
 * cards at all.
 *
 * It is the strongest continuity with the hero and the hungriest for
 * photography — each window is a separate picture, and until the shoot
 * happens they are stand-ins from the festival library.
 */

/** The hero's own geometry, as ratios of the type size. */
const PILL = { width: 1.75, height: 0.665, gap: 0.02 };

export function PillPackages() {
  const { eyebrow, title, from, discover } = hospitalityCopy.packages;

  return (
    <section id="packages" className="relative scroll-mt-24 py-14 xl:py-20">
      <div className="shell flex flex-col gap-12">
        <div className="flex flex-col gap-4">
          <p className="m-0 font-[family-name:var(--font-display)] text-[13px] font-semibold uppercase leading-4 tracking-[1.56px] text-brand">
            {eyebrow}
          </p>
          <DisplayHeading align="left" reveal="clip" size="faq">
            {title}
          </DisplayHeading>
        </div>

        <div className="flex flex-col gap-14 xl:gap-20">
          {hospitalityPackages.map((entry, index) => {
            /* The window goes after the name on even rows and before it on
               odd ones, so the column alternates instead of marching. */
            const trailing = index % 2 === 0;

            const pill = (
              <span
                className="relative inline-block shrink-0 overflow-hidden rounded-full bg-white align-middle"
                style={{
                  width: `${PILL.width}em`,
                  height: `${PILL.height}em`,
                  marginInline: `${PILL.gap}em`,
                }}
              >
                <Image
                  src={entry.image}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 40vw, 70vw"
                  className="object-cover"
                />
              </span>
            );

            return (
              <article key={entry.slug} className="flex flex-col gap-5">
                <Link
                  href={`/hospitality/${entry.slug}`}
                  className="group flex flex-col gap-5"
                  /* The window is a picture of the thing named beside it, so
                     the name alone is the accessible label. */
                  aria-label={`${entry.name} — ${entry.summary}`}
                >
                  <span
                    aria-hidden
                    className={`flex flex-wrap items-center font-daltown text-[clamp(30px,5.92vw,88px)] uppercase leading-[0.9] text-white transition-colors group-hover:text-brand ${
                      trailing ? "justify-start" : "justify-start"
                    }`}
                  >
                    {trailing ? (
                      <>
                        <span>{entry.name}</span>
                        {pill}
                      </>
                    ) : (
                      <>
                        {pill}
                        <span>{entry.name}</span>
                      </>
                    )}
                  </span>

                  <span className="flex flex-col gap-4 border-t border-white/10 pt-5 lg:flex-row lg:items-start lg:justify-between lg:gap-12">
                    <span className="flex max-w-[560px] flex-col gap-2">
                      <span className="font-[family-name:var(--font-display)] text-[13px] font-semibold uppercase leading-5 tracking-[1.56px] text-brand">
                        {entry.festival} · {entry.capacity}
                      </span>
                      <span className="font-[family-name:var(--font-ui)] text-[15px] leading-[1.7] text-content-secondary">
                        {entry.summary}
                      </span>
                    </span>

                    <span className="flex shrink-0 items-end gap-6">
                      <span className="flex flex-col gap-0.5">
                        <span className="font-[family-name:var(--font-ui)] text-[13px] leading-5 text-white/45">
                          {from}
                        </span>
                        <span className="font-[family-name:var(--font-display)] text-[21px] font-black leading-7 text-brand">
                          {entry.price}
                        </span>
                        <span className="font-[family-name:var(--font-ui)] text-[13px] leading-5 text-white/45">
                          {entry.perUnit}
                        </span>
                      </span>
                      <span
                        className="flex items-center bg-brand px-5 py-3 font-[family-name:var(--font-display)] text-[14px] font-semibold leading-6 text-[#0b0b0e] transition-colors group-hover:bg-white"
                        style={{ borderRadius: "var(--radius)" }}
                      >
                        {discover}
                      </span>
                    </span>
                  </span>
                </Link>
              </article>
            );
          })}
        </div>

        <p className="m-0 font-[family-name:var(--font-ui)] text-[13px] leading-[1.6] text-white/45">
          {hospitalityCopy.priceNote}
        </p>
      </div>
    </section>
  );
}
