/**
 * Buy now, pay later — the arithmetic, kept away from the markup so the rules
 * can be read (and corrected) in one place.
 *
 * The rules, as Ahmed set them:
 *
 * - The balance is split into equal monthly payments, at most four.
 * - How many are offered depends on the event: the last payment has to clear
 *   **before the event**, so a plan of N payments needs N−1 whole months of
 *   runway. An event three weeks away can only be paid in full.
 * - No extra fees. The plan divides the total; it never adds to it.
 * - The tickets are not issued until the last payment clears.
 *
 * Money is divided in the smallest unit and the remainder is given to the
 * first payment, so the instalments always add back up to the total exactly
 * and the odd fraction is paid today rather than being carried to the end.
 */

/** The ceiling Ahmed set: four months, no more. */
export const MAX_INSTALMENTS = 4;

export type Instalment = {
  /** When it is taken. The first is today. */
  due: Date;
  amount: number;
};

/** Whole months from `from` until `event`, floored at zero. */
export function monthsUntil(from: Date, event: Date) {
  if (event <= from) return 0;
  let months =
    (event.getFullYear() - from.getFullYear()) * 12 +
    (event.getMonth() - from.getMonth());
  /* Not a whole month yet if the day of the month has not come round. */
  if (event.getDate() < from.getDate()) months -= 1;
  return Math.max(0, months);
}

/**
 * The most payments this event can be split into — 1 means it cannot be
 * split at all, which is what hides the option.
 */
export function maxInstalments(from: Date, event: Date) {
  return Math.min(MAX_INSTALMENTS, monthsUntil(from, event) + 1);
}

/** The same day next month, clamped when that month is shorter. */
function addMonths(date: Date, months: number) {
  const next = new Date(date);
  const day = next.getDate();
  next.setDate(1);
  next.setMonth(next.getMonth() + months);
  const lastDay = new Date(
    next.getFullYear(),
    next.getMonth() + 1,
    0,
  ).getDate();
  next.setDate(Math.min(day, lastDay));
  return next;
}

/** The plan: `count` payments, the first one today. */
export function schedule(total: number, count: number, from: Date) {
  const safeCount = Math.max(1, Math.round(count));
  /* Whole centimes, so the parts add back up to the whole. */
  const units = Math.round(total * 100);
  const each = Math.floor(units / safeCount);
  const remainder = units - each * safeCount;

  return Array.from({ length: safeCount }, (_, index) => ({
    due: addMonths(from, index),
    /* The odd centimes ride on today's payment, not the last one. */
    amount: (each + (index === 0 ? remainder : 0)) / 100,
  })) satisfies Instalment[];
}

/** "20 Oct 2026", as the rest of the journey writes dates. */
export function formatDue(date: Date) {
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
