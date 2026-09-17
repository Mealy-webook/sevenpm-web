"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import type { EventDetails } from "@/data/events";
import { ConcertLights } from "@/components/motion/ConcertLights";
import { StagePulse } from "@/components/motion/StagePulse";
import { setStageAnalyser } from "@/components/motion/stageAudio";
import { StickerPeel } from "@/components/ui/StickerPeel";
import { MiniPlayer } from "./MiniPlayer";
import { ShareButton } from "./ShareButton";
import { VinylCarousel } from "./VinylCarousel";
import { useAudioAnalyser } from "./useAudioAnalyser";
import { needleDrop } from "./vinylNoise";

/* Authored against the 1512 × 1076 Figma hero (node 2091:56451). The deck
 * and the stickers keep their Figma coordinates; the deck stage is scaled as a
 * unit rather than reflowed, and clips at the viewport edges on the way down
 * so the centre record stays centred.
 *
 * It is a record deck, so it sounds like one: the needle lands, the groove
 * hisses for a moment, and then the track comes in over the tail of it
 * (`vinylNoise`, synthesised — no sample to licence).
 *
 * The page opens with the music running, a lighting rig behind it and the
 * event name breathing on the beat — the same rig the homepage hero uses,
 * reading the same clock. The deck's own analyser drives it here, so the
 * light is the track rather than a stand-in for it. */
const FRAME_WIDTH = 1512;
const FRAME_HEIGHT = 1052;
const STAGE_HEIGHT = 612;

export function HeroSection({ event }: { event: EventDetails }) {
  /* The deck starts running. Whether it is allowed to is up to the browser —
     see the autoplay effect below. */
  const [playing, setPlaying] = useState(true);
  const blocked = useRef(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [advanceRequest, setAdvanceRequest] = useState(0);
  const [stepRequest, setStepRequest] = useState<{ id: number; dir: -1 | 1 }>();
  const [deckOffscreen, setDeckOffscreen] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  // The floating player takes over once the deck has scrolled out of view.
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const observer = new IntersectionObserver(
      ([entry]) => setDeckOffscreen(!entry.isIntersecting),
      { threshold: 0.1 },
    );
    observer.observe(stage);
    return () => observer.disconnect();
  }, []);

  const activeTrack = event.playlist[activeIndex];
  const analyser = useAudioAnalyser(audioRef, playing);

  /* One <audio> element, re-pointed as the selection changes. Tracks without
   * an `audioSrc` still select and still drive the deck — they just play
   * nothing. */
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!playing) {
      audio.pause();
      return;
    }
    if (!activeTrack?.audioSrc) return;

    /* Drop the needle, then bring the track in behind it. The wait is however
       long the drop said it needed and nothing more — it is zero when the
       browser would not let it sound, so the music is never held up by a noise
       that is not playing. */
    const start = () => {
      audio.play().catch(() => {
        // Autoplay policy or a bad URL — keep the UI honest.
        blocked.current = true;
        setPlaying(false);
      });
    };

    const wait = needleDrop();
    if (!wait) {
      start();
      return;
    }

    /* Torn down mid-drop — a fast pause, or a track change — and the play
       queued behind it must not land afterwards. */
    const timer = setTimeout(start, wait);
    return () => clearTimeout(timer);
  }, [playing, activeIndex, activeTrack?.audioSrc]);

  /* Browsers refuse audio nobody asked for until the visitor has interacted
     with the page. When that is what stopped us, arm the first gesture so the
     music starts the moment they touch anything — rather than leaving a deck
     that was told to play sitting silent. */
  useEffect(() => {
    let spent = false;
    const kick = () => {
      if (spent) return;
      spent = true;
      off();
      if (blocked.current) setPlaying(true);
    };
    const off = () => {
      window.removeEventListener("pointerdown", kick);
      window.removeEventListener("keydown", kick);
    };
    window.addEventListener("pointerdown", kick);
    window.addEventListener("keydown", kick);
    return off;
  }, []);

  /* Hand the signal to the rig while the deck is running, and take it back
     when it stops so the rig falls to the house beat. */
  useEffect(() => {
    setStageAnalyser(playing ? analyser.current : null);
    return () => setStageAnalyser(null);
  }, [playing, analyser]);

  return (
    <>
      {/* Clipped on one axis only: the deck bleeds past the viewport edges and
          must be cut there, but the lighting rig reaches up over the header to
          the top of the page and must not be. */}
      <section className="relative z-0 [overflow-x:clip] xl:min-h-[1052px]">
        <ConcertLights scrim="even" />
        {/* The element is the truth about whether anything is playing, and the
            platter follows it. Without this a stall, a media-session pause or
            an OS interruption would stop the sound and leave the record
            turning. */}
        <audio
          ref={audioRef}
          src={activeTrack?.audioSrc}
          crossOrigin="anonymous"
          preload="none"
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onEnded={() => setAdvanceRequest((n) => n + 1)}
        />

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

            <p
              className="max-w-[962px] text-center font-[family-name:var(--font-display)] text-[17px] leading-6 tracking-[0.085px] text-content-secondary"
              data-split="lines"
              data-reveal-delay="0.12"
            >
              {event.intro}
            </p>

            {/* Gates open / Last entry / Showtime. These sat above the ticket
                tiers until the comp moved them up here, where they answer the
                question the hero raises rather than the one the tiers do. */}
            <div
              className="flex flex-wrap items-center justify-center gap-8 pt-2"
              data-reveal="up"
              data-reveal-delay="0.16"
            >
              {event.schedule.map((tile, index) => (
                <div key={tile.label} className="flex items-center gap-8">
                  {index > 0 && (
                    <span aria-hidden className="hidden h-[52px] w-px bg-ink-600 sm:block" />
                  )}
                  <div className="flex items-center gap-4">
                    <Image
                      src={tile.icon}
                      alt=""
                      width={32}
                      height={32}
                      className="size-8 shrink-0"
                    />
                    <div className="flex flex-col items-start whitespace-nowrap">
                      <span className="font-[family-name:var(--font-ui)] text-sm leading-[1.5] text-text-secondary">
                        {tile.label}
                      </span>
                      <span className="font-[family-name:var(--font-display)] text-2xl font-semibold leading-[1.22] tracking-[-0.12px] text-text-primary">
                        {tile.value}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div data-reveal="up" data-reveal-delay="0.24">
              <ShareButton eventName={event.name} />
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
                tracks={event.playlist}
                activeIndex={activeIndex}
                playing={playing}
                analyser={analyser}
                advanceRequest={advanceRequest}
                stepRequest={stepRequest}
                onSelect={(index) => {
                  setPlaying(false);
                  setActiveIndex(index);
                }}
                onPlay={() => setPlaying(true)}
                onTogglePlay={() => setPlaying((value) => !value)}
              />
            </div>
          </div>
        </div>

        {/* Stickers, pinned to the 1512 × 1076 frame. The layer itself lets
         *  clicks through so it can sit over the deck; only the stickers are
         *  interactive. */}
        <div
          className="pointer-events-none absolute inset-0 mx-auto hidden xl:block"
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

      {/* Outside the section: it is a stacking context, and a fixed element
          inside it would paint under the sections that follow. */}
      <MiniPlayer
        track={activeTrack}
        playing={playing}
        visible={deckOffscreen}
        onToggle={() => setPlaying((value) => !value)}
        onPrev={() =>
          setStepRequest((s) => ({ id: (s?.id ?? 0) + 1, dir: -1 }))
        }
        onNext={() => setStepRequest((s) => ({ id: (s?.id ?? 0) + 1, dir: 1 }))}
        onOpen={() =>
          stageRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "center",
          })
        }
      />
    </>
  );
}
