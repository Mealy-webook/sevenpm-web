"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { RequestsPanel } from "./RequestsPanel";
import type { Booking } from "@/data/account";
import { bookingsCopy, requestsCopy } from "@/data/account";

/**
 * Bookings, from Figma 2467:17822. Section title with a description, the
 * chips, then the bookings as a three-up grid of cards — a square poster, the
 * event, when and where, and the ticket count as an inline link — or the
 * empty state with the cassette sticker.
 *
 * VIP box requests are the third chip rather than a sidebar entry of their
 * own. An enquiry is a booking that has not been priced yet, and someone
 * looking for "the box I asked about" looks under their bookings first.
 */

type Filter = (typeof bookingsCopy.filters)[number] | "Requests";

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
  /* `/account?tab=requests` opens on the requests chip. Read here rather than
     handed down from the page: a page that reads `searchParams` cannot be
     rendered statically, and the whole site is exported as static files. */
  const params = useSearchParams();
  const [filter, setFilter] = useState<Filter>(
    params.get("tab") === "requests" ? "Requests" : "Upcoming",
  );
  const router = useRouter();

  /* The sidebar's "VIP Box requests" row points at ?tab=requests and lights
     up from the URL, so picking a chip writes the URL as well as the state —
     otherwise the row and the chip disagree about which screen you are on. */
  const select = (next: Filter) => {
    setFilter(next);
    router.replace(next === "Requests" ? "/account?tab=requests" : "/account", {
      scroll: false,
    });
  };
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

      <div
        role="tablist"
        aria-label={bookingsCopy.title}
        className="flex flex-wrap gap-4"
      >
        {[
          ...bookingsCopy.filters.map((label) => ({
            id: label as Filter,
            label: label as string,
          })),
          { id: "Requests" as Filter, label: requestsCopy.title },
        ].map((tab) => {
          const selected = filter === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => select(tab.id)}
              className={`flex h-10 cursor-pointer items-center justify-center gap-2 border p-3 font-[family-name:var(--font-display)] text-[15px] font-semibold leading-[22px] tracking-[0.19px] text-content-primary transition-colors ${
                selected
                  ? "border-content-primary bg-white/10"
                  : "border-white/10 bg-white/5 hover:bg-white/10"
              }`}
            >
              <span className="px-1">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {filter === "Requests" ? (
        <RequestsPanel heading={false} />
      ) : (
        <>
          {shown.length === 0 ? (
            <div className="flex min-h-[253px] flex-1 flex-col items-center justify-center gap-4">
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
            /* Three across on a wide screen: a square poster, the event, when
               and where, and the ticket count as an inline link (2467:18170). */
            <ul className="m-0 grid list-none grid-cols-1 gap-x-8 gap-y-10 p-0 sm:grid-cols-2 xl:grid-cols-3">
              {shown.map((booking) => (
                <li
                  key={booking.id}
                  className="flex flex-col items-start gap-4"
                >
                  <Link
                    href={`/events/${booking.eventSlug}`}
                    className="group relative block aspect-square w-full overflow-hidden bg-ink-700"
                    data-cursor="Open"
                  >
                    <Image
                      src={booking.image}
                      alt=""
                      fill
                      sizes="(max-width: 640px) 90vw, (max-width: 1280px) 45vw, 295px"
                      className="object-cover transition-[scale] duration-700 group-hover:scale-105"
                    />
                  </Link>

                  <div className="flex w-full flex-col gap-2">
                    <h3 className="m-0 font-[family-name:var(--font-display)] text-[22px] font-bold uppercase leading-7 tracking-[-0.11px] text-white">
                      <Link
                        href={`/events/${booking.eventSlug}`}
                        className="transition-colors hover:text-brand"
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
                          className="size-4 shrink-0"
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
                          className="size-4 shrink-0"
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
                    className="group/link flex items-center gap-2 font-[family-name:var(--font-display)] text-[17px] font-semibold leading-6 text-content-primary transition-colors hover:text-brand"
                  >
                    {booking.tickets}{" "}
                    {booking.tickets === 1 ? "Ticket" : "Tickets"}
                    <Image
                      src="/assets/ic-chevron-right-20.svg"
                      alt=""
                      width={20}
                      height={20}
                      className="size-5 transition-[translate] duration-300 group-hover/link:translate-x-1"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </section>
  );
}
