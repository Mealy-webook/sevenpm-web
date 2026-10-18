import Image from "next/image";

import { Cta, SectionHead, bill } from "./shared";

/**
 * J · Postcards — turn it over.
 *
 * Each festival is a postcard: the poster on the front and, on the back,
 * where it is written as an address — the dates, the city, the edition in
 * the stamp box — and the way in. Hover or focus turns it over. Two cities
 * a few hundred kilometres apart is what a postcard is for. On touch the
 * back is shown under the front instead of behind it.
 */
function days(d?: { start: string; end: string }) {
  if (!d) return "";
  const ms = Date.parse(d.end) - Date.parse(d.start);
  return String(Math.round(ms / 86_400_000) + 1);
}

export function UpcomingPostcards() {
  return (
    <section aria-labelledby="up-cards" className="relative py-16 xl:py-20">
      <div className="shell flex flex-col gap-8 xl:gap-12">
        <SectionHead id="up-cards" />

        <ul className="m-0 grid list-none grid-cols-1 gap-10 p-0 lg:grid-cols-2 lg:gap-12">
          {bill.map((f) => (
            <li key={f.id} data-reveal="up" className="postcard group">
              <div className="postcard-inner relative aspect-square w-full">
                {/* Front */}
                <span className="postcard-face absolute inset-0 overflow-hidden shadow-[0_24px_60px_rgba(0,0,0,0.55)]">
                  <Image src={f.card as string} alt={`${f.name} poster`} fill sizes="(min-width: 1024px) 620px, 100vw" className="object-cover" />
                  <span className="absolute bottom-4 left-4 bg-black/70 px-3 py-1.5 font-[family-name:var(--font-display)] text-[12px] uppercase tracking-[0.12em] text-text-primary">
                    Greetings from {f.city}
                  </span>
                </span>

                {/* Back */}
                <div className="postcard-face postcard-back absolute inset-0 grid grid-cols-[1fr_1px_1fr] gap-6 bg-[#f4f1ea] p-6 text-[#0b0b0e] xl:p-8">
                  <div className="flex flex-col justify-between gap-4">
                    <h3 className="card-title">{f.name}</h3>
                    <p className="m-0 font-[family-name:var(--font-display)] text-[14px] leading-[21px] text-black/65">
                      {days(f.dates)} days of music in {f.city}.
                    </p>
                    <Cta festival={f} tone="light" className="w-fit" />
                  </div>
                  <span aria-hidden className="bg-black/15" />
                  <div className="flex flex-col gap-6">
                    <span className="ml-auto flex size-24 flex-col items-center justify-center border-2 border-dashed border-black/30 text-center font-[family-name:var(--font-display)] text-[11px] font-semibold uppercase leading-4 tracking-[0.08em] text-black/60">
                      {f.edition}
                    </span>
                    {[f.when, f.city, "Morocco"].map((line) => (
                      <span key={line} className="border-b border-black/25 pb-2 font-[family-name:var(--font-display)] text-[15px] font-medium">
                        {line}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
