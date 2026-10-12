import Link from "next/link";

import { PhotoSlot } from "@/components/pages/PhotoSlot";
import { hospitalityCopy, hospitalityPackages, nightCopy } from "@/data/hospitality";

/**
 * The spaces, as rooms rather than as products.
 *
 * Each one takes a full band: the picture held in a pill, which is the
 * page's own shape — the hero cuts a pill through the word and these repeat
 * it at size — with the name, the terms and the way in beside it. The side
 * alternates so the column has a rhythm instead of a march.
 *
 * The pill is the whole reason this reads as one page rather than five
 * cards. A rectangle here would have been another grid.
 *
 * Numbered, because the page is an evening in order and these are the rooms
 * you could be standing in during it.
 */
export function Rooms() {
  const { stamp, title, body } = nightCopy.spaces;
  const { from, discover } = hospitalityCopy.packages;

  return (
    <section id="spaces" className="relative scroll-mt-24 py-16 xl:py-24">
      <div className="shell flex flex-col gap-12 xl:gap-16">
        <div className="flex flex-col gap-5">
          <span className="font-[family-name:var(--font-display)] text-[12px] font-bold uppercase leading-4 tracking-[3px] text-brand">
            {stamp}
          </span>
          <h2
            className="m-0 max-w-[14ch] font-daltown text-[clamp(30px,5.5vw,88px)] uppercase leading-[0.88] text-white"
            data-reveal="clip"
          >
            {title}
          </h2>
          <p className="m-0 max-w-[620px] font-[family-name:var(--font-ui)] text-[15px] leading-[1.75] text-content-secondary">
            {body}
          </p>
        </div>

        <div className="flex flex-col gap-16 xl:gap-24">
          {hospitalityPackages.map((entry, index) => {
            const flipped = index % 2 === 1;

            return (
              <article
                key={entry.slug}
                data-reveal="up"
                className={`flex flex-col items-center gap-8 lg:gap-14 ${
                  flipped ? "lg:flex-row-reverse" : "lg:flex-row"
                }`}
              >
                {/* The room, held in the page's own shape. */}
                <div className="w-full shrink-0 lg:w-[52%]">
                  <div className="relative aspect-[16/10] w-full overflow-hidden rounded-full">
                    <PhotoSlot
                      caption={entry.photo}
                      src={entry.image}
                      rounded={false}
                      sizes="(min-width: 1024px) 52vw, 100vw"
                      className="absolute inset-0 size-full"
                    />
                  </div>
                </div>

                <div className="flex w-full flex-col gap-4">
                  <span className="font-[family-name:var(--font-display)] text-[12px] font-bold uppercase leading-4 tracking-[3px] text-brand">
                    {String(index + 1).padStart(2, "0")} · {entry.festival}
                  </span>

                  <h3 className="m-0 font-daltown text-[clamp(26px,4.24vw,61px)] uppercase leading-[0.88] text-white">
                    {entry.name}
                  </h3>

                  <p className="m-0 max-w-[480px] font-[family-name:var(--font-ui)] text-[15px] leading-[1.75] text-content-secondary">
                    {entry.summary}
                  </p>

                  {/* The terms on one rule — capacity, price, and the way
                      in — so nothing about this room needs a panel. */}
                  <div className="mt-2 flex flex-wrap items-end gap-x-10 gap-y-5 border-t border-white/15 pt-5">
                    <span className="flex flex-col gap-0.5">
                      <span className="font-[family-name:var(--font-ui)] text-[13px] leading-5 text-white/45">
                        Holds
                      </span>
                      <span className="font-[family-name:var(--font-display)] text-[16px] font-semibold leading-7 text-white">
                        {entry.capacity}
                      </span>
                    </span>

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

                    <Link
                      href={`/hospitality/${entry.slug}`}
                      className="sweep flex items-center bg-brand px-5 py-3.5 font-[family-name:var(--font-display)] text-[14px] font-semibold leading-6 text-[#0b0b0e]"
                    >
                      <span className="relative z-10">{discover}</span>
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <p className="m-0 font-[family-name:var(--font-ui)] text-[13px] leading-[1.7] text-white/45">
          {hospitalityCopy.priceNote}
        </p>
      </div>
    </section>
  );
}
