"use client";

import Image from "next/image";
import { useId, useState } from "react";

import { Sheet, SheetField, SheetSubmit } from "@/components/ui/Sheet";
import {
  bookingCopy,
  deliveryCountries,
  pickupPoints,
} from "@/data/booking";

/**
 * Delivery details, from Figma 2139:4597 (pickup) and 2139:4953 (address):
 * two tabs over one Save. Nothing is committed until Save, so closing the
 * sheet leaves the checkout row as it was.
 */

export type DeliveryChoice =
  | { mode: "pickup"; point: string }
  | { mode: "address"; country: string; city: string; address: string };

/** One line for the checkout row — "Gate 4 (in venue)", "Riyadh, Saudi Arabia". */
export function describeDelivery(choice: DeliveryChoice | null) {
  if (!choice) return null;
  if (choice.mode === "pickup") {
    return pickupPoints.find((point) => point.id === choice.point)?.hint ?? null;
  }
  return [choice.city, choice.country].filter(Boolean).join(", ");
}

export function DeliveryDialog({
  value,
  onClose,
  onSave,
}: {
  value: DeliveryChoice | null;
  onClose: () => void;
  onSave: (choice: DeliveryChoice) => void;
}) {
  const copy = bookingCopy.deliveryDialog;
  const titleId = useId();
  const baseId = useId();

  const [tab, setTab] = useState<"pickup" | "address">(value?.mode ?? "pickup");
  const [point, setPoint] = useState(
    value?.mode === "pickup" ? value.point : pickupPoints[0].id,
  );
  const [country, setCountry] = useState(
    value?.mode === "address" ? value.country : "",
  );
  const [city, setCity] = useState(value?.mode === "address" ? value.city : "");
  const [address, setAddress] = useState(
    value?.mode === "address" ? value.address : "",
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const cities =
    deliveryCountries.find((item) => item.label === country)?.cities ?? [];

  const save = () => {
    if (tab === "pickup") {
      if (!point) {
        setErrors({ pickup: copy.errors.pickup });
        return;
      }
      onSave({ mode: "pickup", point });
      return;
    }
    const next: Record<string, string> = {};
    if (!country) next.country = copy.errors.country;
    if (!city) next.city = copy.errors.city;
    if (!address.trim()) next.address = copy.errors.address;
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    onSave({ mode: "address", country, city, address: address.trim() });
  };

  return (
    <Sheet
      open
      onClose={onClose}
      title={copy.title}
      subtitle={copy.subtitle}
      titleId={titleId}
      closeLabel={copy.close}
      footer={
        <div className="px-5 pb-5 pt-2">
          <SheetSubmit onClick={save}>{copy.save}</SheetSubmit>
        </div>
      }
    >
      <div className="flex flex-col gap-4 px-5 pt-4">
        {/* Segmented control */}
        <div role="tablist" aria-label={copy.title} className="flex">
          {copy.tabs.map((item) => {
            const selected = tab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => setTab(item.id as "pickup" | "address")}
                className={`flex h-10 flex-1 cursor-pointer items-center justify-center px-3 font-[family-name:var(--font-display)] text-[13px] font-semibold leading-5 tracking-[0.16px] transition-colors ${
                  selected
                    ? "bg-white/15 text-content-primary"
                    : "bg-white/5 text-content-secondary hover:bg-white/10"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        {tab === "pickup" ? (
          <div className="flex flex-col gap-2">
            <p className="m-0 font-[family-name:var(--font-display)] text-[13px] font-semibold leading-5 tracking-[0.16px] text-content-primary">
              {copy.pickupLabel}
            </p>
            <div role="radiogroup" aria-label={copy.pickupLabel} className="flex flex-col gap-2">
              {pickupPoints.map((item) => {
                const selected = point === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    onClick={() => {
                      setPoint(item.id);
                      setErrors({});
                    }}
                    className={`flex cursor-pointer items-center gap-3 border bg-white/5 px-4 py-3 text-left transition-colors ${
                      selected
                        ? "border-content-primary bg-white/10"
                        : "border-white/10 hover:bg-white/10"
                    }`}
                  >
                    <Image
                      src="/assets/ic-pin-16.svg"
                      alt=""
                      width={20}
                      height={20}
                      className="size-5 shrink-0"
                    />
                    <span className="flex min-w-0 flex-1 flex-col">
                      <span className="truncate font-[family-name:var(--font-display)] text-[15px] leading-[22px] tracking-[0.19px] text-content-primary">
                        {item.label}
                      </span>
                      <span className="font-[family-name:var(--font-display)] text-[12px] leading-4 tracking-[0.12px] text-content-secondary">
                        {item.hint}
                      </span>
                    </span>
                    {selected ? (
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
                    )}
                  </button>
                );
              })}
            </div>
            {errors.pickup && (
              <p
                role="alert"
                className="m-0 font-[family-name:var(--font-display)] text-[12px] leading-4 tracking-[0.12px] text-[#ff6c6c]"
              >
                {errors.pickup}
              </p>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <p className="m-0 font-[family-name:var(--font-display)] text-[13px] font-semibold leading-5 tracking-[0.16px] text-content-primary">
              {copy.addressLabel}
            </p>

            <div className="select-field w-full">
              <label htmlFor={`${baseId}-country`} className="sr-only">
                {copy.country}
              </label>
              <select
                id={`${baseId}-country`}
                value={country}
                onChange={(event) => {
                  setCountry(event.target.value);
                  setCity("");
                  setErrors({});
                }}
                className={`h-[54px] w-full appearance-none border bg-white/5 py-3 pl-4 pr-10 font-[family-name:var(--font-display)] text-[15px] leading-[22px] tracking-[0.19px] outline-none transition-colors focus:border-content-primary ${
                  errors.country ? "border-[#ff6c6c]" : "border-white/10"
                } ${country ? "font-semibold text-content-primary" : "text-content-secondary"}`}
              >
                <option value="">{copy.country}</option>
                {deliveryCountries.map((item) => (
                  <option key={item.code} value={item.label}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="select-field w-full">
              <label htmlFor={`${baseId}-city`} className="sr-only">
                {copy.city}
              </label>
              <select
                id={`${baseId}-city`}
                value={city}
                disabled={cities.length === 0}
                onChange={(event) => {
                  setCity(event.target.value);
                  setErrors({});
                }}
                className={`h-[54px] w-full appearance-none border bg-white/5 py-3 pl-4 pr-10 font-[family-name:var(--font-display)] text-[15px] leading-[22px] tracking-[0.19px] outline-none transition-colors focus:border-content-primary disabled:opacity-50 ${
                  errors.city ? "border-[#ff6c6c]" : "border-white/10"
                } ${city ? "font-semibold text-content-primary" : "text-content-secondary"}`}
              >
                <option value="">{copy.city}</option>
                {cities.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <SheetField
              id={`${baseId}-address`}
              label={copy.address}
              value={address}
              onChange={(next) => {
                setAddress(next);
                setErrors({});
              }}
              autoComplete="street-address"
              error={errors.address}
            />
          </div>
        )}
      </div>
    </Sheet>
  );
}
