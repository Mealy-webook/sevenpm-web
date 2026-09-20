"use client";

import { useSyncExternalStore } from "react";

/**
 * Which way the Beats arrive in the header chip.
 *
 * Four options, built so Ahmed can watch each one rather than pick from a
 * description — `/preview/beats` switches between them. Once one is chosen
 * the others go and this module goes with them.
 */

export type BeatsMotion =
  /** Banner, flight and count overlap into a single move. */
  | "continuous"
  /** No flight: the digits roll up on wheels under the banner. */
  | "odometer"
  /** Several marks scatter out of the banner, each nudging the count. */
  | "burst"
  /** No flight: brand fill sweeps across the chip as the count rolls. */
  | "fill";

export const BEATS_MOTIONS: { id: BeatsMotion; label: string }[] = [
  { id: "continuous", label: "One continuous gesture" },
  { id: "odometer", label: "Odometer only" },
  { id: "burst", label: "Coin burst" },
  { id: "fill", label: "Chip fills up" },
];

let motion: BeatsMotion = "continuous";
const listeners = new Set<() => void>();

export function setBeatsMotion(next: BeatsMotion) {
  if (next === motion) return;
  motion = next;
  listeners.forEach((listener) => listener());
}

/** Read outside React — the chip's timeline needs it at fire time. */
export function readBeatsMotion() {
  return motion;
}

export function useBeatsMotion() {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    () => motion,
    () => "continuous" as BeatsMotion,
  );
}
