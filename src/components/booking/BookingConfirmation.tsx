"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import type { Totals } from "./cart";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { bookingCopy, formatMoney } from "@/data/booking";

gsap.registerPlugin(ScrollTrigger);

/**
 * Confirmation, from Figma 2192:5369 (stacked) and 2213:16229 (fanned).
 *
 * The three cards start piled in the middle and deal themselves out as the
 * row is scrolled into place. The layout is the fanned row at all times; GSAP
 * only transforms each card back onto the pile and scrubs it off again, so
 * nothing reflows while they move.
 */

type ConfirmationEvent = {
  slug: string;
  name: string;
  venue: string;
  venueUrl: string;
  poster: string;
  /** ISO start, used for the date line and the calendar file. */
  startsAt: string;
};

/** "Wed, 11 Sep 7:00 PM", as the comp writes it. */
function formatWhen(iso: string) {
  const date = new Date(iso);
  const day = date.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
  const time = date
    .toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    })
    .replace(/\s/, " ");
  return `${day} ${time}`;
}

/** Hands a file to the browser without leaving the page. */
function saveFile(name: string, type: string, body: string) {
  const url = URL.createObjectURL(new Blob([body], { type }));
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  link.click();
  URL.revokeObjectURL(url);
}

function icsStamp(date: Date) {
  return `${date.toISOString().replace(/[-:]/g, "").split(".")[0]}Z`;
}

function CardShell({
  title,
  children,
  footer,
  index,
}: {
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  index: 0 | 1 | 2;
}) {
  return (
    <div
      /* GSAP owns the transform on these, so they carry no Tailwind
         translate/rotate/scale of their own — the two would add up. */
      data-confirm-card
      className="flex flex-col justify-between gap-4 border border-white/5 bg-bg-secondary p-6"
      style={{ zIndex: 30 - index * 10 }}
    >
      <div className="flex flex-col gap-4">
        <h2 className="m-0 font-[family-name:var(--font-display)] text-[22px] font-bold uppercase leading-7 tracking-[-0.11px] text-content-primary">
          {title}
        </h2>
        {children}
      </div>
      {footer}
    </div>
  );
}

function CardRow({
  label,
  value,
  action,
  underline = false,
}: {
  label: string;
  value: string;
  action?: React.ReactNode;
  underline?: boolean;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="font-[family-name:var(--font-display)] text-[12px] leading-4 tracking-[0.12px] text-content-secondary">
          {label}
        </span>
        <span
          className={`truncate font-[family-name:var(--font-display)] text-[13px] font-semibold leading-5 tracking-[0.16px] text-content-primary ${
            underline ? "underline" : ""
          }`}
        >
          {value}
        </span>
      </span>
      {action}
    </div>
  );
}

function PriceRow({
  label,
  amount,
  positive = false,
}: {
  label: string;
  amount: string;
  positive?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between gap-3 font-[family-name:var(--font-display)] text-[13px] leading-5 tracking-[0.13px] ${
        positive ? "text-[#4ade80]" : ""
      }`}
    >
      <span className={positive ? "" : "text-content-secondary"}>{label}</span>
      <span className={positive ? "font-semibold" : "font-semibold text-content-primary"}>
        {amount}
      </span>
    </div>
  );
}

export function BookingConfirmation({
  event,
  totals,
  orderNumber,
  email,
  deliverySummary,
}: {
  event: ConfirmationEvent;
  totals: Totals;
  orderNumber: string;
  email: string;
  deliverySummary: string | null;
}) {
  const copy = bookingCopy.confirmation;
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);
  const cardsRoot = useRef<HTMLDivElement>(null);

  /**
   * Deal the cards out on scroll. Each one starts a column back from where it
   * belongs, tilted, and a scrubbed ScrollTrigger walks it home as the row
   * comes up the viewport. Only from `lg`, where the row is three columns —
   * on a phone the cards are already stacked and there is no pile to undo.
   */
  useEffect(() => {
    const root = cardsRoot.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const media = gsap.matchMedia();
    media.add("(min-width: 1024px)", () => {
      const cards = gsap.utils.toArray<HTMLElement>("[data-confirm-card]", root);
      if (cards.length < 3) return;

      const from = [
        { xPercent: 100, x: 16, rotation: -7 },
        { xPercent: 0, x: 0, rotation: 3 },
        { xPercent: -100, x: -16, rotation: -2 },
      ];

      cards.forEach((card, index) => {
        gsap.fromTo(
          card,
          { ...from[index], scale: 0.95 },
          {
            xPercent: 0,
            x: 0,
            rotation: 0,
            scale: 1,
            ease: "none",
            scrollTrigger: {
              trigger: root,
              start: "top 65%",
              end: "top 15%",
              scrub: 0.8,
            },
          },
        );
      });
    });

    return () => media.revert();
  }, []);

  const when = formatWhen(event.startsAt);

  const copyNumber = async () => {
    try {
      await navigator.clipboard.writeText(orderNumber);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard access can be refused; the number is on screen either way.
    }
  };

  const share = async () => {
    const text = `${event.name} — order ${orderNumber}, ${when}, ${event.venue}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: event.name, text });
        return;
      }
      await navigator.clipboard.writeText(text);
      setShared(true);
      window.setTimeout(() => setShared(false), 2000);
    } catch {
      // The visitor dismissed the share sheet — nothing to report.
    }
  };

  const addToCalendar = () => {
    const start = new Date(event.startsAt);
    const end = new Date(start.getTime() + 5 * 60 * 60 * 1000);
    const ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//SEVENPM//Booking//EN",
      "BEGIN:VEVENT",
      `UID:${orderNumber}@sevenpm`,
      `DTSTAMP:${icsStamp(new Date())}`,
      `DTSTART:${icsStamp(start)}`,
      `DTEND:${icsStamp(end)}`,
      `SUMMARY:${event.name}`,
      `LOCATION:${event.venue}`,
      `DESCRIPTION:Order ${orderNumber}`,
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");
    saveFile(`${event.slug}.ics`, "text/calendar", ics);
  };

  const downloadReceipt = () => {
    const lines = [
      `SEVENPM — ${event.name}`,
      `Order ${orderNumber}`,
      `${when} · ${event.venue}`,
      "",
      ...totals.ticketLines.map(
        (line) => `${line.qty}x ${line.name}  ${formatMoney(line.amount)}`,
      ),
      ...totals.addonLines.map(
        (line) =>
          `${line.qty}x ${line.name}${line.size ? ` (${line.size})` : ""}  ${formatMoney(line.amount)}`,
      ),
      "",
      `${copy.price.subtotal}: ${formatMoney(totals.subtotal)}`,
      `${copy.price.fee}: ${formatMoney(totals.fee)}`,
      totals.promo > 0 && `${copy.price.promo}: -${formatMoney(totals.promo)}`,
      totals.wallet > 0 && `${copy.price.wallet}: -${formatMoney(totals.wallet)}`,
      `${copy.price.total}: ${formatMoney(totals.total)}`,
      `${copy.price.vat(formatMoney(totals.vat))}`,
      "",
      copy.note,
    ]
      .filter(Boolean)
      .join("\n");
    saveFile(`${orderNumber}.txt`, "text/plain", lines);
  };

  const lineRow = (
    line: Totals["ticketLines"][number],
    last: boolean,
  ) => (
    <li
      key={line.key}
      className={`flex items-center gap-3 py-3 ${
        last ? "" : "border-b-[0.5px] border-white/10"
      }`}
    >
      <span className="w-6 shrink-0 font-[family-name:var(--font-display)] text-[15px] leading-[22px] text-content-secondary">
        {line.qty}x
      </span>
      <Image
        src={line.icon}
        alt=""
        width={24}
        height={24}
        className="size-6 shrink-0"
      />
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="truncate font-[family-name:var(--font-display)] text-[15px] leading-[22px] tracking-[0.19px] text-content-primary">
          {line.name}
        </span>
        {line.size && (
          <span className="font-[family-name:var(--font-display)] text-[13px] leading-5 tracking-[0.13px] text-content-secondary">
            {copy.order.size(line.size)}
          </span>
        )}
      </span>
      <span className="shrink-0 font-[family-name:var(--font-display)] text-[13px] font-semibold leading-5 tracking-[0.16px] text-content-primary">
        {formatMoney(line.amount)}
      </span>
    </li>
  );

  return (
    <>
      <SiteHeader />
      <main className="pb-16">
        {/* Hero */}
        <section className="shell flex flex-col items-center gap-6 pt-16 text-center">
          <Image
            src="/assets/conf-hands.png"
            alt=""
            width={181}
            height={140}
            className="h-[140px] w-auto"
            priority
          />
          <div className="flex max-w-[642px] flex-col gap-1">
            <h1 className="m-0 font-[family-name:var(--font-display)] text-[32px] font-black uppercase leading-10 tracking-[-0.5px] text-white sm:text-[40px]">
              {copy.title}
            </h1>
            <p className="m-0 font-[family-name:var(--font-display)] text-[15px] leading-[22px] tracking-[0.19px] text-content-secondary">
              {copy.body(event.name)}
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/account"
              className="flex items-center justify-center bg-brand px-5 py-4 font-[family-name:var(--font-display)] text-[17px] font-semibold leading-6 text-[#18181b] transition-colors hover:bg-[#fff35a]"
            >
              {copy.viewBooking}
            </Link>
            <button
              type="button"
              onClick={addToCalendar}
              className="flex cursor-pointer items-center justify-center gap-2 bg-white px-5 py-4 font-[family-name:var(--font-display)] text-[17px] font-semibold leading-6 text-[#18181b] transition-colors hover:bg-white/90"
            >
              <Image
                src="/assets/ic-calendar-20.svg"
                alt=""
                width={20}
                height={20}
                className="size-5"
              />
              {copy.addToCalendar}
            </button>
          </div>
        </section>

        {/* The three cards, piled then dealt */}
        <section className="shell pt-16">
          <div
            ref={cardsRoot}
            className="mx-auto grid max-w-[886px] gap-4 lg:grid-cols-3"
          >
            <CardShell
              index={0}
              title={copy.summary.title}
              footer={
                <button
                  type="button"
                  onClick={share}
                  className="btn-secondary flex w-full cursor-pointer items-center justify-center gap-2 px-4 py-3"
                >
                  <Image
                    src="/assets/ic-share-16.svg"
                    alt=""
                    width={16}
                    height={16}
                    className="size-4"
                  />
                  <span className="font-[family-name:var(--font-display)] text-[13px] font-semibold leading-5 tracking-[0.16px] text-content-primary">
                    {shared ? copy.summary.shared : copy.summary.share}
                  </span>
                </button>
              }
            >
              <div className="flex flex-col gap-4">
                <CardRow
                  label={copy.summary.orderNumber}
                  value={copied ? copy.summary.copied : orderNumber}
                  action={
                    <button
                      type="button"
                      onClick={copyNumber}
                      aria-label={copy.summary.copy}
                      className="flex size-5 shrink-0 cursor-pointer items-center justify-center transition-opacity hover:opacity-70"
                    >
                      <Image
                        src="/assets/ic-copy-20.svg"
                        alt=""
                        width={20}
                        height={20}
                        className="size-5"
                      />
                    </button>
                  }
                />
                <CardRow label={copy.summary.dateTime} value={when} />
                <CardRow
                  label={copy.summary.location}
                  value={event.venue}
                  underline
                  action={
                    <a
                      href={event.venueUrl}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={copy.summary.directions}
                      className="flex size-5 shrink-0 items-center justify-center transition-opacity hover:opacity-70"
                    >
                      <Image
                        src="/assets/ic-navigate-20.svg"
                        alt=""
                        width={20}
                        height={20}
                        className="size-5"
                      />
                    </a>
                  }
                />
              </div>
            </CardShell>

            <CardShell
              index={1}
              title={copy.tickets.title}
              footer={
                <div className="flex items-center gap-4 border-t-[0.5px] border-white/10 pt-4">
                  <p className="m-0 flex-1 font-[family-name:var(--font-display)] text-[12px] leading-4 tracking-[0.12px] text-content-secondary">
                    {copy.tickets.scan}
                  </p>
                  <Image
                    src="/assets/conf-qr.png"
                    alt=""
                    width={96}
                    height={96}
                    className="size-24 shrink-0 bg-white p-1"
                  />
                </div>
              }
            >
              <div className="flex flex-col gap-3">
                <p className="m-0 font-[family-name:var(--font-display)] text-[12px] leading-4 tracking-[0.12px] text-content-secondary">
                  {copy.tickets.body(email)}
                </p>
                <Link
                  href="/account"
                  className="font-[family-name:var(--font-display)] text-[12px] leading-4 tracking-[0.12px] text-content-primary underline"
                >
                  {copy.tickets.account}
                </Link>
              </div>
            </CardShell>

            <CardShell
              index={2}
              title={copy.price.title}
              footer={
                <button
                  type="button"
                  onClick={downloadReceipt}
                  className="btn-secondary flex w-full cursor-pointer items-center justify-center gap-2 px-4 py-3"
                >
                  <Image
                    src="/assets/ic-download-16.svg"
                    alt=""
                    width={16}
                    height={16}
                    className="size-4"
                  />
                  <span className="font-[family-name:var(--font-display)] text-[13px] font-semibold leading-5 tracking-[0.16px] text-content-primary">
                    {copy.price.receipt}
                  </span>
                </button>
              }
            >
              <div className="flex flex-col gap-2">
                <PriceRow
                  label={copy.price.subtotal}
                  amount={formatMoney(totals.subtotal)}
                />
                {totals.fee > 0 && (
                  <PriceRow
                    label={copy.price.fee}
                    amount={formatMoney(totals.fee)}
                  />
                )}
                {totals.promo > 0 && (
                  <PriceRow
                    label={copy.price.promo}
                    amount={`−${formatMoney(totals.promo)}`}
                    positive
                  />
                )}
                {totals.wallet > 0 && (
                  <PriceRow
                    label={copy.price.wallet}
                    amount={`−${formatMoney(totals.wallet)}`}
                    positive
                  />
                )}
                <div className="mt-2 flex items-start justify-between gap-3 border-t-[0.5px] border-white/10 pt-3">
                  <span className="font-[family-name:var(--font-display)] text-[15px] font-semibold leading-[22px] tracking-[0.19px] text-content-primary">
                    {copy.price.total}
                  </span>
                  <span className="flex flex-col items-end">
                    <span className="font-[family-name:var(--font-display)] text-[17px] font-semibold leading-6 text-content-primary">
                      {formatMoney(totals.total)}
                    </span>
                    <span className="font-[family-name:var(--font-display)] text-[10px] leading-[14px] tracking-[0.1px] text-content-secondary">
                      {copy.price.vat(formatMoney(totals.vat))}
                    </span>
                  </span>
                </div>
              </div>
            </CardShell>
          </div>
        </section>

        {/* Order details */}
        <section className="shell pt-16">
          <div className="mx-auto flex max-w-[622px] flex-col gap-4">
            <div className="flex flex-col gap-1">
              <h2 className="m-0 font-[family-name:var(--font-display)] text-[17px] font-bold uppercase leading-6 tracking-[0.19px] text-white">
                {copy.order.title}
              </h2>
              <p className="m-0 font-[family-name:var(--font-display)] text-[12px] leading-4 tracking-[0.12px] text-content-secondary">
                {copy.order.sentTo(email)}
              </p>
            </div>

            <div className="flex flex-col gap-6 border border-white/5 p-6">
              <div className="flex items-center gap-6">
                <span className="relative block size-[76px] shrink-0 overflow-hidden">
                  <Image
                    src={event.poster}
                    alt=""
                    fill
                    sizes="76px"
                    className="object-cover"
                  />
                </span>
                <h3 className="m-0 font-[family-name:var(--font-display)] text-[28px] font-black uppercase leading-10 tracking-[-0.5px] text-white sm:text-[32px]">
                  {event.name}
                </h3>
              </div>

              {totals.ticketLines.length > 0 && (
                <div className="flex flex-col gap-1">
                  <p className="m-0 font-[family-name:var(--font-display)] text-[13px] leading-5 tracking-[0.13px] text-content-secondary">
                    {copy.order.tickets(totals.ticketCount)}
                  </p>
                  <ul className="m-0 flex list-none flex-col p-0">
                    {totals.ticketLines.map((line, index) =>
                      lineRow(line, index === totals.ticketLines.length - 1),
                    )}
                  </ul>
                </div>
              )}

              {totals.addonLines.length > 0 && (
                <div className="flex flex-col gap-1 border-t-[0.5px] border-white/10 pt-6">
                  <p className="m-0 font-[family-name:var(--font-display)] text-[13px] leading-5 tracking-[0.13px] text-content-secondary">
                    {copy.order.addons(totals.addonCount)}
                  </p>
                  <ul className="m-0 flex list-none flex-col p-0">
                    {totals.addonLines.map((line, index) =>
                      lineRow(line, index === totals.addonLines.length - 1),
                    )}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Delivery */}
        {deliverySummary && (
          <section className="shell pt-12">
            <div className="mx-auto flex max-w-[622px] flex-col gap-4">
              <h2 className="m-0 font-[family-name:var(--font-display)] text-[17px] font-bold uppercase leading-6 tracking-[0.19px] text-white">
                {copy.delivery.title}
              </h2>
              <div className="flex items-center gap-3 border border-white/5 px-4 py-3">
                <Image
                  src="/assets/ic-delivery-24.svg"
                  alt=""
                  width={24}
                  height={24}
                  className="size-6 shrink-0"
                />
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="font-[family-name:var(--font-display)] text-[15px] font-semibold leading-[22px] tracking-[0.19px] text-content-primary">
                    {copy.delivery.method}
                  </span>
                  <span className="font-[family-name:var(--font-display)] text-[12px] leading-4 tracking-[0.12px] text-content-secondary">
                    {deliverySummary}
                  </span>
                </span>
              </div>
            </div>
          </section>
        )}

        <section className="shell pt-12">
          <p className="mx-auto m-0 max-w-[622px] text-center font-[family-name:var(--font-display)] text-[12px] leading-4 tracking-[0.12px] text-content-secondary">
            {copy.note}
          </p>
        </section>
      </main>
    </>
  );
}
