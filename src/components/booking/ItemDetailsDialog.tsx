"use client";

import Image from "next/image";
import { useId, useState } from "react";

import { Sheet, SheetPrice } from "@/components/ui/Sheet";
import { Stepper } from "./Stepper";
import { bookingCopy, formatMoney, type BookingAddon } from "@/data/booking";

/**
 * Item details, from Figma 2196:11760: the product shot, the size chips and a
 * stepper over "Add to cart". Size and quantity are local until that button —
 * the grid tile behind it only changes when the item is actually added.
 */
export function ItemDetailsDialog({
  addon,
  initialSize,
  initialQuantity,
  onClose,
  onAdd,
}: {
  addon: BookingAddon | null;
  initialSize?: string;
  initialQuantity?: number;
  onClose: () => void;
  onAdd: (quantity: number, size?: string) => void;
}) {
  const titleId = useId();
  const [size, setSize] = useState(initialSize ?? addon?.sizes?.[2] ?? addon?.sizes?.[0]);
  const [quantity, setQuantity] = useState(Math.max(1, initialQuantity ?? 0));

  if (!addon) return null;

  return (
    <Sheet
      open
      onClose={onClose}
      title={bookingCopy.extras.details}
      titleId={titleId}
      closeLabel={bookingCopy.extras.close}
      footer={
        <div className="flex flex-col gap-4 px-5 pb-5">
          <div className="flex items-center justify-between gap-4 border-t-[0.5px] border-dashed border-white/10 pt-4">
            <SheetPrice
              price={addon.price}
              wasPrice={addon.wasPrice}
              discount={addon.discount}
              format={formatMoney}
            />
            <Stepper
              value={quantity}
              name={addon.name}
              onAdd={() => setQuantity(1)}
              onChange={(by) => setQuantity((current) => Math.max(0, current + by))}
            />
          </div>
          <button
            type="button"
            onClick={() => onAdd(quantity, size)}
            disabled={quantity === 0}
            className="flex w-full cursor-pointer items-center justify-center bg-white px-5 py-4 font-[family-name:var(--font-display)] text-[17px] font-semibold leading-6 text-[#18181b] transition-colors hover:bg-white/90 disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-white/30"
          >
            {bookingCopy.extras.addToCart}
          </button>
        </div>
      }
    >
      <div className="flex flex-col gap-4 px-5 pb-4 pt-4">
        {addon.image && (
          <span className="relative block aspect-[5/4] w-full overflow-hidden">
            <Image
              src={addon.image}
              alt={addon.name}
              fill
              sizes="338px"
              className="object-cover"
            />
          </span>
        )}

        <h3 className="m-0 font-[family-name:var(--font-display)] text-[15px] font-semibold uppercase leading-[22px] tracking-[0.19px] text-content-primary">
          {addon.name}
        </h3>

        {addon.sizes && (
          <div className="flex flex-col gap-2">
            <p className="m-0 font-[family-name:var(--font-display)] text-[13px] leading-5 tracking-[0.13px] text-content-secondary">
              {bookingCopy.extras.size}
            </p>
            <div role="radiogroup" aria-label={bookingCopy.extras.size} className="flex flex-wrap gap-2">
              {addon.sizes.map((option) => {
                const selected = option === size;
                return (
                  <button
                    key={option}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    onClick={() => setSize(option)}
                    className={`flex h-9 min-w-[44px] cursor-pointer items-center justify-center px-3 font-[family-name:var(--font-display)] text-[13px] font-semibold leading-5 tracking-[0.16px] transition-colors ${
                      selected
                        ? "border border-content-primary bg-white/10 text-content-primary"
                        : "border-[0.5px] border-white/10 bg-white/5 text-content-primary hover:bg-white/10"
                    }`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </Sheet>
  );
}
