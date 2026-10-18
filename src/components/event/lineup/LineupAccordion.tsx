"use client";

import { useState } from "react";

import { lineup, runningOrder } from "@/data/lineup";
import { ActLinks, ActPhoto, DayTabs, HeadlinerTag, LineupHead } from "./shared";

/**
 * K · Accordion — the night in one glance, an act in one tap.
 *
 * The densest direction: each act is one slim line — time, name, stage,
 * a chevron — so six acts take a third of a screen. Opening a line drops
 * the act's photo, bio and links out underneath it, one at a time. It
 * follows the FAQ's pattern on the same page, so it costs the visitor
 * nothing to learn.
 */
export function LineupAccordion() {
  const [dayId, setDayId] = useState(lineup[0].id);
  const day = lineup.find((d) => d.id === dayId) ?? lineup[0];
  const [open, setOpen] = useState<string | null>(null);

  return (
    <section aria-labelledby="lu-acc" className="relative py-16 xl:py-20">
      <div className="shell flex flex-col gap-8 xl:gap-12">
        <LineupHead id="lu-acc">
          <DayTabs days={lineup} value={day.id} onChange={(id) => { setDayId(id); setOpen(null); }} />
        </LineupHead>

        <ol key={day.id} className="deck-fade m-0 list-none border-b border-white/10 p-0">
          {runningOrder(day).map((a) => {
            const on = open === a.id;
            return (
              <li key={a.id} className="border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setOpen(on ? null : a.id)}
                  aria-expanded={on}
                  className="grid w-full grid-cols-[72px_1fr_auto] items-center gap-4 py-5 text-left sm:grid-cols-[110px_1fr_200px_24px] sm:gap-8"
                >
                  <span className="font-daltown text-[34px] leading-none text-brand">{a.start}</span>
                  <span className="flex min-w-0 items-center gap-3">
                    <span className="truncate font-daltown text-[clamp(32px,3.6vw,52px)] uppercase leading-none text-white">{a.name}</span>
                    {a.headliner ? <HeadlinerTag /> : null}
                  </span>
                  <span className="hidden font-[family-name:var(--font-display)] text-[13px] font-semibold uppercase tracking-[0.1em] text-text-secondary sm:block">
                    {a.stage}
                  </span>
                  <span
                    aria-hidden
                    className={`size-6 bg-[image:var(--asset-chevron-down-16)] bg-center bg-no-repeat transition-transform duration-300 ${on ? "rotate-180" : ""}`}
                  />
                </button>
                <div className={`grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${on ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                  <div className="overflow-hidden">
                    <div className="grid grid-cols-1 gap-5 pb-6 sm:grid-cols-[110px_200px_1fr] sm:gap-8">
                      <span className="hidden sm:block" />
                      <ActPhoto act={a} sizes="200px" className="aspect-square w-full max-w-[200px]" />
                      <div className="flex flex-col gap-3">
                        <span className="font-[family-name:var(--font-display)] text-[13px] font-semibold uppercase tracking-[0.1em] text-text-primary">
                          {a.stage} · {a.start} – {a.end}
                        </span>
                        <p className="m-0 max-w-[60ch] font-[family-name:var(--font-display)] text-[15px] leading-[22px] text-content-secondary">
                          {a.bio}
                        </p>
                        <ActLinks act={a} />
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
