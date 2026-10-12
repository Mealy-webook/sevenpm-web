"use client";

import Link from "next/link";

import { PhotoSlot } from "@/components/pages/PhotoSlot";
import { DisplayHeading } from "@/components/ui/DisplayHeading";
import { hospitalityCopy, hospitalityPackages } from "@/data/hospitality";

/**
 * Direction Q — the ladder.
 *
 * The packages as ascending plinths, each one standing taller than the last,
 * so the shape of the offer is legible before a word is read. Hospitality is
 * sold in levels and this is the only direction that draws the levels.
 *
 * The heights are ordinal — first, second, third — not proportional to
 * price, because every price in the data is a placeholder and a bar chart
 * built on placeholders would be making a claim the data cannot support. It
 * says "these are ranked", which is true, rather than "this one costs twice
 * that one", which is not yet known.
 *
 * Below `lg` the plinths stack and the ladder becomes a plain ordered list:
 * a stepped row on a phone is four slivers and one legible column.
 */
export function TierLadder() {
  const { eyebrow, title, from, discover } = hospitalityCopy.packages;

  /* Ordinal steps, tallest last. Kept as a table rather than computed from
     price for the reason in the note above. */
  const STEP = [0.58, 0.68, 0.78, 0.88, 1];

  return (
    <section id="packages" className="relative scroll-mt-24 py-14 xl:py-20">
      <div className="shell flex flex-col gap-10">
        <div className="flex flex-col gap-4">
          <p className="m-0 font-[family-name:var(--font-display)] text-[13px] font-semibold uppercase leading-4 tracking-[1.56px] text-brand">
            {eyebrow}
          </p>
          <DisplayHeading align="left" reveal="clip" size="faq">
            {title}
          </DisplayHeading>
          <p className="m-0 max-w-[620px] font-[family-name:var(--font-ui)] text-[15px] leading-[1.7] text-content-secondary">
            Five levels, from a seat in the room to the whole festival. The
            steps show the order, not the price.
          </p>
        </div>

        {/* The ladder. */}
        <div className="hidden items-end gap-4 lg:flex">
          {hospitalityPackages.map((entry, index) => (
            <article
              key={entry.slug}
              className="flex flex-1 flex-col justify-end"
              style={{ height: `${STEP[index % STEP.length] * 560}px` }}
            >
              <div
                className="flex h-full flex-col overflow-hidden border border-white/12 bg-ink-900"
                style={{ borderRadius: "var(--radius)" }}
              >
                <PhotoSlot
                  caption={entry.photo}
                  src={entry.image}
                  rounded={false}
                  sizes="20vw"
                  className="h-[34%] w-full shrink-0"
                />

                <div className="flex flex-1 flex-col gap-2.5 p-5">
                  <span className="font-[family-name:var(--font-display)] text-[11px] font-bold uppercase leading-4 tracking-[3px] text-brand">
                    Level {String(index + 1).padStart(2, "0")}
                  </span>

                  <h3 className="m-0 font-daltown text-[clamp(18px,1.56vw,26px)] uppercase leading-[0.95] text-white">
                    {entry.name}
                  </h3>

                  <span className="font-[family-name:var(--font-ui)] text-[13px] leading-5 text-content-secondary">
                    {entry.capacity}
                  </span>

                  <div className="mt-auto flex flex-col gap-2 border-t border-white/10 pt-3">
                    <span className="font-[family-name:var(--font-display)] text-[16px] font-black leading-6 text-brand">
                      {from} {entry.price}
                    </span>
                    <Link
                      href={`/hospitality/${entry.slug}`}
                      className="flex items-center justify-center bg-brand px-3 py-2.5 font-[family-name:var(--font-display)] text-[13px] font-semibold leading-5 text-[#0b0b0e] transition-colors hover:bg-white"
                      style={{ borderRadius: "var(--radius)" }}
                    >
                      {discover}
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* The ladder, read as a list, below `lg`. */}
        <ol className="m-0 flex list-none flex-col p-0 lg:hidden">
          {hospitalityPackages.map((entry, index) => (
            <li key={entry.slug} className="border-t border-white/12">
              <Link
                href={`/hospitality/${entry.slug}`}
                className="flex items-center gap-4 py-5"
              >
                <span className="font-[family-name:var(--font-display)] text-[12px] font-bold uppercase leading-4 tracking-[2px] text-brand">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="flex flex-1 flex-col gap-0.5">
                  <span className="font-[family-name:var(--font-display)] text-[16px] font-bold leading-6 text-white">
                    {entry.name}
                  </span>
                  <span className="font-[family-name:var(--font-ui)] text-[13px] leading-5 text-content-secondary">
                    {entry.capacity} · {entry.perUnit}
                  </span>
                </span>
                <span className="shrink-0 font-[family-name:var(--font-display)] text-[14px] font-semibold leading-6 text-brand">
                  {entry.price}
                </span>
              </Link>
            </li>
          ))}
          <li className="border-t border-white/12" />
        </ol>

        <p className="m-0 font-[family-name:var(--font-ui)] text-[13px] leading-[1.6] text-white/45">
          {hospitalityCopy.priceNote}
        </p>
      </div>
    </section>
  );
}
