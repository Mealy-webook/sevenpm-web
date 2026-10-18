import Image from "next/image";

import { Cta, SectionHead, bill, splitWhen } from "./shared";

/**
 * B · Board — the departures board.
 *
 * Two ruled rows at display size, the date leading: when it is matters
 * before what it is called, because that is what a visitor checks against
 * their own diary. The poster is a thumbnail at the start of the row and
 * grows on hover; the rest is type.
 */
export function UpcomingBoard() {
  return (
    <section aria-labelledby="up-board" className="relative py-16 xl:py-20">
      <div className="shell flex flex-col gap-8 xl:gap-12">
        <SectionHead id="up-board" />

        <ol className="m-0 list-none border-b border-white/10 p-0">
          {bill.map((f, i) => {
            const d = splitWhen(f.when);
            return (
              <li
                key={f.id}
                className="group grid grid-cols-[96px_1fr] items-center gap-x-6 gap-y-5 border-t border-white/10 py-6 transition-colors duration-300 hover:bg-white/[0.03] lg:grid-cols-[180px_240px_1fr_auto] lg:gap-x-10 lg:py-8"
                data-reveal="up"
              >
                <span className="relative block aspect-square w-full overflow-hidden bg-ink-900">
                  <Image
                    src={f.card as string}
                    alt={`${f.name} poster`}
                    fill
                    sizes="(min-width: 1024px) 180px, 96px"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  />
                </span>

                {d ? (
                  <p className="m-0 flex flex-col">
                    <span className="display-m font-daltown text-brand">
                      {d.days}
                    </span>
                    <span className="font-[family-name:var(--font-display)] text-body-s uppercase tracking-[0.12em] text-text-secondary">
                      {d.month} {d.year}
                    </span>
                  </p>
                ) : (
                  <span />
                )}

                <div className="col-span-2 flex flex-col gap-2 lg:col-span-1">
                  <span className="font-[family-name:var(--font-display)] text-body-s uppercase tracking-[0.12em] text-text-secondary">
                    {String(i + 1).padStart(2, "0")} · {f.edition}
                  </span>
                  <h3 className="card-title text-white">{f.name}</h3>
                  <span className="font-[family-name:var(--font-display)] text-body text-text-secondary">
                    {f.city}
                  </span>
                </div>

                <Cta festival={f} className="col-span-2 lg:col-span-1" />
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
