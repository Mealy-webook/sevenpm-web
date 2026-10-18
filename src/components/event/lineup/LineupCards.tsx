"use client";

import { useState } from "react";

import { lineup, runningOrder } from "@/data/lineup";
import { ActLinks, ActPhoto, DayTabs, HeadlinerTag, LineupHead } from "./shared";

/**
 * C · Cards — a card per act, the photo leading.
 *
 * The official photo gets the most room of any direction: each card is the
 * portrait with the set time and stage on a strip across its foot, then the
 * name, the bio and the links. Three across on desktop; the headliner's
 * card is two wide, so the bill's order shows without a number. Four acts
 * fill one row and a half, six fill two — both are tidy. One across on a
 * phone, the headliner first.
 */
export function LineupCards() {
  const [dayId, setDayId] = useState(lineup[0].id);
  const day = lineup.find((d) => d.id === dayId) ?? lineup[0];
  const acts = runningOrder(day);
  /* Headliner first, then the running order. */
  const ordered = [...acts.filter((a) => a.headliner), ...acts.filter((a) => !a.headliner)];

  return (
    <section aria-labelledby="lu-cards" className="relative py-16 xl:py-20">
      <div className="shell flex flex-col gap-8 xl:gap-12">
        <LineupHead id="lu-cards">
          <DayTabs days={lineup} value={day.id} onChange={setDayId} />
        </LineupHead>

        <ul key={day.id} className="deck-fade m-0 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3">
          {ordered.map((a) => (
            <li key={a.id} className={`group flex flex-col bg-bg-secondary ${a.headliner ? "sm:col-span-2" : ""}`}>
              <div className="relative">
                <ActPhoto
                  act={a}
                  sizes={a.headliner ? "(min-width: 1024px) 830px, 100vw" : "(min-width: 1024px) 410px, 100vw"}
                  className={`w-full ${a.headliner ? "aspect-[2/1]" : "aspect-[4/3]"} [&_img]:transition-[scale] [&_img]:duration-700 group-hover:[&_img]:scale-[1.5]`}
                />
                <span className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 bg-gradient-to-t from-black/85 to-transparent px-5 pb-4 pt-10">
                  <span className="display-xs font-daltown leading-none text-brand">{a.start}</span>
                  <span className="font-[family-name:var(--font-display)] text-caption font-semibold uppercase tracking-[0.1em] text-white">
                    {a.stage} · to {a.end}
                  </span>
                </span>
              </div>
              <div className="flex flex-1 flex-col gap-3 p-5 xl:p-6">
                {a.headliner ? <HeadlinerTag /> : null}
                <h3 className="card-title text-white">{a.name}</h3>
                <p className="m-0 font-[family-name:var(--font-display)] text-body text-content-secondary">
                  {a.bio}
                </p>
                <div className="mt-auto pt-2">
                  <ActLinks act={a} />
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
