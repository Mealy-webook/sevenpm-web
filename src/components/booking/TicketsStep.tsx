"use client";

import Image from "next/image";
import { useState } from "react";

import { Stepper } from "./Stepper";
import { quantityOf, type Cart } from "./cart";
import {
  bookingCopy,
  formatMoney,
  ticketGroups,
  type BookingTicket,
} from "@/data/booking";

/**
 * Step 1, from Figma 2138:3339 and 2024:4434: the event's name and times, the
 * admission-type chips, then one row per ticket. Each row carries an info
 * button that opens the line-up and a stepper that fills the basket.
 */
export function TicketsStep({
  eventName,
  time,
  venue,
  venueUrl,
  cart,
  onAdjust,
  onInfo,
}: {
  eventName: string;
  time: string;
  venue: string;
  venueUrl: string;
  cart: Cart;
  onAdjust: (id: string, by: number) => void;
  onInfo: (ticket: BookingTicket) => void;
}) {
  const [filter, setFilter] = useState<string>("all");
  const groups =
    filter === "all"
      ? ticketGroups
      : ticketGroups.filter((group) => group.id === filter);

  const chips = [
    { id: "all", label: bookingCopy.tickets.all },
    ...ticketGroups.map((group) => ({ id: group.id, label: group.label })),
  ];

  return (
    /* The name, the times and the type chips are the page's header and stay
       where they are; only the tickets below them travel. On a phone the
       column is not height-constrained and the whole page scrolls instead. */
    <div className="flex flex-col gap-8 lg:h-full lg:min-h-0">
      <header className="flex shrink-0 flex-col gap-2">
        <h1 className="m-0 font-[family-name:var(--font-display)] text-[32px] font-black uppercase leading-10 tracking-[-0.5px] text-white sm:text-[40px]">
          {eventName}
        </h1>
        <p className="m-0 flex items-center gap-1">
          <Image
            src="/assets/ic-clock-brand-20.svg"
            alt=""
            width={20}
            height={20}
            className="size-5 shrink-0"
          />
          <span className="font-[family-name:var(--font-display)] text-[13px] font-semibold leading-5 tracking-[0.16px] text-brand">
            {time}
          </span>
        </p>
        <p className="m-0 flex items-center gap-1">
          <Image
            src="/assets/ic-pin-16.svg"
            alt=""
            width={20}
            height={20}
            className="size-5 shrink-0"
          />
          <a
            href={venueUrl}
            target="_blank"
            rel="noreferrer"
            className="font-[family-name:var(--font-display)] text-[13px] font-semibold leading-5 tracking-[0.16px] text-white underline transition-colors hover:text-brand"
          >
            {venue}
          </a>
        </p>
      </header>

      <div
        role="tablist"
        aria-label="Ticket type"
        className="flex shrink-0 flex-wrap gap-2"
      >
        {chips.map((chip) => {
          const selected = filter === chip.id;
          return (
            <button
              key={chip.id}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => setFilter(chip.id)}
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

      <div
        /* Lenis takes the wheel at window level; without this it would scroll
           a page that no longer moves and this list would never budge. */
        data-lenis-prevent
        className="booking-scroll flex flex-col gap-8 lg:min-h-0 lg:flex-1 lg:overflow-y-auto lg:pb-2 lg:pr-3"
      >
        {groups.map((group) => (
          <section key={group.id} className="flex flex-col gap-4">
            <h2 className="m-0 font-[family-name:var(--font-display)] text-[17px] font-bold uppercase leading-6 text-white">
              {group.label}
            </h2>
            <ul className="m-0 flex list-none flex-col gap-3 p-0">
              {group.tickets.map((ticket) => {
                const quantity = quantityOf(cart, ticket.id);
                /* A box is not a seat: it is bought whole, it costs what a
                   table costs, and in a list of general admission rows it
                   should not look like one more of them. */
                const vip = group.id === "vip";
                return (
                  <li
                    key={ticket.id}
                    className={`flex items-center gap-2 border p-4 transition-colors ${
                      vip
                        ? "border-brand/40 bg-brand/[0.06] hover:border-brand"
                        : "border-white/5 hover:border-white/15"
                    }`}
                  >
                    <div className="flex min-w-0 flex-1 flex-col gap-2">
                      <div className="flex items-center gap-2">
                        {vip && (
                          <span className="flex shrink-0 items-center bg-brand/15 px-2 py-0.5 font-[family-name:var(--font-display)] text-[11px] font-bold uppercase leading-4 tracking-[1px] text-brand">
                            {bookingCopy.tickets.vip}
                          </span>
                        )}
                        <p className="m-0 truncate font-[family-name:var(--font-display)] text-[15px] font-semibold leading-[22px] tracking-[0.19px] text-white">
                          {ticket.name}
                        </p>
                        <button
                          type="button"
                          onClick={() => onInfo(ticket)}
                          aria-label={bookingCopy.tickets.info(ticket.name)}
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
                          {formatMoney(ticket.price)}
                        </span>
                        <span className="text-[10px] leading-[14px] tracking-[0.1px] text-content-secondary">
                          {vip
                            ? bookingCopy.tickets.perBox
                            : bookingCopy.tickets.perPerson}
                        </span>
                      </p>
                    </div>

                    <Stepper
                      atZero="stepper"
                      value={quantity}
                      name={ticket.name}
                      onAdd={() => onAdjust(ticket.id, 1)}
                      onChange={(by) => onAdjust(ticket.id, by)}
                    />
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
