"use client";

import Image from "next/image";
import { useId, useState } from "react";

import { Sheet, SheetPrice } from "@/components/ui/Sheet";
import { Stepper } from "./Stepper";
import { bookingCopy, formatMoney, type BookingTicket } from "@/data/booking";

/**
 * Ticket info, from Figma 2078:45259: the line-up behind a ticket, with the
 * price and a stepper in the dock. Quantity is local until "Add to cart" —
 * closing without it changes nothing.
 */
export function TicketInfoDialog({
  ticket,
  inCart,
  onClose,
  onAdd,
}: {
  ticket: BookingTicket | null;
  /** How many of this ticket are already in the cart. */
  inCart: number;
  onClose: () => void;
  onAdd: (quantity: number) => void;
}) {
  const titleId = useId();
  const [quantity, setQuantity] = useState(Math.max(1, inCart));

  if (!ticket) return null;

  return (
    <Sheet
      open
      onClose={onClose}
      title={ticket.name}
      titleId={titleId}
      closeLabel={bookingCopy.ticketInfo.close}
      footer={
        <div className="flex flex-col gap-4 px-5 pb-5">
          <div className="flex items-center justify-between gap-4">
            <SheetPrice
              price={ticket.price}
              wasPrice={ticket.wasPrice}
              discount={ticket.discount}
              suffix={bookingCopy.ticketInfo.perPerson}
              format={formatMoney}
            />
            <Stepper
              value={quantity}
              name={ticket.name}
              onAdd={() => setQuantity(1)}
              onChange={(by) => setQuantity((current) => Math.max(0, current + by))}
            />
          </div>
          <button
            type="button"
            onClick={() => onAdd(quantity)}
            disabled={quantity === 0}
            className="flex w-full cursor-pointer items-center justify-center bg-white px-5 py-4 font-[family-name:var(--font-display)] text-[17px] font-semibold leading-6 text-[#18181b] transition-colors hover:bg-white/90 disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-white/30"
          >
            {bookingCopy.ticketInfo.addToCart}
          </button>
        </div>
      }
    >
      <div className="flex flex-col gap-2 px-5 pb-4 pt-4">
        <p className="m-0 font-[family-name:var(--font-display)] text-[13px] font-semibold leading-5 tracking-[0.16px] text-content-primary">
          {bookingCopy.ticketInfo.lineup}
        </p>
        <ul
          className="m-0 flex max-h-[228px] list-none flex-col overflow-y-auto overscroll-contain p-0"
          data-lenis-prevent
        >
          {ticket.lineup.map((slot, index) => (
            <li
              key={`${slot.name}-${index}`}
              className="flex items-center gap-3 py-2"
            >
              <span className="relative block size-8 shrink-0 overflow-hidden rounded-full">
                <Image
                  src={slot.image}
                  alt=""
                  fill
                  sizes="32px"
                  className="object-cover"
                />
              </span>
              <span className="flex min-w-0 flex-1 flex-col border-b-[0.5px] border-white/10 pb-2">
                <span className="truncate font-[family-name:var(--font-display)] text-[15px] leading-[22px] tracking-[0.15px] text-content-primary">
                  {slot.name}
                </span>
                <span className="font-[family-name:var(--font-display)] text-[13px] leading-5 tracking-[0.13px] text-content-secondary">
                  {slot.time}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </Sheet>
  );
}
