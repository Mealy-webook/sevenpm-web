"use client";

import { useState } from "react";

import { lineup, runningOrder } from "@/data/lineup";
import { ActLinks, ActPhoto, DayTabs, HeadlinerTag, LineupHead } from "./shared";

/**
 * H · Rail — tall portraits you swipe through.
 *
 * The day's acts as a sideways rail of tall portrait cards, time and stage
 * on the photo, in playing order. Each card turns its photo into the bio:
 * tap "About" and the lower half slides up over the picture with the bio
 * and the links, tap again to put it back. It is the most phone-native of
 * the directions — a swipe and a tap — and on desktop the rail shows four
 * cards with the rest a scroll away.
 */
export function LineupRail() {
  const [dayId, setDayId] = useState(lineup[0].id);
  const day = lineup.find((d) => d.id === dayId) ?? lineup[0];
  const [open, setOpen] = useState<string | null>(null);

  return (
    <section aria-labelledby="lu-rail" className="relative overflow-hidden py-16 xl:py-20">
      <div className="shell flex flex-col gap-8 xl:gap-12">
        <LineupHead id="lu-rail">
          <DayTabs days={lineup} value={day.id} onChange={(id) => { setDayId(id); setOpen(null); }} />
        </LineupHead>

        <div className="-mr-[var(--shell-gutter)] overflow-x-auto pb-2 pr-[var(--shell-gutter)] [scrollbar-width:none]">
          <ul key={day.id} className="deck-fade m-0 flex w-max list-none gap-4 p-0">
            {runningOrder(day).map((a) => {
              const on = open === a.id;
              return (
                <li key={a.id} className="relative h-[520px] w-[300px] shrink-0 overflow-hidden bg-bg-secondary xl:w-[306px]">
                  <div className="absolute inset-0">
                    <ActPhoto act={a} sizes="306px" className="size-full" />
                  </div>
                  <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/40" />

                  <div className="absolute inset-x-0 top-0 flex items-start justify-between p-4">
                    <span className="font-daltown text-[40px] leading-none text-brand">{a.start}</span>
                    {a.headliner ? <HeadlinerTag /> : null}
                  </div>

                  <div
                    className={`absolute inset-x-0 bottom-0 flex flex-col gap-3 p-5 transition-[background-color,translate] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${on ? "bg-bg-primary/95" : "translate-y-[calc(100%-132px)]"}`}
                  >
                    <h3 className="card-title text-white">{a.name}</h3>
                    <span className="font-[family-name:var(--font-display)] text-[12px] font-semibold uppercase tracking-[0.1em] text-text-primary">
                      {a.stage} · to {a.end}
                    </span>
                    <button
                      type="button"
                      onClick={() => setOpen(on ? null : a.id)}
                      aria-expanded={on}
                      className="w-fit font-[family-name:var(--font-display)] text-[13px] font-semibold text-brand underline underline-offset-4"
                    >
                      {on ? "Close" : "About"}
                    </button>
                    <p className="m-0 font-[family-name:var(--font-display)] text-[14px] leading-[21px] text-content-secondary">
                      {a.bio}
                    </p>
                    <ActLinks act={a} />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
