import Image from "next/image";

import { Cta, bill, cities } from "./shared";

/**
 * L · Print — one bill for both.
 *
 * A single yellow sheet typeset like a festival bill — "SEVENPM presents",
 * the two names at display size between rules, each with its dates, city
 * and a small square of its poster — taped to the page a degree off
 * square. It is the same taped sheet as the sponsor pitch and the
 * newsletter, carrying the programme. Being the section, it carries the
 * section's heading too, so there is no title above it.
 */
export function UpcomingPrint() {
  return (
    <section aria-labelledby="up-print" className="relative py-16 xl:py-20">
      <div className="shell flex justify-center">
        <div
          data-reveal="up"
          className="relative w-full max-w-[1054px] rotate-1 bg-brand px-6 py-10 text-[#0b0b0e] sm:px-12 sm:py-14"
        >
          <span
            aria-hidden
            className="pointer-events-none absolute left-[3%] top-[-1.5%] z-[2] block h-[25px] w-[118px] -translate-x-1/2 -translate-y-1/2 -rotate-[33.63deg] bg-[rgba(217,217,217,0.4)]"
          />
          <span
            aria-hidden
            className="pointer-events-none absolute left-[97%] top-[101.5%] z-[2] block h-[25px] w-[118px] -translate-x-1/2 -translate-y-1/2 -rotate-[33.63deg] bg-[rgba(217,217,217,0.4)]"
          />

          <div className="flex flex-col items-center gap-2 text-center">
            <span className="font-[family-name:var(--font-display)] text-[13px] font-semibold uppercase tracking-[0.2em]">
              SEVENPM presents
            </span>
            <h2 id="up-print" className="section-title">
              Upcoming events
            </h2>
            <span className="font-[family-name:var(--font-display)] text-[13px] font-semibold uppercase tracking-[0.2em] text-black/60">
              {cities.join(" · ")}
            </span>
          </div>

          <ul className="m-0 mt-10 list-none border-t-2 border-black p-0">
            {bill.map((f) => (
              <li
                key={f.id}
                className="grid grid-cols-[80px_1fr] items-center gap-x-5 gap-y-4 border-b-2 border-black py-6 sm:grid-cols-[112px_1fr_auto] sm:gap-x-8"
              >
                <span className="relative block aspect-square w-full overflow-hidden">
                  <Image src={f.card as string} alt={`${f.name} poster`} fill sizes="112px" className="object-cover" />
                </span>
                <div className="flex flex-col gap-1">
                  <h3 className="card-title">{f.name}</h3>
                  <span className="font-[family-name:var(--font-display)] text-[15px] font-medium leading-[22px]">
                    {f.when} · {f.city} · {f.edition}
                  </span>
                </div>
                <Cta
                  festival={f}
                  tone="light"
                  className={`col-span-2 sm:col-span-1 ${f.href !== "#" ? "!bg-[#0b0b0e] !text-brand after:!bg-white" : ""}`}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
