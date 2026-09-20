"use client";

import Image from "next/image";

import type { SavedCard } from "@/components/ui/CardDialog";
import type { Totals } from "./cart";
import { PayLaterHint, PayLaterPlan } from "./PayLater";
import { maxInstalments, type Instalment } from "./payLaterRules";
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

/** 24 square, as the design system's Radio draws it. */
function Radio({ selected }: { selected: boolean }) {
  return selected ? (
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
  eventStartsAt,
  payLaterTotal,
  plan,
  onPlan,
  today,
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
  /** ISO start of the event — it is what limits the payment plan. */
  eventStartsAt: string;
  /** What a plan would divide. */
  payLaterTotal: number;
  plan: number;
  onPlan: (count: number) => void;
  /** Fixed once by the journey so the schedule cannot drift mid-session. */
  today: Date;
}) {
  const copy = bookingCopy.checkout;
  const later = copy.payLater;
  /* How far the event lets the balance be spread — 1 means not at all. */
  const mostInstalments = maxInstalments(today, new Date(eventStartsAt));
  const canSplit = mostInstalments >= 2;

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

          {/* Buy now, pay later. Shown even when the event is too close to
              split, greyed and saying why: an option that quietly disappears
              reads as a bug. */}
          <div className="flex flex-col">
            <button
              type="button"
              role="radio"
              aria-checked={method === later.id}
              disabled={!canSplit}
              onClick={() => onMethod(later.id)}
              className={`${ROW} py-3 text-left transition-colors ${
                method === later.id
                  ? "border-content-primary bg-white/5"
                  : canSplit
                    ? "cursor-pointer hover:bg-white/5"
                    : "cursor-not-allowed opacity-50"
              } ${canSplit ? "cursor-pointer" : ""}`}
            >
              <Image
                src={later.icon}
                alt=""
                width={24}
                height={24}
                className="size-6 shrink-0"
              />
              <span className="flex min-w-0 flex-1 flex-col gap-1">
                <span className="font-[family-name:var(--font-display)] text-[15px] font-semibold leading-[22px] tracking-[0.19px] text-content-primary">
                  {later.label}
                </span>
                <PayLaterHint most={mostInstalments} />
              </span>
              <Radio selected={method === later.id} />
            </button>

            {method === later.id && (
              <PayLaterPlan
                total={payLaterTotal}
                eventStartsAt={eventStartsAt}
                count={plan}
                onCount={onPlan}
                today={today}
              />
            )}
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
  payLater,
}: {
  totals: Totals;
  agreed: boolean;
  onAgreed: (on: boolean) => void;
  error?: string;
  /** The instalments, when the order is going out on a plan. */
  payLater?: Instalment[] | null;
}) {
  const copy = bookingCopy.checkout;
  const summary = bookingCopy.orderSummary;
  const price = bookingCopy.confirmation.price;
  /**
   * On a plan the card states what is actually being charged now, which is
   * the comp's reading: a "Today payment" row, and the total beneath it is
   * today's payment rather than the order's. The order's own total is still
   * on the summary bar under this card, where the button is.
   */
  const dueToday = payLater?.length ? payLater[0].amount : totals.total;
  /* VAT follows the figure above it. Quoting the whole order's VAT under
     today's payment would be two different orders' numbers in one row. */
  const dueVat = payLater?.length
    ? dueToday * bookingConfig.vatRate
    : totals.vat;

  return (
    <div className="flex flex-col bg-bg-secondary">
      <div className="flex flex-col gap-4 p-4">
        <h2 className="m-0 font-[family-name:var(--font-display)] text-[18px] font-bold uppercase leading-6 tracking-[-0.09px] text-content-primary">
          {copy.priceDetails}
        </h2>

        <div className="flex flex-col gap-2">
          <PriceLine label={summary.subtotal} amount={formatMoney(totals.subtotal)} />
          {totals.fee > 0 && (
            <PriceLine label={price.fee} amount={formatMoney(totals.fee)} />
          )}
          {totals.promo > 0 && (
            <PriceLine
              label={price.promo}
              amount={`−${formatMoney(totals.promo)}`}
              positive
            />
          )}
          {totals.wallet > 0 && (
            <PriceLine
              label={summary.wallet}
              amount={`−${formatMoney(totals.wallet)}`}
              positive
            />
          )}
          {payLater?.length ? (
            <PriceLine
              label={copy.todayPayment}
              amount={formatMoney(dueToday)}
            />
          ) : null}

          <span aria-hidden className="h-px w-full bg-white/10" />

          <div className="flex items-center justify-between gap-2">
            <span className="font-[family-name:var(--font-display)] text-[17px] font-semibold leading-6 text-content-primary">
              {summary.total}
            </span>
            <span className="flex flex-col items-end gap-[3px]">
              <span className="font-[family-name:var(--font-sans)] text-[17px] font-bold leading-6 tracking-[0.085px] text-content-primary">
                {formatMoney(dueToday)}
              </span>
              <span className="font-[family-name:var(--font-display)] text-[10px] leading-[14px] tracking-[0.1px] text-content-secondary">
                {summary.vat(formatMoney(dueVat))}
              </span>
            </span>
          </div>

          <span aria-hidden className="h-px w-full bg-white/10" />
        </div>

        <div className="flex flex-col gap-1">
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(event) => onAgreed(event.target.checked)}
            aria-invalid={Boolean(error)}
            className="peer sr-only"
          />
          {/* The design system's Checkbox: 24 square, a 5% black ground
              behind a 30% white border when off, a solid white ground with
              the inverse checkmark when on. Not the brand yellow — that is
              the switch's colour, and using it here made the two controls
              on this screen look like the same kind of thing. */}
          <span
            aria-hidden
            className={`mt-[2px] flex size-6 shrink-0 items-center justify-center p-1 transition-colors peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brand ${
              agreed ? "bg-white" : "border border-white/30 bg-black/5"
            }`}
          >
            {agreed && (
              <Image
                src="/assets/ic-checkmark-16.svg"
                alt=""
                width={16}
                height={16}
                className="size-4"
              />
            )}
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

      {/* What the booking earns, on the card's own foot. The same figure the
          confirmation pays out. */}
      <p className="m-0 flex items-center justify-center bg-[#0f3e21] p-2 text-center font-[family-name:var(--font-display)] text-[13px] font-semibold leading-5 tracking-[0.16px] text-content-primary">
        {copy.earnBanner(bookingCopy.confirmation.earnedBeats)}
      </p>
    </div>
  );
}

/** One line of the breakdown, at the comp's 15/22. */
function PriceLine({
  label,
  amount,
  positive,
}: {
  label: string;
  amount: string;
  /** Money coming off — a promo or the wallet. */
  positive?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-2 font-[family-name:var(--font-display)] text-[15px] leading-[22px]">
      <span
        className={`tracking-[0.15px] ${positive ? "text-[#4ade80]" : "text-content-primary"}`}
      >
        {label}
      </span>
      <span
        className={`font-semibold tracking-[0.19px] ${positive ? "text-[#4ade80]" : "text-content-primary"}`}
      >
        {amount}
      </span>
    </div>
  );
}
