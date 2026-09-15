"use client";

import { useEffect, useRef } from "react";

import { onStageFrame } from "./stageAudio";

/**
 * Breathes its children in time with the music — the shared stage clock's
 * level, so a heading and the lighting rig behind it hit together.
 *
 * It writes `scale` and nothing else, on a node of its own. Whatever is inside
 * usually has GSAP on its transforms, and two writers on one node spend the
 * frame overwriting each other.
 *
 * The level it follows is smoothed again on the way in. The lights want the
 * raw attack — a beam should snap on the kick — but a headline doing the same
 * throbs; here it wants to breathe, so it trails the signal instead of
 * tracking it.
 *
 * Under prefers-reduced-motion it is an ordinary wrapper.
 */
export function StagePulse({
  /** How much bigger the content gets at full level. */
  amount = 0.022,
  className = "",
  children,
}: {
  amount?: number;
  className?: string;
  children: React.ReactNode;
}) {
  const el = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = el.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let eased = 0;

    return onStageFrame((_t, level, dt) => {
      eased += (level - eased) * Math.min(1, (dt || 0.016) * 12);
      if (eased < 0.0005) eased = 0;
      node.style.scale = String(1 + eased * amount);
    });
  }, [amount]);

  return (
    <span ref={el} className={`block will-change-transform ${className}`}>
      {children}
    </span>
  );
}
