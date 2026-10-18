"use client";

import { useState } from "react";

import { lineup, runningOrder } from "@/data/lineup";
import { ActLinks, ActPhoto, DayTabs, HeadlinerTag, LineupHead, StageTime } from "./shared";

/* The strip fills the row whatever the night's size: 3, 4 or 5 supports. */
const COLS: Record<number, string> = {
  3: "lg:grid-cols-3",
  4: "lg:grid-cols-4",
  5: "lg:grid-cols-5",
};

/**
 * N · Top of the bill — the headliner first, at full width.
 *
 * Each night is sold on its headliner, so the day opens on them: a
 * full-width photo banner with the name at display size, the stage and
 * time, the bio and the links laid over it. The rest of the night follows
 * as a strip of smaller cards in playing order. It is the most promotional
 * of the directions — closest to how the festival announces a night.
 */
export function LineupBill() {
  const [dayId, setDayId] = useState(lineup[0].id);
  const day = lineup.find((d) => d.id === dayId) ?? lineup[0];
  const acts = runningOrder(day);
  const top = acts.find((a) => a.headliner) ?? acts[acts.length - 1];
  const rest = acts.filter((a) => a.id !== top.id);

  return (
    <section aria-labelledby="lu-bill" className="relative py-16 xl:py-20">
      <div className="shell flex flex-col gap-8 xl:gap-12">
        <LineupHead id="lu-bill">
          <DayTabs days={lineup} value={day.id} onChange={setDayId} />
        </LineupHead>

        <div key={day.id} className="deck-fade flex flex-col gap-4">
          <article className="relative grid min-h-[460px] overflow-hidden bg-bg-secondary lg:grid-cols-2">
            <ActPhoto act={top} sizes="(min-width: 1024px) 636px, 100vw" className="aspect-square w-full lg:aspect-auto lg:h-full" />
            <div className="flex flex-col justify-end gap-4 p-6 xl:p-10">
              <HeadlinerTag />
              <h3 className="section-title m-0 font-daltown uppercase text-white">
                {top.name}
              </h3>
              <StageTime act={top} className="text-brand" />
              <p className="m-0 max-w-[52ch] font-[family-name:var(--font-display)] text-body text-content-secondary">
                {top.bio}
              </p>
              <ActLinks act={top} />
            </div>
          </article>

          <ul className={`m-0 grid list-none grid-cols-2 gap-4 p-0 md:grid-cols-3 ${COLS[rest.length] ?? "lg:grid-cols-5"}`}>
            {rest.map((a) => (
              <li key={a.id} className="flex flex-col gap-3 bg-bg-secondary p-3">
                <ActPhoto act={a} sizes="240px" className="aspect-square w-full" />
                <span className="font-[family-name:var(--font-display)] text-caption font-semibold uppercase tracking-[0.08em] text-brand">
                  {a.start} · {a.stage}
                </span>
                <span className="display-xs font-daltown uppercase text-white">{a.name}</span>
                <p className="m-0 line-clamp-2 font-[family-name:var(--font-display)] text-caption text-content-secondary">
                  {a.bio}
                </p>
                <div className="mt-auto">
                  <ActLinks act={a} compact />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
