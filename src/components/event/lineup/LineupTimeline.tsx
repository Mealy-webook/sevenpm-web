"use client";

import { useState } from "react";

import { LINEUP_STAGES, lineup, minutesFromSix, runningOrder } from "@/data/lineup";
import {
  ActLinks,
  ActPhoto,
  DayTabs,
  HeadlinerTag,
  LineupHead,
  StageTime,
} from "./shared";

/**
 * B · Timeline — one lane per stage, sets placed on the clock.
 *
 * The night as a grid: hours across, a lane for each stage, and every set a
 * block the length of its set, so two acts on at once sit one above the
 * other and a clash is visible before anyone has to work it out. Picking a
 * block opens that act underneath — photo, bio, links. On a phone the grid
 * keeps its width and scrolls sideways; a timeline squeezed to 375px stops
 * being one.
 */
export function LineupTimeline() {
  const [dayId, setDayId] = useState(lineup[0].id);
  const day = lineup.find((d) => d.id === dayId) ?? lineup[0];
  const acts = runningOrder(day);
  const [pickedId, setPickedId] = useState<string | null>(null);
  const picked = acts.find((a) => a.id === pickedId) ?? acts.find((a) => a.headliner) ?? acts[0];

  const from = Math.floor(Math.min(...acts.map((a) => minutesFromSix(a.start))) / 60) * 60;
  const to = Math.ceil(Math.max(...acts.map((a) => minutesFromSix(a.end))) / 60) * 60;
  const span = to - from;
  const pct = (m: number) => `${((m - from) / span) * 100}%`;
  const hours = Array.from({ length: span / 60 + 1 }, (_, i) => from + i * 60);
  const label = (m: number) => String((18 + Math.floor(m / 60)) % 24).padStart(2, "0") + ":00";

  return (
    <section aria-labelledby="lu-time" className="relative py-16 xl:py-20">
      <div className="shell flex flex-col gap-8 xl:gap-12">
        <LineupHead id="lu-time">
          <DayTabs
            days={lineup}
            value={day.id}
            onChange={(id) => {
              setDayId(id);
              setPickedId(null);
            }}
          />
        </LineupHead>

        <div className="-mx-[var(--shell-gutter)] overflow-x-auto px-[var(--shell-gutter)] [scrollbar-width:none]">
          <div className="relative min-w-[960px]">
            {/* Hours */}
            <div className="relative ml-[140px] h-8">
              {hours.map((m) => (
                <span
                  key={m}
                  className="absolute top-0 -translate-x-1/2 font-[family-name:var(--font-display)] text-[12px] tracking-[0.08em] text-text-secondary"
                  style={{ left: pct(m) }}
                >
                  {label(m)}
                </span>
              ))}
            </div>

            {LINEUP_STAGES.map((stage) => (
              <div key={stage} className="flex border-t border-white/10">
                <span className="flex w-[140px] shrink-0 items-center font-[family-name:var(--font-display)] text-[13px] font-semibold uppercase tracking-[0.08em] text-text-primary">
                  {stage}
                </span>
                <div className="relative h-[112px] flex-1">
                  {hours.map((m) => (
                    <span key={m} aria-hidden className="absolute inset-y-0 w-px bg-white/5" style={{ left: pct(m) }} />
                  ))}
                  {acts
                    .filter((a) => a.stage === stage)
                    .map((a) => {
                      const on = a.id === picked.id;
                      const s = minutesFromSix(a.start);
                      const e = minutesFromSix(a.end);
                      return (
                        <button
                          key={a.id}
                          type="button"
                          onClick={() => setPickedId(a.id)}
                          aria-pressed={on}
                          className={`absolute inset-y-3 flex items-stretch gap-3 overflow-hidden border text-left transition-colors duration-200 ${on ? "border-brand bg-brand text-[#0b0b0e]" : a.headliner ? "border-white/25 bg-bg-tertiary text-white hover:border-white/50" : "border-white/10 bg-bg-secondary text-white hover:border-white/40"}`}
                          style={{ left: `calc(${pct(s)} + 2px)`, width: `calc(${((e - s) / span) * 100}% - 4px)` }}
                        >
                          <ActPhoto act={a} sizes="88px" className="aspect-square h-full shrink-0" />
                          <span className="flex min-w-0 flex-col justify-center gap-1 pr-3">
                            <span className="truncate font-daltown text-[26px] uppercase leading-[22px]">{a.name}</span>
                            <span className="font-[family-name:var(--font-display)] text-[12px] font-medium opacity-75">
                              {a.start} – {a.end}
                            </span>
                          </span>
                        </button>
                      );
                    })}
                </div>
              </div>
            ))}
            <div className="border-t border-white/10" />
          </div>
        </div>

        {/* The picked act */}
        <article key={picked.id} className="deck-fade grid grid-cols-1 gap-6 bg-bg-secondary p-6 sm:grid-cols-[220px_1fr] xl:gap-10 xl:p-8">
          <ActPhoto act={picked} sizes="220px" className="aspect-square w-full max-w-[220px]" />
          <div className="flex flex-col justify-center gap-3">
            {picked.headliner ? <HeadlinerTag /> : null}
            <h3 className="card-title text-white">{picked.name}</h3>
            <StageTime act={picked} className="text-brand" />
            <p className="m-0 max-w-[60ch] font-[family-name:var(--font-display)] text-[15px] leading-[22px] text-content-secondary">
              {picked.bio}
            </p>
            <ActLinks act={picked} />
          </div>
        </article>
      </div>
    </section>
  );
}
