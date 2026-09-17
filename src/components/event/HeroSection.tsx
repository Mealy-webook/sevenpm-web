"use client";

import { useEffect, useRef } from "react";

import type { EventDetails } from "@/data/events";
import { ConcertLights } from "@/components/motion/ConcertLights";
import { StagePulse } from "@/components/motion/StagePulse";
import { StickerPeel } from "@/components/ui/StickerPeel";
import { analyserRef } from "./DeckHost";
import {
  loadDeck,
  selectTrack,
  setDeckOnScreen,
  setPlaying,
  togglePlaying,
  useDeck,
} from "./deckStore";
import { ShareButton } from "./ShareButton";
import { VinylCarousel } from "./VinylCarousel";

/* Authored against the 1512 × 1076 Figma hero (node 2091:56451). The deck
 * and the stickers keep their Figma coordinates; the deck stage is scaled as a
 * unit rather than reflowed, and clips at the viewport edges on the way down
 * so the centre record stays centred.
 *
 * The deck's <audio> element is not here — it lives in `DeckHost`, mounted in
 * the root layout, so the music survives the walk into the booking journey.
 * This page announces its playlist and then drives the shared deck.
 *
 * The page opens with the music running, a lighting rig behind it and the
 * event name breathing on the beat — the same rig the homepage hero uses,
 * reading the same clock. The deck's own analyser drives it here, so the
 * light is the track rather than a stand-in for it. */
const FRAME_WIDTH = 1512;
const FRAME_HEIGHT = 1052;
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

  /* The deck starts running. Whether it is allowed to is the host's problem. */
  useEffect(() => {
    setPlaying(true);
  }, []);

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
      <section className="relative z-0 [overflow-x:clip] xl:min-h-[1052px]">
        <ConcertLights scrim="even" />

        <div className="relative mx-auto flex max-w-[1512px] flex-col items-center gap-12 pb-24">
          <div className="shell-pad flex w-full flex-col items-center gap-4">
            <StagePulse className="w-full">
              <h1
                className="display-text w-full text-center"
                data-reveal="clip"
              >
                {event.name}
              </h1>
            </StagePulse>
            {/* Time and place, under the name. The venue is the directions
                link: the comp dropped the map panel further down the page and
                underlines the venue here instead, so this is where getting
                there now lives. */}
            <div
              className="flex flex-col items-center gap-2"
              data-reveal="up"
              data-reveal-delay="0.08"
            >
              <p className="m-0 font-[family-name:var(--font-display)] text-[17px] font-semibold leading-6 tracking-[0.085px] text-brand">
                {event.sessionTime}
              </p>
              <a
                href={event.venue.directionsUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="font-[family-name:var(--font-display)] text-[17px] leading-6 tracking-[0.085px] text-content-primary underline underline-offset-4 transition-colors hover:text-brand"
              >
                {event.venue.name}
              </a>
            </div>


          </div>

          {/* The deck — one Figma stage at every width, scaled as a unit */}
          <div
            ref={stageRef}
            className="stage-hero relative w-full"
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

          {/* Below the deck, where 2393:16345 puts it. */}
          <div data-reveal="up" data-reveal-delay="0.1">
            <ShareButton eventName={event.name} />
          </div>
        </div>

        {/* Stickers, pinned to the 1512 × 1076 frame. The layer itself lets
         *  clicks through so it can sit over the deck; only the stickers are
         *  interactive. */}
        <div
          className="pointer-events-none absolute inset-0 mx-auto hidden xl:block z-20"
          style={{ maxWidth: FRAME_WIDTH, minHeight: FRAME_HEIGHT }}
          aria-hidden
        >
          <StickerPeel
            className="pointer-events-auto"
            imageSrc="/assets/sticker-cassette.png"
            width={256}
            height={233}
            /* Beside the title, as the comp places it. It used to sit lower,
               which was clear of everything until the hero grew a time, a
               venue and a schedule under the name. */
            initialPosition={{ x: 96, y: 24 }}
            peelBackHoverPct={22}
            peelBackActivePct={34}
            shadowIntensity={0.6}
            lightingIntensity={0.12}
          />
          <StickerPeel
            className="pointer-events-auto"
            imageSrc="/assets/sticker-boombox.png"
            width={230}
            height={270}
            initialPosition={{ x: 1190, y: 18 }}
            peelBackHoverPct={22}
            peelBackActivePct={34}
            shadowIntensity={0.6}
            lightingIntensity={0.12}
          />
        </div>
      </section>

    </>
  );
}
