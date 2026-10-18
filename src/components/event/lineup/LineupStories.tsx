"use client";

import { useState } from "react";

import { lineup, runningOrder } from "@/data/lineup";
import { ActLinks, ActPhoto, DayTabs, HeadlinerTag, LineupHead, StageTime } from "./shared";

/**
 * R · Stories — one act at a time, in playing order.
 *
 * The night as a sequence of full-width slides, story-style: a row of thin
 * bars along the top, one per act, filled up to the one showing; the photo
 * large on one side and the act on the other. Previous and next step
 * through the night, and so do taps on either half of the photo. It gives
 * every act the whole stage for a moment, which suits a short bill and a
 * phone.
 */
export function LineupStories() {
  const [dayId, setDayId] = useState(lineup[0].id);
  const day = lineup.find((d) => d.id === dayId) ?? lineup[0];
  const acts = runningOrder(day);
  const [idx, setIdx] = useState(0);
  const a = acts[Math.min(idx, acts.length - 1)];
  const go = (d: number) => setIdx((i) => Math.max(0, Math.min(acts.length - 1, i + d)));

  return (
    <section aria-labelledby="lu-stories" className="relative py-16 xl:py-20">
      <div className="shell flex flex-col gap-8 xl:gap-12">
        <LineupHead id="lu-stories">
          <DayTabs days={lineup} value={day.id} onChange={(id) => { setDayId(id); setIdx(0); }} />
        </LineupHead>

        <div className="flex flex-col gap-4">
          {/* progress */}
          <div className="flex gap-1" aria-hidden>
            {acts.map((x, i) => (
              <span key={x.id} className="h-1 flex-1 bg-white/10">
                <span className={`block h-full bg-brand transition-[width] duration-500 ${i <= idx ? "w-full" : "w-0"}`} />
              </span>
            ))}
          </div>

          <article key={a.id} className="deck-fade grid grid-cols-1 overflow-hidden bg-bg-secondary lg:grid-cols-2">
            <div className="relative">
              <ActPhoto act={a} sizes="(min-width: 1024px) 636px, 100vw" className="aspect-square w-full" />
              {/* tap halves */}
              <button type="button" aria-label="Previous act" onClick={() => go(-1)} className="absolute inset-y-0 left-0 w-1/3" />
              <button type="button" aria-label="Next act" onClick={() => go(1)} className="absolute inset-y-0 right-0 w-2/3" />
              <span className="pointer-events-none absolute left-4 top-4 bg-black/70 px-3 py-1.5 font-[family-name:var(--font-display)] text-[12px] font-semibold uppercase tracking-[0.1em] text-white">
                {idx + 1} / {acts.length}
              </span>
            </div>
            <div className="flex flex-col justify-between gap-8 p-6 xl:p-10">
              <div className="flex flex-col gap-4">
                <span className="font-daltown text-[clamp(56px,6vw,96px)] leading-[0.85] text-brand">{a.start}</span>
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="m-0 font-daltown text-[clamp(56px,6vw,96px)] uppercase leading-[0.85] text-white">{a.name}</h3>
                  {a.headliner ? <HeadlinerTag /> : null}
                </div>
                <StageTime act={a} className="text-text-primary" />
                <p className="m-0 max-w-[52ch] font-[family-name:var(--font-display)] text-[15px] leading-[22px] text-content-secondary">
                  {a.bio}
                </p>
                <ActLinks act={a} />
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => go(-1)}
                  disabled={idx === 0}
                  className="btn-secondary px-5 py-3 font-[family-name:var(--font-display)] text-[15px] font-semibold text-text-primary disabled:opacity-40"
                >
                  ← Previous
                </button>
                <button
                  type="button"
                  onClick={() => go(1)}
                  disabled={idx === acts.length - 1}
                  className="sweep bg-brand px-5 py-3 font-[family-name:var(--font-display)] text-[15px] font-semibold text-[#0b0b0e] after:!bg-white disabled:opacity-40"
                >
                  <span className="relative z-10">
                    Next{acts[idx + 1] ? ` · ${acts[idx + 1].start}` : ""} →
                  </span>
                </button>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
