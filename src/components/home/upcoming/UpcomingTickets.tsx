import Image from "next/image";

import { Cta, SectionHead, bill } from "./shared";

/**
 * C · Tickets — two admit-ones.
 *
 * Each festival is a paper ticket: the poster on the stub, a perforation,
 * and the details as a ruled docket on the body — date, city, edition — with
 * the way in where you would tear. Paper on the dark page is the one light
 * object in the section, so the two tickets are what the eye lands on.
 * They tip apart and straighten on hover.
 */
export function UpcomingTickets() {
  return (
    <section aria-labelledby="up-tickets" className="relative py-16 xl:py-20">
      <div className="shell flex flex-col gap-8 xl:gap-12">
        <SectionHead id="up-tickets" />

        <ul className="m-0 grid list-none grid-cols-1 gap-8 p-0 lg:grid-cols-2 lg:gap-10">
          {bill.map((f, i) => (
            <li
              key={f.id}
              data-reveal="up"
              className={`flex transition-transform duration-500 ease-out hover:rotate-0 ${i % 2 === 0 ? "lg:-rotate-1" : "lg:rotate-1"}`}
            >
              <article className="flex w-full flex-col bg-[#f4f1ea] text-[#0b0b0e] shadow-[0_24px_60px_rgba(0,0,0,0.5)] sm:flex-row">
                {/* The stub */}
                <span className="relative block aspect-square w-full shrink-0 overflow-hidden sm:w-[44%]">
                  <Image
                    src={f.card as string}
                    alt={`${f.name} poster`}
                    fill
                    sizes="(min-width: 1024px) 280px, (min-width: 640px) 44vw, 100vw"
                    className="object-cover"
                  />
                </span>

                {/* The perforation, notched at both ends */}
                <span
                  aria-hidden
                  className="relative hidden w-0 shrink-0 border-l-2 border-dashed border-black/25 sm:block"
                >
                  <span className="absolute -left-3 -top-3 size-6 rounded-full bg-bg-primary" />
                  <span className="absolute -bottom-3 -left-3 size-6 rounded-full bg-bg-primary" />
                </span>

                {/* The body */}
                <div className="flex flex-1 flex-col justify-between gap-6 p-6 xl:p-7">
                  <div className="flex items-center justify-between gap-4 font-[family-name:var(--font-display)] text-[12px] font-semibold uppercase leading-4 tracking-[0.14em] text-black/55">
                    <span>Admit one</span>
                    <span>No. {String(i + 1).padStart(2, "0")}</span>
                  </div>

                  <h3 className="card-title">{f.name}</h3>

                  <dl className="m-0 grid grid-cols-1 border-t border-black/15">
                    {[
                      ["Date", f.when],
                      ["City", f.city],
                      ["Edition", f.edition],
                    ].map(([k, v]) =>
                      v ? (
                        <div
                          key={k}
                          className="flex items-baseline justify-between gap-4 border-b border-black/15 py-2.5"
                        >
                          <dt className="font-[family-name:var(--font-display)] text-[12px] uppercase tracking-[0.12em] text-black/50">
                            {k}
                          </dt>
                          <dd className="m-0 font-[family-name:var(--font-display)] text-[15px] font-medium leading-[22px]">
                            {v}
                          </dd>
                        </div>
                      ) : null,
                    )}
                  </dl>

                  <Cta festival={f} tone="light" className="w-full" />
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
