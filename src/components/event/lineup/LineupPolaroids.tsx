"use client";

import { useState } from "react";

import { lineup, runningOrder } from "@/data/lineup";
import { ActLinks, ActPhoto, DayTabs, HeadlinerTag, LineupHead, StageTime } from "./shared";

/**
 * P · Polaroids — the night pinned up as prints.
 *
 * The event page's gallery is a fan of polaroids; the lineup borrows the
 * object. Each act is a print, a few degrees off square, with the time and
 * name written in the deep white foot. Picking one straightens it, lifts
 * it, and opens the act — stage, bio, links — in a card under the row.
 * It is the warmest of the directions, and the least like a timetable.
 */
const TILT = [-3, 2, -1.5, 3, -2.5, 1.5];

export function LineupPolaroids() {
  const [dayId, setDayId] = useState(lineup[0].id);
  const day = lineup.find((d) => d.id === dayId) ?? lineup[0];
  const acts = runningOrder(day);
  const [pickedId, setPickedId] = useState<string | null>(null);
  const picked = acts.find((a) => a.id === pickedId) ?? acts.find((a) => a.headliner) ?? acts[0];

  return (
    <section aria-labelledby="lu-pola" className="relative overflow-hidden py-16 xl:py-20">
      <div className="shell flex flex-col gap-8 xl:gap-12">
        <LineupHead id="lu-pola">
          <DayTabs days={lineup} value={day.id} onChange={(id) => { setDayId(id); setPickedId(null); }} />
        </LineupHead>

        <ul key={day.id} className="deck-fade m-0 flex list-none flex-wrap justify-center gap-x-5 gap-y-8 p-0 pt-2">
          {acts.map((a, i) => {
            const on = a.id === picked.id;
            return (
              <li key={a.id} className="w-[min(200px,42vw)]">
                <button
                  type="button"
                  onClick={() => setPickedId(a.id)}
                  aria-pressed={on}
                  className={`block w-full bg-[#f4f1ea] p-2.5 pb-0 text-left text-[#0b0b0e] shadow-[0_18px_40px_rgba(0,0,0,0.45)] transition-[rotate,translate,scale] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${on ? "-translate-y-2 scale-105 !rotate-0 outline outline-2 outline-offset-4 outline-brand" : "hover:-translate-y-1"}`}
                  style={{ rotate: `${TILT[i % TILT.length]}deg` }}
                >
                  <ActPhoto act={a} sizes="200px" className="aspect-square w-full" />
                  <span className="flex flex-col gap-0.5 px-1 py-3">
                    <span className="font-[family-name:var(--font-display)] text-[12px] font-semibold tabular-nums text-black/55">
                      {a.start} · {a.stage}
                    </span>
                    <span className="font-daltown text-[30px] uppercase leading-[26px]">{a.name}</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        <article key={picked.id} className="deck-fade mx-auto flex w-full max-w-[820px] flex-col gap-3 border-t-2 border-brand pt-6 text-center">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <h3 className="card-title text-white">{picked.name}</h3>
            {picked.headliner ? <HeadlinerTag /> : null}
          </div>
          <StageTime act={picked} className="text-brand" />
          <p className="m-0 font-[family-name:var(--font-display)] text-[15px] leading-[22px] text-content-secondary">
            {picked.bio}
          </p>
          <div className="flex justify-center">
            <ActLinks act={picked} />
          </div>
        </article>
      </div>
    </section>
  );
}
