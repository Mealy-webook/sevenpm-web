import Image from "next/image";

import { Cta, SectionHead, bill } from "./shared";

/**
 * K · Bands — the name on the move.
 *
 * Each festival is a full-width band with its name running across it on a
 * loop, the same kinetic device as the band further down the homepage. The
 * first runs in brand yellow, left; the second runs dark, right — so the
 * two read as a pair rather than one band repeated. The poster is pinned
 * over the band with the dates and the way in beside it. Hovering a band
 * slows its type down to readable.
 */
export function UpcomingBands() {
  return (
    <section aria-labelledby="up-bands" className="relative overflow-hidden py-16 xl:py-20">
      <div className="shell">
        <SectionHead id="up-bands" />
      </div>

      <ul className="m-0 mt-8 flex list-none flex-col gap-4 p-0 xl:mt-12">
        {bill.map((f, i) => {
          const brand = i % 2 === 0;
          const words = Array.from({ length: 8 }, () => f.name);
          return (
            <li
              key={f.id}
              className={`band group relative flex min-h-[260px] items-center overflow-hidden ${brand ? "bg-brand text-[#0b0b0e]" : "border-y border-white/10 bg-bg-secondary text-white"}`}
            >
              <div
                aria-hidden
                className={`band-track flex w-max shrink-0 gap-12 whitespace-nowrap font-daltown text-[clamp(96px,12vw,190px)] uppercase leading-none ${brand ? "" : "band-reverse"}`}
              >
                {[...words, ...words].map((w, k) => (
                  <span key={k} className={k % 2 ? "opacity-30" : ""}>
                    {w}
                  </span>
                ))}
              </div>

              {/* The card pinned over the band */}
              <div className="shell absolute inset-0 flex items-center justify-end">
                <div className="flex items-center gap-5 bg-[#0b0b0e] p-4 text-white shadow-[0_24px_60px_rgba(0,0,0,0.55)] xl:gap-6">
                  <span className="relative block size-28 shrink-0 overflow-hidden xl:size-36">
                    <Image src={f.card as string} alt={`${f.name} poster`} fill sizes="144px" className="object-cover" />
                  </span>
                  <div className="flex flex-col gap-3 pr-2">
                    <h3 className="m-0 font-daltown text-[32px] uppercase leading-[28px]">{f.name}</h3>
                    <span className="font-[family-name:var(--font-display)] text-[14px] leading-5 text-text-secondary">
                      {f.when}
                      <br />
                      {f.city} · {f.edition}
                    </span>
                    <Cta festival={f} className="w-fit !px-4 !py-2.5 !text-[14px]" />
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
