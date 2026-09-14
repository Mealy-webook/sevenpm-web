"use client";

import Image from "next/image";
import Link from "next/link";
import { useId, useMemo, useState } from "react";

import type { EventDetails, TicketTier } from "@/data/events";
import { bookingCopy, bookingFees, formatMoney } from "@/data/booking";
import {
  accountUser,
  paymentCards,
  walletBalance,
  walletCurrency,
} from "@/data/account";

/**
 * The booking flow: tickets → your details → payment → confirmation, with a
 * summary that stays beside it the whole way.
 *
 * It is UI only. Confirming does not talk to a payment provider and nothing
 * is charged; the last step says so rather than pretending otherwise. Card
 * numbers are never collected here — a real integration adds new cards on the
 * provider's own hosted page, which is what the payment step points at.
 */

type Step = 0 | 1 | 2 | 3;

const card = "flex flex-col gap-2 border border-white/5 p-6";
const cardTitle =
  "m-0 font-[family-name:var(--font-display)] text-[18px] font-bold uppercase leading-6 tracking-[-0.09px] text-content-primary";
const label =
  "font-[family-name:var(--font-display)] text-[13px] font-semibold uppercase leading-5 tracking-[1.56px] text-content-secondary";
const field =
  "w-full border-[0.5px] border-white/10 bg-white/5 px-4 py-3 font-[family-name:var(--font-display)] text-[15px] leading-[22px] tracking-[0.15px] text-content-primary outline-none transition-colors placeholder:text-content-secondary/60 focus:border-content-primary";

function Stepper({
  value,
  onChange,
  label: name,
}: {
  value: number;
  onChange: (next: number) => void;
  label: string;
}) {
  const button =
    "flex size-10 shrink-0 cursor-pointer items-center justify-center border-[0.5px] border-white/10 bg-white/5 font-[family-name:var(--font-display)] text-[17px] leading-none text-content-primary transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40";
  return (
    <div className="flex shrink-0 items-center gap-2">
      <button
        type="button"
        onClick={() => onChange(value - 1)}
        disabled={value === 0}
        aria-label={`One fewer ${name}`}
        className={button}
      >
        −
      </button>
      <span
        aria-live="polite"
        className="w-6 text-center font-[family-name:var(--font-display)] text-[17px] font-semibold leading-6 text-content-primary tabular-nums"
      >
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        disabled={value >= bookingFees.maxPerTier}
        aria-label={`One more ${name}`}
        className={button}
      >
        +
      </button>
    </div>
  );
}

export function BookingFlow({
  event,
  initialTier,
}: {
  event: EventDetails;
  /** Pre-selected from the ticket stub's CTA. */
  initialTier?: string;
}) {
  const baseId = useId();
  const [step, setStep] = useState<Step>(0);
  const [quantities, setQuantities] = useState<Record<string, number>>(() =>
    Object.fromEntries(
      event.ticketTiers.map((tier) => [
        tier.id,
        tier.id === initialTier ? 1 : 0,
      ]),
    ),
  );
  const [details, setDetails] = useState({
    firstName: accountUser.name.split(" ")[0] ?? "",
    lastName: accountUser.name.split(" ").slice(1).join(" "),
    email: accountUser.email,
    phone: accountUser.phone,
    marketing: true,
  });
  const [method, setMethod] = useState<string>(
    paymentCards.find((c) => c.primary)?.id ?? paymentCards[0]?.id ?? "wallet",
  );
  const [useWallet, setUseWallet] = useState(true);
  const [terms, setTerms] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [reference, setReference] = useState<string | null>(null);

  const price = (tier: TicketTier) =>
    Number(tier.priceFrom.replace(/[^\d]/g, ""));

  const lines = useMemo(
    () =>
      event.ticketTiers
        .map((tier) => ({ tier, quantity: quantities[tier.id] ?? 0 }))
        .filter((line) => line.quantity > 0),
    [event.ticketTiers, quantities],
  );

  const count = lines.reduce((total, line) => total + line.quantity, 0);
  const subtotal = lines.reduce(
    (total, line) => total + price(line.tier) * line.quantity,
    0,
  );
  const fees = count * bookingFees.perTicket;
  const total = subtotal + fees;
  const walletApplied = useWallet ? Math.min(walletBalance, total) : 0;
  const due = total - walletApplied;
  const currency = event.ticketTiers[0]?.currency ?? walletCurrency;

  const goNext = () => {
    const next: Record<string, string> = {};
    if (step === 0 && count === 0) next.tickets = bookingCopy.tickets.empty;
    if (step === 1) {
      if (!details.firstName.trim()) next.firstName = "Needed";
      if (!details.lastName.trim()) next.lastName = "Needed";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(details.email))
        next.email = "Check this";
    }
    if (step === 2 && !terms) next.terms = bookingCopy.payment.termsError;
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    if (step === 2) {
      // No payment provider is connected — see the component note.
      setReference(
        `SVN-${new Date().getFullYear()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`,
      );
      setStep(3);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    setStep((current) => (current + 1) as Step);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* ---------------------------------------------------------------- */
  /* Confirmation                                                      */
  /* ---------------------------------------------------------------- */
  if (step === 3 && reference) {
    return (
      <div className="flex flex-col gap-6" data-reveal="up">
        <div className="flex flex-col gap-4 border border-white/5 bg-bg-secondary p-8">
          <h2 className="m-0 font-daltown text-[64px] leading-[0.9] text-brand xl:text-[88px]">
            {bookingCopy.done.title}
          </h2>
          <div className="flex flex-col gap-1">
            <span className={label}>{bookingCopy.done.reference}</span>
            <span className="font-[family-name:var(--font-display)] text-[26px] font-bold uppercase leading-8 tracking-[-0.13px] text-white">
              {reference}
            </span>
          </div>
          <p className="m-0 max-w-[560px] font-[family-name:var(--font-display)] text-[17px] leading-7 tracking-[0.085px] text-content-secondary">
            {bookingCopy.done.body}
          </p>
          <p className="m-0 max-w-[560px] font-[family-name:var(--font-display)] text-[13px] leading-5 tracking-[0.13px] text-content-secondary">
            {bookingCopy.done.note}
          </p>
          <div className="mt-2 flex flex-wrap gap-3">
            <Link
              href="/account"
              data-magnetic="0.2"
              className="sweep flex items-center bg-brand px-5 py-4 font-[family-name:var(--font-display)] text-[17px] font-semibold leading-6 text-[#0b0b0e]"
            >
              <span className="relative z-10">{bookingCopy.done.bookings}</span>
            </Link>
            <Link
              href={`/events/${event.slug}`}
              className="btn-secondary flex items-center px-5 py-4 font-[family-name:var(--font-display)] text-[17px] font-semibold leading-6 text-content-primary"
            >
              {bookingCopy.done.event}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  /* ---------------------------------------------------------------- */
  /* Steps                                                             */
  /* ---------------------------------------------------------------- */
  return (
    <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-8">
      <div className="flex min-w-0 flex-1 flex-col gap-6">
        {/* Progress */}
        <ol className="m-0 flex list-none flex-wrap gap-x-6 gap-y-2 p-0">
          {bookingCopy.steps.map((item, index) => {
            const state =
              index === step ? "current" : index < step ? "done" : "todo";
            return (
              <li
                key={item.id}
                aria-current={state === "current" ? "step" : undefined}
                className={`flex items-center gap-2 font-[family-name:var(--font-display)] text-[13px] font-semibold uppercase leading-5 tracking-[1.56px] ${
                  state === "current"
                    ? "text-brand"
                    : state === "done"
                      ? "text-content-primary"
                      : "text-content-secondary"
                }`}
              >
                <span
                  className={`flex size-6 items-center justify-center rounded-full text-[12px] ${
                    state === "current"
                      ? "bg-brand text-[#0b0b0e]"
                      : state === "done"
                        ? "bg-white/15 text-content-primary"
                        : "border border-white/15"
                  }`}
                >
                  {index + 1}
                </span>
                {item.label}
              </li>
            );
          })}
        </ol>

        {/* 1 — tickets */}
        {step === 0 && (
          <section className={card} data-reveal="up">
            <h2 className={cardTitle}>{bookingCopy.tickets.title}</h2>
            <p className="m-0 pb-2 font-[family-name:var(--font-display)] text-[13px] leading-5 tracking-[0.13px] text-content-secondary">
              {bookingCopy.tickets.description}
            </p>
            {event.ticketTiers.map((tier, index) => (
              <div
                key={tier.id}
                className={`flex items-center gap-4 py-4 ${
                  index < event.ticketTiers.length - 1
                    ? "border-b-[0.5px] border-white/10"
                    : ""
                }`}
              >
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="font-daltown text-[28px] uppercase leading-[0.9] text-white">
                    {tier.title}
                  </span>
                  <span className="font-[family-name:var(--font-display)] text-[13px] leading-5 tracking-[0.13px] text-content-secondary">
                    {formatMoney(price(tier), tier.currency)}{" "}
                    {bookingCopy.tickets.perPerson}
                  </span>
                </span>
                <Stepper
                  label={tier.title}
                  value={quantities[tier.id] ?? 0}
                  onChange={(next) =>
                    setQuantities((current) => ({
                      ...current,
                      [tier.id]: Math.min(
                        Math.max(next, 0),
                        bookingFees.maxPerTier,
                      ),
                    }))
                  }
                />
              </div>
            ))}
            <p className="m-0 pt-2 font-[family-name:var(--font-display)] text-[13px] leading-5 tracking-[0.13px] text-content-secondary">
              {bookingCopy.tickets.max}
            </p>
            {errors.tickets && (
              <p
                role="alert"
                className="m-0 font-[family-name:var(--font-display)] text-[13px] leading-5 text-[#ff6c6c]"
              >
                {errors.tickets}
              </p>
            )}
          </section>
        )}

        {/* 2 — details */}
        {step === 1 && (
          <section className={card} data-reveal="up">
            <h2 className={cardTitle}>{bookingCopy.details.title}</h2>
            <p className="m-0 pb-2 font-[family-name:var(--font-display)] text-[13px] leading-5 tracking-[0.13px] text-content-secondary">
              {bookingCopy.details.description}
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              {(
                [
                  ["firstName", bookingCopy.details.firstName, "given-name"],
                  ["lastName", bookingCopy.details.lastName, "family-name"],
                  ["email", bookingCopy.details.email, "email"],
                  ["phone", bookingCopy.details.phone, "tel"],
                ] as const
              ).map(([key, text, autoComplete]) => (
                <div key={key} className="flex min-w-0 flex-col gap-2">
                  <label htmlFor={`${baseId}-${key}`} className={label}>
                    {text}
                  </label>
                  <input
                    id={`${baseId}-${key}`}
                    value={details[key]}
                    autoComplete={autoComplete}
                    aria-invalid={Boolean(errors[key])}
                    onChange={(e) => {
                      const value = e.target.value;
                      setDetails((current) => ({ ...current, [key]: value }));
                      setErrors((current) =>
                        current[key] ? { ...current, [key]: "" } : current,
                      );
                    }}
                    className={`${field} ${errors[key] ? "border-[#ff6c6c]" : ""}`}
                  />
                  {errors[key] && (
                    <p
                      role="alert"
                      className="m-0 font-[family-name:var(--font-display)] text-[13px] leading-5 text-[#ff6c6c]"
                    >
                      {errors[key]}
                    </p>
                  )}
                </div>
              ))}
            </div>
            <label className="mt-2 flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={details.marketing}
                onChange={(e) =>
                  setDetails((current) => ({
                    ...current,
                    marketing: e.target.checked,
                  }))
                }
                className="mt-1 size-5 shrink-0 cursor-pointer accent-[#fbeb1c]"
              />
              <span className="font-[family-name:var(--font-display)] text-[15px] leading-[22px] tracking-[0.15px] text-content-secondary">
                {bookingCopy.details.marketing}
              </span>
            </label>
          </section>
        )}

        {/* 3 — payment */}
        {step === 2 && (
          <section className={card} data-reveal="up">
            <h2 className={cardTitle}>{bookingCopy.payment.title}</h2>
            <p className="m-0 pb-2 font-[family-name:var(--font-display)] text-[13px] leading-5 tracking-[0.13px] text-content-secondary">
              {bookingCopy.payment.description}
            </p>

            {/* Wallet */}
            <label className="flex cursor-pointer items-center gap-4 border-b-[0.5px] border-white/10 py-4">
              <input
                type="checkbox"
                checked={useWallet}
                onChange={(e) => setUseWallet(e.target.checked)}
                className="size-5 shrink-0 cursor-pointer accent-[#fbeb1c]"
              />
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="font-[family-name:var(--font-display)] text-[15px] leading-[22px] tracking-[0.15px] text-content-primary">
                  {bookingCopy.payment.walletLabel}
                </span>
                <span className="font-[family-name:var(--font-display)] text-[13px] leading-5 tracking-[0.13px] text-content-secondary">
                  {walletBalance >= total
                    ? bookingCopy.payment.walletCovers(
                        formatMoney(total, currency),
                      )
                    : bookingCopy.payment.walletShort}
                </span>
              </span>
              <span className="shrink-0 font-[family-name:var(--font-display)] text-[15px] font-semibold leading-[22px] text-content-primary">
                {formatMoney(walletBalance, walletCurrency)}
              </span>
            </label>

            {/* Cards */}
            <div
              role="radiogroup"
              aria-label={bookingCopy.payment.title}
              className="flex flex-col"
            >
              {paymentCards.map((payment) => {
                const selected = method === payment.id;
                return (
                  <button
                    key={payment.id}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    onClick={() => setMethod(payment.id)}
                    disabled={due === 0}
                    className="flex cursor-pointer items-center gap-4 border-b-[0.5px] border-white/10 py-4 text-left disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <span
                      aria-hidden
                      className={`flex size-5 shrink-0 items-center justify-center rounded-full border ${
                        selected
                          ? "border-brand bg-brand"
                          : "border-white/30 bg-black/5"
                      }`}
                    >
                      {selected && (
                        <span className="block size-2 rounded-full bg-[#0b0b0e]" />
                      )}
                    </span>
                    <Image
                      src="/assets/ic-acct-payments.svg"
                      alt=""
                      width={24}
                      height={24}
                      className="size-6 shrink-0"
                    />
                    <span className="flex min-w-0 flex-1 flex-col">
                      <span className="font-[family-name:var(--font-display)] text-[15px] leading-[22px] tracking-[0.15px] text-content-primary">
                        {payment.brand} •••• {payment.last4}
                      </span>
                      <span className="font-[family-name:var(--font-display)] text-[13px] leading-5 tracking-[0.13px] text-content-secondary">
                        Expires {payment.expiry}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>

            <p className="m-0 pt-2 font-[family-name:var(--font-display)] text-[13px] leading-5 tracking-[0.13px] text-content-secondary">
              {bookingCopy.payment.newCard}
            </p>

            <label className="mt-2 flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={terms}
                onChange={(e) => {
                  setTerms(e.target.checked);
                  setErrors((current) => ({ ...current, terms: "" }));
                }}
                aria-invalid={Boolean(errors.terms)}
                className="mt-1 size-5 shrink-0 cursor-pointer accent-[#fbeb1c]"
              />
              <span className="font-[family-name:var(--font-display)] text-[15px] leading-[22px] tracking-[0.15px] text-content-secondary">
                {bookingCopy.payment.terms}
              </span>
            </label>
            {errors.terms && (
              <p
                role="alert"
                className="m-0 font-[family-name:var(--font-display)] text-[13px] leading-5 text-[#ff6c6c]"
              >
                {errors.terms}
              </p>
            )}
          </section>
        )}

        {/* Step controls */}
        <div className="flex flex-wrap items-center gap-3">
          {step > 0 && (
            <button
              type="button"
              onClick={() => setStep((current) => (current - 1) as Step)}
              className="btn-secondary flex cursor-pointer items-center px-5 py-4 font-[family-name:var(--font-display)] text-[17px] font-semibold leading-6 text-content-primary"
            >
              {bookingCopy.actions.back}
            </button>
          )}
          <button
            type="button"
            onClick={goNext}
            data-magnetic="0.15"
            className="sweep flex cursor-pointer items-center bg-brand px-5 py-4 font-[family-name:var(--font-display)] text-[17px] font-semibold leading-6 text-[#0b0b0e]"
          >
            <span className="relative z-10">
              {step === 2
                ? `${bookingCopy.actions.pay} — ${formatMoney(due, currency)}`
                : bookingCopy.actions.continue}
            </span>
          </button>
        </div>
      </div>

      {/* Summary */}
      <aside
        className="flex w-full shrink-0 flex-col gap-2 border border-white/5 bg-bg-secondary p-6 lg:sticky lg:top-28 lg:w-[380px]"
        aria-label={bookingCopy.summary.title}
      >
        <h2 className={cardTitle}>{bookingCopy.summary.title}</h2>
        <div className="flex flex-col gap-1 border-b-[0.5px] border-white/10 pb-4 pt-2">
          <span className="font-[family-name:var(--font-display)] text-[15px] font-semibold leading-[22px] text-content-primary">
            {event.name}
          </span>
          <span className="font-[family-name:var(--font-display)] text-[13px] leading-5 tracking-[0.13px] text-content-secondary">
            {event.venue.name}
          </span>
        </div>

        {lines.length === 0 ? (
          <p className="m-0 py-4 font-[family-name:var(--font-display)] text-[13px] leading-5 tracking-[0.13px] text-content-secondary">
            {bookingCopy.tickets.empty}
          </p>
        ) : (
          lines.map((line) => (
            <div
              key={line.tier.id}
              className="flex items-baseline justify-between gap-4 py-2"
            >
              <span className="min-w-0 font-[family-name:var(--font-display)] text-[15px] leading-[22px] tracking-[0.15px] text-content-primary">
                {line.quantity} ×{" "}
                <span className="uppercase">{line.tier.title}</span>
              </span>
              <span className="shrink-0 font-[family-name:var(--font-display)] text-[15px] leading-[22px] text-content-primary tabular-nums">
                {formatMoney(price(line.tier) * line.quantity, currency)}
              </span>
            </div>
          ))
        )}

        {count > 0 && (
          <>
            <div className="flex items-baseline justify-between gap-4 border-t-[0.5px] border-white/10 py-2 pt-4">
              <span className="font-[family-name:var(--font-display)] text-[13px] leading-5 tracking-[0.13px] text-content-secondary">
                {bookingCopy.summary.fees} · {count}{" "}
                {count === 1
                  ? bookingCopy.summary.ticket
                  : bookingCopy.summary.tickets}
              </span>
              <span className="font-[family-name:var(--font-display)] text-[13px] leading-5 text-content-secondary tabular-nums">
                {formatMoney(fees, currency)}
              </span>
            </div>
            {walletApplied > 0 && (
              <div className="flex items-baseline justify-between gap-4 py-1">
                <span className="font-[family-name:var(--font-display)] text-[13px] leading-5 tracking-[0.13px] text-content-secondary">
                  {bookingCopy.summary.wallet}
                </span>
                <span className="font-[family-name:var(--font-display)] text-[13px] leading-5 text-[#22c55e] tabular-nums">
                  −{formatMoney(walletApplied, currency)}
                </span>
              </div>
            )}
            <div className="mt-2 flex items-end justify-between gap-4 border-t-[0.5px] border-white/10 pt-4">
              <span className={label}>{bookingCopy.summary.total}</span>
              <span className="font-daltown text-[40px] leading-[0.9] text-white">
                {due.toLocaleString("en-US")}{" "}
                <span className="text-brand">{currency}</span>
              </span>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
