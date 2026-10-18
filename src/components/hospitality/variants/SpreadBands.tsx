"use client";

import Link from "next/link";

import { PhotoSlot } from "@/components/pages/PhotoSlot";
import { hospitalityCopy, hospitalityPackages } from "@/data/hospitality";

/**
 * Direction E — full-bleed spreads.
 *
 * No grid and no cards: each package takes the whole width as a photographic
 * band with its name laid over the picture at display size, and the detail
 * ruled underneath inside the shell. The section title goes too — the first
 * band is the title.
 *
 * This is the direction that sells rather than lists. It is also the one that
 * depends most completely on the photography being good, because a band is
 * the picture: with the stand-ins in place it already reads, but a weak shot
 * has nowhere to hide here.
 *
 * The scrim over each picture is heaviest at the foot, where the name sits,
 * so a light frame never takes the type with it.
 */
export function SpreadBands() {
  const { from, discover } = hospitalityCopy.packages;

  return (
    <section id="packages" className="relative scroll-mt-24">
      {hospitalityPackages.map((entry, index) => (
        <article key={entry.slug} className="relative">
          <div className="relative">
            <PhotoSlot
              caption={entry.photo}
              src={entry.image}
              rounded={false}
              sizes="100vw"
              className="h-[320px] w-full sm:h-[420px] xl:h-[520px]"
            />

            {/* A foot, not a wash. The first version ran 35% black across
                the whole frame and reached 95% at the bottom, which on
                already-dark concert photography left a band that read as
                empty — in the one direction whose entire argument is the
                picture. It now clears completely above the lower third and
                only darkens where the name actually sits. */}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 block bg-[linear-gradient(to_top,rgba(11,11,14,0.92),rgba(11,11,14,0.55)_18%,transparent_42%)]"
            />

            <div className="absolute inset-x-0 bottom-0">
              <div className="shell flex flex-col gap-2 pb-7">
                <p className="m-0 font-[family-name:var(--font-display)] text-caption font-bold uppercase tracking-[3px] text-brand">
                  {/* The running number does the work the section title used
                      to: it says how many there are and where you are. */}
                  {String(index + 1).padStart(2, "0")} · {entry.festival} ·{" "}
                  {entry.capacity}
                </p>
                <h3 className="section-title m-0 font-daltown uppercase text-white">
                  {entry.name}
                </h3>
              </div>
            </div>
          </div>

          <div className="shell flex flex-col gap-5 border-b border-white/10 py-7 lg:flex-row lg:items-start lg:justify-between lg:gap-12">
            <p className="m-0 max-w-[620px] font-[family-name:var(--font-ui)] text-body text-content-secondary">
              {entry.summary}
            </p>

            <div className="flex shrink-0 items-end gap-6">
              <div className="flex flex-col gap-0.5">
                <span className="font-[family-name:var(--font-ui)] text-body-s text-white/45">
                  {from}
                </span>
                <span className="font-[family-name:var(--font-display)] text-title-section font-black text-brand">
                  {entry.price}
                </span>
                <span className="font-[family-name:var(--font-ui)] text-body-s text-white/45">
                  {entry.perUnit}
                </span>
              </div>
              <Link
                href={`/hospitality/${entry.slug}`}
                className="sweep flex items-center bg-brand px-5 py-3.5 font-[family-name:var(--font-display)] text-body font-semibold text-[#0b0b0e]"
              >
                <span className="relative z-10">{discover}</span>
              </Link>
            </div>
          </div>
        </article>
      ))}

      <div className="shell py-7">
        <p className="m-0 font-[family-name:var(--font-ui)] text-body-s text-white/45">
          {hospitalityCopy.priceNote}
        </p>
      </div>
    </section>
  );
}
