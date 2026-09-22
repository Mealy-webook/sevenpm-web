"use client";

import { useState } from "react";

import { LOADERS } from "@/components/motion/loaders/LoaderOptions";

/**
 * The loading screens side by side, each in its own stage so all four can be
 * watched without reloading the site.
 *
 * Every option plays once on load and again on Replay; "Play all" restarts
 * them together, which is the only fair way to compare how long each one
 * keeps you waiting. Review chrome — it goes with the choice.
 */
export default function LoadersPreview() {
  /* Bumping the key remounts a stage, which is what replays it. */
  const [runs, setRuns] = useState<Record<string, number>>({});

  const replay = (id: string) =>
    setRuns((current) => ({ ...current, [id]: (current[id] ?? 0) + 1 }));

  const replayAll = () =>
    setRuns((current) =>
      Object.fromEntries(
        LOADERS.map((option) => [option.id, (current[option.id] ?? 0) + 1]),
      ),
    );

  return (
    <main className="min-h-svh bg-bg-primary">
      <div className="shell flex flex-col gap-10 py-14">
        <div className="flex flex-col gap-3">
          <h1 className="m-0 font-daltown text-[clamp(40px,6vw,88px)] uppercase leading-[0.9] text-white">
            Loading screens
          </h1>
          <p className="m-0 max-w-[640px] font-[family-name:var(--font-display)] text-[15px] leading-[22px] text-content-secondary">
            Four alternatives to the needle drop, each about a second and a half
            to the reveal. They play on load; Replay runs one again.
          </p>
          <button
            type="button"
            onClick={replayAll}
            className="btn-secondary flex w-fit cursor-pointer items-center px-5 py-3 font-[family-name:var(--font-display)] text-[13px] font-semibold uppercase tracking-[1.3px] text-content-primary"
          >
            Play all
          </button>
        </div>

        <ul className="m-0 grid list-none grid-cols-1 gap-8 p-0 xl:grid-cols-2">
          {LOADERS.map((option) => {
            const { Component } = option;
            const run = runs[option.id] ?? 0;
            return (
              <li key={option.id} className="flex flex-col gap-3">
                <div className="relative aspect-[16/10] w-full overflow-hidden border border-white/10 bg-bg-secondary">
                  {/* What the loader lifts off, so the reveal has something
                      to reveal. */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-daltown text-[clamp(28px,5vw,64px)] uppercase leading-none text-white/15">
                      Festivals
                    </span>
                  </div>
                  <Component key={`${option.id}-${run}`} run />
                </div>

                <div className="flex items-start justify-between gap-4">
                  <div className="flex min-w-0 flex-col gap-1">
                    <span className="font-[family-name:var(--font-display)] text-[15px] font-semibold uppercase leading-[22px] tracking-[1.5px] text-white">
                      {option.label}
                    </span>
                    <span className="font-[family-name:var(--font-display)] text-[13px] leading-5 text-content-secondary">
                      {option.note}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => replay(option.id)}
                    className="btn-secondary flex shrink-0 cursor-pointer items-center px-4 py-2 font-[family-name:var(--font-display)] text-[12px] font-semibold uppercase tracking-[1.2px] text-content-primary"
                  >
                    Replay
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </main>
  );
}
