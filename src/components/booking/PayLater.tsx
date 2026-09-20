"use client";

import { Fragment } from "react";

import { bookingCopy, formatMoney } from "@/data/booking";
import { formatDueShort, maxInstalments, schedule } from "./payLaterRules";

/**
 * Buy now, pay later on the checkout step — Figma 2410:20033.
 *
 * The number of payments on offer is worked out from the event date, not
 * chosen by us: the last one has to clear before the doors open, so a plan of
 * N payments needs N−1 whole months of runway and the ceiling is four. An
 * event too close to split still shows the option, greyed, saying why —
 * an option that vanishes without explanation reads as a bug.
 *
 * The panel is the comp's: the count as chips, then the plan as a timeline
 * running left to right, then the one real catch — the tickets are not
 * issued until the last payment clears.
 */

/**
 * One node on the timeline: a ring with a wedge filled to how much of the
 * balance is paid off by that point — a quarter, a half, three quarters,
 * all of it, for a plan of four.
 *
 * Drawn rather than an exported asset. The fraction depends on how many
 * payments there are, so a three-payment plan needs thirds, which no fixed
 * set of 25/50/75/100 files can give; the geometry is the comp's (r9 ring,
 * 2px stroke, r7 wedge from twelve o'clock, clockwise).
 */
function ProgressPie({ fraction }: { fraction: number }) {
  const turn = Math.min(1, Math.max(0, fraction));
  const angle = (turn * 360 - 90) * (Math.PI / 180);
  const x = 12 + 7 * Math.cos(angle);
  const y = 12 + 7 * Math.sin(angle);

  return (
    <svg
      viewBox="0 0 24 24"
      className="size-6 shrink-0"
      fill="none"
      aria-hidden
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeWidth="2"
        opacity="0.9"
      />
      {turn >= 1 ? (
        <circle cx="12" cy="12" r="7" fill="currentColor" />
      ) : turn > 0 ? (
        <path
          d={`M12 12 L12 5 A7 7 0 ${turn > 0.5 ? 1 : 0} 1 ${x.toFixed(3)} ${y.toFixed(3)} Z`}
          fill="currentColor"
        />
      ) : null}
    </svg>
  );
}

/** The row's second line: what the plan offers, or why there is none. */
export function PayLaterHint({ most }: { most: number }) {
  const copy = bookingCopy.checkout.payLater;
  return (
    <span className="font-[family-name:var(--font-display)] text-[13px] leading-5 tracking-[0.13px] text-content-secondary">
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
    <div className="flex flex-col gap-6 border border-white/5 border-t-0 p-4">
      <p className="m-0 font-[family-name:var(--font-display)] text-[15px] font-semibold leading-[22px] tracking-[0.19px] text-content-primary">
        {copy.choose}
      </p>

      <div
        role="radiogroup"
        aria-label={copy.choose}
        className="flex flex-wrap gap-2"
      >
        {options.map((option) => {
          const selected = option === chosen;
          /* The chip quotes the payment it would mean, so the choice is made
             on the number that matters. Where the total does not divide
             evenly there is no single amount to quote — the parts differ by
             a centime — so those chips say "from" and the timeline below
             carries the exact figures. */
          const parts = schedule(total, option, today);
          const even = parts.every((part) => part.amount === parts[0].amount);
          const each = formatMoney(parts[parts.length - 1].amount);

          return (
            <button
              key={option}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onCount(option)}
              className={`flex h-10 cursor-pointer items-center justify-center px-3 font-[family-name:var(--font-display)] text-[15px] font-semibold leading-[22px] tracking-[0.19px] transition-colors ${
                selected
                  ? "border border-content-primary bg-white/10 text-content-primary"
                  : "border border-white/10 bg-white/5 text-content-primary hover:bg-white/10"
              }`}
            >
              <span className="px-1">
                {even
                  ? copy.planEach(option, each)
                  : copy.planUneven(option, each)}
              </span>
            </button>
          );
        })}
      </div>

      {/* The plan, left to right. The rule between two payments is pushed
          down to the icons' centre line — 4px of padding plus half of a 24px
          icon — so it joins them rather than the labels below. */}
      <ol className="m-0 flex w-full list-none items-start p-0">
        {plan.map((instalment, index) => (
          <Fragment key={instalment.due.toISOString()}>
            {index > 0 && (
              <li
                aria-hidden
                className="mt-4 h-px min-w-0 flex-1 shrink bg-white/15"
              />
            )}
            <li className="flex w-[77px] shrink-0 flex-col items-center gap-3 p-1 text-content-primary">
              {/* Filled to what is paid off once this payment clears. */}
              <ProgressPie fraction={(index + 1) / plan.length} />
              <span className="flex flex-col items-center gap-1">
                <span className="whitespace-nowrap font-[family-name:var(--font-display)] text-[15px] font-semibold leading-[22px] tracking-[0.19px] text-content-primary">
                  {formatMoney(instalment.amount)}
                </span>
                <span className="whitespace-nowrap font-[family-name:var(--font-display)] text-[13px] leading-5 tracking-[0.13px] text-content-secondary">
                  {index === 0 ? copy.today : formatDueShort(instalment.due)}
                </span>
              </span>
            </li>
          </Fragment>
        ))}
      </ol>

      <p className="m-0 font-[family-name:var(--font-display)] text-[13px] leading-5 tracking-[0.13px] text-content-secondary">
        {copy.heldTickets}
      </p>
    </div>
  );
}
