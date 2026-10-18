"use client";

import { useState } from "react";

import { lineup, runningOrder } from "@/data/lineup";
import { ActLinks, ActPhoto, HeadlinerTag, LineupHead, StageTime } from "./shared";

/**
 * D · Poster — the whole bill at once, set like a festival poster.
 *
 * No tabs: every day is on the page, the headliner on a line of its own at
 * display size and the rest of the day under it at a step down, each with
 * its start time. That is how a festival announces itself, and it lets a
 * visitor see the whole run before choosing a night. Every name is a
 * button; the act it names opens in a panel that stays beside the bill on
 * desktop and sits under it on a phone.
 */
export function LineupPoster() {
  const all = lineup.flatMap((d) => d.acts);
  const [pickedId, setPickedId] = useState(all.find((a) => a.headliner)?.id ?? all[0].id);
  const picked = all.find((a) => a.id === pickedId) ?? all[0];

  return (
    <section aria-labelledby="lu-poster" className="relative py-16 xl:py-20">
      <div className="shell flex flex-col gap-8 xl:gap-12">
        <LineupHead id="lu-poster" />

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_380px] lg:gap-12">
          <ol className="m-0 flex list-none flex-col p-0">
            {lineup.map((day, i) => {
              const acts = runningOrder(day);
              const top = acts.find((a) => a.headliner);
              const rest = acts.filter((a) => !a.headliner);
              return (
                <li key={day.id} className="flex flex-col gap-4 border-t border-white/15 py-8 first:border-t-0 first:pt-0">
                  <span className="font-[family-name:var(--font-display)] text-body-s font-semibold uppercase tracking-[0.14em] text-brand">
                    Day {i + 1} · {day.label}
                  </span>
                  {top ? (
                    <NameButton act={top} on={top.id === picked.id} big onPick={setPickedId} />
                  ) : null}
                  <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2">
                    {rest.map((a) => (
                      <NameButton key={a.id} act={a} on={a.id === picked.id} onPick={setPickedId} />
                    ))}
                  </div>
                </li>
              );
            })}
          </ol>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <article key={picked.id} className="deck-fade flex flex-col gap-4 bg-bg-secondary p-5">
              <ActPhoto act={picked} sizes="380px" className="aspect-square w-full" />
              {picked.headliner ? <HeadlinerTag /> : null}
              <h3 className="card-title text-white">{picked.name}</h3>
              <StageTime act={picked} className="text-brand" />
              <p className="m-0 font-[family-name:var(--font-display)] text-body text-content-secondary">
                {picked.bio}
              </p>
              <ActLinks act={picked} />
            </article>
          </aside>
        </div>
      </div>
    </section>
  );
}

function NameButton({
  act,
  on,
  big = false,
  onPick,
}: {
  act: { id: string; name: string; start: string };
  on: boolean;
  big?: boolean;
  onPick: (id: string) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onPick(act.id)}
      aria-pressed={on}
      className={`group inline-flex items-baseline gap-3 text-left font-daltown uppercase transition-colors duration-200 ${big ? "section-title" : "display-s"} ${on ? "text-brand" : "text-white hover:text-brand"}`}
    >
      {act.name}
      <span className={`font-[family-name:var(--font-display)] font-semibold normal-case tracking-normal ${big ? "text-title-body" : "text-body-s"} ${on ? "text-brand" : "text-text-secondary"}`}>
        {act.start}
      </span>
    </button>
  );
}
