"use client";

import { useEffect, useRef } from "react";

import { onStageFrame, stageBands } from "./stageAudio";

/**
 * The little equaliser, reading the actual spectrum rather than looping a
 * keyframe. Bass on the left.
 *
 * It was a decorative CSS bounce; now it only moves when something is playing,
 * which is the point — a meter that dances over silence is a lie, and it is
 * the same rule the lighting rig follows. At rest the bars settle to the
 * heights the comp drew.
 */
export function StageMeter({
  /** Resting bar heights in px — the comp's four, by default. */
  heights = [6, 16, 12, 2],
  className = "",
}: {
  heights?: number[];
  className?: string;
}) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const bars = Array.from(el.querySelectorAll<HTMLSpanElement>("span"));
    /* Spread however many bars we have across the bands, skipping the very
       bottom one: sub-bass swamps a four-bar meter. */
    const pick = bars.map((_, i) =>
      Math.min(7, 1 + Math.round((i * 6) / Math.max(1, bars.length - 1))),
    );

    return onStageFrame(() => {
      const bands = stageBands();
      bars.forEach((bar, i) => {
        const value = bands[pick[i]] ?? 0;
        bar.style.scale = `1 ${(0.7 + value * 2.6).toFixed(3)}`;
      });
    });
  }, []);

  return (
    <div ref={root} className={`eq-bars ${className}`} aria-hidden>
      {heights.map((height, i) => (
        <span
          key={`${height}-${i}`}
          style={{ "--h": `${height}px` } as React.CSSProperties}
        />
      ))}
    </div>
  );
}
