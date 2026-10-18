"use client";

import { useState } from "react";

import { LINEUP_STAGES, lineup, runningOrder } from "@/data/lineup";
import { ActLinks, ActPhoto, DayTabs, HeadlinerTag, LineupHead } from "./shared";

/**
 * F · Spine — the night read top to bottom.
 *
 * A clock runs down the middle with each start time on it; the main stage
 * hangs off the left of the spine and the second stage off the right, so
 * the two stages read as two columns of one evening and overlapping sets
 * sit side by side. It is the timeline (B) turned upright, which is the
 * way a phone wants it: below `lg` the spine moves to the left edge, every
 * act hangs off its right, and the stage is named on the card.
 */
export function LineupSpine() {
  const [dayId, setDayId] = useState(lineup[0].id);
  const day = lineup.find((d) => d.id === dayId) ?? lineup[0];
  const acts = runningOrder(day);
  const [MAIN] = LINEUP_STAGES;

  return (
    <section aria-labelledby="lu-spine" className="relative py-16 xl:py-20">
      <div className="shell flex flex-col gap-8 xl:gap-12">
        <LineupHead id="lu-spine">
          <DayTabs days={lineup} value={day.id} onChange={setDayId} />
        </LineupHead>

        {/* Stage heads over the two columns */}
        <div className="hidden grid-cols-[1fr_120px_1fr] lg:grid">
          {LINEUP_STAGES.map((s, i) => (
            <span
              key={s}
              className={`font-[family-name:var(--font-display)] text-body-s font-semibold uppercase tracking-[0.14em] text-text-secondary ${i === 0 ? "text-right" : "col-start-3"}`}
            >
              {s}
            </span>
          ))}
        </div>

        <ol key={day.id} className="deck-fade relative m-0 flex list-none flex-col gap-6 p-0">
          <span aria-hidden className="absolute bottom-0 left-[39px] top-0 w-px bg-white/15 lg:left-1/2" />
          {acts.map((a) => {
            const left = a.stage === MAIN;
            return (
              <li key={a.id} className="relative grid grid-cols-[80px_1fr] items-start lg:grid-cols-[1fr_120px_1fr]">
                {/* time on the spine */}
                <span className={`relative z-10 flex flex-col items-center gap-1 bg-bg-primary py-2 lg:col-start-2 lg:row-start-1`}>
                  <span className={`block size-3 ${a.headliner ? "bg-brand" : "bg-white/60"}`} />
                  <span className="display-xs font-daltown leading-none text-white">{a.start}</span>
                </span>

                <article
                  className={`flex gap-4 border border-white/10 bg-bg-secondary p-4 lg:row-start-1 ${left ? "lg:col-start-1 lg:flex-row-reverse lg:text-right" : "lg:col-start-3"}`}
                >
                  <ActPhoto act={a} sizes="112px" className="aspect-square w-24 shrink-0 xl:w-28" />
                  <div className={`flex min-w-0 flex-col gap-2 ${left ? "lg:items-end" : ""}`}>
                    {a.headliner ? <HeadlinerTag /> : null}
                    <h3 className="display-xs m-0 font-daltown uppercase text-white">{a.name}</h3>
                    <span className="font-[family-name:var(--font-display)] text-caption font-semibold uppercase tracking-[0.1em] text-brand">
                      <span className="lg:hidden">{a.stage} · </span>
                      {a.start} – {a.end}
                    </span>
                    <p className="m-0 font-[family-name:var(--font-display)] text-body-s text-content-secondary">
                      {a.bio}
                    </p>
                    <ActLinks act={a} compact />
                  </div>
                </article>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
