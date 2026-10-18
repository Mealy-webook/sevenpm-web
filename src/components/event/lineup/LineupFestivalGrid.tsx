"use client";

import Image from "next/image";
import { useState } from "react";

import { lineup, runningOrder } from "@/data/lineup";
import { ActLinks, ActPhoto, HeadlinerTag, LineupHead, StageTime } from "./shared";

/**
 * Q · Whole festival — every night on one grid.
 *
 * The other directions show a day at a time. This shows the run: one row
 * per night, each night's acts across it in playing order as faces with
 * their start times, the headliner's face the largest in its row. Picking
 * a face opens the act in a panel under the grid. It answers "which night
 * should I come" before "who is on tonight", which is the order a visitor
 * buying a single-day ticket actually asks in.
 */
export function LineupFestivalGrid() {
  const all = lineup.flatMap((d) => d.acts);
  const [pickedId, setPickedId] = useState(all.find((a) => a.headliner)?.id ?? all[0].id);
  const picked = all.find((a) => a.id === pickedId) ?? all[0];

  return (
    <section aria-labelledby="lu-grid" className="relative py-16 xl:py-20">
      <div className="shell flex flex-col gap-8 xl:gap-12">
        <LineupHead id="lu-grid">
          <span className="font-[family-name:var(--font-display)] text-body-s uppercase tracking-[0.12em] text-text-secondary">
            {lineup.length} nights · {all.length} acts
          </span>
        </LineupHead>

        <ol className="m-0 flex list-none flex-col p-0">
          {lineup.map((day, i) => (
            <li key={day.id} className="grid grid-cols-1 items-center gap-4 border-t border-white/10 py-5 md:grid-cols-[150px_1fr] md:gap-6">
              <div className="flex flex-col">
                <span className="font-[family-name:var(--font-display)] text-caption font-semibold uppercase tracking-[0.12em] text-text-secondary">
                  Night {i + 1}
                </span>
                <span className="display-xs font-daltown uppercase leading-none text-white">{day.label}</span>
              </div>
              <ul className="m-0 flex list-none flex-wrap items-end gap-3 p-0 sm:gap-4">
                {runningOrder(day).map((a) => {
                  const on = a.id === picked.id;
                  return (
                    <li key={a.id}>
                      <button
                        type="button"
                        onClick={() => setPickedId(a.id)}
                        aria-pressed={on}
                        aria-label={`${a.name}, ${day.label} ${a.start}`}
                        className="group flex flex-col items-center gap-2"
                      >
                        <span className={`relative block overflow-hidden rounded-full transition-[filter,box-shadow] duration-300 ${a.headliner ? "size-24 sm:size-28" : "size-16 sm:size-20"} ${on ? "ring-4 ring-brand ring-offset-2 ring-offset-bg-primary" : "grayscale group-hover:grayscale-0"}`}>
                          <Image src={a.photo} alt="" fill sizes="112px" className="object-cover" />
                        </span>
                        <span className={`font-[family-name:var(--font-display)] text-caption font-semibold tabular-nums ${on ? "text-brand" : "text-text-secondary"}`}>
                          {a.start}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </li>
          ))}
        </ol>

        <article key={picked.id} className="deck-fade grid grid-cols-1 gap-6 bg-bg-secondary p-6 sm:grid-cols-[200px_1fr] xl:p-8">
          <ActPhoto act={picked} sizes="200px" className="aspect-square w-full max-w-[200px]" />
          <div className="flex flex-col justify-center gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="card-title text-white">{picked.name}</h3>
              {picked.headliner ? <HeadlinerTag /> : null}
            </div>
            <StageTime act={picked} className="text-brand" />
            <p className="m-0 max-w-[60ch] font-[family-name:var(--font-display)] text-body text-content-secondary">
              {picked.bio}
            </p>
            <ActLinks act={picked} />
          </div>
        </article>
      </div>
    </section>
  );
}
