"use client";

import { useState } from "react";

import { lineup, runningOrder } from "@/data/lineup";
import { ActLinks, ActPhoto, DayTabs, LineupHead } from "./shared";

/**
 * I · Stubs — every set is a ticket.
 *
 * The site sells with perforated stubs, so the lineup speaks the same
 * language: each act is a landscape stub — photo on the stub end, a
 * perforation, then the set as the ticket's printed fields (time, stage,
 * the act) with the bio and the links. Two across on desktop, so six acts
 * are three neat rows; one across on a phone.
 */
export function LineupStubs() {
  const [dayId, setDayId] = useState(lineup[0].id);
  const day = lineup.find((d) => d.id === dayId) ?? lineup[0];

  return (
    <section aria-labelledby="lu-stubs" className="relative py-16 xl:py-20">
      <div className="shell flex flex-col gap-8 xl:gap-12">
        <LineupHead id="lu-stubs">
          <DayTabs days={lineup} value={day.id} onChange={setDayId} />
        </LineupHead>

        <ul key={day.id} className="deck-fade m-0 grid list-none grid-cols-1 gap-4 p-0 lg:grid-cols-2">
          {runningOrder(day).map((a) => (
            <li key={a.id} className={`flex ${a.headliner ? "bg-brand text-[#0b0b0e]" : "bg-bg-secondary text-white"}`}>
              <ActPhoto act={a} sizes="200px" className="aspect-square w-[34%] shrink-0 self-stretch" />

              <span aria-hidden className={`relative w-0 shrink-0 border-l-2 border-dashed ${a.headliner ? "border-black/25" : "border-white/15"}`}>
                <span className="absolute -left-3 -top-3 size-6 rounded-full bg-bg-primary" />
                <span className="absolute -bottom-3 -left-3 size-6 rounded-full bg-bg-primary" />
              </span>

              <div className="flex min-w-0 flex-1 flex-col gap-3 p-5">
                <div className={`flex items-center justify-between gap-3 font-[family-name:var(--font-display)] text-[12px] font-semibold uppercase tracking-[0.12em] ${a.headliner ? "text-black/60" : "text-text-secondary"}`}>
                  <span>{a.stage}</span>
                  {a.headliner ? <span>Headliner</span> : null}
                </div>
                <div className="flex items-baseline gap-3">
                  <span className={`font-daltown text-[40px] leading-none ${a.headliner ? "" : "text-brand"}`}>{a.start}</span>
                  <span className={`font-[family-name:var(--font-display)] text-[13px] ${a.headliner ? "text-black/60" : "text-text-secondary"}`}>to {a.end}</span>
                </div>
                <h3 className="card-title">{a.name}</h3>
                <p className={`m-0 line-clamp-3 font-[family-name:var(--font-display)] text-[13px] leading-[19px] ${a.headliner ? "text-black/70" : "text-content-secondary"}`}>
                  {a.bio}
                </p>
                <div className={a.headliner ? "[&_a]:!border-black/20 [&_a]:!bg-black/10 [&_a]:!text-[#0b0b0e] [&_img]:invert" : ""}>
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
