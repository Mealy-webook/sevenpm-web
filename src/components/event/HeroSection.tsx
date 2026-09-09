"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import type { EventDetails } from "@/data/events";
import { StickerPeel } from "@/components/ui/StickerPeel";
import { VinylCarousel } from "./VinylCarousel";
import { useAudioAnalyser } from "./useAudioAnalyser";

/* Authored against the 1512 × 1076 Figma hero (node 2091:56451). The deck
 * and the stickers keep their Figma coordinates; the deck stage is scaled as a
 * unit rather than reflowed, and clips at the viewport edges on the way down
 * so the centre record stays centred. */
const FRAME_WIDTH = 1512;
const FRAME_HEIGHT = 1076;
const STAGE_HEIGHT = 612;

export function HeroSection({ event }: { event: EventDetails }) {
  const [playing, setPlaying] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [advanceRequest, setAdvanceRequest] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

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

    audio.play().catch(() => {
      // Autoplay policy or a bad URL — keep the UI honest.
      setPlaying(false);
    });
  }, [playing, activeIndex, activeTrack?.audioSrc]);

  return (
    <section className="relative z-0 overflow-hidden xl:min-h-[1076px]">
      <audio
        ref={audioRef}
        src={activeTrack?.audioSrc}
        crossOrigin="anonymous"
        preload="none"
        onEnded={() => setAdvanceRequest((n) => n + 1)}
      />

      <div className="relative mx-auto flex max-w-[1512px] flex-col items-center gap-12 pb-10">
        <div className="shell-pad flex w-full flex-col items-center gap-12">
          <h1
            className="display-box w-full"
            data-reveal="clip"
            style={
              {
                "--display-line-box": "208px",
                "--display-art-width": `${event.wordmark.width}px`,
              } as React.CSSProperties
            }
          >
            <Image
              src={event.wordmark.src}
              alt={event.wordmark.alt}
              width={event.wordmark.width}
              height={event.wordmark.height}
              priority
              unoptimized
              style={{ height: "auto" }}
            />
          </h1>
          <p
            className="max-w-[962px] text-center font-[family-name:var(--font-display)] text-[17px] leading-6 tracking-[0.085px] text-content-secondary"
            data-reveal="up"
            data-reveal-delay="0.12"
          >
            {event.intro}
          </p>
        </div>

        {/* The deck — one Figma stage at every width, scaled as a unit */}
        <div
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
          initialPosition={{ x: 120, y: 77 }}
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
          initialPosition={{ x: 1155, y: 0 }}
          peelBackHoverPct={22}
          peelBackActivePct={34}
          shadowIntensity={0.6}
          lightingIntensity={0.12}
        />
      </div>
    </section>
  );
}
