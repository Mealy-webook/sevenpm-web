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
 * The basket line never wraps, and the two halves are laid out differently
 * by width. The comp splits the bar evenly because its basket reads "1
 * Tickets, 1 add-on"; at "2 Tickets, 2 add-ons" half of a 405 bar is not
 * enough and it broke across two lines.
 *
 * From `lg` the basket takes the room and the button shrinks to its label,
 * which is the comp's arrangement with the give in the right place. Below
 * that the bar is the full width of a phone and the two stack: the basket on
 * its own line and the button under it, full width — the whole bottom edge
 * of a phone is the tap target, and there is nothing to share it with.
 *
 * The basket and the total share that line on a phone, which has the room
 * for both. They stay stacked from `lg`, where the button is beside them and
 * the column is only about 225px: side by side there, a two-part basket
 * ("2 Tickets, 2 add-ons") would have to be cut short to make space for a
 * figure that is already the biggest thing in the bar.
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
      <div className="flex w-full flex-col items-start gap-4 lg:flex-row lg:items-center">
        <div className="flex w-full min-w-0 flex-row items-baseline justify-between gap-3 lg:flex-1 lg:flex-col lg:items-stretch lg:justify-start">
          {empty ? (
            <p className="m-0 whitespace-nowrap font-[family-name:var(--font-display)] text-[15px] font-semibold leading-[22px] tracking-[0.19px] text-content-secondary">
              {bookingCopy.summaryBar.empty}
            </p>
          ) : (
            <>
              <button
                type="button"
                onClick={onOpenSummary}
                aria-label={bookingCopy.summaryBar.open}
                className="flex min-w-0 max-w-full shrink cursor-pointer items-center gap-2 self-baseline transition-opacity hover:opacity-80 lg:self-start"
              >
                <span className="truncate whitespace-nowrap font-[family-name:var(--font-display)] text-[15px] font-semibold leading-[22px] tracking-[0.19px] text-content-primary">
                  {parts.join(", ")}
                </span>
                <Image
                  src="/assets/ic-chevron-down-16.svg"
                  alt=""
                  width={16}
                  height={16}
                  className="size-4 shrink-0"
                />
              </button>
              <p className="m-0 flex shrink-0 items-baseline gap-1 whitespace-nowrap">
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
          className={`flex w-full shrink-0 cursor-pointer items-center justify-center gap-2 whitespace-nowrap px-5 py-4 lg:w-auto font-[family-name:var(--font-display)] text-[17px] font-semibold leading-6 transition-colors disabled:cursor-not-allowed disabled:bg-white/5 disabled:text-white/30 ${
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
