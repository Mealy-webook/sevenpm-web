"use client";

import Image from "next/image";
import { useState } from "react";

import { CardTile } from "./CardTile";
import { CardDialog } from "@/components/ui/CardDialog";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import type { PaymentCard } from "@/data/account";
import { paymentsCopy } from "@/data/account";

/**
 * Payments, from Figma 2205:7060: "Manage your cards" over a wrapping grid of
 * card tiles, each with its default toggle and Remove.
 *
 * The comp stops at the cards, and so does this panel. Billing details and a
 * receipts list used to sit under it; they were dropped on request.
 *
 * Adding reuses the booking journey's `CardDialog`, so raw card data is
 * handled in exactly one place on the site: the number, expiry and CVC live
 * and die inside that component and only the brand, mark and last four ever
 * reach this panel. A card added here therefore has no expiry to show, and the
 * tile leaves that line out rather than inventing one. In production the
 * dialog's fields must be replaced by the payment provider's hosted fields so
 * raw card data never touches our DOM at all.
 *
 * State is local and deliberately not persisted: this is a prototype, no
 * provider is connected, and the note under the grid says so rather than
 * leaving someone to discover it.
 */
export function PaymentsPanel({
  cards: initialCards,
}: {
  cards: PaymentCard[];
}) {
  const [cards, setCards] = useState(initialCards);
  const [defaultId, setDefaultId] = useState(
    initialCards.find((card) => card.primary)?.id ?? initialCards[0]?.id,
  );
  const [adding, setAdding] = useState(false);
  const [pending, setPending] = useState<PaymentCard | null>(null);

  const copy = paymentsCopy.cards;

  const remove = (card: PaymentCard) => {
    setCards((current) => current.filter((item) => item.id !== card.id));
    setPending(null);
  };

  return (
    <div
      className="flex min-w-0 flex-1 flex-col gap-6"
      aria-labelledby="payments-title"
    >
      {/* Section title */}
      <div className="flex items-center gap-4">
        <h2
          id="payments-title"
          className="m-0 min-w-0 flex-1 truncate font-[family-name:var(--font-display)] text-[26px] font-bold uppercase leading-8 tracking-[-0.13px] text-content-primary"
        >
          {copy.title}
        </h2>
        <button
          type="button"
          onClick={() => setAdding(true)}
          className="btn-secondary flex shrink-0 cursor-pointer items-center justify-center gap-1 p-[10px]"
        >
          <Image
            src="/assets/ic-plus-13.svg"
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

      {cards.length === 0 ? (
        <p className="m-0 py-6 font-[family-name:var(--font-display)] text-[15px] leading-[22px] tracking-[0.15px] text-content-secondary">
          {copy.empty}
        </p>
      ) : (
        <ul className="m-0 flex list-none flex-wrap items-start gap-6 p-0">
          {cards.map((card) => (
            <CardTile
              key={card.id}
              card={card}
              isDefault={card.id === defaultId}
              onMakeDefault={() => setDefaultId(card.id)}
              onRemove={() => setPending(card)}
            />
          ))}
        </ul>
      )}

      <p className="m-0 font-[family-name:var(--font-display)] text-[12px] leading-4 tracking-[0.12px] text-content-secondary">
        {copy.note}
      </p>

      {adding && (
        <CardDialog
          title={copy.addTitle}
          submitLabel={copy.addCard}
          showNote={false}
          onClose={() => setAdding(false)}
          onAdd={(saved) => {
            setCards((current) => [
              ...current,
              {
                id: `${saved.brand}-${saved.last4}-${current.length}`,
                brand: saved.brand,
                last4: saved.last4,
                mark: saved.mark,
              },
            ]);
            setAdding(false);
          }}
        />
      )}

      {pending && (
        <ConfirmDialog
          title={copy.confirmTitle}
          body={copy.confirmBody(`${pending.brand} ending ${pending.last4}`)}
          cancelLabel={copy.cancel}
          confirmLabel={copy.remove}
          destructive
          onCancel={() => setPending(null)}
          onConfirm={() => remove(pending)}
        />
      )}
    </div>
  );
}
