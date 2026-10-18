"use client";

import { useState } from "react";

import { LINEUP_STAGES, lineup, runningOrder } from "@/data/lineup";
import { ActLinks, ActPhoto, DayTabs, HeadlinerTag, LineupHead } from "./shared";

/**
 * M · Stages — a column per stage, like a printed programme.
 *
 * The festival's own question is "what's on where", so the day splits into
 * one column per stage, each a stack of acts in playing order. Reading
 * down a column is one stage's night; reading across shows what plays
 * against what. Each act is a compact card — photo, time, name, bio, links.
 * On a phone the columns stack, main stage first.
 */
export function LineupStages() {
  const [dayId, setDayId] = useState(lineup[0].id);
  const day = lineup.find((d) => d.id === dayId) ?? lineup[0];
  const acts = runningOrder(day);

  return (
    <section aria-labelledby="lu-stages" className="relative py-16 xl:py-20">
      <div className="shell flex flex-col gap-8 xl:gap-12">
        <LineupHead id="lu-stages">
          <DayTabs days={lineup} value={day.id} onChange={setDayId} />
        </LineupHead>

        <div key={day.id} className="deck-fade grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-6">
          {LINEUP_STAGES.map((stage) => {
            const here = acts.filter((a) => a.stage === stage);
            return (
              <div key={stage} className="flex flex-col">
                <div className="flex items-baseline justify-between border-b-2 border-brand pb-3">
                  <h3 className="display-xs m-0 font-daltown uppercase leading-none text-white">{stage}</h3>
                  <span className="font-[family-name:var(--font-display)] text-body-s text-text-secondary">
                    {here.length} sets
                  </span>
                </div>
                <ol className="m-0 flex list-none flex-col p-0">
                  {here.map((a) => (
                    <li key={a.id} className="grid grid-cols-[96px_1fr] gap-4 border-b border-white/10 py-4 xl:grid-cols-[120px_1fr] xl:gap-5">
                      <ActPhoto act={a} sizes="120px" className="aspect-square w-full" />
                      <div className="flex min-w-0 flex-col gap-1.5">
                        <span className="font-[family-name:var(--font-display)] text-body-s font-semibold text-brand">
                          {a.start} – {a.end}
                        </span>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="display-xs font-daltown uppercase text-white">{a.name}</span>
                          {a.headliner ? <HeadlinerTag /> : null}
                        </div>
                        <p className="m-0 line-clamp-2 font-[family-name:var(--font-display)] text-body-s text-content-secondary">
                          {a.bio}
                        </p>
                        <ActLinks act={a} compact />
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
