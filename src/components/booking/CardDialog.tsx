"use client";

import Image from "next/image";
import { useId, useState } from "react";

import { Sheet, SheetField, SheetSubmit } from "./Sheet";
import { bookingCopy } from "@/data/booking";

/**
 * Add new card, from Figma 2139:5400 (empty), 2213:15202 (filled) and
 * 2213:15353 (expiry error).
 *
 * Read this before wiring it to anything real: the number, expiry and CVC
 * live in this component's state and nowhere else. They are never stored,
 * never logged, and never leave the page — `onAdd` receives only the brand,
 * the last four digits and the name, which is all the checkout row shows.
 *
 * In production these three inputs must be replaced by the payment
 * provider's hosted fields, so raw card data never touches our own DOM and
 * the site stays out of PCI scope. Until then this is a mock of that screen.
 */

export type SavedCard = {
  brand: string;
  mark: string;
  last4: string;
  name: string;
  /** Whether the visitor asked to keep it for next time. */
  remember: boolean;
};

/** Groups digits four at a time, as the comp shows them. */
function formatNumber(raw: string) {
  const digits = raw.replace(/\D/g, "").slice(0, 19);
  return digits.replace(/(.{4})/g, "$1 ").trim();
}

function formatExpiry(raw: string) {
  const digits = raw.replace(/\D/g, "").slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

/** Enough to pick the right mark; the provider does the real checking. */
function brandOf(digits: string) {
  if (/^4/.test(digits)) return { brand: "Visa", mark: "/assets/pay-visa.svg" };
  if (/^(5[1-5]|2[2-7])/.test(digits))
    return { brand: "Mastercard", mark: "/assets/pay-mastercard.svg" };
  if (/^3[47]/.test(digits))
    return { brand: "Amex", mark: "/assets/pay-amex.svg" };
  return { brand: "Card", mark: "/assets/pay-cmi.svg" };
}

/** Luhn — catches a mistyped digit before the provider has to. */
function luhn(digits: string) {
  let sum = 0;
  let double = false;
  for (let index = digits.length - 1; index >= 0; index -= 1) {
    let value = Number(digits[index]);
    if (double) {
      value *= 2;
      if (value > 9) value -= 9;
    }
    sum += value;
    double = !double;
  }
  return sum % 10 === 0;
}

function expiryIsDue(value: string) {
  const [month, year] = value.split("/");
  if (!month || !year || month.length !== 2 || year.length !== 2) return true;
  const monthNumber = Number(month);
  if (monthNumber < 1 || monthNumber > 12) return true;
  const now = new Date();
  const end = new Date(2000 + Number(year), monthNumber, 0, 23, 59, 59);
  return end.getTime() < now.getTime();
}

export function CardDialog({
  onClose,
  onAdd,
}: {
  onClose: () => void;
  onAdd: (card: SavedCard) => void;
}) {
  const copy = bookingCopy.cardDialog;
  const titleId = useId();
  const baseId = useId();

  const [number, setNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [name, setName] = useState("");
  const [remember, setRemember] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const digits = number.replace(/\D/g, "");
  const { brand, mark } = brandOf(digits);

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const next: Record<string, string> = {};
    if (digits.length < 13 || !luhn(digits)) next.number = copy.errors.number;
    if (expiryIsDue(expiry)) next.expiry = copy.errors.expiry;
    if (cvc.replace(/\D/g, "").length < 3) next.cvc = copy.errors.cvc;
    if (!name.trim()) next.name = copy.errors.name;
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    // Only these four values leave the component. The number, expiry and CVC
    // go out of scope with it.
    onAdd({
      brand,
      mark,
      last4: digits.slice(-4),
      name: name.trim(),
      remember,
    });
  };

  return (
    <Sheet
      open
      onClose={onClose}
      title={copy.title}
      subtitle={copy.subtitle}
      titleId={titleId}
      closeLabel={copy.close}
    >
      <form onSubmit={submit} noValidate className="flex flex-col gap-3 px-5 pb-5 pt-4">
        <SheetField
          id={`${baseId}-number`}
          label={copy.number}
          value={number}
          onChange={(next) => {
            setNumber(formatNumber(next));
            setErrors((current) => ({ ...current, number: "" }));
          }}
          inputMode="numeric"
          autoComplete="cc-number"
          error={errors.number || undefined}
          trailing={
            <span
              aria-hidden
              title={copy.scan}
              className="flex size-5 shrink-0 items-center justify-center opacity-70"
            >
              <Image
                src="/assets/ic-camera-20.svg"
                alt=""
                width={20}
                height={20}
                className="size-5"
              />
            </span>
          }
        />

        <div className="flex items-center gap-2">
          {bookingCopy.checkout.cardMarks.map((item) => (
            <Image
              key={item}
              src={item}
              alt=""
              width={26}
              height={16}
              className={`h-4 w-auto transition-opacity ${
                digits.length >= 2 && item !== mark ? "opacity-30" : "opacity-100"
              }`}
            />
          ))}
        </div>

        <div className="flex items-start gap-2">
          <SheetField
            id={`${baseId}-expiry`}
            label={copy.expiry}
            placeholder={copy.expiry}
            value={expiry}
            onChange={(next) => {
              setExpiry(formatExpiry(next));
              setErrors((current) => ({ ...current, expiry: "" }));
            }}
            inputMode="numeric"
            autoComplete="cc-exp"
            error={errors.expiry || undefined}
            className="flex-1"
            trailing={
              errors.expiry ? (
                <button
                  type="button"
                  aria-label={copy.errors.expiry}
                  onClick={() => {
                    setExpiry("");
                    setErrors((current) => ({ ...current, expiry: "" }));
                  }}
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
          <SheetField
            id={`${baseId}-cvc`}
            label={copy.cvc}
            placeholder={copy.cvc}
            value={cvc}
            onChange={(next) => {
              setCvc(next.replace(/\D/g, "").slice(0, 4));
              setErrors((current) => ({ ...current, cvc: "" }));
            }}
            inputMode="numeric"
            autoComplete="cc-csc"
            maxLength={4}
            error={errors.cvc || undefined}
            className="flex-1"
            trailing={
              <span
                aria-hidden
                title={copy.cvcHint}
                className="flex size-5 shrink-0 items-center justify-center"
              >
                <Image
                  src="/assets/ic-info-20.svg"
                  alt=""
                  width={20}
                  height={20}
                  className="size-5"
                />
              </span>
            }
          />
        </div>

        <SheetField
          id={`${baseId}-name`}
          label={copy.name}
          value={name}
          onChange={(next) => {
            setName(next);
            setErrors((current) => ({ ...current, name: "" }));
          }}
          autoComplete="cc-name"
          error={errors.name || undefined}
        />

        <p className="m-0 font-[family-name:var(--font-display)] text-[12px] leading-4 tracking-[0.12px] text-content-secondary">
          {copy.note}
        </p>

        <label className="flex cursor-pointer items-center gap-3 py-1">
          <input
            type="checkbox"
            checked={remember}
            onChange={(event) => setRemember(event.target.checked)}
            className="peer sr-only"
          />
          <span
            aria-hidden
            className="flex size-5 shrink-0 items-center justify-center border border-white/30 transition-colors peer-checked:border-white peer-checked:bg-white peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brand"
          >
            <svg
              viewBox="0 0 16 16"
              className={`size-3 ${remember ? "opacity-100" : "opacity-0"}`}
              fill="none"
            >
              <path d="M2 8.5 6 12.5 14 3.5" stroke="#18181b" strokeWidth="2.5" />
            </svg>
          </span>
          <span className="font-[family-name:var(--font-display)] text-[15px] leading-[22px] tracking-[0.19px] text-content-secondary">
            {copy.save}
          </span>
        </label>

        <div className="pt-2">
          <SheetSubmit type="submit">{copy.submit}</SheetSubmit>
        </div>
      </form>
    </Sheet>
  );
}
