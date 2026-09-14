"use client";

import Image from "next/image";
import { useState } from "react";

import { Stepper } from "./Stepper";
import { quantityOf, quantityOfAny, type Cart } from "./cart";
import {
  addons,
  bookingCopy,
  formatMoney,
  type AddonCategory,
  type BookingAddon,
} from "@/data/booking";

/**
 * Step 2, from Figma 2078:45505 (merchandise) and 2212:13243 (parking).
 * Merchandise is a three-up grid of product shots with the stepper floating
 * over the image; parking reuses the ticket row.
 *
 * Adding from a tile takes the default size — the size chips live in the item
 * details sheet, which the product shot opens.
 */
export function ExtrasStep({
  cart,
  onAdjust,
  onDetails,
}: {
  cart: Cart;
  onAdjust: (addon: BookingAddon, by: number, size?: string) => void;
  onDetails: (addon: BookingAddon) => void;
}) {
  const [category, setCategory] = useState<AddonCategory>("merchandise");
  const shown = addons.filter((addon) => addon.category === category);

  return (
    <div className="flex flex-col gap-8">
      <h1 className="m-0 font-[family-name:var(--font-display)] text-[32px] font-black uppercase leading-10 tracking-[-0.5px] text-white sm:text-[40px]">
        {bookingCopy.extras.title}
      </h1>

      <div role="tablist" aria-label="Extras" className="flex flex-wrap gap-2">
        {bookingCopy.extras.categories.map((chip) => {
          const selected = category === chip.id;
          return (
            <button
              key={chip.id}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => setCategory(chip.id as AddonCategory)}
              className={`flex h-10 cursor-pointer items-center px-4 font-[family-name:var(--font-display)] text-[15px] font-semibold leading-[22px] tracking-[0.19px] transition-colors ${
                selected
                  ? "border border-content-primary bg-white/10 text-content-primary"
                  : "border-[0.5px] border-white/10 bg-white/5 text-content-primary hover:bg-white/10"
              }`}
            >
              {chip.label}
            </button>
          );
        })}
      </div>

      {category === "merchandise" ? (
        <ul className="m-0 grid list-none grid-cols-2 gap-4 p-0 sm:grid-cols-3 sm:gap-8">
          {shown.map((addon) => {
            const quantity = quantityOfAny(cart, addon.id);
            const defaultSize = addon.sizes?.[2] ?? addon.sizes?.[0];
            return (
              <li key={addon.id} className="flex flex-col gap-2">
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => onDetails(addon)}
                    aria-label={bookingCopy.extras.openDetails(addon.name)}
                    className="relative block aspect-[185/277] w-full cursor-pointer overflow-hidden"
                  >
                    {addon.image && (
                      <Image
                        src={addon.image}
                        alt={addon.name}
                        fill
                        sizes="(max-width: 640px) 45vw, 200px"
                        className="object-cover transition-transform duration-500 hover:scale-[1.03]"
                      />
                    )}
                  </button>
                  <div className="absolute bottom-2 right-2">
                    <Stepper
                      emphasised
                      value={quantity}
                      name={addon.name}
                      onAdd={() => onAdjust(addon, 1, defaultSize)}
                      onChange={(by) => onAdjust(addon, by, defaultSize)}
                    />
                  </div>
                </div>
                <p className="m-0 font-[family-name:var(--font-display)] text-[13px] font-semibold leading-[22px] tracking-[0.16px] text-white">
                  {addon.name}
                </p>
                <p className="m-0 font-[family-name:var(--font-display)] text-[12px] font-semibold leading-[14px] tracking-[0.12px] text-brand">
                  {formatMoney(addon.price)}
                </p>
              </li>
            );
          })}
        </ul>
      ) : (
        <ul className="m-0 flex list-none flex-col gap-3 p-0">
          {shown.map((addon) => {
            const quantity = quantityOf(cart, addon.id);
            return (
              <li
                key={addon.id}
                className="flex items-center gap-2 border border-white/5 p-4 transition-colors hover:border-white/15"
              >
                <div className="flex min-w-0 flex-1 flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <p className="m-0 truncate font-[family-name:var(--font-display)] text-[15px] font-semibold leading-[22px] tracking-[0.19px] text-white">
                      {addon.name}
                    </p>
                    <button
                      type="button"
                      onClick={() => onDetails(addon)}
                      aria-label={bookingCopy.extras.openDetails(addon.name)}
                      className="flex shrink-0 cursor-pointer items-center justify-center transition-opacity hover:opacity-70"
                    >
                      <Image
                        src="/assets/ic-info-16.svg"
                        alt=""
                        width={20}
                        height={20}
                        className="size-5"
                      />
                    </button>
                  </div>
                  <p className="m-0 flex items-baseline gap-[2px] font-[family-name:var(--font-display)]">
                    <span className="text-[15px] font-semibold leading-[22px] tracking-[0.19px] text-content-primary">
                      {formatMoney(addon.price)}
                    </span>
                    <span className="text-[10px] leading-[14px] tracking-[0.1px] text-content-secondary">
                      {bookingCopy.tickets.perPerson}
                    </span>
                  </p>
                </div>
                <Stepper
                  value={quantity}
                  name={addon.name}
                  onAdd={() => onAdjust(addon, 1)}
                  onChange={(by) => onAdjust(addon, by)}
                />
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
