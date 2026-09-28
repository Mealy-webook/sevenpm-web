"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { RequestsPanel } from "./RequestsPanel";
import { PaymentsSheet } from "@/components/booking/PaymentsSheet";
import { totals } from "@/components/booking/cart";
import { schedule } from "@/components/booking/payLaterRules";
import { bookingConfig } from "@/data/booking";
import type { Booking } from "@/data/account";
import { bookingsCopy, requestsCopy, walletCurrency } from "@/data/account";

/**
 * Bookings, from Figma 2496:7702. The display-size title, the chips, then the
 * bookings as 305-wide cards — or the empty state with the cassette sticker.
 *
 * The card is the booking's own summary rather than a link to the event: the
 * artwork with what you bought written over it, the status, the name at
 * display size, when and where — and, when the booking is on an instalment
 * plan, a footer carrying how far through it you are and what the next
 * payment costs, with the action to make it.
 *
 * VIP box requests are the third chip rather than a sidebar entry of their
 * own. An enquiry is a booking that has not been priced yet, and someone
 * looking for "the box I asked about" looks under their bookings first.
 */

type Filter = (typeof bookingsCopy.filters)[number] | "Requests";

/* The comp gives the date alone — "2 Juillet 2026" — with no time and no
   range. The gate cares about the day; the hour is on the event page. */
const dateFormat = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "Africa/Casablanca",
});

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

  /* Which booking's payment sheet is open, and how far through its plan we
     have got. Settling is local to the page — there is no payment provider
     behind any of this — so the count lives here rather than in the data. */
  const [paying, setPaying] = useState<Booking | null>(null);
  const [cleared, setCleared] = useState<Record<string, number>>({});

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
      {/* Display size, and no standfirst: the comp carries neither. */}
      <h2
        id="bookings-title"
        className="account-panel-title m-0 font-daltown uppercase text-white"
        data-no-split
      >
        {bookingsCopy.title}
      </h2>

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
            /* 305 per card, wrapping — the comp draws one, at that width,
               and says nothing about what a second does. */
            <ul className="m-0 flex list-none flex-wrap gap-6 p-0">
              {shown.map((booking) => {
                /* Priced from the booking's own cart, so the card, the order
                   tab and the plan cannot quote different figures. */
                const order = totals(booking.cart);
                const contents = bookingsCopy.contents(
                  order.ticketCount,
                  order.addonCount,
                );
                const plan = booking.payment
                  ? schedule(
                      order.total,
                      booking.payment.instalments,
                      new Date(booking.payment.startedAt),
                    )
                  : null;
                const paid = booking.payment
                  ? (cleared[booking.id] ?? booking.payment.paid)
                  : 0;
                const nextDue = plan?.[paid] ?? null;
                return (
                  <li
                    key={booking.id}
                    className="flex w-full max-w-[305px] flex-col bg-bg-secondary"
                  >
                    <div className="flex flex-col justify-center gap-3 px-4 pb-3 pt-4">
                      <div className="flex flex-col gap-2">
                        <div className="relative">
                          <Link
                            href={`/events/${booking.eventSlug}`}
                            className="group relative block aspect-[240/160] w-full overflow-hidden bg-bg-tertiary"
                            data-cursor="Open"
                          >
                            <Image
                              src={booking.image}
                              alt=""
                              fill
                              sizes="305px"
                              className="object-cover transition-[scale] duration-700 group-hover:scale-105"
                            />
                          </Link>
                          {/* Over the artwork, bottom right: what you bought. */}
                          <span className="pointer-events-none absolute bottom-3 right-3 bg-bg-primary px-1.5 py-1 font-[family-name:var(--font-display)] text-[15px] font-semibold leading-[22px] tracking-[0.19px] text-content-primary">
                            {contents}
                          </span>
                        </div>

                        {nextDue && (
                          /* Orange on near-black: the comp lays 90% black over
                             the orange rather than tinting it, so the tag sits
                             back while the text stays at full strength. */
                          <span
                            className="flex w-fit items-center gap-1 px-1.5 py-1"
                            style={{
                              backgroundImage:
                                "linear-gradient(90deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.9) 100%), linear-gradient(90deg, #ff7f29 0%, #ff7f29 100%)",
                            }}
                          >
                            <Image
                              src="/assets/ic-pending-16.svg"
                              alt=""
                              width={16}
                              height={16}
                              className="size-4 shrink-0"
                            />
                            <span className="font-[family-name:var(--font-display)] text-[15px] font-semibold leading-[22px] tracking-[0.19px] text-[#ff7f29]">
                              {bookingsCopy.pending}
                            </span>
                          </span>
                        )}
                      </div>

                      <div className="flex flex-col gap-1">
                        <h3 className="m-0 truncate font-daltown text-[56px] uppercase leading-[42px] tracking-[0.56px] text-white">
                          <Link
                            href={`/events/${booking.eventSlug}`}
                            className="transition-colors hover:text-brand"
                          >
                            {booking.eventName}
                          </Link>
                        </h3>
                        <time
                          dateTime={booking.startsAt}
                          className="font-[family-name:var(--font-display)] text-[15px] font-semibold leading-[22px] tracking-[0.19px] text-brand"
                        >
                          {dateFormat.format(new Date(booking.startsAt))}
                        </time>
                        {booking.venueUrl ? (
                          <a
                            href={booking.venueUrl}
                            target="_blank"
                            rel="noreferrer noopener"
                            className="font-[family-name:var(--font-display)] text-[15px] leading-[22px] tracking-[0.15px] text-content-secondary underline decoration-solid transition-colors hover:text-white"
                          >
                            {booking.venue}
                          </a>
                        ) : (
                          <span className="font-[family-name:var(--font-display)] text-[15px] leading-[22px] tracking-[0.15px] text-content-secondary underline decoration-solid">
                            {booking.venue}
                          </span>
                        )}
                      </div>
                    </div>

                    {booking.payment && plan && (
                      /* The plan, and the way to move it along. */
                      <div className="flex flex-col justify-center border-t border-solid border-white/5 p-4">
                        <div className="flex items-center gap-2">
                          <div className="flex min-w-0 flex-1 flex-col justify-center gap-1">
                            <span className="font-[family-name:var(--font-display)] text-[13px] leading-5 tracking-[0.13px] text-content-secondary">
                              {bookingsCopy.instalments(
                                paid,
                                booking.payment.instalments,
                              )}
                            </span>
                            <span className="whitespace-nowrap font-[family-name:var(--font-display)] text-[17px] font-semibold leading-6 text-content-primary">
                              {(nextDue?.amount ?? 0).toFixed(2)}{" "}
                              {walletCurrency}
                            </span>
                          </div>
                          {/* The flow this button names already exists —
                              `PaymentsSheet` is the one the journey opens
                              from its confirmation. */}
                          <button
                            type="button"
                            onClick={() => setPaying(booking)}
                            disabled={!nextDue}
                            className="flex min-w-0 flex-1 cursor-pointer items-center justify-center gap-2 whitespace-nowrap bg-brand px-5 py-4 text-center font-[family-name:var(--font-display)] text-[17px] font-semibold leading-6 text-[#0b0b0e] transition-opacity hover:opacity-90 disabled:cursor-default disabled:opacity-40"
                          >
                            {nextDue ? bookingsCopy.pay : bookingsCopy.settled}
                          </button>
                        </div>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </>
      )}

      {/* The flow behind "Make payment": the instalments, each with its own
          Pay, and the order they belong to (Figma 2417:22873 / 2420:25015). */}
      {paying?.payment && (
        <PaymentsSheet
          instalments={schedule(
            totals(paying.cart).total,
            paying.payment.instalments,
            new Date(paying.payment.startedAt),
          )}
          cleared={cleared[paying.id] ?? paying.payment.paid}
          onPay={(count) =>
            setCleared((prev) => ({ ...prev, [paying.id]: count }))
          }
          onClose={() => setPaying(null)}
          totals={totals(paying.cart)}
          event={{
            name: paying.eventName,
            poster: paying.image,
            time: bookingConfig.sessionTime,
            venue: paying.venue,
            venueUrl: paying.venueUrl ?? "",
          }}
          today={now}
        />
      )}
    </section>
  );
}
