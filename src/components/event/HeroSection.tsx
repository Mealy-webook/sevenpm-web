"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import type { EventDetails } from "@/data/events";
import { ConcertLights } from "@/components/motion/ConcertLights";
import { StagePulse } from "@/components/motion/StagePulse";
import { analyserRef } from "./DeckHost";
import {
  loadDeck,
  selectTrack,
  setDeckOnScreen,
  setPlaying,
  togglePlaying,
  useDeck,
} from "./deckStore";
import { VinylCarousel } from "./VinylCarousel";

/* Authored against the 1512 × 1046 Figma hero (node 2556:20996). The deck
 * keeps its Figma coordinates; the stage is scaled as a unit rather than
 * reflowed, and clips at the viewport edges on the way down so the centre
 * record stays centred. The sticker layer that used to sit over it went out
 * with the stickers themselves.
 *
 * The deck's <audio> element is not here — it lives in `DeckHost`, mounted in
 * the root layout, so the music survives the walk into the booking journey.
 * This page announces its playlist and then drives the shared deck.
 *
 * The page opens silent. A lighting rig plays behind it and the event name
 * breathes on the beat — the same rig the homepage hero uses, reading the
 * same clock — but no record is turning until the visitor puts one on. The
 * deck used to call `setPlaying(true)` on mount and let the browser's
 * autoplay policy decide the rest, which meant the music started by itself
 * wherever the policy allowed it. Pressing play is now the only thing that
 * starts it, and the page says nothing about it: the deck, the arm and the
 * sleeve are the invitation. Once it has started, the deck's own analyser
 * drives the rig, so the light is the track rather than a stand-in for it. */
const FRAME_WIDTH = 1512;
const STAGE_HEIGHT = 612;

export function HeroSection({ event }: { event: EventDetails }) {
  const deck = useDeck();
  const stageRef = useRef<HTMLDivElement>(null);

  /* Announce this event's playlist. Re-announcing the same one is a no-op, so
     coming back from the booking journey does not restart anything. */
  useEffect(() => {
    loadDeck({
      tracks: event.playlist,
      eventName: event.name,
      eventHref: `/events/${event.slug}`,
    });
  }, [event.playlist, event.name, event.slug]);

  /* Nothing starts the deck, and nothing invites it to be started either —
     the cue that used to sit under it has been taken out. The music begins
     when the visitor presses play on the deck or the mini player, and at no
     other time. */

  /* Report the deck's visibility so the floating player knows whether it is
     needed, and give it up on the way out. */
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const observer = new IntersectionObserver(
      ([entry]) => setDeckOnScreen(entry.isIntersecting),
      { threshold: 0.1 },
    );
    observer.observe(stage);
    return () => {
      observer.disconnect();
      setDeckOnScreen(false);
    };
  }, []);

  return (
    <>
      {/* Clipped on one axis only: the deck bleeds past the viewport edges and
          must be cut there, but the lighting rig reaches up over the header to
          the top of the page and must not be. */}
      <section className="section-screen relative z-0 py-10 [overflow-x:clip]">
        <ConcertLights scrim="even" />

        {/* 2556:20996: 40px of padding, the 838 text block, a 48px gap, the
            deck. The block is one column now — the name, the standfirst and
            the three times on a 24px rhythm — where the comp used to float
            the times beside the deck. */}
        <div className="relative mx-auto flex max-w-[1512px] flex-col items-center gap-12">
          <div className="shell-pad flex w-full flex-col items-center gap-8">
            <StagePulse className="w-full">
              {/* The name, as the festival's own lockup (2550:19929). The comp
                draws it as a logo, not as Daltown — so this is an image, with
                the name carried by the heading's accessible text. */}
              {event.wordmark ? (
                <h1 className="m-0 w-full" data-reveal="clip">
                  <span className="sr-only">{event.name}</span>
                  <Image
                    src={event.wordmark.src}
                    alt=""
                    width={event.wordmark.width}
                    height={event.wordmark.height}
                    priority
                    /* 567 at the comp's 1512 frame; capped so it never runs to
                     the gutters on a narrow screen. */
                    className="mx-auto h-auto w-[min(567px,78vw)]"
                  />
                </h1>
              ) : (
                <h1
                  className="display-text w-full text-center"
                  data-reveal="clip"
                >
                  {event.name}
                </h1>
              )}
            </StagePulse>

            {/* The standfirst, centred on the comp's 838 measure. */}
            <p
              className="m-0 max-w-[838px] text-center font-[family-name:var(--font-ui)] text-body text-content-secondary"
              data-reveal="up"
              data-reveal-delay="0.06"
            >
              {event.intro}
            </p>

            {/* Gates open, last entry, showtime (2743:21781): three 109.6
              tiles, each a 24 icon over its label and time, with an 81
              hairline between them and 16 either side of it. */}
            <ul
              className="m-0 flex list-none flex-wrap items-center justify-center gap-4 p-0"
              data-reveal="up"
              data-reveal-delay="0.1"
            >
              {event.schedule.map((tile, index) => (
                <li key={tile.label} className="flex items-center gap-4">
                  {index > 0 ? (
                    <span aria-hidden className="h-[81px] w-px bg-white/5" />
                  ) : null}
                  <span className="flex w-[109.6px] flex-col items-center gap-2 p-3 text-center">
                    <Image
                      src={tile.icon}
                      alt=""
                      width={24}
                      height={24}
                      className="size-6 shrink-0"
                    />
                    <span className="flex w-full flex-col">
                      <span className="font-[family-name:var(--font-display)] text-body-s text-content-secondary">
                        {tile.label}
                      </span>
                      <span className="truncate font-[family-name:var(--font-display)] text-body font-semibold tracking-[0.1875px] text-content-primary">
                        {tile.value}
                      </span>
                    </span>
                  </span>
                </li>
              ))}
            </ul>

            <ShareBeatsButton event={event} />
          </div>

          {/* The deck — one Figma stage at every width, scaled as a unit */}
          <div
            ref={stageRef}
            /* Above the lighting rig: its layers are positioned too, and
               without a z-index they painted over the outer records. */
            className="stage-hero relative z-10 w-full"
            data-reveal="scale"
            data-reveal-delay="0.22"
          >
            <div
              className="absolute left-1/2 top-0"
              style={{
                width: FRAME_WIDTH,
                height: STAGE_HEIGHT,
                marginLeft: -FRAME_WIDTH / 2,
                transform: "scale(var(--hero-stage-scale))",
                transformOrigin: "top center",
              }}
            >
              <VinylCarousel
                /* From props, not the store: the store is empty on the server
                   and for the first client frame, and the carousel indexes
                   straight into this list. The store carries playback state,
                   not the programme. */
                tracks={event.playlist}
                activeIndex={deck.activeIndex}
                playing={deck.playing}
                analyser={analyserRef}
                advanceRequest={deck.advanceRequest}
                stepRequest={deck.stepRequest}
                onSelect={selectTrack}
                onPlay={() => setPlaying(true)}
                onTogglePlay={togglePlaying}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

/**
 * "Share & Earn beats" (2743:21731): the secondary button, a 20 icon beside
 * the label. It shares the event page through the system share sheet, or
 * copies the link where there is none and says so for two seconds.
 */
function ShareBeatsButton({ event }: { event: EventDetails }) {
  const [copied, setCopied] = useState(false);

  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: event.name, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // The visitor dismissed the share sheet — nothing to report.
    }
  };

  return (
    <button
      type="button"
      onClick={share}
      className="flex cursor-pointer items-center justify-center gap-2 border-[0.5px] border-white/10 bg-white/5 px-5 py-4 font-[family-name:var(--font-display)] text-body-l font-semibold text-content-primary transition-colors duration-200 hover:border-white/30 hover:bg-white/10"
      data-reveal="up"
      data-reveal-delay="0.14"
    >
      <Image
        src="/assets/ic-share-beats.svg"
        alt=""
        width={20}
        height={20}
        className="size-5 shrink-0"
      />
      <span aria-live="polite">{copied ? "Link copied" : "Share & Earn beats"}</span>
    </button>
  );
}
