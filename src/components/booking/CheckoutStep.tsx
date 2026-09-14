"use client";

import Image from "next/image";
import { useId, useState } from "react";

import type { Totals } from "./cart";
import { bookingConfig, bookingCopy, formatMoney } from "@/data/booking";

/**
 * Step 3, from Figma 2033:18293: delivery, payment method and promo code on
 * the left, the price details card on the right.
 *
 * No card number is ever typed here. Picking "Card" hands over to the payment
 * provider's own page, which is the only place a number should be entered —
 * and there is no provider connected to this build, so confirming charges
 * nothing. `BookingJourney` says so in as many words on the done screen.
 */

const SECTION =
  "m-0 font-[family-name:var(--font-display)] text-[15px] font-bold uppercase leading-6 tracking-[0.19px] text-white";

const ROW = "flex w-full items-center gap-3 border border-white/5 px-4";

/** The design system's small Secondary button: 28px tall from an inner box. */
function SmallButton({
  children,
  onClick,
  label,
}: {
  children: React.ReactNode;
  onClick: () => void;
  label?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="btn-secondary flex shrink-0 cursor-pointer items-center justify-center p-1.5"
    >
      <span className="flex h-4 items-center px-1 font-[family-name:var(--font-display)] text-[13px] font-semibold leading-4 tracking-[0.16px] text-content-primary">
        {children}
      </span>
    </button>
  );
}

function Radio({ selected }: { selected: boolean }) {
  return selected ? (
    <Image
      src="/assets/ic-check-on.svg"
      alt=""
      width={20}
      height={20}
      className="size-5 shrink-0"
    />
  ) : (
    <span
      aria-hidden
      className="size-5 shrink-0 rounded-full border border-white/30"
    />
  );
}

export function CheckoutStep({
  wallet,
  onWallet,
  method,
  onMethod,
  delivery,
  onDelivery,
  needsDelivery,
  promo,
  onPromo,
}: {
  wallet: boolean;
  onWallet: (on: boolean) => void;
  method: string;
  onMethod: (id: string) => void;
  delivery: string | null;
  onDelivery: (id: string) => void;
  /** False when the basket has no merchandise to send anywhere. */
  needsDelivery: boolean;
  promo: string;
  onPromo: (code: string) => void;
}) {
  const copy = bookingCopy.checkout;
  const [deliveryOpen, setDeliveryOpen] = useState(false);
  const [promoOpen, setPromoOpen] = useState(false);
  const [promoDraft, setPromoDraft] = useState(promo);
  const [promoError, setPromoError] = useState("");
  const promoId = useId();

  const chosenDelivery = copy.deliveryOptions.find(
    (option) => option.id === delivery,
  );

  return (
    <div className="flex flex-col gap-8">
      <h1 className="m-0 font-[family-name:var(--font-display)] text-[32px] font-black uppercase leading-10 tracking-[-0.5px] text-white sm:text-[40px]">
        {copy.title}
      </h1>

      <section className="flex flex-col gap-4">
        <h2 className={SECTION}>{copy.delivery}</h2>
        {needsDelivery ? (
          <>
            <div className={`${ROW} py-3`}>
              <Image
                src="/assets/ic-delivery-24.svg"
                alt=""
                width={24}
                height={24}
                className="size-6 shrink-0"
              />
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="font-[family-name:var(--font-display)] text-[15px] font-semibold leading-[22px] tracking-[0.19px] text-content-primary">
                  {chosenDelivery ? chosenDelivery.label : copy.deliveryMethod}
                </span>
                <span className="font-[family-name:var(--font-display)] text-[12px] leading-4 tracking-[0.12px] text-content-secondary">
                  {chosenDelivery ? chosenDelivery.hint : copy.deliveryHint}
                </span>
              </span>
              <SmallButton onClick={() => setDeliveryOpen((open) => !open)}>
                {chosenDelivery ? copy.change : copy.add}
              </SmallButton>
            </div>

            {deliveryOpen && (
              <div
                role="radiogroup"
                aria-label={copy.deliveryMethod}
                className="flex flex-col gap-2"
              >
                {copy.deliveryOptions.map((option) => {
                  const selected = option.id === delivery;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      onClick={() => {
                        onDelivery(option.id);
                        setDeliveryOpen(false);
                      }}
                      className={`${ROW} cursor-pointer py-3 text-left transition-colors ${
                        selected ? "border-content-primary bg-white/10" : "hover:bg-white/5"
                      }`}
                    >
                      <span className="flex min-w-0 flex-1 flex-col">
                        <span className="font-[family-name:var(--font-display)] text-[15px] font-semibold leading-[22px] tracking-[0.19px] text-content-primary">
                          {option.label}
                        </span>
                        <span className="font-[family-name:var(--font-display)] text-[12px] leading-4 tracking-[0.12px] text-content-secondary">
                          {option.hint}
                        </span>
                      </span>
                      <Radio selected={selected} />
                    </button>
                  );
                })}
              </div>
            )}
          </>
        ) : (
          <p className="m-0 font-[family-name:var(--font-display)] text-[13px] leading-5 tracking-[0.13px] text-content-secondary">
            {copy.deliveryNone}
          </p>
        )}
      </section>

      <section className="flex flex-col gap-4">
        <h2 className={SECTION}>{copy.payWith}</h2>

        <div className={`${ROW} py-3`}>
          <Image
            src="/assets/ic-wallet.svg"
            alt=""
            width={24}
            height={24}
            className="size-6 shrink-0"
          />
          <span className="flex min-w-0 flex-1 flex-col">
            <span className="font-[family-name:var(--font-display)] text-[15px] font-semibold leading-[22px] tracking-[0.19px] text-content-primary">
              {copy.wallet}
            </span>
            <span className="font-[family-name:var(--font-display)] text-[12px] leading-4 tracking-[0.12px] text-content-secondary">
              {formatMoney(bookingConfig.walletCredit)}
            </span>
          </span>
          <button
            type="button"
            role="switch"
            aria-checked={wallet}
            aria-label={copy.wallet}
            onClick={() => onWallet(!wallet)}
            className={`flex h-8 w-[52px] shrink-0 cursor-pointer items-center rounded-full p-1 transition-colors ${
              wallet ? "justify-end bg-brand" : "justify-start bg-white/15"
            }`}
          >
            <span className="flex size-6 items-center justify-center rounded-full bg-white">
              {wallet && (
                <Image
                  src="/assets/ic-check-on.svg"
                  alt=""
                  width={16}
                  height={16}
                  className="size-4"
                />
              )}
            </span>
          </button>
        </div>

        <div role="radiogroup" aria-label={copy.payWith} className="flex flex-col gap-2">
          {copy.payMethods.map((option) => {
            const selected = method === option.id;
            const isCard = option.id === "card";
            return (
              <button
                key={option.id}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => onMethod(option.id)}
                className={`${ROW} cursor-pointer py-3 text-left transition-colors ${
                  selected ? "border-content-primary bg-white/5" : "hover:bg-white/5"
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
                  {isCard && (
                    <span className="flex items-center gap-1">
                      {copy.cardMarks.map((mark) => (
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
                  )}
                </span>
                <Radio selected={selected} />
              </button>
            );
          })}
        </div>

        {method === "card" && (
          <p className="m-0 font-[family-name:var(--font-display)] text-[12px] leading-4 tracking-[0.12px] text-content-secondary">
            {copy.cardNote}
          </p>
        )}
      </section>

      <section className="flex flex-col gap-4">
        <h2 className={SECTION}>{copy.discount}</h2>
        <div className={`${ROW} py-[14px]`}>
          <Image
            src="/assets/ic-promo-24.svg"
            alt=""
            width={24}
            height={24}
            className="size-6 shrink-0"
          />
          <span className="min-w-0 flex-1 font-[family-name:var(--font-display)] text-[15px] font-semibold leading-[22px] tracking-[0.19px] text-content-primary">
            {promo || copy.promo}
          </span>
          <SmallButton onClick={() => setPromoOpen((open) => !open)}>
            {promo ? copy.change : copy.add}
          </SmallButton>
        </div>

        {promoOpen && (
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <label htmlFor={promoId} className="sr-only">
                {copy.promo}
              </label>
              <input
                id={promoId}
                value={promoDraft}
                onChange={(event) => {
                  setPromoDraft(event.target.value);
                  setPromoError("");
                }}
                placeholder={copy.promoPlaceholder}
                className="min-w-0 flex-1 border-[0.5px] border-white/10 bg-white/5 px-4 py-3 font-[family-name:var(--font-display)] text-[15px] leading-[22px] tracking-[0.19px] text-content-primary outline-none transition-colors placeholder:text-content-secondary focus:border-content-primary"
              />
              <button
                type="button"
                onClick={() => {
                  // No promotions are loaded in this build, so every code is
                  // unknown. The day they arrive, only this branch changes.
                  setPromoError(copy.promoUnknown);
                  onPromo("");
                }}
                className="btn-secondary flex shrink-0 cursor-pointer items-center justify-center px-4 py-3 font-[family-name:var(--font-display)] text-[15px] font-semibold leading-[22px] tracking-[0.19px] text-content-primary"
              >
                {copy.promoApply}
              </button>
            </div>
            {promoError && (
              <p
                role="alert"
                className="m-0 font-[family-name:var(--font-display)] text-[13px] leading-5 tracking-[0.13px] text-[#ff6c6c]"
              >
                {promoError}
              </p>
            )}
          </div>
        )}
      </section>
    </div>
  );
}

/** The right-hand card on the checkout step — Figma 2033:18293. */
export function PriceDetails({
  totals,
  agreed,
  onAgreed,
  error,
}: {
  totals: Totals;
  agreed: boolean;
  onAgreed: (on: boolean) => void;
  error?: string;
}) {
  const copy = bookingCopy.checkout;
  const summary = bookingCopy.orderSummary;

  return (
    <div className="flex flex-col gap-3 border border-white/5 p-4">
      <h2 className="m-0 font-[family-name:var(--font-display)] text-[15px] font-bold uppercase leading-6 tracking-[0.19px] text-white">
        {copy.priceDetails}
      </h2>

      <div className="flex items-center justify-between gap-4 font-[family-name:var(--font-display)] text-[13px] leading-5 tracking-[0.13px]">
        <span className="text-content-secondary">{summary.subtotal}</span>
        <span className="font-semibold text-content-primary">
          {formatMoney(totals.subtotal)}
        </span>
      </div>

      {totals.wallet > 0 && (
        <div className="flex items-center justify-between gap-4 font-[family-name:var(--font-display)] text-[13px] leading-5 tracking-[0.13px] text-[#4ade80]">
          <span>{summary.wallet}</span>
          <span className="font-semibold">−{formatMoney(totals.wallet)}</span>
        </div>
      )}

      <div className="flex items-start justify-between gap-4 border-t-[0.5px] border-white/10 pt-3">
        <span className="font-[family-name:var(--font-display)] text-[15px] font-semibold leading-[22px] tracking-[0.19px] text-content-primary">
          {summary.total}
        </span>
        <span className="flex flex-col items-end">
          <span className="font-[family-name:var(--font-display)] text-[17px] font-semibold leading-6 text-content-primary">
            {formatMoney(totals.total)}
          </span>
          <span className="font-[family-name:var(--font-display)] text-[10px] leading-[14px] tracking-[0.1px] text-content-secondary">
            {summary.vat(formatMoney(totals.vat))}
          </span>
        </span>
      </div>

      <div className="flex flex-col gap-1 border-t-[0.5px] border-white/10 pt-3">
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(event) => onAgreed(event.target.checked)}
            aria-invalid={Boolean(error)}
            className="peer sr-only"
          />
          <span
            aria-hidden
            className="mt-[2px] flex size-5 shrink-0 items-center justify-center border border-white/30 transition-colors peer-checked:border-brand peer-checked:bg-brand peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brand"
          >
            <svg
              viewBox="0 0 16 16"
              className={`size-3 ${agreed ? "opacity-100" : "opacity-0"}`}
              fill="none"
            >
              <path
                d="M2 8.5 6 12.5 14 3.5"
                stroke="#18181b"
                strokeWidth="2.5"
              />
            </svg>
          </span>
          <span className="font-[family-name:var(--font-display)] text-[12px] leading-4 tracking-[0.12px] text-content-secondary">
            {copy.agreement}
          </span>
        </label>
        {error && (
          <p
            role="alert"
            className="m-0 font-[family-name:var(--font-display)] text-[13px] leading-5 tracking-[0.13px] text-[#ff6c6c]"
          >
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
