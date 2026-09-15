"use client";

import Image from "next/image";

/**
 * Toggle switch, from the design system (Figma 2033:16698): a 52 × 32 track
 * with a 28px white knob that slides between the ends. On, the track is brand
 * yellow and the knob carries a tick.
 *
 * Square edges are the house rule everywhere else on this site, but not here —
 * a pill track with a round knob is what makes a switch read as a switch, and
 * the comp draws it that way.
 *
 * It is a real `role="switch"` button, so it announces its state and responds
 * to space and enter without any of that being re-implemented.
 */
export function Switch({
  on,
  onChange,
  label,
  disabled = false,
}: {
  on: boolean;
  onChange: (on: boolean) => void;
  /** Accessible name — the visible text sits outside the control. */
  label: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!on)}
      className={`flex w-[52px] shrink-0 items-center rounded-full p-0.5 transition-colors duration-300 disabled:cursor-not-allowed disabled:opacity-40 ${
        on ? "justify-end bg-brand" : "justify-start bg-white/20"
      } ${disabled ? "" : "cursor-pointer"}`}
    >
      <span className="flex size-7 items-center justify-center rounded-full bg-white p-1.5 drop-shadow-[0px_1px_2px_rgba(0,0,0,0.12)]">
        {on && (
          <Image
            src="/assets/ic-switch-check-16.svg"
            alt=""
            width={16}
            height={16}
            className="size-4"
          />
        )}
      </span>
    </button>
  );
}
