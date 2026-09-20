"use client";

import Image from "next/image";
import { useId, useState } from "react";

import { Sheet } from "@/components/ui/Sheet";
import { CardDialog, type SavedCard } from "@/components/ui/CardDialog";
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
 * Pressing Pay does not settle anything on its own. It opens a three-step
 * flow inside this same sheet — choose a method, confirm the amount, see it
 * done — because money leaving an account should take a deliberate second
 * press, and because the person paying should be told which card it is
 * coming from before it goes rather than after.
 *
 * The steps live in the sheet rather than in dialogs stacked on top of it:
 * a sheet over a sheet buries the thing being paid for, and the header
 * already has somewhere for a back arrow to go. There is no comp for the
 * flow; it follows the checkout's own method list so that paying later
 * looks like paying at the time.
 *
 * Nothing is charged. There is no payment provider behind any of this — the
 * final press marks the instalments settled and moves the plan on, and the
 * note says so at every step.
 */

type Step =
  | { name: "list" }
  /** `upto` is how many instalments the flow will settle, counted from the
   *  front — one payment, or all of them from "Pay all". */
  | { name: "method"; upto: number }
  | { name: "confirm"; upto: number }
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

  const back =
    step.name === "method"
      ? () => setStep({ name: "list" })
      : step.name === "confirm"
        ? () => setStep({ name: "method", upto: step.upto })
        : undefined;

  return (
    <Sheet
      open
      onClose={onClose}
      /* The comps differ only here: a sheet with nothing left to pay is not
         asking you to make one. */
      title={
        step.name === "confirm"
          ? copy.confirmTitle
          : step.name === "done"
            ? copy.doneTitle
            : settled
              ? copy.sheetTitleSettled
              : copy.sheetTitle
      }
      titleId={titleId}
      onBack={back}
      backLabel={copy.back}
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
            onContinue={() => setStep({ name: "confirm", upto: step.upto })}
            onPay={() => {
              onPay(step.upto);
              setStep({
                name: "done",
                upto: step.upto,
                amount: payingTotal,
              });
            }}
            onDone={() => setStep({ name: "list" })}
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
                    setStep({ name: "method", upto: instalments.length })
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
                            setStep({ name: "method", upto: index + 1 })
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
 * Choose a method, confirm the amount, see it done.
 *
 * The three steps share this one panel so the sheet's header can carry the
 * back arrow and the booking above stays on screen throughout. Each step
 * ends in exactly one forward action, and the amount is written on the
 * button that spends it — "Pay 25 MAD", never a bare "Confirm", so nobody
 * presses the last button without the figure in front of them.
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
  onContinue,
  onPay,
  onDone,
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
  onContinue: () => void;
  onPay: () => void;
  onDone: () => void;
}) {
  const copy = bookingCopy.checkout.payLater;
  const checkout = bookingCopy.checkout;

  /** "the 2nd payment", or "the remaining 3 payments". A single payment is
   *  named by its place in the plan — `upto` counts from the front, so it
   *  is that instalment's own number. */
  const what =
    paying.length === 1
      ? copy.oneInstalment(ordinal(step.upto))
      : copy.remainingInstalments(paying.length);
  const chosen = checkout.payMethods.find((option) => option.id === method);

  if (step.name === "done") {
    return (
      <div className="flex flex-col gap-5 py-2">
        <div className="flex flex-col items-center gap-3 text-center">
          <span className="flex size-14 items-center justify-center rounded-full bg-[#4ade80]/15">
            <svg viewBox="0 0 24 24" className="size-7" fill="none">
              <path
                d="M4 12.5 9.5 18 20 6.5"
                stroke="#4ade80"
                strokeWidth="2.4"
              />
            </svg>
          </span>
          <p className="m-0 font-[family-name:var(--font-display)] text-[17px] font-semibold leading-6 text-content-primary">
            {copy.doneBody(formatMoney(step.amount))}
          </p>
          <p className="m-0 font-[family-name:var(--font-display)] text-[13px] leading-5 tracking-[0.13px] text-content-secondary">
            {leftAfter > 0 && nextDue
              ? copy.doneNext(formatDue(nextDue))
              : copy.doneSettled}
          </p>
        </div>

        <button
          type="button"
          onClick={onDone}
          className="flex w-full cursor-pointer items-center justify-center bg-white px-5 py-4 font-[family-name:var(--font-display)] text-[17px] font-semibold leading-6 text-[#18181b] transition-colors hover:bg-white/90"
        >
          {copy.doneAction}
        </button>
      </div>
    );
  }

  if (step.name === "confirm") {
    return (
      <div className="flex flex-col gap-5">
        <dl className="m-0 flex flex-col gap-3">
          <Line label={copy.amountLabel} value={formatMoney(payingTotal)} big />
          <Line
            label={copy.methodLabel}
            value={
              chosen?.id === "card" && card
                ? `${chosen.label} •••• ${card.last4}`
                : (chosen?.label ?? "")
            }
          />
          <Line
            label={leftAfter > 0 ? copy.leavesLabel : copy.settlesLabel}
            value={leftAfter > 0 ? formatMoney(leftAfter) : formatMoney(0)}
          />
        </dl>

        <p className="m-0 font-[family-name:var(--font-display)] text-[12px] leading-4 tracking-[0.12px] text-content-secondary">
          {copy.payNowNote}
        </p>

        {/* The figure is on the button that spends it. */}
        <button
          type="button"
          onClick={onPay}
          className="flex w-full cursor-pointer items-center justify-center gap-2 bg-brand px-5 py-4 font-[family-name:var(--font-display)] text-[17px] font-semibold leading-6 text-[#18181b] transition-colors hover:bg-[#fff35a]"
        >
          <Image
            src="/assets/ic-lock-16.svg"
            alt=""
            width={16}
            height={16}
            className="size-4"
          />
          {copy.payAmount(formatMoney(payingTotal))}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <p className="m-0 font-[family-name:var(--font-display)] text-[15px] font-semibold leading-[22px] tracking-[0.19px] text-content-primary">
          {copy.chooseMethod}
        </p>
        <p className="m-0 font-[family-name:var(--font-display)] text-[13px] leading-5 tracking-[0.13px] text-content-secondary">
          {copy.payingFor(what)} · {formatMoney(payingTotal)}
        </p>
      </div>

      <div
        role="radiogroup"
        aria-label={copy.chooseMethod}
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
                      •••• {card.last4}
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
      </div>

      <button
        type="button"
        onClick={onContinue}
        className="flex w-full cursor-pointer items-center justify-center bg-white px-5 py-4 font-[family-name:var(--font-display)] text-[17px] font-semibold leading-6 text-[#18181b] transition-colors hover:bg-white/90"
      >
        {copy.confirmTitle}
      </button>
    </div>
  );
}

/** A label and its figure, for the confirm step. */
function Line({
  label,
  value,
  big,
}: {
  label: string;
  value: string;
  big?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b-[0.5px] border-white/10 pb-3 last:border-b-0 last:pb-0">
      <dt className="font-[family-name:var(--font-display)] text-[13px] leading-5 tracking-[0.13px] text-content-secondary">
        {label}
      </dt>
      <dd
        className={`m-0 font-[family-name:var(--font-display)] font-semibold tabular-nums text-content-primary ${
          big ? "text-[22px] leading-7" : "text-[15px] leading-[22px]"
        }`}
      >
        {value}
      </dd>
    </div>
  );
}
