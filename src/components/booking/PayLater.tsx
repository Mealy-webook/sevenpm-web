"use client";

import Image from "next/image";

import { bookingCopy, formatMoney } from "@/data/booking";
import { formatDue, maxInstalments, schedule } from "./payLaterRules";

/**
 * Buy now, pay later on the checkout step.
 *
 * The number of payments on offer is worked out from the event date, not
 * chosen by us: the last one has to clear before the doors open, so a plan of
 * N payments needs N−1 whole months of runway and the ceiling is four. An
 * event too close to split still shows the option, greyed, saying why —
 * an option that vanishes without explanation reads as a bug.
 *
 * The plan divides the total and adds nothing to it, and the panel says so
 * next to the one real catch: the tickets are not issued until the last
 * payment clears.
 */

/** The row's second line: what the plan offers, or why there is none. */
export function PayLaterHint({ most }: { most: number }) {
  const copy = bookingCopy.checkout.payLater;
  return (
    <span className="font-[family-name:var(--font-display)] text-[12px] leading-4 tracking-[0.12px] text-content-secondary">
      {most >= 2 ? copy.hint(most) : copy.tooSoon}
    </span>
  );
}

export function PayLaterPlan({
  total,
  eventStartsAt,
  count,
  onCount,
  /** Fixed on first render by the caller, so the dates cannot drift mid-session. */
  today,
}: {
  total: number;
  eventStartsAt: string;
  count: number;
  onCount: (count: number) => void;
  today: Date;
}) {
  const copy = bookingCopy.checkout.payLater;
  const most = maxInstalments(today, new Date(eventStartsAt));
  if (most < 2) return null;

  const chosen = Math.min(Math.max(2, count), most);
  const plan = schedule(total, chosen, today);
  const options = Array.from({ length: most - 1 }, (_, i) => i + 2);

  return (
    <div className="flex flex-col gap-4 border border-white/5 border-t-0 p-4">
      <div className="flex flex-col gap-2">
        <p className="m-0 font-[family-name:var(--font-display)] text-[13px] font-semibold leading-5 tracking-[0.16px] text-content-primary">
          {copy.choose}
        </p>
        <div role="radiogroup" aria-label={copy.choose} className="flex flex-wrap gap-2">
          {options.map((option) => {
            const selected = option === chosen;
            /* Each chip quotes the payment it would mean, so the choice is
               made on the number that matters rather than on the count.
               Where the total does not divide evenly there is no single
               "each" to quote — "3 × 16.66" would not add up to the total —
               so those chips quote today's payment instead. */
            const parts = schedule(total, option, today);
            const even = parts.every((part) => part.amount === parts[0].amount);
            const label = even
              ? copy.planEach(option, formatMoney(parts[0].amount))
              : copy.planUneven(option, formatMoney(parts[0].amount));
            return (
              <button
                key={option}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => onCount(option)}
                className={`flex cursor-pointer items-center border px-4 py-2 font-[family-name:var(--font-display)] text-[13px] font-semibold leading-5 tracking-[0.16px] transition-colors ${
                  selected
                    ? "border-content-primary bg-white/10 text-content-primary"
                    : "border-white/10 bg-white/5 text-content-secondary hover:bg-white/10"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <p className="m-0 font-[family-name:var(--font-display)] text-[13px] font-semibold leading-5 tracking-[0.16px] text-content-primary">
          {copy.scheduleTitle}
        </p>
        <ul className="m-0 flex list-none flex-col p-0">
          {plan.map((instalment, index) => (
            <li
              key={instalment.due.toISOString()}
              className="flex items-baseline justify-between gap-4 border-b-[0.5px] border-white/10 py-2 last:border-b-0 font-[family-name:var(--font-display)] text-[13px] leading-5 tracking-[0.13px]"
            >
              <span className={index === 0 ? "text-content-primary" : "text-content-secondary"}>
                {index === 0 ? copy.today : formatDue(instalment.due)}
              </span>
              <span
                className={`font-semibold tabular-nums ${
                  index === 0 ? "text-brand" : "text-content-primary"
                }`}
              >
                {formatMoney(instalment.amount)}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col gap-1">
        <p className="m-0 font-[family-name:var(--font-display)] text-[12px] leading-4 tracking-[0.12px] text-content-secondary">
          {copy.noFees}
        </p>
        <p className="m-0 flex items-start gap-1.5 font-[family-name:var(--font-display)] text-[12px] leading-4 tracking-[0.12px] text-content-secondary">
          <Image
            src="/assets/ic-info-16.svg"
            alt=""
            width={16}
            height={16}
            className="mt-[1px] size-4 shrink-0"
          />
          {copy.heldTickets}
        </p>
      </div>
    </div>
  );
}
