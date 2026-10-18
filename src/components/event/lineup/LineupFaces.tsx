"use client";

import Image from "next/image";
import { useState } from "react";

import { lineup, runningOrder } from "@/data/lineup";
import { ActLinks, DayTabs, HeadlinerTag, LineupHead, StageTime } from "./shared";

/**
 * E · Faces — the comp's wall of portraits, made to answer questions.
 *
 * The lineup comp (2550:20117) is a band of overlapping circular portraits
 * with nothing else on it. This keeps that band — the day's acts as
 * circles, the headliner's larger, each overlapping the next — and makes
 * each face a control: pick one and the act steps into a spotlight under
 * the band with its photo, stage, time, bio and links. The time sits under
 * each face so the band still reads as a running order.
 */
export function LineupFaces() {
  const [dayId, setDayId] = useState(lineup[0].id);
  const day = lineup.find((d) => d.id === dayId) ?? lineup[0];
  const acts = runningOrder(day);
  const [pickedId, setPickedId] = useState<string | null>(null);
  const picked = acts.find((a) => a.id === pickedId) ?? acts.find((a) => a.headliner) ?? acts[0];

  return (
    <section aria-labelledby="lu-faces" className="relative py-16 xl:py-20">
      <div className="shell flex flex-col gap-8 xl:gap-12">
        <LineupHead id="lu-faces">
          <DayTabs
            days={lineup}
            value={day.id}
            onChange={(id) => {
              setDayId(id);
              setPickedId(null);
            }}
          />
        </LineupHead>

        <div className="-mx-[var(--shell-gutter)] overflow-x-auto px-[var(--shell-gutter)] pb-2 [scrollbar-width:none]">
          <ul key={day.id} className="deck-fade m-0 flex w-max list-none items-end p-0 lg:mx-auto">
            {acts.map((a, i) => {
              const on = a.id === picked.id;
              const size = a.headliner ? "size-[200px] xl:size-[240px]" : "size-[136px] xl:size-[168px]";
              return (
                <li key={a.id} className="flex flex-col items-center gap-3" style={{ marginLeft: i ? -18 : 0, zIndex: on ? 20 : 10 - i }}>
                  <button
                    type="button"
                    onClick={() => setPickedId(a.id)}
                    aria-pressed={on}
                    aria-label={`${a.name}, ${a.start}`}
                    className={`relative overflow-hidden rounded-full transition-[scale,filter] duration-300 ${size} ${on ? "scale-105 ring-4 ring-brand ring-offset-4 ring-offset-bg-primary" : "grayscale hover:grayscale-0"}`}
                  >
                    <Image src={a.photo} alt="" fill sizes="240px" className="object-cover" />
                  </button>
                  <span className={`font-[family-name:var(--font-display)] text-body-s font-semibold ${on ? "text-brand" : "text-text-secondary"}`}>
                    {a.start}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>

        <article key={picked.id} className="deck-fade grid grid-cols-1 items-center gap-6 border-t border-white/10 pt-8 lg:grid-cols-[1fr_auto] lg:gap-12">
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="section-title m-0 font-daltown uppercase text-white">
                {picked.name}
              </h3>
              {picked.headliner ? <HeadlinerTag /> : null}
            </div>
            <StageTime act={picked} className="text-brand" />
            <p className="m-0 max-w-[62ch] font-[family-name:var(--font-display)] text-body text-content-secondary">
              {picked.bio}
            </p>
          </div>
          <ActLinks act={picked} />
        </article>
      </div>
    </section>
  );
}
