"use client";

import { useState } from "react";

import { lineup, runningOrder } from "@/data/lineup";
import {
  ActLinks,
  ActPhoto,
  DayTabs,
  HeadlinerTag,
  LineupHead,
} from "./shared";

/**
 * A · Running order — one row per act, in the order they play.
 *
 * The time leads each row because "when" is what a visitor reads a lineup
 * for; then the photo, the name, the stage, the bio and the two links, all
 * visible without a tap. Four to six rows a day fit one screen on desktop
 * and scroll cleanly on a phone, where the row stacks: photo and time on
 * one line, everything else under it. The headliner's row is the only one
 * on a raised ground.
 */
export function LineupRunningOrder() {
  const [dayId, setDayId] = useState(lineup[0].id);
  const day = lineup.find((d) => d.id === dayId) ?? lineup[0];

  return (
    <section aria-labelledby="lu-run" className="relative py-16 xl:py-20">
      <div className="shell flex flex-col gap-8 xl:gap-12">
        <LineupHead id="lu-run">
          <DayTabs days={lineup} value={day.id} onChange={setDayId} />
        </LineupHead>

        <ol key={day.id} className="deck-fade m-0 list-none border-b border-white/10 p-0">
          {runningOrder(day).map((a) => (
            <li
              key={a.id}
              className={`grid grid-cols-[88px_1fr] gap-x-5 gap-y-4 border-t border-white/10 p-4 sm:grid-cols-[120px_120px_1fr] lg:grid-cols-[140px_160px_1fr_auto] lg:items-center lg:gap-x-8 lg:px-6 lg:py-5 ${a.headliner ? "bg-bg-secondary" : ""}`}
            >
              {/* When */}
              <div className="flex flex-col justify-center">
                <span className="display-s font-daltown text-brand">
                  {a.start}
                </span>
                <span className="font-[family-name:var(--font-display)] text-body-s text-text-secondary">
                  to {a.end}
                </span>
              </div>

              <ActPhoto act={a} sizes="160px" className="-order-1 aspect-square w-full sm:order-none" />

              {/* Who, where */}
              <div className="col-span-2 flex min-w-0 flex-col gap-2 sm:col-span-1">
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="card-title text-white">{a.name}</h3>
                  {a.headliner ? <HeadlinerTag /> : null}
                </div>
                <span className="font-[family-name:var(--font-display)] text-body-s font-medium uppercase tracking-[0.08em] text-text-primary">
                  {a.stage}
                </span>
                <p className="m-0 max-w-[60ch] font-[family-name:var(--font-display)] text-body text-content-secondary">
                  {a.bio}
                </p>
              </div>

              <div className="col-span-2 sm:col-span-3 lg:col-span-1">
                <ActLinks act={a} />
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
