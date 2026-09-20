"use client";

import Image from "next/image";
import { useId, useState } from "react";

import { Sheet } from "@/components/ui/Sheet";
import type { Totals } from "./cart";
import { bookingCopy, formatMoney } from "@/data/booking";
import {
  daysUntil,
  formatDue,
  ordinal,
  type Instalment,
} from "./payLaterRules";

/**
 * The plan behind "Make payment" — Figma 2417:22873 (payments),
 * 2420:25015 (order details) and 2417:24296 (once things are paid).
 *
 * Two tabs over one sheet: the instalments, each with its own Pay, and the
 * order they belong to. The header reads "Make payment" while something is
 * owed and "Payment" once nothing is, which is the difference between the
 * two comps.
 *
 * Nothing is charged. There is no payment provider behind any of this — a
 * Pay marks the instalment settled and moves the plan on, and the note under
 * the list says so.
 */

type Props = {
  instalments: Instalment[];
  /** How many are already behind you. Always at least the one taken today. */
  cleared: number;
  onPay: (count: number) => void;
  onClose: () => void;
  totals: Totals;
  event: { name: string; poster: string; time: string; venue: string; venueUrl: string };
  today: Date;
};

/** The date pill: lime once paid, orange when due today, quiet otherwise. */
function DueTag({
  instalment,
  paid,
  today,
}: {
  instalment: Instalment;
  paid: boolean;
  today: Date;
}) {
  const copy = bookingCopy.checkout.payLater;
  const days = daysUntil(today, instalment.due);
  const dueNow = !paid && days === 0;

  const tone = paid
    ? "bg-[#b3e100]/10 text-[#b3e100]"
    : dueNow
      ? "bg-[#ff7f29]/10 text-[#ff7f29]"
      : "bg-white/5 text-content-secondary";

  return (
    <span
      className={`flex shrink-0 items-center gap-0.5 rounded-full px-1.5 py-[1px] font-[family-name:var(--font-display)] text-[10px] leading-[14px] tracking-[0.1px] ${tone}`}
    >
      <Image
        src="/assets/ic-calendar-12.svg"
        alt=""
        width={12}
        height={12}
        className="size-3"
      />
      {paid
        ? formatDue(instalment.due)
        : dueNow
          ? copy.dueToday
          : copy.dueInDays(days)}
    </span>
  );
}

export function PaymentsSheet({
  instalments,
  cleared,
  onPay,
  onClose,
  totals,
  event,
  today,
}: Props) {
  const copy = bookingCopy.checkout.payLater;
  const summary = bookingCopy.orderSummary;
  const titleId = useId();
  const [tab, setTab] = useState<"payments" | "order">("payments");

  const done = Math.min(cleared, instalments.length);
  const settled = done >= instalments.length;
  const outstanding = instalments
    .slice(done)
    .reduce((sum, part) => sum + part.amount, 0);
  const whole = instalments.reduce((sum, part) => sum + part.amount, 0);

  return (
    <Sheet
      open
      onClose={onClose}
      /* The comps differ only here: a sheet with nothing left to pay is not
         asking you to make one. */
      title={settled ? copy.sheetTitleSettled : copy.sheetTitle}
      titleId={titleId}
      closeLabel={copy.close}
    >
      <div className="flex flex-col gap-4 px-5 py-4">
        {/* Which booking this is. */}
        <div className="flex items-center gap-3">
          <span className="relative block size-[88px] shrink-0 overflow-hidden">
            <Image
              src={event.poster}
              alt=""
              fill
              sizes="89px"
              className="object-cover"
            />
          </span>
          <span className="flex min-w-0 flex-1 flex-col gap-2">
            <span className="font-daltown text-[40px] uppercase leading-[0.78] tracking-[0.4px] text-white">
              {event.name}
            </span>
            <span className="flex flex-col">
              <span className="font-[family-name:var(--font-display)] text-[13px] font-semibold leading-5 tracking-[0.16px] text-brand">
                {event.time}
              </span>
              <a
                href={event.venueUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="font-[family-name:var(--font-display)] text-[13px] font-semibold leading-5 tracking-[0.16px] text-white underline transition-colors hover:text-brand"
              >
                {event.venue}
              </a>
            </span>
          </span>
        </div>

        <div
          role="tablist"
          aria-label={copy.paymentsTitle}
          className="flex items-center bg-white/5 p-1"
        >
          {(
            [
              ["payments", copy.tabPayments],
              ["order", copy.tabOrder],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={tab === id}
              onClick={() => setTab(id)}
              className={`flex h-10 flex-1 cursor-pointer items-center justify-center px-3 font-[family-name:var(--font-display)] text-[15px] leading-[22px] transition-colors ${
                tab === id
                  ? "bg-white/5 font-semibold tracking-[0.19px] text-content-primary"
                  : "tracking-[0.15px] text-content-secondary hover:text-white"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {tab === "payments" ? (
          <>
            <div className="flex items-center gap-4">
              <span className="flex min-w-0 flex-1 flex-col gap-1">
                <span className="truncate font-[family-name:var(--font-display)] text-[18px] font-bold uppercase leading-6 tracking-[-0.09px] text-content-primary">
                  {copy.planCount(instalments.length, formatMoney(whole))}
                </span>
                <span className="font-[family-name:var(--font-display)] text-[13px] leading-5 tracking-[0.13px] text-content-secondary">
                  {copy.planTotal(formatMoney(whole))}
                </span>
              </span>
              {!settled && (
                <button
                  type="button"
                  onClick={() => onPay(instalments.length)}
                  aria-label={copy.payAllFor(formatMoney(outstanding))}
                  className="flex shrink-0 cursor-pointer items-center justify-center bg-brand p-3 font-[family-name:var(--font-display)] text-[15px] font-semibold leading-[22px] tracking-[0.19px] text-[#0b0b0e] transition-colors hover:bg-[#fff35a]"
                >
                  <span className="px-1">{copy.payAll}</span>
                </button>
              )}
            </div>

            <ul
              className="m-0 flex max-h-[352px] list-none flex-col gap-3 overflow-y-auto overscroll-contain p-0"
              data-lenis-prevent
            >
              {instalments.map((instalment, index) => {
                const paid = index < done;
                return (
                  <li
                    key={instalment.due.toISOString()}
                    className="flex flex-col justify-center gap-3 border border-white/10 bg-white/5 p-4"
                  >
                    <span className="flex items-center gap-2">
                      <span className="min-w-0 flex-1 font-[family-name:var(--font-display)] text-[13px] leading-5 tracking-[0.13px] text-content-primary">
                        {copy.nth(ordinal(index + 1))}
                      </span>
                      <DueTag
                        instalment={instalment}
                        paid={paid}
                        today={today}
                      />
                    </span>

                    <span aria-hidden className="h-px w-full bg-white/10" />

                    <span className="flex items-center gap-3">
                      <Image
                        src="/assets/ic-payment-24.svg"
                        alt=""
                        width={24}
                        height={24}
                        className="size-6 shrink-0"
                      />
                      <span className="min-w-0 flex-1 font-[family-name:var(--font-display)] text-[15px] leading-[22px] tracking-[0.15px] text-content-primary">
                        {formatMoney(instalment.amount)}
                      </span>
                      {paid ? (
                        <span className="flex shrink-0 items-center justify-center bg-white/5 p-3 font-[family-name:var(--font-display)] text-[15px] font-semibold leading-[22px] tracking-[0.19px] text-white/30">
                          <span className="px-1">{copy.paid}</span>
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => onPay(index + 1)}
                          aria-label={copy.payFor(ordinal(index + 1))}
                          className="flex shrink-0 cursor-pointer items-center justify-center bg-white p-3 font-[family-name:var(--font-display)] text-[15px] font-semibold leading-[22px] tracking-[0.19px] text-[#18181b] transition-colors hover:bg-white/90"
                        >
                          <span className="px-1">{copy.pay}</span>
                        </button>
                      )}
                    </span>
                  </li>
                );
              })}
            </ul>

            <p className="m-0 font-[family-name:var(--font-display)] text-[12px] leading-4 tracking-[0.12px] text-content-secondary">
              {settled ? copy.allPaid : copy.payNowNote}
            </p>
          </>
        ) : (
          /* The order the plan is paying for — 2420:25015. */
          <div className="flex flex-col gap-4">
            {(
              [
                [summary.tickets(totals.ticketCount), totals.ticketLines],
                [summary.addons(totals.addonCount), totals.addonLines],
              ] as const
            )
              .filter(([, lines]) => lines.length > 0)
              .map(([heading, lines]) => (
                <div key={heading} className="flex flex-col gap-2">
                  <p className="m-0 font-[family-name:var(--font-display)] text-[13px] leading-5 tracking-[0.13px] text-content-secondary">
                    {heading}
                  </p>
                  <ul className="m-0 flex list-none flex-col p-0">
                    {lines.map((line) => (
                      <li
                        key={line.key}
                        className="flex items-center gap-3 border-b-[0.5px] border-white/10 py-2 last:border-b-0"
                      >
                        <span className="font-[family-name:var(--font-display)] text-[13px] leading-5 tracking-[0.13px] text-content-secondary">
                          {line.qty}x
                        </span>
                        <Image
                          src={line.icon}
                          alt=""
                          width={20}
                          height={20}
                          className="size-5 shrink-0"
                        />
                        <span className="flex min-w-0 flex-1 flex-col">
                          <span className="truncate font-[family-name:var(--font-display)] text-[15px] font-semibold leading-[22px] tracking-[0.19px] text-content-primary">
                            {line.name}
                          </span>
                          {line.size && (
                            <span className="font-[family-name:var(--font-display)] text-[13px] leading-5 tracking-[0.13px] text-content-secondary">
                              {summary.size(line.size)}
                            </span>
                          )}
                        </span>
                        <span className="shrink-0 font-[family-name:var(--font-display)] text-[13px] font-semibold leading-5 tracking-[0.16px] text-content-primary">
                          {formatMoney(line.amount)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}

            <span aria-hidden className="h-px w-full bg-white/10" />

            <div className="flex flex-col gap-2">
              <p className="m-0 flex items-center justify-between gap-3 font-[family-name:var(--font-display)] text-[15px] leading-[22px]">
                <span className="tracking-[0.15px] text-content-secondary">
                  {summary.subtotal}
                </span>
                <span className="font-semibold tracking-[0.19px] text-content-primary">
                  {formatMoney(totals.subtotal)}
                </span>
              </p>
              <p className="m-0 flex items-center justify-between gap-3">
                <span className="font-[family-name:var(--font-display)] text-[17px] font-semibold leading-6 text-content-primary">
                  {summary.total}
                </span>
                <span className="flex flex-col items-end">
                  <span className="font-[family-name:var(--font-sans)] text-[17px] font-bold leading-6 tracking-[0.085px] text-content-primary">
                    {formatMoney(totals.total)}
                  </span>
                  <span className="font-[family-name:var(--font-display)] text-[10px] leading-[14px] tracking-[0.1px] text-content-secondary">
                    {summary.vat(formatMoney(totals.vat))}
                  </span>
                </span>
              </p>
            </div>
          </div>
        )}
      </div>
    </Sheet>
  );
}
