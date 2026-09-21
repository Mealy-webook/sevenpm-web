"use client";

import Image from "next/image";
import { useId, useState } from "react";

import { CardDialog, type SavedCard } from "@/components/ui/CardDialog";
import { Sheet, SheetField, SheetSubmit } from "@/components/ui/Sheet";
import { walletCopy } from "@/data/account";

/** Plain "150 MAD" — `formatAmount` prefixes a "+", which reads wrong here. */
function money(amount: number, currency: string) {
  return `${amount.toLocaleString("en-US")} ${currency}`;
}

/**
 * Top up, from Figma 2196:10582 (amount + methods), 2196:11179 (add payment
 * method) and 2196:12115 (a card on file).
 *
 * No payment provider is connected, so topping up moves the balance on this
 * page and says as much — see `doneBody`.
 */
export function TopUpDialog({
  balance,
  currency,
  onClose,
  onTopUp,
}: {
  balance: number;
  currency: string;
  onClose: () => void;
  /** Called with the amount once the visitor confirms. */
  onTopUp: (amount: number) => void;
}) {
  const copy = walletCopy.topUp;
  const titleId = useId();
  const fieldId = useId();

  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("apple-pay");
  const [card, setCard] = useState<SavedCard | null>(null);
  const [cardOpen, setCardOpen] = useState(false);
  const [done, setDone] = useState<number | null>(null);

  const value = Number(amount) || 0;
  const belowMinimum = amount.length > 0 && value < copy.minimum;

  if (cardOpen) {
    return (
      <CardDialog
        title={copy.cardTitle}
        submitLabel={copy.cardSubmit}
        showNote={false}
        onClose={() => setCardOpen(false)}
        onAdd={(saved) => {
          setCard(saved);
          setMethod("card");
          setCardOpen(false);
        }}
      />
    );
  }

  if (done !== null) {
    return (
      <Sheet
        open
        onClose={onClose}
        title={copy.doneTitle}
        titleId={titleId}
        closeLabel={copy.close}
      >
        <div className="flex flex-col gap-4 px-5 pb-5 pt-4">
          <p className="m-0 font-[family-name:var(--font-display)] text-[15px] leading-[22px] tracking-[0.19px] text-content-secondary">
            {copy.doneBody(money(done, currency))}
          </p>
          <SheetSubmit onClick={onClose}>{copy.done}</SheetSubmit>
        </div>
      </Sheet>
    );
  }

  return (
    <Sheet
      open
      onClose={onClose}
      title={copy.title}
      subtitle={copy.balance(money(balance, currency))}
      titleId={titleId}
      closeLabel={copy.close}
    >
      <div className="flex flex-col gap-4 px-5 pb-5 pt-4">
        <div className="flex flex-col gap-3">
          <SheetField
            id={fieldId}
            label={copy.amount}
            value={amount}
            onChange={(next) => setAmount(next.replace(/[^\d]/g, "").slice(0, 6))}
            inputMode="numeric"
            trailing={
              amount ? (
                <button
                  type="button"
                  aria-label={copy.clear}
                  onClick={() => setAmount("")}
                  className="flex size-5 shrink-0 cursor-pointer items-center justify-center"
                >
                  <Image
                    src="/assets/ic-clear-20.svg"
                    alt=""
                    width={20}
                    height={20}
                    className="size-5"
                  />
                </button>
              ) : undefined
            }
          />
          <p
            className={`m-0 font-[family-name:var(--font-display)] text-[12px] leading-4 tracking-[0.12px] ${
              belowMinimum ? "text-[#ff6c6c]" : "text-content-secondary"
            }`}
          >
            {copy.minimumHint(money(copy.minimum, currency))}
          </p>

          <div className="flex flex-wrap gap-2">
            {copy.quick.map((step) => (
              <button
                key={step}
                type="button"
                onClick={() => setAmount(String(value + step))}
                className="btn-secondary flex cursor-pointer items-center justify-center px-4 py-[10px] font-[family-name:var(--font-display)] text-[13px] font-semibold leading-5 tracking-[0.16px] text-content-primary"
              >
                {copy.quickLabel(money(step, currency))}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t-[0.5px] border-white/10 pt-4">
          <h3 className="m-0 font-[family-name:var(--font-display)] text-[15px] font-bold uppercase leading-6 tracking-[0.19px] text-white">
            {copy.payWith}
          </h3>

          <div
            role="radiogroup"
            aria-label={copy.payWith}
            className="flex flex-col gap-2"
          >
            {copy.methods.map((option) => {
              const selected = method === option.id;
              const isCard = option.id === "card";
              return (
                <button
                  key={option.id}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => setMethod(option.id)}
                  className={`flex w-full cursor-pointer items-center gap-3 border px-4 py-3 text-left transition-colors ${
                    selected
                      ? "border-content-primary bg-white/10"
                      : "border-white/10 bg-white/5 hover:bg-white/10"
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
                    <span className="font-[family-name:var(--font-display)] text-[15px] leading-[22px] tracking-[0.19px] text-content-primary">
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
                  {selected ? (
                    <Image
                      src="/assets/ic-check-square.svg"
                      alt=""
                      width={20}
                      height={20}
                      className="size-5 shrink-0"
                    />
                  ) : (
                    <span
                      aria-hidden
                      className="size-5 shrink-0 border border-white/30"
                    />
                  )}
                </button>
              );
            })}

            {card && (
              <button
                type="button"
                onClick={() => setCardOpen(true)}
                className="flex w-full cursor-pointer items-center justify-center gap-2 border border-white/10 bg-white/5 px-4 py-3 transition-colors hover:bg-white/10"
              >
                <Image
                  src="/assets/ic-plus-16.svg"
                  alt=""
                  width={16}
                  height={16}
                  className="size-4"
                />
                <span className="font-[family-name:var(--font-display)] text-[15px] leading-[22px] tracking-[0.19px] text-content-primary">
                  {copy.addCard}
                </span>
              </button>
            )}
          </div>
        </div>

        <SheetSubmit
          disabled={value < copy.minimum}
          onClick={() => {
            // Choosing Card with nothing on file goes to the card sheet first.
            if (method === "card" && !card) {
              setCardOpen(true);
              return;
            }
            onTopUp(value);
            setDone(value);
          }}
        >
          {copy.submit}
        </SheetSubmit>
      </div>
    </Sheet>
  );
}
