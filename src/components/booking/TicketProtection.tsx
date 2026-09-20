"use client";

import Image from "next/image";
import { useId } from "react";

import { Sheet } from "@/components/ui/Sheet";
import { bookingCopy } from "@/data/booking";

/**
 * Ticket protection on the checkout step — Figma 2389:11607 (the row),
 * 2410:18780 (what it covers) and 2407:11381 (the confirm on switching it
 * off).
 *
 * It is on by default and turning it *off* is the step that asks a question:
 * the confirm only appears on the way down, never on the way up, and its
 * ✕ leaves protection on. Someone switching it back on has nothing to be
 * warned about.
 *
 * Nothing here charges for it — the comps carry no price. See the note on
 * `bookingCopy.checkout.protection`.
 */

/** The shield, 110 square. The comp crops it slightly; these are its numbers. */
function Shield() {
  return (
    <span className="relative block size-[110px] shrink-0 overflow-hidden">
      <Image
        src="/assets/protect-shield.png"
        alt=""
        width={1254}
        height={1254}
        className="absolute max-w-none"
        style={{ left: "-6.42%", top: "-5.8%", width: "113.41%", height: "113.41%" }}
      />
    </span>
  );
}

/** The row in the checkout column. */
export function TicketProtectionRow({
  on,
  onToggle,
  onExplain,
  className = "",
}: {
  on: boolean;
  /** Called with what the visitor asked for, before any confirmation. */
  onToggle: (next: boolean) => void;
  onExplain: () => void;
  className?: string;
}) {
  const copy = bookingCopy.checkout.protection;
  const labelId = useId();

  return (
    <div className={`flex w-full items-center gap-4 border border-white/5 py-3 pl-4 pr-3 ${className}`}>
      <Image
        src="/assets/ic-shield-24.svg"
        alt=""
        width={24}
        height={24}
        className="size-6 shrink-0"
      />

      <span className="flex min-w-0 flex-1 flex-col">
        <span className="flex items-center gap-1">
          <span
            id={labelId}
            className="font-[family-name:var(--font-display)] text-[15px] leading-[22px] tracking-[0.15px] text-content-primary"
          >
            {copy.label}
          </span>
          <button
            type="button"
            onClick={onExplain}
            aria-label={copy.what}
            className="flex shrink-0 cursor-pointer items-center justify-center transition-opacity hover:opacity-70"
          >
            <Image
              src="/assets/ic-info-16.svg"
              alt=""
              width={20}
              height={20}
              className="size-5"
            />
          </button>
        </span>
        <span className="font-[family-name:var(--font-display)] text-[13px] leading-5 tracking-[0.13px] text-content-secondary">
          {copy.description}
        </span>
      </span>

      {/* 59 x 32 with a 28 knob, as the comp's Switch draws it. */}
      <button
        type="button"
        role="switch"
        aria-checked={on}
        aria-labelledby={labelId}
        onClick={() => onToggle(!on)}
        className={`flex h-8 w-[59px] shrink-0 cursor-pointer items-center rounded-full p-[2px] transition-colors ${
          on ? "justify-end bg-brand" : "justify-start bg-white/15"
        }`}
      >
        <span className="flex size-7 items-center justify-center rounded-full bg-white shadow-[0px_1px_2px_rgba(0,0,0,0.12)]">
          {on && (
            <Image
              src="/assets/ic-checkmark-16.svg"
              alt=""
              width={16}
              height={16}
              className="size-4"
            />
          )}
        </span>
      </button>
    </div>
  );
}

/** What protection covers — 2410:18780. */
export function ProtectionInfoDialog({ onClose }: { onClose: () => void }) {
  const copy = bookingCopy.checkout.protection;
  const titleId = useId();

  return (
    <Sheet
      open
      onClose={onClose}
      title={copy.title}
      titleId={titleId}
      closeLabel={copy.close}
      footer={
        <div className="px-5 pb-5 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex w-full cursor-pointer items-center justify-center bg-white px-5 py-4 font-[family-name:var(--font-display)] text-[17px] font-semibold leading-6 text-[#18181b] transition-colors hover:bg-white/90"
          >
            {copy.gotIt}
          </button>
        </div>
      }
    >
      <div className="flex flex-col gap-4 px-5 py-4">
        <div className="flex flex-col items-center gap-4">
          <Shield />
          <p className="m-0 text-center font-[family-name:var(--font-display)] text-[13px] leading-5 tracking-[0.13px] text-content-secondary">
            {copy.intro}
          </p>
        </div>

        <p className="m-0 font-[family-name:var(--font-display)] text-[15px] font-semibold leading-[22px] tracking-[0.19px] text-content-primary">
          {copy.coveredTitle}
        </p>

        <ul className="m-0 flex list-none flex-col p-0">
          {copy.covered.map((reason) => (
            <li key={reason.title} className="flex items-center gap-4">
              <Image
                src={reason.icon}
                alt=""
                width={24}
                height={24}
                className="size-6 shrink-0"
              />
              {/* The rule is on the content, not the row, so it starts
                  after the icon — as the comp draws it. */}
              <span className="flex min-w-0 flex-1 flex-col border-b-[0.5px] border-white/10 py-3">
                <span className="font-[family-name:var(--font-display)] text-[15px] leading-[22px] tracking-[0.15px] text-content-primary">
                  {reason.title}
                </span>
                {reason.detail.map((line) => (
                  <span
                    key={line}
                    className="font-[family-name:var(--font-display)] text-[13px] leading-5 tracking-[0.13px] text-content-secondary"
                  >
                    {line}
                  </span>
                ))}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </Sheet>
  );
}

/** The confirm on switching protection off — 2407:11381. */
export function SkipProtectionDialog({
  onKeep,
  onProceed,
}: {
  onKeep: () => void;
  onProceed: () => void;
}) {
  const copy = bookingCopy.checkout.protection;
  const titleId = useId();
  const headingId = useId();

  return (
    <Sheet
      open
      /* Closing without choosing keeps protection: the ✕ is a way out of the
         question, not an answer to it. */
      onClose={onKeep}
      title=""
      titleId={titleId}
      labelledBy={headingId}
      closeLabel={copy.close}
      footer={
        <div className="flex flex-col gap-3 px-5 pb-5 pt-2">
          <button
            type="button"
            onClick={onKeep}
            className="flex w-full cursor-pointer items-center justify-center bg-white px-5 py-4 font-[family-name:var(--font-display)] text-[17px] font-semibold leading-6 text-[#18181b] transition-colors hover:bg-white/90"
          >
            {copy.keep}
          </button>
          <button
            type="button"
            onClick={onProceed}
            className="flex w-full cursor-pointer items-center justify-center px-5 py-4 font-[family-name:var(--font-display)] text-[17px] font-semibold leading-6 text-content-primary transition-colors hover:text-white"
          >
            {copy.proceed}
          </button>
        </div>
      }
    >
      <div className="flex flex-col items-center gap-4 px-5 py-4">
        <Shield />
        <div className="flex flex-col gap-1">
          <h2
            id={headingId}
            className="m-0 text-center font-[family-name:var(--font-display)] text-[22px] font-bold uppercase leading-7 tracking-[-0.11px] text-content-primary"
          >
            {copy.skipTitle}
          </h2>
          <p className="m-0 text-center font-[family-name:var(--font-display)] text-[13px] leading-5 tracking-[0.13px] text-content-secondary">
            {copy.skipBody}
          </p>
        </div>
      </div>
    </Sheet>
  );
}
