"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import type { Booking } from "@/data/account";
import { bookingsCopy } from "@/data/account";

/**
 * Bookings, from Figma 2173:26014 / 2173:25819. Section title with a
 * description, Upcoming / Past chips, then either the booking cards or the
 * empty state with the cassette sticker.
 */

type Filter = (typeof bookingsCopy.filters)[number];

const dateFormat = new Intl.DateTimeFormat("en-GB", {
  weekday: "short",
  day: "numeric",
  month: "short",
  timeZone: "Africa/Casablanca",
});
const timeFormat = new Intl.DateTimeFormat("en-US", {
  hour: "numeric",
  minute: "2-digit",
  timeZone: "Africa/Casablanca",
});

function formatWhen(booking: Booking) {
  const start = new Date(booking.startsAt);
  const end = new Date(booking.endsAt);
  return `${dateFormat.format(start)} ${timeFormat.format(start)} - ${timeFormat.format(end)}`;
}

export function BookingsPanel({
  bookings,
  now = new Date(),
}: {
  bookings: Booking[];
  /** Injected so the split is deterministic in tests and on the server. */
  now?: Date;
}) {
  const [filter, setFilter] = useState<Filter>("Upcoming");
  const shown = bookings.filter((b) =>
    filter === "Upcoming"
      ? new Date(b.endsAt) >= now
      : new Date(b.endsAt) < now,
  );

  return (
    <section
      className="flex min-w-0 flex-1 flex-col gap-6"
      aria-labelledby="bookings-title"
    >
      <div className="flex flex-col gap-1">
        <h2
          id="bookings-title"
          className="m-0 font-[family-name:var(--font-display)] text-[26px] font-bold uppercase leading-8 tracking-[-0.13px] text-content-primary"
        >
          {bookingsCopy.title}
        </h2>
        <p className="m-0 font-[family-name:var(--font-display)] text-[13px] leading-5 tracking-[0.13px] text-content-secondary">
          {bookingsCopy.description}
        </p>
      </div>

      <div role="tablist" aria-label="Booking period" className="flex gap-4">
        {bookingsCopy.filters.map((label) => {
          const selected = filter === label;
          return (
            <button
              key={label}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => setFilter(label)}
              className={`flex h-10 cursor-pointer items-center justify-center border p-3 font-[family-name:var(--font-display)] text-[15px] font-semibold leading-[22px] tracking-[0.19px] text-content-primary transition-colors ${
                selected
                  ? "border-content-primary bg-white/10"
                  : "border-white/10 bg-white/5 hover:bg-white/10"
              }`}
            >
              <span className="px-1">{label}</span>
            </button>
          );
        })}
      </div>

      {shown.length === 0 ? (
        <div
          className="flex min-h-[253px] flex-1 flex-col items-center justify-center gap-4"
        >
          <Image
            src="/assets/sticker-cassette.png"
            alt=""
            width={256}
            height={233}
            className="h-auto w-[156px]"
          />
          <p className="m-0 w-full text-center font-[family-name:var(--font-display)] text-[22px] font-bold uppercase leading-7 tracking-[-0.11px] text-content-primary">
            {bookingsCopy.empty}
          </p>
        </div>
      ) : (
        <ul
          className="m-0 flex list-none flex-col gap-4 p-0"
        >
          {shown.map((booking) => (
            <li
              key={booking.id}
              className="flex w-full flex-col gap-4 border border-white/5 p-6 sm:flex-row sm:items-center"
            >
              <div className="relative size-[88px] shrink-0 overflow-hidden bg-ink-700">
                <Image
                  src={booking.image}
                  alt=""
                  fill
                  sizes="88px"
                  className="object-cover"
                />
              </div>
              <div className="flex min-w-0 flex-1 flex-col gap-3">
                <h3 className="m-0 font-[family-name:var(--font-display)] text-[18px] font-bold uppercase leading-6 tracking-[-0.09px] text-white">
                  <Link
                    href={`/events/${booking.eventSlug}`}
                    className="hover:text-brand transition-colors"
                  >
                    {booking.eventName}
                  </Link>
                </h3>
                <div className="flex flex-col gap-1 font-[family-name:var(--font-display)] text-[13px] leading-5 tracking-[0.13px] text-content-secondary">
                  <span className="flex items-center gap-1">
                    <Image
                      src="/assets/ic-clock-16.svg"
                      alt=""
                      width={16}
                      height={16}
                      className="size-4"
                    />
                    <time dateTime={booking.startsAt}>
                      {formatWhen(booking)}
                    </time>
                  </span>
                  <span className="flex items-center gap-1">
                    <Image
                      src="/assets/ic-pin-16.svg"
                      alt=""
                      width={16}
                      height={16}
                      className="size-4"
                    />
                    {booking.venueUrl ? (
                      <a
                        href={booking.venueUrl}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="underline decoration-solid underline-offset-2 transition-colors hover:text-white"
                      >
                        {booking.venue}
                      </a>
                    ) : (
                      booking.venue
                    )}
                  </span>
                </div>
              </div>
              <Link
                href={`/events/${booking.eventSlug}#tickets`}
                className="btn-secondary flex shrink-0 items-center justify-center gap-2 self-start px-5 py-4 font-[family-name:var(--font-display)] text-[17px] font-semibold leading-6 text-content-primary sm:self-center"
                data-cursor="Open"
              >
                {booking.tickets} {booking.tickets === 1 ? "Ticket" : "Tickets"}
                <Image
                  src="/assets/ic-chevron-right-20.svg"
                  alt=""
                  width={20}
                  height={20}
                  className="size-5"
                />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
