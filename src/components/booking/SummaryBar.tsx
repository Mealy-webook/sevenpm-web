"use client";

import Image from "next/image";

import type { Totals } from "./cart";
import { TickingValue } from "@/components/ui/RollingNumber";
import { bookingCopy, formatMoney } from "@/data/booking";

/**
 * Booking summary bar, from Figma 2138:3409 / 2033:14633: what is in the
 * basket on the left, the step's one action on the right. It sits under the
 * poster on desktop and sticks to the bottom of the viewport on phones.
 *
 * The total travels to its new figure as the basket changes. It is the number
 * people are watching while they add things; seeing it move is the feedback
 * that the tap landed.
 */
export function SummaryBar({
  totals,
  action,
  onAction,
  onOpenSummary,
  pay = false,
  busy = false,
}: {
  totals: Totals;
  action: string;
  onAction: () => void;
  onOpenSummary: () => void;
  /** The checkout's yellow "Confirm & pay" with its lock. */
  pay?: boolean;
  busy?: boolean;
}) {
  const empty = totals.ticketCount === 0;
  const parts = [
    bookingCopy.summaryBar.tickets(totals.ticketCount),
    totals.addonCount > 0 && bookingCopy.summaryBar.addons(totals.addonCount),
  ].filter(Boolean);

  return (
    <div className="flex w-full flex-col items-center gap-4 bg-[#27272a] p-4">
      <div className="flex w-full items-center gap-4">
        <div className="flex min-w-0 flex-1 flex-col">
          {empty ? (
            <p className="m-0 font-[family-name:var(--font-display)] text-[15px] font-semibold leading-[22px] tracking-[0.19px] text-content-secondary">
              {bookingCopy.summaryBar.empty}
            </p>
          ) : (
            <>
              <button
                type="button"
                onClick={onOpenSummary}
                aria-label={bookingCopy.summaryBar.open}
                className="flex cursor-pointer items-center gap-2 self-start transition-opacity hover:opacity-80"
              >
                <span className="font-[family-name:var(--font-display)] text-[15px] font-semibold leading-[22px] tracking-[0.19px] text-content-primary">
                  {parts.join(", ")}
                </span>
                <Image
                  src="/assets/ic-chevron-down-16.svg"
                  alt=""
                  width={16}
                  height={16}
                  className="size-4"
                />
              </button>
              <p className="m-0 flex items-baseline gap-1">
                <span className="font-[family-name:var(--font-sans)] text-[14px] leading-5 text-content-secondary">
                  {bookingCopy.summaryBar.total}
                </span>
                <TickingValue
                  value={totals.total}
                  format={formatMoney}
                  className="font-[family-name:var(--font-sans)] text-[18px] font-medium leading-7 text-content-primary"
                />
              </p>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={onAction}
          disabled={empty || busy}
          className={`flex flex-1 cursor-pointer items-center justify-center gap-2 px-5 py-4 font-[family-name:var(--font-display)] text-[17px] font-semibold leading-6 transition-colors disabled:cursor-not-allowed disabled:bg-white/5 disabled:text-white/30 ${
            pay
              ? "bg-brand text-[#18181b] hover:bg-[#fff35a]"
              : "bg-white text-[#18181b] hover:bg-white/90"
          }`}
        >
          {pay && !empty && (
            <Image
              src="/assets/ic-lock-16.svg"
              alt=""
              width={16}
              height={16}
              className="size-4"
            />
          )}
          {action}
        </button>
      </div>
    </div>
  );
}
