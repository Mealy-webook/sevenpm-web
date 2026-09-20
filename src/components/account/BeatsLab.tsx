"use client";

import { useState } from "react";

import {
  BEATS_MOTIONS,
  setBeatsMotion,
  useBeatsMotion,
  type BeatsMotion,
} from "./beatsMotion";
import { earnBeats, useLoyalty } from "./loyaltyStore";

/**
 * Review chrome for the Beats announcement. Not part of the design — it
 * goes with the three options Ahmed does not pick.
 */
const NOTES: Record<BeatsMotion, string> = {
  continuous:
    "Banner, flight and count overlap into one move: the +100 leaves the banner while it is still settling and the digits land on the new number exactly as it arrives. Digits roll on wheels.",
  odometer:
    "Nothing flies. The banner fades in and the chip's digits roll up on vertical wheels, units first. The calmest of the four.",
  burst:
    "Six beats scatter out of the banner and arc into the chip on a stagger, each one stepping the count up as it lands. The busiest.",
  fill: "No token. Brand yellow sweeps across the chip from the left as the count climbs, then drains away.",
};

export function BeatsLab() {
  const motion = useBeatsMotion();
  const { balance } = useLoyalty();
  const [run, setRun] = useState(0);

  /* A fresh order number each time, or the store would refuse to pay twice. */
  const play = (next: BeatsMotion) => {
    setBeatsMotion(next);
    setRun((n) => n + 1);
    /* A beat, so the switch has landed before the animation reads it. */
    window.setTimeout(() => earnBeats(`lab-${next}-${Date.now()}`, 100, "Preview"), 30);
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="m-0 font-[family-name:var(--font-display)] text-[32px] font-black uppercase leading-10 tracking-[-0.5px] text-white">
          Beats motion
        </h1>
        <p className="m-0 max-w-[640px] font-[family-name:var(--font-display)] text-[15px] leading-[22px] tracking-[0.19px] text-content-secondary">
          Four ways the earned Beats can land in the chip up there. Press one
          and watch the top right. The banner stays until you dismiss it.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        {BEATS_MOTIONS.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => play(option.id)}
            aria-pressed={motion === option.id}
            className={`flex h-12 cursor-pointer items-center px-5 font-[family-name:var(--font-display)] text-[15px] font-semibold leading-[22px] tracking-[0.19px] transition-colors ${
              motion === option.id
                ? "border border-content-primary bg-white/10 text-content-primary"
                : "border border-white/10 bg-white/5 text-content-secondary hover:bg-white/10"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      <p className="m-0 max-w-[640px] border-l-2 border-brand pl-4 font-[family-name:var(--font-display)] text-[15px] leading-[22px] tracking-[0.19px] text-content-primary">
        {NOTES[motion]}
      </p>

      <p className="m-0 font-[family-name:var(--font-display)] text-[13px] leading-5 tracking-[0.13px] text-content-secondary">
        Balance {balance.toLocaleString("en-US")} · played {run}{" "}
        {run === 1 ? "time" : "times"}
      </p>
    </div>
  );
}
