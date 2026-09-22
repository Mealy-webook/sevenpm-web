"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";

import { BookingConfirmation } from "./BookingConfirmation";
import { deckAudioRef } from "@/components/event/DeckHost";
import {
  readDeck,
  selectTrack as selectDeckTrack,
  setHandedOver,
  setPlaying as setDeckPlaying,
  setResumeAt,
} from "@/components/event/deckStore";
import { MusicPlayer, type Track } from "@/components/ui/music-player-widget";
import { CardDialog, type SavedCard } from "@/components/ui/CardDialog";
import { CheckoutStep, PriceDetails } from "./CheckoutStep";
import { HoldExpiredDialog } from "./HoldExpiredDialog";
import {
  DeliveryDialog,
  describeDelivery,
  type DeliveryChoice,
} from "./DeliveryDialog";
import { ExtrasStep } from "./ExtrasStep";
import { ItemDetailsDialog } from "./ItemDetailsDialog";
import { OrderSummaryDialog } from "./OrderSummaryDialog";
import { PromoDialog } from "./PromoDialog";
import { SummaryBar } from "./SummaryBar";
import { TicketInfoDialog } from "./TicketInfoDialog";
import {
  ProtectionInfoDialog,
  SkipProtectionDialog,
} from "./TicketProtection";
import { TicketsStep } from "./TicketsStep";
import { adjust, quantityOf, totals as priceCart, type Cart } from "./cart";
import {
  MAX_INSTALMENTS,
  maxInstalments,
  schedule,
} from "./payLaterRules";
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
 * The booking journey, from Figma 2138:3339 → 2033:18293, ending on the
 * confirmation at 2192:5369.
 *
 * Three steps behind one piece of chrome: a back button, the breadcrumb, the
 * hold countdown and the globe. The right column carries the poster and the
 * summary bar on the first two steps, and the price details card on the last.
 *
 * Nothing here talks to a payment provider. Confirming mints an order number
 * and the confirmation says plainly that no money moved.
 */

type StepId = "tickets" | "extras" | "checkout";
type Dialog =
  | "delivery"
  | "card"
  | "promo"
  | "summary"
  | "protection"
  | "skip-protection"
  | null;

export type BookingEvent = {
  slug: string;
  name: string;
  time: string;
  venue: string;
  venueUrl: string;
  poster: string;
  /** The event's own playlist, for the player that replaces the poster. */
  playlist: { title: string; artist: string; artworkUrl?: string; audioSrc?: string }[];
  startsAt: string;
  /** Where the confirmation says the booking was sent. */
  email: string;
};

function clock(seconds: number) {
  const safe = Math.max(0, seconds);
  const minutes = Math.floor(safe / 60);
  return `${minutes}:${String(safe % 60).padStart(2, "0")}`;
}

export function BookingJourney({
  event,
  initialTier,
}: {
  event: BookingEvent;
  /** `?tier=` from the event page's ticket stubs. */
  initialTier?: string;
}) {
  /* The event's playlist, in the shape the widget takes. */
  const playerTracks = useMemo<Track[]>(
    () =>
      event.playlist
        .filter((t) => t.audioSrc)
        .map((t) => ({
          title: t.title,
          artist: t.artist,
          cover: t.artworkUrl ?? event.poster,
          src: t.audioSrc as string,
        })),
    [event.playlist, event.poster],
  );

  /* One player on this screen, and it is the one in the column — the deck that
     follows you in stops, and the floating player it would otherwise put up
     stands down with it.
     
     The hand-over carries the position, so the music does not restart: the
     deck's track and moment are read before it is paused, and the widget opens
     there and keeps playing. Read synchronously on mount rather than through
     the store, because the element knows the time and the store does not. */
  /* Read once, on the first render, before anything has been paused. The
     element knows the moment and the store does not, so this goes to the
     element directly. */
  const [handoff] = useState(() => {
    const audio = deckAudioRef.current;
    return {
      index: readDeck().activeIndex,
      time: audio?.currentTime ?? 0,
      playing: audio ? !audio.paused : false,
    };
  });

  /* Where the widget has got to, so leaving hands the position back. */
  const position = useRef({ index: handoff.index, time: handoff.time });

  useEffect(() => {
    setDeckPlaying(false);
    setHandedOver(true);
    return () => {
      /* On the way out, hand the position back. The deck applies it when the
         track is loaded — writing `currentTime` here would be thrown away by
         the element's own load. */
      selectDeckTrack(position.current.index);
      setResumeAt(position.current);
      setHandedOver(false);
    };
  }, []);

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
  const [dialog, setDialog] = useState<Dialog>(null);

  const [wallet, setWallet] = useState(true);
  const [method, setMethod] = useState("apple-pay");
  const [delivery, setDelivery] = useState<DeliveryChoice | null>(null);
  const [card, setCard] = useState<SavedCard | null>(null);
  const [promo, setPromo] = useState<{ code: string; off: number } | null>(null);
  /* Ticket protection is on by default, as the comp has it. Switching it
     off asks first; switching it back on does not. */
  const [protection, setProtection] = useState(true);
  /* How many payments a buy-now-pay-later plan is split into. Clamped to
     what the event date allows wherever it is used. */
  const [plan, setPlan] = useState(MAX_INSTALMENTS);
  /* Today, fixed once: a schedule that recomputed on every render would
     move its own dates if the session crossed midnight. */
  const [today] = useState(() => new Date());
  const [agreed, setAgreed] = useState(false);
  const [agreeError, setAgreeError] = useState("");
  const [orderNumber, setOrderNumber] = useState<string | null>(null);

  const [seconds, setSeconds] = useState(bookingConfig.holdSeconds);
  const [localeOpen, setLocaleOpen] = useState(false);
  const [language, setLanguage] = useState<LanguageCode>("en");
  const [currency, setCurrency] = useState<CurrencyCode>("MAD");
  const localeId = useId();
  const localeWrap = useRef<HTMLDivElement>(null);

  // The hold. It stops once the booking is confirmed — nothing left to hold.
  useEffect(() => {
    if (orderNumber) return;
    const id = window.setInterval(() => {
      setSeconds((current) => (current <= 0 ? 0 : current - 1));
    }, 1000);
    return () => window.clearInterval(id);
  }, [orderNumber]);

  useEffect(() => {
    if (!localeOpen) return;
    const onDown = (pointer: MouseEvent) => {
      if (!localeWrap.current?.contains(pointer.target as Node)) {
        setLocaleOpen(false);
      }
    };
    const onKey = (key: KeyboardEvent) => {
      if (key.key === "Escape") setLocaleOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [localeOpen]);

  const hasMerchandise = useMemo(
    () => cart.some((line) => line.kind === "addon" && line.size !== undefined),
    [cart],
  );

  const totals = useMemo(
    () =>
      priceCart(cart, {
        // Credit and codes only apply once the visitor reaches payment — the
        // earlier steps quote the plain price, as the comps do.
        wallet: step === "checkout" && wallet,
        promo: step === "checkout" ? (promo?.off ?? 0) : 0,
        // Protection is chosen on the add-ons step, so it is priced from
        // there on — the basket has to answer the switch immediately.
        protection,
      }),
    [cart, promo, protection, step, wallet],
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

  const expired = seconds <= 0 && !orderNumber;

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
    // Eight hex characters, as the confirmation comp shows them.
    const random = Array.from({ length: 8 }, () =>
      Math.floor(Math.random() * 16).toString(16),
    ).join("");
    setOrderNumber(random);
  };

  const steps = bookingCopy.steps;
  const stepIndex = steps.findIndex((item) => item.id === step);

  const back = () => {
    if (stepIndex <= 0) return;
    setStep(steps[stepIndex - 1].id as StepId);
  };

  /* The plan the order actually goes out on: only when pay-later is the
     chosen method and the event is far enough away to allow it. */
  const mostInstalments = maxInstalments(today, new Date(event.startsAt));
  const payLaterPlan =
    method === bookingCopy.checkout.payLater.id && mostInstalments >= 2
      ? schedule(
          totals.total,
          Math.min(Math.max(2, plan), mostInstalments),
          today,
        )
      : null;

  if (orderNumber) {
    return (
      <BookingConfirmation
        event={event}
        totals={totals}
        orderNumber={orderNumber}
        email={event.email}
        deliverySummary={hasMerchandise ? describeDelivery(delivery) : null}
        payLater={payLaterPlan}
      />
    );
  }

  return (
    /* On a wide screen the journey is one screenful and stays put: the
       chrome, the event's name and the player do not move, and the list in
       the middle is what scrolls. Below `lg` the columns stack and the page
       scrolls normally — a locked viewport on a phone would leave the summary
       bar fighting the browser's own chrome. */
    <div className="shell flex flex-col gap-8 pb-24 pt-8 lg:h-[100svh] lg:min-h-0 lg:overflow-hidden lg:pb-8">
      {/* Chrome */}
      <div className="flex items-center gap-3 sm:gap-4">
        <div className="flex min-w-0 flex-1 items-center gap-3 sm:gap-4">
          {stepIndex <= 0 ? (
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
                    onClick={() => done && setStep(item.id as StepId)}
                    disabled={!done}
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
          <p
            className={`m-0 whitespace-nowrap font-[family-name:var(--font-display)] text-[13px] font-semibold leading-5 tracking-[0.16px] ${
              seconds <= 60 ? "text-[#ff6c6c]" : "text-content-primary"
            }`}
          >
            {bookingCopy.chrome.timer(clock(seconds))}
          </p>
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

      {/* The hold running out is a dialog over the journey, not a page in
          place of it: the basket they chose stays visible behind while they
          decide, and there is only ever one thing to do about it. */}
      {expired && <HoldExpiredDialog onRestart={restart} />}

      <div
        aria-hidden={expired}
        className={`flex flex-col gap-12 lg:min-h-0 lg:flex-1 lg:flex-row lg:items-start lg:justify-between lg:gap-8 ${
          expired ? "pointer-events-none" : ""
        }`}
      >
        {/* 620 + 405 inside the 1272 content column, as the comps set it. */}
        <div className="flex min-w-0 flex-1 flex-col lg:h-full lg:min-h-0 lg:max-w-[620px]">
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
            <div
              data-lenis-prevent
              className="booking-scroll flex flex-col lg:min-h-0 lg:flex-1 lg:overflow-y-auto lg:pr-3"
            >
              <ExtrasStep
                cart={cart}
                onAdjust={adjustAddon}
                onDetails={setDetailsAddon}
              />
            </div>
          )}
          {step === "checkout" && (
            <div
              data-lenis-prevent
              className="booking-scroll flex flex-col lg:min-h-0 lg:flex-1 lg:overflow-y-auto lg:pr-3"
            >
              <CheckoutStep
                wallet={wallet}
                onWallet={setWallet}
                method={method}
                onMethod={setMethod}
                deliverySummary={describeDelivery(delivery)}
                onEditDelivery={() => setDialog("delivery")}
                needsDelivery={hasMerchandise}
                card={card}
                onAddCard={() => setDialog("card")}
                promo={promo}
                onAddPromo={() => setDialog("promo")}
                onRemovePromo={() => setPromo(null)}
                protection={protection}
                onProtection={(next) => {
                  if (next) setProtection(true);
                  else setDialog("skip-protection");
                }}
                onExplainProtection={() => setDialog("protection")}
                eventStartsAt={event.startsAt}
                payLaterTotal={totals.total}
                plan={plan}
                onPlan={setPlan}
                today={today}
              />
            </div>
          )}
        </div>

        <aside className="flex w-full shrink-0 flex-col gap-6 lg:sticky lg:top-8 lg:w-[405px]">
          {step === "checkout" ? (
            <PriceDetails
              totals={totals}
              payLater={payLaterPlan}
              agreed={agreed}
              onAgreed={(on) => {
                setAgreed(on);
                if (on) setAgreeError("");
              }}
              error={agreeError}
            />
          ) : (
            <div className="hidden w-full lg:block">
              <MusicPlayer
                tracks={playerTracks}
                crossOrigin="anonymous"
                startIndex={handoff.index}
                startTime={handoff.time}
                /* Only if it was already playing — pressing "Get your
                     ticket" is not a request to start music that was off. */
                autoPlay={handoff.playing}
                onPosition={(at) => {
                  position.current = at;
                }}
              />
            </div>
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
              onOpenSummary={() => setDialog("summary")}
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

      {dialog === "protection" && (
        <ProtectionInfoDialog onClose={() => setDialog(null)} />
      )}

      {dialog === "skip-protection" && (
        <SkipProtectionDialog
          onKeep={() => setDialog(null)}
          onProceed={() => {
            setProtection(false);
            setDialog(null);
          }}
        />
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

      {dialog === "summary" && (
        <OrderSummaryDialog totals={totals} onClose={() => setDialog(null)} />
      )}

      {dialog === "delivery" && (
        <DeliveryDialog
          value={delivery}
          onClose={() => setDialog(null)}
          onSave={(choice) => {
            setDelivery(choice);
            setDialog(null);
          }}
        />
      )}

      {dialog === "card" && (
        <CardDialog
          onClose={() => setDialog(null)}
          onAdd={(saved) => {
            setCard(saved);
            setMethod("card");
            setDialog(null);
          }}
        />
      )}

      {dialog === "promo" && (
        <PromoDialog
          onClose={() => setDialog(null)}
          onApply={(code, off) => {
            setPromo({ code, off });
            setDialog(null);
          }}
        />
      )}
    </div>
  );
}
