"use client";

import Image from "next/image";

import { Switch } from "@/components/ui/Switch";
import type { PaymentCard } from "@/data/account";
import { accountUser, paymentsCopy } from "@/data/account";

/**
 * A saved card, from Figma 2205:7234: the card face itself over an action bar
 * that tucks under its bottom edge.
 *
 * The face is drawn rather than photographed — a diagonal charcoal gradient, a
 * frosted layer over it, and one big sweeping highlight (`card-sheen.svg`)
 * that reads as light across plastic. The bar behind it carries the default
 * toggle and Remove.
 *
 * The default card's Remove is disabled rather than hidden: a row that loses
 * its button when you switch default reads as a bug, and the title says why it
 * cannot be pressed.
 *
 * Numbers here are already masked to four digits by the time they arrive —
 * `CardDialog` never lets a full number out — so there is nothing on this tile
 * that would matter if it were screenshotted.
 */
export function CardTile({
  card,
  isDefault,
  onMakeDefault,
  onRemove,
}: {
  card: PaymentCard;
  isDefault: boolean;
  onMakeDefault: () => void;
  onRemove: () => void;
}) {
  const name = `${card.brand} ending ${card.last4}`;

  return (
    <li className="isolate flex w-full max-w-[461px] list-none flex-col">
      {/* Card face. The negative margin pulls the bar up behind it. */}
      <div className="relative z-[2] -mb-6 aspect-[335/185] w-full">
        <div className="absolute inset-0 bg-[linear-gradient(117.67deg,#282828_1.6%,#0b0b0b_93.5%)]" />
        {/* The comp frosts this layer, but it sits on an opaque gradient — the
            blur has nothing behind it to sample, so only the tint is kept. */}
        <div className="absolute inset-0 bg-white/[0.03]" />
        <Image
          src="/assets/card-sheen.svg"
          alt=""
          width={462}
          height={255}
          aria-hidden
          className="absolute inset-0 size-full object-cover"
        />

        <p className="absolute left-6 top-7 m-0 font-[family-name:var(--font-display)] text-[17px] leading-6 tracking-[0.085px] text-content-primary">
          {accountUser.name}
        </p>

        <div className="absolute inset-x-6 bottom-6 flex items-end justify-between gap-4">
          <span className="flex min-w-0 flex-col gap-1 text-content-primary">
            <span className="font-[family-name:var(--font-display)] text-[18px] font-bold uppercase leading-6 tracking-[-0.09px]">
              xxxx xxxx xxxx {card.last4}
            </span>
            {card.expiry && (
              <span className="font-[family-name:var(--font-display)] text-[13px] leading-5 tracking-[0.13px]">
                {paymentsCopy.cards.expires} {card.expiry}
              </span>
            )}
          </span>
          {card.mark && (
            <Image
              src={card.mark}
              alt={card.brand}
              width={48}
              height={48}
              className="size-12 shrink-0 object-contain"
            />
          )}
        </div>
      </div>

      {/* Action bar. Its top 24px sit behind the card, so the padding above
          the controls has to carry that 24 plus the 12 that shows — otherwise
          the row reads as flush to the top edge and loose at the bottom. */}
      <div className="relative z-[1] flex w-full flex-wrap items-center justify-between gap-3 bg-white/5 py-3 pl-4 pr-3 pt-9">
        <span className="flex items-center gap-2">
          <span className="font-[family-name:var(--font-display)] text-[17px] leading-6 tracking-[0.085px] text-content-secondary">
            {paymentsCopy.cards.setDefault}
          </span>
          <Switch
            on={isDefault}
            /* Turning the default off would leave nothing to pay with, so the
               only move this control makes is promoting another card. */
            disabled={isDefault}
            onChange={onMakeDefault}
            label={`${paymentsCopy.cards.setDefault} — ${name}`}
          />
        </span>

        <button
          type="button"
          onClick={onRemove}
          disabled={isDefault}
          title={isDefault ? paymentsCopy.cards.defaultLocked : undefined}
          aria-label={`${paymentsCopy.cards.remove} — ${name}`}
          className={`flex shrink-0 items-center justify-center gap-1 p-3 transition-colors ${
            isDefault
              ? "cursor-not-allowed bg-white/5"
              : "btn-secondary cursor-pointer"
          }`}
        >
          <Image
            src={
              isDefault
                ? "/assets/ic-trash-dim-16.svg"
                : "/assets/ic-trash-red-16.svg"
            }
            alt=""
            width={16}
            height={16}
            className="size-4"
          />
          <span
            className={`flex h-4 items-center px-1 font-[family-name:var(--font-display)] text-[15px] font-semibold leading-[22px] tracking-[0.19px] ${
              isDefault ? "text-white/30" : "text-[#ff6c6c]"
            }`}
          >
            {paymentsCopy.cards.remove}
          </span>
        </button>
      </div>
    </li>
  );
}
