"use client";

import { useState } from "react";

import { LINEUP_STAGES, lineup, minutesFromSix, runningOrder } from "@/data/lineup";
import type { LineupAct } from "@/data/lineup";
import { ActLinks, ActPhoto, DayTabs, HeadlinerTag, LineupHead } from "./shared";

/**
 * J · Live — on now, up next.
 *
 * During the festival the question is not "who is playing" but "who is on
 * right now, and what's next". So the day leads with each stage's current
 * set at full size and the next one beside it, with the rest of the night
 * as a short list underneath. Before the gates open it shows the first set
 * as "First up"; after the last, the night's headliner.
 *
 * On the real site the clock is the visitor's own. Here it is a slider, so
 * the behaviour can be seen at any point in the evening.
 */
function fmt(m: number) {
  const h = (18 + Math.floor(m / 60)) % 24;
  return `${String(h).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
}

export function LineupLive() {
  const [dayId, setDayId] = useState(lineup[0].id);
  const day = lineup.find((d) => d.id === dayId) ?? lineup[0];
  const acts = runningOrder(day);
  const first = minutesFromSix(acts[0].start);
  const last = Math.max(...acts.map((a) => minutesFromSix(a.end)));
  const [now, setNow] = useState(240); // 22:00

  const onAt = (stage: string) =>
    acts.find((a) => a.stage === stage && minutesFromSix(a.start) <= now && now < minutesFromSix(a.end));
  const nextAt = (stage: string) =>
    acts.find((a) => a.stage === stage && minutesFromSix(a.start) > now);
  const later = acts.filter((a) => minutesFromSix(a.start) > now);

  return (
    <section aria-labelledby="lu-live" className="relative py-16 xl:py-20">
      <div className="shell flex flex-col gap-8 xl:gap-12">
        <LineupHead id="lu-live">
          <DayTabs days={lineup} value={day.id} onChange={setDayId} />
        </LineupHead>

        <label className="flex flex-col gap-2 border border-dashed border-white/20 p-4 sm:flex-row sm:items-center sm:gap-6">
          <span className="font-[family-name:var(--font-display)] text-body-s font-semibold uppercase tracking-[0.12em] text-text-secondary">
            Preview the night at <span className="text-brand">{fmt(now)}</span>
          </span>
          <input
            type="range"
            min={first - 30}
            max={last + 15}
            step={15}
            value={now}
            onChange={(e) => setNow(Number(e.target.value))}
            className="flex-1 accent-[var(--color-brand)]"
          />
        </label>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {LINEUP_STAGES.map((stage) => {
            const cur = onAt(stage);
            const nxt = nextAt(stage);
            return (
              <div key={stage} className="flex flex-col gap-4 bg-bg-secondary p-5 xl:p-6">
                <span className="font-[family-name:var(--font-display)] text-body-s font-semibold uppercase tracking-[0.14em] text-text-primary">
                  {stage}
                </span>
                {cur ? (
                  <Now act={cur} label="On now" now={now} />
                ) : nxt ? (
                  <Now act={nxt} label={now < first ? "First up" : "Next, after the break"} now={now} />
                ) : (
                  <p className="m-0 py-10 font-[family-name:var(--font-display)] text-body text-text-secondary">
                    Nothing more on this stage tonight.
                  </p>
                )}
                {cur && nxt ? (
                  <div className="flex items-center gap-4 border-t border-white/10 pt-4">
                    <ActPhoto act={nxt} sizes="64px" className="aspect-square w-16 shrink-0" />
                    <div className="flex flex-col">
                      <span className="font-[family-name:var(--font-display)] text-caption font-semibold uppercase tracking-[0.12em] text-text-secondary">
                        Up next · {nxt.start}
                      </span>
                      <span className="display-xs font-daltown uppercase text-white">{nxt.name}</span>
                    </div>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>

        {later.length ? (
          <div className="flex flex-col gap-3">
            <span className="font-[family-name:var(--font-display)] text-body-s font-semibold uppercase tracking-[0.14em] text-text-secondary">
              Later tonight
            </span>
            <ul className="m-0 flex list-none flex-wrap gap-x-8 gap-y-2 p-0">
              {later.map((a) => (
                <li key={a.id} className="font-[family-name:var(--font-display)] text-body text-text-primary">
                  <span className="text-brand">{a.start}</span> {a.name} · {a.stage}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </section>
  );
}

function Now({ act, label, now }: { act: LineupAct; label: string; now: number }) {
  const s = minutesFromSix(act.start);
  const e = minutesFromSix(act.end);
  const progress = Math.min(1, Math.max(0, (now - s) / (e - s)));
  return (
    <article className="grid grid-cols-[120px_1fr] gap-5 sm:grid-cols-[180px_1fr]">
      <ActPhoto act={act} sizes="180px" className="aspect-square w-full" />
      <div className="flex min-w-0 flex-col gap-2">
        <span className="flex items-center gap-2 font-[family-name:var(--font-display)] text-caption font-bold uppercase tracking-[0.12em] text-brand">
          {label === "On now" ? <span className="size-2 animate-pulse rounded-full bg-brand" /> : null}
          {label}
        </span>
        <div className="flex flex-wrap items-center gap-3">
          <h3 className="card-title text-white">{act.name}</h3>
          {act.headliner ? <HeadlinerTag /> : null}
        </div>
        <span className="font-[family-name:var(--font-display)] text-body-s text-text-secondary">
          {act.start} – {act.end}
        </span>
        {label === "On now" ? (
          <span aria-hidden className="block h-1 w-full bg-white/10">
            <span className="block h-full bg-brand" style={{ width: `${progress * 100}%` }} />
          </span>
        ) : null}
        <p className="m-0 line-clamp-3 font-[family-name:var(--font-display)] text-body-s text-content-secondary">
          {act.bio}
        </p>
        <ActLinks act={act} compact />
      </div>
    </article>
  );
}
