"use client";

import Image from "next/image";

import { bookingConfig, bookingCopy } from "@/data/booking";

/**
 * Quantity control, from Figma 2024:11801. At zero it is a single "Add" pill;
 * from one up it becomes `− value +`, with the minus drawn as a bin at one
 * because that press removes the line rather than decrementing it.
 *
 * `atZero="stepper"` uses the comp's other zero state instead: the counter is
 * always on screen reading 0, with the minus disabled. The ticket rows use it
 * so every row offers the same control and the count is never implied.
 *
 * `emphasised` swaps the 5% overlay for the solid elevated surface, for the
 * control that floats over a product photo.
 */

const SHELL =
  "flex shrink-0 items-center justify-center border-[0.5px] border-white/10";

export function Stepper({
  value,
  name,
  onAdd,
  onChange,
  emphasised = false,
  atZero = "add",
  addLabel = bookingCopy.tickets.add,
}: {
  value: number;
  /** Names the thing being counted, for screen readers. */
  name: string;
  onAdd: () => void;
  onChange: (by: number) => void;
  emphasised?: boolean;
  /** What zero looks like: the "Add" pill, or the counter reading 0. */
  atZero?: "add" | "stepper";
  addLabel?: string;
}) {
  const surface = emphasised
    ? "bg-bg-tertiary"
    : "bg-white/5 transition-colors hover:bg-white/10";

  if (value === 0 && atZero === "add") {
    return (
      <button
        type="button"
        onClick={onAdd}
        aria-label={`${addLabel} — ${name}`}
        className={`${SHELL} ${surface} cursor-pointer gap-1 px-3 py-[14px]`}
      >
        <Image
          src="/assets/ic-plus-16.svg"
          alt=""
          width={16}
          height={16}
          className="size-4"
        />
        <span className="px-1 font-[family-name:var(--font-display)] text-[15px] font-semibold leading-[22px] tracking-[0.19px] text-content-primary">
          {addLabel}
        </span>
      </button>
    );
  }

  const atMax = value >= bookingConfig.maxPerLine;
  const empty = value === 0;
  // At one the minus removes the line, so it is drawn as a bin.
  const first = value === 1;

  return (
    <div
      className={`${SHELL} ${emphasised ? "bg-bg-tertiary" : "bg-white/5"} gap-1 px-2 py-[11px]`}
    >
      <button
        type="button"
        onClick={() => onChange(-1)}
        disabled={empty}
        aria-label={`${first ? bookingCopy.tickets.remove : bookingCopy.tickets.fewer} — ${name}`}
        className="flex size-[22px] cursor-pointer items-center justify-center transition-opacity hover:opacity-70 disabled:cursor-not-allowed disabled:opacity-30"
      >
        <Image
          src={first ? "/assets/ic-trash-16.svg" : "/assets/ic-minus-16.svg"}
          alt=""
          width={16}
          height={16}
          className="size-4"
        />
      </button>
      <span
        aria-live="polite"
        className="min-w-5 text-center font-[family-name:var(--font-display)] text-[15px] font-semibold leading-[22px] tracking-[0.19px] text-content-primary"
      >
        {value}
      </span>
      <button
        type="button"
        onClick={() => (empty ? onAdd() : onChange(1))}
        disabled={atMax}
        aria-label={`${bookingCopy.tickets.more} — ${name}`}
        className="flex size-[22px] cursor-pointer items-center justify-center transition-opacity hover:opacity-70 disabled:cursor-not-allowed disabled:opacity-30"
      >
        <Image
          src="/assets/ic-plus-16.svg"
          alt=""
          width={16}
          height={16}
          className="size-4"
        />
      </button>
    </div>
  );
}
