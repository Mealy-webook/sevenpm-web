"use client";

import { useState } from "react";

import { lineup, runningOrder } from "@/data/lineup";
import { ActLinks, ActPhoto, DayTabs, HeadlinerTag, LineupHead, StageTime } from "./shared";

/**
 * G · Index — names on the left, the act on the right.
 *
 * The day as a ruled index of names at display size with their start
 * times, and beside it one large panel that follows whichever name the
 * pointer (or focus) is on: the photo, stage, time, bio and links. Scanning
 * the night is reading a list; learning about one act is moving the
 * pointer, not opening anything. On a phone the panel sits under the list
 * and follows taps.
 */
export function LineupIndex() {
  const [dayId, setDayId] = useState(lineup[0].id);
  const day = lineup.find((d) => d.id === dayId) ?? lineup[0];
  const acts = runningOrder(day);
  const [pickedId, setPickedId] = useState<string | null>(null);
  const picked = acts.find((a) => a.id === pickedId) ?? acts.find((a) => a.headliner) ?? acts[0];

  return (
    <section aria-labelledby="lu-index" className="relative py-16 xl:py-20">
      <div className="shell flex flex-col gap-8 xl:gap-12">
        <LineupHead id="lu-index">
          <DayTabs days={lineup} value={day.id} onChange={(id) => { setDayId(id); setPickedId(null); }} />
        </LineupHead>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_440px] lg:gap-12">
          <ol className="m-0 list-none border-b border-white/10 p-0">
            {acts.map((a) => {
              const on = a.id === picked.id;
              return (
                <li key={a.id} className="border-t border-white/10">
                  <button
                    type="button"
                    onMouseEnter={() => setPickedId(a.id)}
                    onFocus={() => setPickedId(a.id)}
                    onClick={() => setPickedId(a.id)}
                    aria-pressed={on}
                    className="group flex w-full items-baseline justify-between gap-6 py-4 text-left"
                  >
                    <span className={`font-daltown text-[clamp(48px,6vw,92px)] uppercase leading-[0.85] transition-colors duration-200 ${on ? "text-brand" : "text-white/35 group-hover:text-white"}`}>
                      {a.name}
                    </span>
                    <span className={`shrink-0 font-[family-name:var(--font-display)] text-[15px] font-semibold ${on ? "text-brand" : "text-text-secondary"}`}>
                      {a.start} · {a.stage}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>

          <article key={picked.id} className="deck-fade flex flex-col gap-4 lg:sticky lg:top-28 lg:self-start">
            <ActPhoto act={picked} sizes="440px" className="aspect-[4/5] w-full" />
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="card-title text-white">{picked.name}</h3>
              {picked.headliner ? <HeadlinerTag /> : null}
            </div>
            <StageTime act={picked} className="text-brand" />
            <p className="m-0 font-[family-name:var(--font-display)] text-[14px] leading-[21px] text-content-secondary">
              {picked.bio}
            </p>
            <ActLinks act={picked} />
          </article>
        </div>
      </div>
    </section>
  );
}
