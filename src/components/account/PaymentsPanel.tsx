import Image from "next/image";

import type { PaymentCard, Receipt } from "@/data/account";
import { paymentsCopy } from "@/data/account";
import {
  AccountCard,
  AccountRow,
  ActionButton,
} from "@/components/account/AccountCard";

/**
 * Payments. No Figma comp — composed from the account vocabulary: the
 * wallet's leading icon tile for the saved cards, the profile's card and
 * row for everything else. Three cards: saved cards, billing details and
 * receipts.
 */
export function PaymentsPanel({
  cards,
  billing,
  receipts,
}: {
  cards: PaymentCard[];
  billing: { label: string; value?: string; action: string }[];
  receipts: Receipt[];
}) {
  return (
    <div
      className="flex min-w-0 flex-1 flex-col gap-6"
      aria-labelledby="payments-title"
    >
      <div className="flex flex-col gap-1">
        <h2
          id="payments-title"
          className="m-0 font-[family-name:var(--font-display)] text-[26px] font-bold uppercase leading-8 tracking-[-0.13px] text-content-primary"
        >
          {paymentsCopy.title}
        </h2>
        <p className="m-0 font-[family-name:var(--font-display)] text-[13px] leading-5 tracking-[0.13px] text-content-secondary">
          {paymentsCopy.description}
        </p>
      </div>

      <AccountCard
        id="cards"
        title={paymentsCopy.cards.title}
        action={<ActionButton>{paymentsCopy.cards.addCard}</ActionButton>}
      >
        {cards.length === 0 ? (
          <div className="flex min-h-[160px] flex-col items-center justify-center gap-4">
            <Image
              src="/assets/sticker-cassette.png"
              alt=""
              width={256}
              height={233}
              className="h-auto w-[120px]"
            />
            <p className="m-0 text-center font-[family-name:var(--font-display)] text-[15px] leading-[22px] tracking-[0.15px] text-content-secondary">
              {paymentsCopy.cards.empty}
            </p>
          </div>
        ) : (
          cards.map((card, index) => (
            <AccountRow
              key={card.id}
              icon="/assets/ic-acct-payments.svg"
              label={`${card.brand} •••• ${card.last4}`}
              value={`${paymentsCopy.cards.expires} ${card.expiry}`}
              divider={index < cards.length - 1}
            >
              {card.primary ? (
                <span className="shrink-0 bg-brand px-2 py-1 font-[family-name:var(--font-display)] text-[12px] font-bold uppercase leading-4 tracking-[0.12px] text-[#0b0b0e]">
                  {paymentsCopy.cards.primaryBadge}
                </span>
              ) : (
                <ActionButton
                  label={`Make ${card.brand} ending ${card.last4} the primary card`}
                >
                  {paymentsCopy.cards.makePrimary}
                </ActionButton>
              )}
              <ActionButton label={`Remove ${card.brand} ending ${card.last4}`}>
                {paymentsCopy.cards.remove}
              </ActionButton>
            </AccountRow>
          ))
        )}
      </AccountCard>

      <AccountCard id="billing" title={paymentsCopy.billing.title}>
        {billing.map((field, index) => (
          <AccountRow
            key={field.label}
            label={field.label}
            value={field.value ?? paymentsCopy.billing.emptyValue}
            divider={index < billing.length - 1}
          >
            <ActionButton
              label={`${field.action} ${field.label.toLowerCase()}`}
            >
              {field.action}
            </ActionButton>
          </AccountRow>
        ))}
      </AccountCard>

      <AccountCard id="receipts" title={paymentsCopy.receipts.title}>
        {receipts.map((receipt, index) => (
          <AccountRow
            key={receipt.id}
            label={receipt.label}
            value={`${receipt.date} · ${receipt.method}`}
            divider={index < receipts.length - 1}
          >
            <span className="shrink-0 whitespace-nowrap font-[family-name:var(--font-display)] text-[15px] font-semibold leading-[22px] tracking-[0.19px] text-content-primary">
              {receipt.amount}
            </span>
            <ActionButton label={`Download the receipt for ${receipt.label}`}>
              {paymentsCopy.receipts.download}
            </ActionButton>
          </AccountRow>
        ))}
      </AccountCard>
    </div>
  );
}
