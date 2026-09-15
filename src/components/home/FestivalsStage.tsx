"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { setStageAnalyser } from "@/components/motion/stageAudio";
import { useAudioAnalyser } from "@/components/event/useAudioAnalyser";
import type { Festival } from "@/data/home";
import { homeCopy } from "@/data/home";

/**
 * The festival poster row, from Figma 15:246 (1901.63 × 526, centred on the
 * 1512 frame so it bleeds ~195px each side). Each poster is the comp's own
 * export, already drawn in perspective for its slot, so the composition is
 * fixed and scaled as a unit; the side posters sit in luminosity (grey) and
 * come back to colour on hover.
 *
 * "Press & hold spacebar to listen": holding Space (or pressing the centre
 * poster) plays the featured festival's preview and lets go on release.
 *
 * While it plays, the analyser is handed to `stageAudio` so the hero's
 * lighting rig and headline move to the actual track rather than to the house
 * beat they fall back on.
 */

const STAGE_WIDTH = 1901.634;
const STAGE_HEIGHT = 526;
const SLOT_X = [0, 404.267, 796.536, 1132.303, 1526.634];
const GLOW = 497;
const GLOW_LEFT = 702.817;

export function FestivalsStage({ festivals }: { festivals: Festival[] }) {
  const featured = festivals[Math.floor(festivals.length / 2)];
  const audioRef = useRef<HTMLAudioElement>(null);
  const [listening, setListening] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !featured?.audioSrc) return;
    if (listening) {
      audio.play().catch(() => setListening(false));
    } else {
      audio.pause();
    }
  }, [listening, featured?.audioSrc]);

  /* Hand the signal to the hero while the preview is playing, and take it
     back when it stops so the rig returns to the house beat. */
  const analyserRef = useAudioAnalyser(audioRef, listening);
  useEffect(() => {
    setStageAnalyser(listening ? analyserRef.current : null);
    return () => setStageAnalyser(null);
  }, [listening, analyserRef]);

  // Spacebar: down starts, up stops. Ignored while typing in a field.
  useEffect(() => {
    const isTyping = (t: EventTarget | null) =>
      t instanceof HTMLElement && /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName);
    const down = (e: KeyboardEvent) => {
      if (e.code !== "Space" || e.repeat || isTyping(e.target)) return;
      e.preventDefault();
      setListening(true);
    };
    const up = (e: KeyboardEvent) => {
      if (e.code !== "Space") return;
      setListening(false);
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    window.addEventListener("blur", () => setListening(false));
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);

  const shown = festivals.find((f) => f.id === hovered) ?? featured;

  return (
    <div className="flex w-full flex-col items-center gap-12">
      {featured?.audioSrc && (
        <audio ref={audioRef} src={featured.audioSrc} preload="none" loop />
      )}

      {/* Stage: 1901.63 × 526 at 1512, scaled with the viewport */}
      <div
        className="stage-festivals relative w-full"
        data-reveal="scale"
        data-reveal-delay="0.1"
        data-listening={listening}
      >
        <div
          className="absolute left-1/2 top-0"
          style={{
            width: STAGE_WIDTH,
            height: STAGE_HEIGHT,
            marginLeft: -STAGE_WIDTH / 2,
            transform: "scale(var(--home-stage-scale))",
            transformOrigin: "top center",
          }}
        >
          {/* Colour wash behind the featured poster */}
          <div
            aria-hidden
            className="festival-glow pointer-events-none absolute"
            style={{ left: GLOW_LEFT, top: -1, width: GLOW, height: GLOW }}
          >
            <Image
              src="/assets/festival-glow.jpg"
              alt=""
              fill
              sizes="500px"
              className="object-cover"
            />
          </div>

          {festivals.map((festival, i) => {
            const centre = festival.id === featured?.id;
            const { poster } = festival;
            return (
              <Link
                key={festival.id}
                href={festival.href}
                aria-label={
                  centre
                    ? `${festival.name} — open the festival`
                    : festival.name
                }
                className={`festival-poster absolute top-0 block ${centre ? "is-centre" : ""}`}
                data-cursor={centre ? "Hold" : "Open"}
                style={{
                  left: SLOT_X[i],
                  width: poster.width,
                  height: poster.height,
                }}
                onMouseEnter={() => setHovered(festival.id)}
                onMouseLeave={() => setHovered(null)}
                onFocus={() => setHovered(festival.id)}
                onBlur={() => setHovered(null)}
                onPointerDown={centre ? () => setListening(true) : undefined}
                onPointerUp={centre ? () => setListening(false) : undefined}
                onPointerCancel={centre ? () => setListening(false) : undefined}
              >
                <Image
                  src={poster.src}
                  alt=""
                  width={Math.round(poster.width)}
                  height={Math.round(poster.height)}
                  sizes={`${Math.round(poster.width)}px`}
                  priority={centre}
                  className="block h-full w-full"
                  draggable={false}
                />
              </Link>
            );
          })}
        </div>
      </div>

      {/* Title + hint */}
      <div className="flex w-full flex-col items-center gap-7" data-reveal="up">
        <div className="flex h-[34px] items-center justify-center">
          <span className="font-[family-name:var(--font-display)] text-[24px] font-black uppercase tracking-[0.12em] text-white">
            {shown?.name}
          </span>
        </div>
        <p
          className="text-center font-[family-name:var(--font-display)] text-[14px] font-light uppercase leading-[1.1] text-text-secondary"
          aria-live="polite"
        >
          {listening ? (
            <>
              Now listening to {featured?.name}
              <br />
              release to stop
            </>
          ) : (
            <>
              {homeCopy.listenHint[0]}
              <br />
              {homeCopy.listenHint[1]}
            </>
          )}
        </p>
      </div>
    </div>
  );
}
