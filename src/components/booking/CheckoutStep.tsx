"use client";

import Image from "next/image";

import type { SavedCard } from "@/components/ui/CardDialog";
import type { Totals } from "./cart";
import { TicketProtectionRow } from "./TicketProtection";
import { bookingConfig, bookingCopy, formatMoney } from "@/data/booking";

/**
 * Step 3, from Figma 2033:18293 and 2139:6888: delivery, payment method and
 * discounts on the left, the price details card on the right. Each row opens
 * its own sheet — delivery details, add new card, add promocode.
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
  deliverySummary,
  onEditDelivery,
  needsDelivery,
  card,
  onAddCard,
  promo,
  onAddPromo,
  onRemovePromo,
  protection,
  onProtection,
  onExplainProtection,
}: {
  wallet: boolean;
  onWallet: (on: boolean) => void;
  method: string;
  onMethod: (id: string) => void;
  /** One line describing the saved choice, or null while there is none. */
  deliverySummary: string | null;
  onEditDelivery: () => void;
  /** False when the basket has no merchandise to send anywhere. */
  needsDelivery: boolean;
  card: SavedCard | null;
  onAddCard: () => void;
  promo: { code: string; off: number } | null;
  onAddPromo: () => void;
  onRemovePromo: () => void;
  protection: boolean;
  /** Called with what was asked for; the journey owns the confirm. */
  onProtection: (next: boolean) => void;
  onExplainProtection: () => void;
}) {
  const copy = bookingCopy.checkout;

  return (
    <div className="flex flex-col gap-8">
      <h1 className="m-0 font-[family-name:var(--font-display)] text-[32px] font-black uppercase leading-10 tracking-[-0.5px] text-white sm:text-[40px]">
        {copy.title}
      </h1>

      <section className="flex flex-col gap-4">
        <h2 className={SECTION}>{copy.delivery}</h2>
        {needsDelivery ? (
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
                {copy.deliveryMethod}
              </span>
              <span className="font-[family-name:var(--font-display)] text-[12px] leading-4 tracking-[0.12px] text-content-secondary">
                {deliverySummary ?? copy.deliveryHint}
              </span>
            </span>
            <SmallButton onClick={onEditDelivery}>
              {deliverySummary ? copy.edit : copy.add}
            </SmallButton>
          </div>
        ) : (
          <p className="m-0 font-[family-name:var(--font-display)] text-[13px] leading-5 tracking-[0.13px] text-content-secondary">
            {copy.deliveryNone}
          </p>
        )}
      </section>

      <TicketProtectionRow
        on={protection}
        onToggle={onProtection}
        onExplain={onExplainProtection}
      />

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

        <div
          role="radiogroup"
          aria-label={copy.payWith}
          className="flex flex-col gap-2"
        >
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
                  selected
                    ? "border-content-primary bg-white/5"
                    : "hover:bg-white/5"
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
                    ))}
                </span>
                <Radio selected={selected} />
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
      </section>

      <section className="flex flex-col gap-4">
        <h2 className={SECTION}>{copy.discounts}</h2>
        <div className={`${ROW} py-[14px]`}>
          <Image
            src="/assets/ic-promo-24.svg"
            alt=""
            width={24}
            height={24}
            className="size-6 shrink-0"
          />
          {promo ? (
            <>
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="font-[family-name:var(--font-display)] text-[15px] font-semibold leading-[22px] tracking-[0.19px] text-content-primary">
                  {promo.code}
                </span>
                <span className="font-[family-name:var(--font-display)] text-[12px] leading-4 tracking-[0.12px] text-[#4ade80]">
                  {copy.promoSaved(formatMoney(promo.off))}
                </span>
              </span>
              <button
                type="button"
                onClick={onRemovePromo}
                aria-label={copy.promoRemove}
                className="btn-secondary flex shrink-0 cursor-pointer items-center justify-center p-[6px]"
              >
                <Image
                  src="/assets/ic-trash-16.svg"
                  alt=""
                  width={16}
                  height={16}
                  className="size-4"
                />
              </button>
            </>
          ) : (
            <>
              <span className="min-w-0 flex-1 font-[family-name:var(--font-display)] text-[15px] font-semibold leading-[22px] tracking-[0.19px] text-content-primary">
                {copy.promo}
              </span>
              <SmallButton onClick={onAddPromo}>{copy.add}</SmallButton>
            </>
          )}
        </div>
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
  const price = bookingCopy.confirmation.price;

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

      {totals.fee > 0 && (
        <div className="flex items-center justify-between gap-4 font-[family-name:var(--font-display)] text-[13px] leading-5 tracking-[0.13px]">
          <span className="text-content-secondary">{price.fee}</span>
          <span className="font-semibold text-content-primary">
            {formatMoney(totals.fee)}
          </span>
        </div>
      )}

      {totals.promo > 0 && (
        <div className="flex items-center justify-between gap-4 font-[family-name:var(--font-display)] text-[13px] leading-5 tracking-[0.13px] text-[#4ade80]">
          <span>{price.promo}</span>
          <span className="font-semibold">−{formatMoney(totals.promo)}</span>
        </div>
      )}

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
