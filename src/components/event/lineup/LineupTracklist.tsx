"use client";

import Image from "next/image";
import { useState } from "react";

import { lineup, minutesFromSix, runningOrder } from "@/data/lineup";
import { ActLinks, DayTabs, HeadlinerTag, LineupHead, StageTime } from "./shared";

/**
 * L · Tracklist — each night is a record.
 *
 * The event page opens on a turntable; this carries the idea down to the
 * lineup. A day is an album: the sleeve on the left with a record half out
 * of it, and the night's acts as its tracklist — side A, side B, each set
 * numbered like a track (A1, A2, B1…) with its start and its length. Pick a
 * track and the sleeve becomes that act's photo, the record's label takes
 * it too, and the bio and links play underneath.
 */
export function LineupTracklist() {
  const [dayId, setDayId] = useState(lineup[0].id);
  const day = lineup.find((d) => d.id === dayId) ?? lineup[0];
  const acts = runningOrder(day);
  const [pickedId, setPickedId] = useState<string | null>(null);
  const picked = acts.find((a) => a.id === pickedId) ?? acts.find((a) => a.headliner) ?? acts[0];
  const half = Math.ceil(acts.length / 2);
  const track = (i: number) => (i < half ? `A${i + 1}` : `B${i - half + 1}`);
  const dur = (s: string, e: string) => minutesFromSix(e) - minutesFromSix(s);

  return (
    <section aria-labelledby="lu-tracks" className="relative overflow-hidden py-16 xl:py-20">
      <div className="shell flex flex-col gap-8 xl:gap-12">
        <LineupHead id="lu-tracks">
          <DayTabs days={lineup} value={day.id} onChange={(id) => { setDayId(id); setPickedId(null); }} />
        </LineupHead>

        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[minmax(0,500px)_1fr] lg:gap-16">
          {/* Sleeve and record */}
          <div className="relative w-[min(420px,72vw)]">
            <span aria-hidden className="bill-record-disc deck-spin absolute inset-[3%] translate-x-[38%] rounded-full">
              <span className="absolute inset-[32%] overflow-hidden rounded-full">
                <Image src={picked.photo} alt="" fill sizes="140px" className="scale-[1.42] object-cover" />
              </span>
              <span className="absolute inset-[48.5%] rounded-full bg-[#0b0b0e]" />
            </span>
            <div key={picked.id} className="deck-fade relative aspect-square w-full overflow-hidden bg-brand shadow-[0_30px_70px_rgba(0,0,0,0.6)]">
              <Image src={picked.photo} alt={`${picked.name}, official photo`} fill sizes="420px" className="scale-[1.42] object-cover" />
              <span className="absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-black/85 to-transparent p-4 pt-12">
                <span className="display-xs font-daltown uppercase leading-none text-white">{day.label}</span>
                <span className="font-[family-name:var(--font-display)] text-caption font-semibold uppercase tracking-[0.12em] text-brand">
                  {track(acts.indexOf(picked))}
                </span>
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-8">
            <ol className="m-0 list-none p-0">
              {acts.map((a, i) => {
                const on = a.id === picked.id;
                return (
                  <li key={a.id} className={i === half ? "mt-6 border-t border-white/25 pt-6" : ""}>
                    {i === 0 || i === half ? (
                      <span className="mb-2 block font-[family-name:var(--font-display)] text-caption font-semibold uppercase tracking-[0.14em] text-text-secondary">
                        Side {i === 0 ? "A" : "B"}
                      </span>
                    ) : null}
                    <button
                      type="button"
                      onClick={() => setPickedId(a.id)}
                      aria-pressed={on}
                      className={`grid w-full grid-cols-[40px_1fr_auto] items-baseline gap-4 border-b border-white/10 py-3 text-left transition-colors ${on ? "text-brand" : "text-white hover:text-brand"}`}
                    >
                      <span className="font-[family-name:var(--font-display)] text-body-s font-semibold opacity-70">{track(i)}</span>
                      <span className="display-xs min-w-0 truncate font-daltown uppercase leading-none">{a.name}</span>
                      <span className="font-[family-name:var(--font-display)] text-body-s tabular-nums opacity-80">
                        {a.start} · {dur(a.start, a.end)} min
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>

            <article key={picked.id} className="deck-fade flex flex-col gap-3">
              <div className="flex flex-wrap items-center gap-3">
                <h3 className="card-title text-white">{picked.name}</h3>
                {picked.headliner ? <HeadlinerTag /> : null}
              </div>
              <StageTime act={picked} className="text-brand" />
              <p className="m-0 max-w-[60ch] font-[family-name:var(--font-display)] text-body text-content-secondary">
                {picked.bio}
              </p>
              <ActLinks act={picked} />
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
