"use client";

import Image from "next/image";
import { useId, useState } from "react";

import { Sheet } from "@/components/ui/Sheet";
import { CardDialog, type SavedCard } from "@/components/ui/CardDialog";
import type { Totals } from "./cart";
import { bookingConfig, bookingCopy, formatMoney } from "@/data/booking";
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
 * Pressing Pay does not settle anything on its own. It opens the flow the
 * designer drew in the app file (442:7791, 442:8617): one screen carrying
 * both what is being paid and how, then the receipt.
 *
 * That replaced a three-step version built here before the comp existed —
 * the comp puts the breakdown and the method list on one screen and the
 * amount on the button, which does the same work in one press fewer.
 *
 * The steps live in the sheet rather than in dialogs stacked on top of it:
 * a sheet over a sheet buries the thing being paid for, and the header
 * already has somewhere for a back arrow to go.
 *
 * Neither node could be read through `get_design_context` or
 * `get_metadata` — both report the ids missing while `get_screenshot`
 * renders them — so the measurements here come from the screenshots and
 * from the design system the rest of the journey already uses, not from the
 * file. Worth re-measuring when the tooling can see them.
 *
 * Nothing is charged. There is no payment provider behind any of this — the
 * press marks the instalments settled and moves the plan on.
 */

type Step =
  | { name: "list" }
  /** `upto` is how many instalments the flow will settle, counted from the
   *  front — one payment, or all of them from "Pay all". */
  | { name: "pay"; upto: number }
  | { name: "done"; upto: number; amount: number };

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
  const [step, setStep] = useState<Step>({ name: "list" });
  /* Remembered across the flow, so settling three instalments in a row does
     not ask three times — but each one still gets its own confirm. */
  const [method, setMethod] = useState("apple-pay");
  const [card, setCard] = useState<SavedCard | null>(null);
  const [addingCard, setAddingCard] = useState(false);

  const done = Math.min(cleared, instalments.length);
  const settled = done >= instalments.length;
  const outstanding = instalments
    .slice(done)
    .reduce((sum, part) => sum + part.amount, 0);
  const whole = instalments.reduce((sum, part) => sum + part.amount, 0);

  /* What the step is settling, and what that comes to. */
  const target = step.name === "list" ? done : step.upto;
  const paying = instalments.slice(done, target);
  const payingTotal = paying.reduce((sum, part) => sum + part.amount, 0);
  const leftAfter = instalments
    .slice(target)
    .reduce((sum, part) => sum + part.amount, 0);

  /* The receipt has nothing to go back to — the money has moved. */
  const back =
    step.name === "pay" ? () => setStep({ name: "list" }) : undefined;

  return (
    <Sheet
      open
      onClose={onClose}
      /* The comps differ only here: a sheet with nothing left to pay is not
         asking you to make one. */
      /* The receipt titles itself in its own body, over the mark. */
      title={step.name === "done" ? "" : settled ? copy.sheetTitleSettled : copy.sheetTitle}
      labelledBy={step.name === "done" ? `${titleId}-done` : undefined}
      titleId={titleId}
      onBack={back}
      backLabel={copy.back}
      closeLabel={copy.close}
    >
      <div className="flex flex-col gap-4 px-5 py-4">
        {/* Which booking this is. The receipt drops it — 442:8617 is the
            mark and the news and nothing else, and by then the booking has
            been on screen for two steps. */}
        <div
          className={`items-center gap-3 ${step.name === "done" ? "hidden" : "flex"}`}
        >
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

        {step.name !== "list" ? (
          <PayFlow
            step={step}
            paying={paying}
            payingTotal={payingTotal}
            leftAfter={leftAfter}
            nextDue={instalments[step.upto]?.due}
            method={method}
            onMethod={setMethod}
            card={card}
            onAddCard={() => setAddingCard(true)}
            titleId={`${titleId}-done`}
            walletSpent={totals.wallet > 0}
            onPay={(charged) => {
              onPay(step.upto);
              setStep({ name: "done", upto: step.upto, amount: charged });
            }}
            onAnother={() => setStep({ name: "list" })}
            onViewBooking={onClose}
          />
        ) : (
          <>
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
                  onClick={() =>
                    setStep({ name: "pay", upto: instalments.length })
                  }
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
                          onClick={() =>
                            setStep({ name: "pay", upto: index + 1 })
                          }
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
          </>
        )}
      </div>

      {addingCard && (
        <CardDialog
          onClose={() => setAddingCard(false)}
          onAdd={(saved) => {
            setCard(saved);
            setMethod("card");
            setAddingCard(false);
          }}
        />
      )}
    </Sheet>
  );
}

/**
 * What is being paid and how, on one screen — Figma 442:7791 — then the
 * receipt, 442:8617.
 *
 * The amount is written on the button that spends it, which is the comp's
 * own call and the right one: nobody should press the last button without
 * the figure in front of them.
 */
function PayFlow({
  step,
  paying,
  payingTotal,
  leftAfter,
  nextDue,
  method,
  onMethod,
  card,
  onAddCard,
  onPay,
  onAnother,
  onViewBooking,
  titleId,
  walletSpent,
}: {
  step: Exclude<Step, { name: "list" }>;
  paying: Instalment[];
  payingTotal: number;
  leftAfter: number;
  nextDue?: Date;
  method: string;
  onMethod: (id: string) => void;
  card: SavedCard | null;
  onAddCard: () => void;
  onPay: (charged: number) => void;
  onAnother: () => void;
  onViewBooking: () => void;
  titleId: string;
  /** True when the booking already spent the wallet credit at checkout. */
  walletSpent: boolean;
}) {
  const copy = bookingCopy.checkout.payLater;
  const checkout = bookingCopy.checkout;
  const [wallet, setWallet] = useState(!walletSpent);

  if (step.name === "done") {
    return (
      <div className="flex flex-col gap-4 pb-2 pt-1">
        <div className="flex flex-col items-center gap-3 text-center">
          <PaidMark />
          <h2
            id={titleId}
            className="m-0 font-[family-name:var(--font-display)] text-[22px] font-bold uppercase leading-7 tracking-[-0.11px] text-content-primary"
          >
            {copy.doneTitle}
          </h2>
          <p className="m-0 max-w-[280px] font-[family-name:var(--font-display)] text-[13px] leading-5 tracking-[0.13px] text-content-secondary">
            {copy.doneBody(formatMoney(step.amount))}
            {leftAfter > 0 && nextDue
              ? copy.doneNext(formatDue(nextDue))
              : copy.doneSettled}
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={onViewBooking}
            className="btn-secondary flex w-full cursor-pointer items-center justify-center px-5 py-4 font-[family-name:var(--font-display)] text-[17px] font-semibold leading-6 text-content-primary"
          >
            {copy.viewBooking}
          </button>
          {/* Offered only while there is something left to pay. */}
          {leftAfter > 0 && (
            <button
              type="button"
              onClick={onAnother}
              className="flex w-full cursor-pointer items-center justify-center bg-brand px-5 py-4 font-[family-name:var(--font-display)] text-[17px] font-semibold leading-6 text-[#18181b] transition-colors hover:bg-[#fff35a]"
            >
              {copy.payAnother}
            </button>
          )}
        </div>
      </div>
    );
  }

  /* The wallet comes off this payment, never below nothing. */
  const credit =
    wallet && !walletSpent
      ? Math.min(bookingConfig.walletCredit, payingTotal)
      : 0;
  const charged = payingTotal - credit;
  const what =
    paying.length === 1
      ? copy.oneInstalment(ordinal(step.upto))
      : copy.remainingInstalments(paying.length);

  return (
    <div className="flex flex-col gap-4">
      <section className="flex flex-col gap-3">
        <h3 className="m-0 font-[family-name:var(--font-display)] text-[15px] font-bold uppercase leading-6 tracking-[0.19px] text-white">
          {copy.detailsTitle}
        </h3>
        <div className="flex flex-col gap-3 border border-white/5 p-4">
          <p className="m-0 flex items-baseline justify-between gap-3 font-[family-name:var(--font-display)] text-[15px] leading-[22px]">
            <span className="tracking-[0.15px] text-content-primary">
              {what}
            </span>
            <span className="font-semibold tabular-nums tracking-[0.19px] text-content-primary">
              {formatMoney(payingTotal)}
            </span>
          </p>
          {credit > 0 && (
            <p className="m-0 flex items-baseline justify-between gap-3 font-[family-name:var(--font-display)] text-[15px] leading-[22px] text-[#4ade80]">
              <span className="tracking-[0.15px]">{copy.walletLabel}</span>
              <span className="font-semibold tabular-nums tracking-[0.19px]">
                −{formatMoney(credit)}
              </span>
            </p>
          )}

          <span aria-hidden className="h-px w-full bg-white/10" />

          <p className="m-0 flex items-center justify-between gap-3">
            <span className="font-[family-name:var(--font-display)] text-[17px] font-semibold leading-6 text-content-primary">
              {bookingCopy.orderSummary.total}
            </span>
            <span className="flex flex-col items-end">
              <span className="font-[family-name:var(--font-sans)] text-[17px] font-bold leading-6 tracking-[0.085px] tabular-nums text-content-primary">
                {formatMoney(charged)}
              </span>
              <span className="font-[family-name:var(--font-display)] text-[10px] leading-[14px] tracking-[0.1px] text-content-secondary">
                {bookingCopy.orderSummary.vat(
                  formatMoney(charged * bookingConfig.vatRate),
                )}
              </span>
            </span>
          </p>
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h3 className="m-0 font-[family-name:var(--font-display)] text-[15px] font-bold uppercase leading-6 tracking-[0.19px] text-white">
          {copy.payWith}
        </h3>

        {/* The wallet, if the booking left any of it. */}
        {!walletSpent && (
          <div className="flex w-full items-center gap-3 border border-white/5 px-4 py-3">
            <Image
              src="/assets/ic-wallet.svg"
              alt=""
              width={24}
              height={24}
              className="size-6 shrink-0"
            />
            <span className="flex min-w-0 flex-1 flex-col">
              <span className="font-[family-name:var(--font-display)] text-[15px] font-semibold leading-[22px] tracking-[0.19px] text-content-primary">
                {copy.walletLabel}
              </span>
              <span className="font-[family-name:var(--font-display)] text-[12px] leading-4 tracking-[0.12px] text-content-secondary">
                {formatMoney(bookingConfig.walletCredit)}
              </span>
            </span>
            <button
              type="button"
              role="switch"
              aria-checked={wallet}
              aria-label={copy.walletLabel}
              onClick={() => setWallet((on) => !on)}
              className={`flex h-8 w-[52px] shrink-0 cursor-pointer items-center rounded-full p-1 transition-colors ${
                wallet ? "justify-end bg-brand" : "justify-start bg-white/15"
              }`}
            >
              <span className="flex size-6 items-center justify-center rounded-full bg-white">
                {wallet && (
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
        )}

        <div
          role="radiogroup"
          aria-label={copy.payWith}
          className="flex flex-col gap-2"
        >
          {checkout.payMethods.map((option) => {
            const selected = option.id === method;
            const isCard = option.id === "card";
            return (
              <button
                key={option.id}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => onMethod(option.id)}
                className={`flex w-full cursor-pointer items-center gap-3 border px-4 py-3 text-left transition-colors ${
                  selected
                    ? "border-content-primary bg-white/5"
                    : "border-white/5 hover:bg-white/5"
                }`}
              >
                <Image
                  src={option.icon}
                  alt=""
                  width={24}
                  height={24}
                  className="size-6 shrink-0"
                />
                <span className="flex min-w-0 flex-1 flex-col gap-1">
                  <span className="font-[family-name:var(--font-display)] text-[15px] font-semibold leading-[22px] tracking-[0.19px] text-content-primary">
                    {option.label}
                  </span>
                  {isCard &&
                    (card ? (
                      <span className="font-[family-name:var(--font-display)] text-[12px] leading-4 tracking-[0.12px] text-content-secondary">
                        **** {card.last4}
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        {checkout.cardMarks.map((mark) => (
                          <Image
                            key={mark}
                            src={mark}
                            alt=""
                            width={26}
                            height={16}
                            className="h-4 w-auto"
                          />
                        ))}
                      </span>
                    ))}
                </span>
                {selected ? (
                  <Image
                    src="/assets/ic-check-on.svg"
                    alt=""
                    width={24}
                    height={24}
                    className="size-6 shrink-0"
                  />
                ) : (
                  <span
                    aria-hidden
                    className="size-6 shrink-0 rounded-full border border-white/30"
                  />
                )}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={onAddCard}
          className="btn-secondary flex cursor-pointer items-center justify-center gap-1 self-start px-3 py-[10px]"
        >
          <Image
            src="/assets/ic-plus-16.svg"
            alt=""
            width={16}
            height={16}
            className="size-4"
          />
          <span className="px-1 font-[family-name:var(--font-display)] text-[13px] font-semibold leading-5 tracking-[0.16px] text-content-primary">
            {copy.addCard}
          </span>
        </button>
      </section>

      <button
        type="button"
        onClick={() => onPay(charged)}
        className="flex w-full cursor-pointer items-center justify-center bg-brand px-5 py-4 font-[family-name:var(--font-display)] text-[17px] font-semibold leading-6 text-[#18181b] transition-colors hover:bg-[#fff35a]"
      >
        {copy.confirmAndPay(formatMoney(charged))}
      </button>

      <p className="m-0 font-[family-name:var(--font-display)] text-[12px] leading-4 tracking-[0.12px] text-content-secondary">
        {copy.payNowNote}
      </p>
    </div>
  );
}

/**
 * The mark on the receipt: a brand disc with a tick, and a few short rays
 * around it. Drawn rather than exported — the comp's own asset could not be
 * fetched (see the note at the top of this file) — so it is the shape from
 * the screenshot in the house colours rather than the file's artwork.
 */
function PaidMark() {
  return (
    <svg viewBox="0 0 64 64" className="size-16" aria-hidden>
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
        <line
          key={deg}
          x1="32"
          y1="32"
          x2="32"
          y2="4"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          className="text-white/70"
          transform={`rotate(${deg} 32 32)`}
          strokeDasharray="4 24"
        />
      ))}
      <circle cx="32" cy="32" r="21" fill="#0b0b0e" />
      <circle cx="32" cy="32" r="18" fill="var(--color-brand)" />
      <path
        d="M23 32.5 29.5 39 42 25"
        stroke="#18181b"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}
