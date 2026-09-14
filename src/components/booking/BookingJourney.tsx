"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";

import { CheckoutStep, PriceDetails } from "./CheckoutStep";
import { ExtrasStep } from "./ExtrasStep";
import { ItemDetailsDialog } from "./ItemDetailsDialog";
import { OrderSummaryDialog } from "./OrderSummaryDialog";
import { SummaryBar } from "./SummaryBar";
import { TicketInfoDialog } from "./TicketInfoDialog";
import { TicketsStep } from "./TicketsStep";
import { adjust, quantityOf, totals as priceCart, type Cart } from "./cart";
import {
  LocaleMenu,
  type CurrencyCode,
  type LanguageCode,
} from "@/components/layout/LocaleMenu";
import {
  bookingConfig,
  bookingCopy,
  getTicket,
  type BookingAddon,
  type BookingTicket,
} from "@/data/booking";

/**
 * The booking journey, from Figma 2138:3339 → 2033:18293.
 *
 * Three steps behind one piece of chrome: a back button, the breadcrumb, the
 * hold countdown and the globe. The right column carries the poster and the
 * summary bar on the first two steps, and the price details card on the last.
 *
 * Nothing here talks to a payment provider. Confirming mints a reference and
 * says plainly that no money moved — see the done panel at the bottom.
 */

type StepId = "tickets" | "extras" | "checkout";

function clock(seconds: number) {
  const safe = Math.max(0, seconds);
  const minutes = Math.floor(safe / 60);
  return `${minutes}:${String(safe % 60).padStart(2, "0")}`;
}

export function BookingJourney({
  event,
  initialTier,
}: {
  event: {
    slug: string;
    name: string;
    time: string;
    venue: string;
    venueUrl: string;
    poster: string;
  };
  /** `?tier=` from the event page's ticket stubs. */
  initialTier?: string;
}) {
  const [step, setStep] = useState<StepId>("tickets");
  const [cart, setCart] = useState<Cart>(() =>
    // The event page's stubs sell tiers, not the journey's dated tickets, so
    // a `?tier=` that doesn't name one of these is simply ignored.
    initialTier && getTicket(initialTier)
      ? adjust([], "ticket", initialTier, 1)
      : [],
  );
  const [infoTicket, setInfoTicket] = useState<BookingTicket | null>(null);
  const [detailsAddon, setDetailsAddon] = useState<BookingAddon | null>(null);
  const [summaryOpen, setSummaryOpen] = useState(false);

  const [wallet, setWallet] = useState(true);
  const [method, setMethod] = useState("apple-pay");
  const [delivery, setDelivery] = useState<string | null>(null);
  const [promo, setPromo] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [agreeError, setAgreeError] = useState("");
  const [reference, setReference] = useState<string | null>(null);

  const [seconds, setSeconds] = useState(bookingConfig.holdSeconds);
  const [localeOpen, setLocaleOpen] = useState(false);
  const [language, setLanguage] = useState<LanguageCode>("en");
  const [currency, setCurrency] = useState<CurrencyCode>("MAD");
  const localeId = useId();
  const localeWrap = useRef<HTMLDivElement>(null);

  // The hold. It stops once the booking is confirmed — nothing left to hold.
  useEffect(() => {
    if (reference) return;
    const id = window.setInterval(() => {
      setSeconds((current) => (current <= 0 ? 0 : current - 1));
    }, 1000);
    return () => window.clearInterval(id);
  }, [reference]);

  useEffect(() => {
    if (!localeOpen) return;
    const onDown = (event: MouseEvent) => {
      if (!localeWrap.current?.contains(event.target as Node)) {
        setLocaleOpen(false);
      }
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setLocaleOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [localeOpen]);

  const hasMerchandise = useMemo(
    () =>
      cart.some((line) => line.kind === "addon" && line.size !== undefined),
    [cart],
  );

  const deliveryFee = useMemo(() => {
    if (!hasMerchandise) return 0;
    const option = bookingCopy.checkout.deliveryOptions.find(
      (item) => item.id === delivery,
    );
    return option?.fee ?? 0;
  }, [delivery, hasMerchandise]);

  const totals = useMemo(
    () =>
      priceCart(cart, {
        // Credit is only applied once the visitor reaches payment — the
        // earlier steps quote the plain price, as the comps do.
        wallet: step === "checkout" && wallet,
        delivery: step === "checkout" ? deliveryFee : 0,
      }),
    [cart, deliveryFee, step, wallet],
  );

  const adjustTicket = useCallback((id: string, by: number) => {
    setCart((current) => adjust(current, "ticket", id, by));
  }, []);

  const adjustAddon = useCallback(
    (addon: BookingAddon, by: number, size?: string) => {
      setCart((current) => adjust(current, "addon", addon.id, by, size));
    },
    [],
  );

  const expired = seconds <= 0 && !reference;

  const restart = () => {
    setCart([]);
    setStep("tickets");
    setSeconds(bookingConfig.holdSeconds);
    setAgreed(false);
    setAgreeError("");
  };

  const confirm = () => {
    if (!agreed) {
      setAgreeError(bookingCopy.checkout.agreementError);
      return;
    }
    const random = Math.random().toString(36).slice(2, 6).toUpperCase();
    setReference(`SVN-${new Date().getFullYear()}-${random}`);
  };

  const steps = bookingCopy.steps;
  const stepIndex = steps.findIndex((item) => item.id === step);

  const back = () => {
    if (stepIndex <= 0) return;
    setStep(steps[stepIndex - 1].id as StepId);
  };

  return (
    <div className="shell flex flex-col gap-8 pb-24 pt-8 lg:pb-16">
      {/* Chrome */}
      <div className="flex items-center gap-3 sm:gap-4">
        <div className="flex min-w-0 flex-1 items-center gap-3 sm:gap-4">
          {stepIndex <= 0 || reference ? (
            <Link
              href={`/events/${event.slug}`}
              aria-label={bookingCopy.chrome.back}
              className="btn-secondary flex size-[52px] shrink-0 items-center justify-center"
            >
              <Image
                src="/assets/ic-arrow-left-20.svg"
                alt=""
                width={20}
                height={20}
                className="size-5"
              />
            </Link>
          ) : (
            <button
              type="button"
              onClick={back}
              aria-label={bookingCopy.chrome.back}
              className="btn-secondary flex size-[52px] shrink-0 cursor-pointer items-center justify-center"
            >
              <Image
                src="/assets/ic-arrow-left-20.svg"
                alt=""
                width={20}
                height={20}
                className="size-5"
              />
            </button>
          )}

          <ol className="m-0 flex min-w-0 list-none items-center gap-2 overflow-hidden p-0">
            {steps.map((item, index) => {
              const done = index < stepIndex;
              const current = index === stepIndex;
              return (
                <li
                  key={item.id}
                  /* Three steps and a globe don't fit 375px, so the phone
                     shows only the step you are on. */
                  className={`items-center gap-2 ${current ? "flex" : "hidden sm:flex"}`}
                >
                  {index > 0 && (
                    <Image
                      src="/assets/ic-chevron-right-20.svg"
                      alt=""
                      width={20}
                      height={20}
                      className="hidden size-5 opacity-40 sm:block"
                      aria-hidden
                    />
                  )}
                  <button
                    type="button"
                    onClick={() => done && !reference && setStep(item.id as StepId)}
                    disabled={!done || Boolean(reference)}
                    aria-current={current ? "step" : undefined}
                    className={`whitespace-nowrap font-[family-name:var(--font-display)] text-[13px] font-semibold leading-5 tracking-[0.16px] transition-colors ${
                      current
                        ? "text-white"
                        : done
                          ? "cursor-pointer text-content-secondary hover:text-white"
                          : "text-white/30"
                    }`}
                  >
                    {index + 1}. {item.label}
                  </button>
                </li>
              );
            })}
          </ol>
        </div>

        <div className="flex shrink-0 items-center gap-3 sm:gap-4">
          {!reference && (
            <p
              className={`m-0 whitespace-nowrap font-[family-name:var(--font-display)] text-[13px] font-semibold leading-5 tracking-[0.16px] ${
                seconds <= 60 ? "text-[#ff6c6c]" : "text-content-primary"
              }`}
            >
              {bookingCopy.chrome.timer(clock(seconds))}
            </p>
          )}
          <div ref={localeWrap} className="relative">
            <button
              type="button"
              id={`${localeId}-button`}
              onClick={() => setLocaleOpen((open) => !open)}
              aria-expanded={localeOpen}
              aria-haspopup="dialog"
              aria-label={bookingCopy.chrome.locale}
              className={`btn-secondary flex size-[52px] cursor-pointer items-center justify-center ${
                localeOpen ? "is-active" : ""
              }`}
            >
              <Image
                src="/assets/ic-globe.svg"
                alt=""
                width={20}
                height={20}
                className="size-5"
              />
            </button>
            {localeOpen && (
              <div className="absolute right-0 top-[calc(100%+8px)] z-40">
                <LocaleMenu
                  id={localeId}
                  labelledBy={`${localeId}-button`}
                  language={language}
                  currency={currency}
                  onLanguage={setLanguage}
                  onCurrency={setCurrency}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {reference ? (
        <Done reference={reference} slug={event.slug} />
      ) : expired ? (
        <div className="flex max-w-[620px] flex-col gap-4 border border-white/5 p-8">
          <h1 className="m-0 font-[family-name:var(--font-display)] text-[32px] font-black uppercase leading-10 tracking-[-0.5px] text-white">
            {bookingCopy.chrome.expired}
          </h1>
          <p className="m-0 font-[family-name:var(--font-display)] text-[15px] leading-[22px] tracking-[0.19px] text-content-secondary">
            {bookingCopy.chrome.expiredBody}
          </p>
          <button
            type="button"
            onClick={restart}
            className="flex cursor-pointer items-center justify-center self-start bg-brand px-5 py-4 font-[family-name:var(--font-display)] text-[17px] font-semibold leading-6 text-[#18181b] transition-colors hover:bg-[#fff35a]"
          >
            {bookingCopy.chrome.restart}
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:justify-between lg:gap-8">
          {/* 620 + 405 inside the 1272 content column, as the comps set it. */}
          <div className="flex min-w-0 flex-1 flex-col lg:max-w-[620px]">
            {step === "tickets" && (
              <TicketsStep
                eventName={event.name}
                time={event.time}
                venue={event.venue}
                venueUrl={event.venueUrl}
                cart={cart}
                onAdjust={adjustTicket}
                onInfo={setInfoTicket}
              />
            )}
            {step === "extras" && (
              <ExtrasStep
                cart={cart}
                onAdjust={adjustAddon}
                onDetails={setDetailsAddon}
              />
            )}
            {step === "checkout" && (
              <CheckoutStep
                wallet={wallet}
                onWallet={setWallet}
                method={method}
                onMethod={setMethod}
                delivery={delivery}
                onDelivery={setDelivery}
                needsDelivery={hasMerchandise}
                promo={promo}
                onPromo={setPromo}
              />
            )}
          </div>

          <aside className="flex w-full shrink-0 flex-col gap-6 lg:sticky lg:top-8 lg:w-[405px]">
            {step === "checkout" ? (
              <PriceDetails
                totals={totals}
                agreed={agreed}
                onAgreed={(on) => {
                  setAgreed(on);
                  if (on) setAgreeError("");
                }}
                error={agreeError}
              />
            ) : (
              <span className="relative hidden aspect-square w-full overflow-hidden lg:block">
                <Image
                  src={event.poster}
                  alt={`${event.name} poster`}
                  fill
                  sizes="405px"
                  className="object-cover"
                  priority
                />
              </span>
            )}

            <div className="max-lg:fixed max-lg:inset-x-0 max-lg:bottom-0 max-lg:z-40">
              <SummaryBar
                totals={totals}
                pay={step === "checkout"}
                action={
                  step === "tickets"
                    ? bookingCopy.summaryBar.nextExtras
                    : step === "extras"
                      ? bookingCopy.summaryBar.nextCheckout
                      : bookingCopy.summaryBar.pay
                }
                onAction={() => {
                  if (step === "tickets") setStep("extras");
                  else if (step === "extras") setStep("checkout");
                  else confirm();
                }}
                onOpenSummary={() => setSummaryOpen(true)}
              />
            </div>

            {step === "checkout" && (
              <p className="m-0 text-center font-[family-name:var(--font-display)] text-[12px] leading-5 tracking-[0.12px] text-content-secondary max-lg:hidden">
                {/* The legal pages don't exist yet, so these stay plain text
                    rather than 404 links. Wrap them in <Link> the day they do. */}
                {bookingCopy.checkout.terms}{" "}
                <span className="text-content-primary">
                  {bookingCopy.checkout.termsLink}
                </span>
                . {bookingCopy.checkout.privacyLead}{" "}
                <span className="text-content-primary">
                  {bookingCopy.checkout.privacyLink}
                </span>{" "}
                {bookingCopy.checkout.privacyTail}
              </p>
            )}
          </aside>
        </div>
      )}

      {infoTicket && (
        <TicketInfoDialog
          key={infoTicket.id}
          ticket={infoTicket}
          inCart={quantityOf(cart, infoTicket.id)}
          onClose={() => setInfoTicket(null)}
          onAdd={(quantity) => {
            setCart((current) =>
              adjust(
                current,
                "ticket",
                infoTicket.id,
                quantity - quantityOf(current, infoTicket.id),
              ),
            );
            setInfoTicket(null);
          }}
        />
      )}

      {detailsAddon && (
        <ItemDetailsDialog
          key={detailsAddon.id}
          addon={detailsAddon}
          onClose={() => setDetailsAddon(null)}
          onAdd={(quantity, size) => {
            setCart((current) =>
              adjust(
                current,
                "addon",
                detailsAddon.id,
                quantity - quantityOf(current, detailsAddon.id, size),
                size,
              ),
            );
            setDetailsAddon(null);
          }}
        />
      )}

      {summaryOpen && (
        <OrderSummaryDialog
          totals={totals}
          onClose={() => setSummaryOpen(false)}
        />
      )}
    </div>
  );
}

/** Confirmation. No provider is connected, and the copy says so. */
function Done({ reference, slug }: { reference: string; slug: string }) {
  const copy = bookingCopy.done;
  return (
    <div className="flex max-w-[620px] flex-col gap-4 border border-white/5 p-8">
      <h1 className="m-0 font-[family-name:var(--font-display)] text-[32px] font-black uppercase leading-10 tracking-[-0.5px] text-brand sm:text-[40px]">
        {copy.title}
      </h1>
      <p className="m-0 font-[family-name:var(--font-display)] text-[13px] leading-5 tracking-[0.13px] text-content-secondary">
        {copy.reference}
      </p>
      <p className="m-0 font-[family-name:var(--font-display)] text-[22px] font-bold leading-7 tracking-[0.22px] text-white">
        {reference}
      </p>
      <p className="m-0 font-[family-name:var(--font-display)] text-[15px] leading-[22px] tracking-[0.19px] text-content-secondary">
        {copy.body}
      </p>
      <p className="m-0 font-[family-name:var(--font-display)] text-[13px] leading-5 tracking-[0.13px] text-content-primary">
        {copy.note}
      </p>
      <div className="flex flex-wrap gap-3">
        <Link
          href="/account"
          className="flex items-center justify-center bg-brand px-5 py-4 font-[family-name:var(--font-display)] text-[17px] font-semibold leading-6 text-[#18181b] transition-colors hover:bg-[#fff35a]"
        >
          {copy.bookings}
        </Link>
        <Link
          href={`/events/${slug}`}
          className="btn-secondary flex items-center justify-center px-5 py-4 font-[family-name:var(--font-display)] text-[17px] font-semibold leading-6 text-content-primary"
        >
          {copy.event}
        </Link>
      </div>
    </div>
  );
}
