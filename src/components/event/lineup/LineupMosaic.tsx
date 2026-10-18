"use client";

import { useState } from "react";

import { lineup, runningOrder } from "@/data/lineup";
import { ActLinks, ActPhoto, DayTabs, HeadlinerTag, LineupHead } from "./shared";

/**
 * O · Mosaic — the night as a photo wall, the bio behind each face.
 *
 * A gapless bento: the headliner takes a 2×2 tile, the rest fill the grid
 * around them, every tile a photo with the time and name on it. Hovering
 * or focusing a tile lays its bio, stage and links over the picture; on a
 * phone the tiles carry them underneath instead. Four, five or six acts
 * all close the grid without a hole, because the layout is chosen by count.
 */
const SPANS: Record<number, string[]> = {
  4: ["lg:col-span-2 lg:row-span-2", "lg:col-span-2", "", ""],
  5: ["lg:col-span-2 lg:row-span-2", "", "", "", ""],
  6: ["lg:col-span-2 lg:row-span-2", "", "", "lg:col-span-2", "", ""],
};

export function LineupMosaic() {
  const [dayId, setDayId] = useState(lineup[0].id);
  const day = lineup.find((d) => d.id === dayId) ?? lineup[0];
  const acts = runningOrder(day);
  const ordered = [...acts.filter((a) => a.headliner), ...acts.filter((a) => !a.headliner)];
  const spans = SPANS[ordered.length] ?? [];
  const cols = ordered.length === 6 ? "lg:grid-cols-5" : "lg:grid-cols-4";

  return (
    <section aria-labelledby="lu-mosaic" className="relative py-16 xl:py-20">
      <div className="shell flex flex-col gap-8 xl:gap-12">
        <LineupHead id="lu-mosaic">
          <DayTabs days={lineup} value={day.id} onChange={setDayId} />
        </LineupHead>

        <ul key={day.id} className={`deck-fade m-0 grid list-none auto-rows-[260px] grid-cols-1 gap-1 p-0 sm:grid-cols-2 lg:grid-flow-dense ${cols}`}>
          {ordered.map((a, i) => (
            <li key={a.id} tabIndex={0} className={`group relative overflow-hidden bg-ink-900 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand ${spans[i] ?? ""}`}>
              <div className="absolute inset-0">
                <ActPhoto act={a} sizes="(min-width: 1024px) 640px, 50vw" className="size-full [&_img]:transition-[scale] [&_img]:duration-700 group-hover:[&_img]:scale-[1.5]" />
              </div>
              <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent transition-colors duration-300 group-hover:bg-black/60 group-focus-within:bg-black/60" />
              <div className="absolute inset-x-0 bottom-0 flex flex-col gap-2 p-5">
                <div className="flex items-center gap-3">
                  <span className="display-xs font-daltown leading-none text-brand">{a.start}</span>
                  {a.headliner ? <HeadlinerTag /> : null}
                </div>
                <span className={`font-daltown uppercase text-white ${a.headliner ? "display-m" : "display-xs"}`}>
                  {a.name}
                </span>
                <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-500 group-hover:grid-rows-[1fr] group-focus-within:grid-rows-[1fr]">
                  <div className="flex flex-col gap-3 overflow-hidden">
                    <span className="pt-1 font-[family-name:var(--font-display)] text-caption font-semibold uppercase tracking-[0.1em] text-text-primary">
                      {a.stage} · to {a.end}
                    </span>
                    <p className="m-0 line-clamp-3 font-[family-name:var(--font-display)] text-body-s text-content-primary">
                      {a.bio}
                    </p>
                    <ActLinks act={a} />
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
