"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";

import type { PlaylistTrack } from "@/data/events";
import { HeroSpectrum } from "./HeroSpectrum";

/**
 * The hero deck, from Figma node 2091:56611: a row of records with the active
 * one under the tonearm and the neighbours receding either side. The records
 * are the playlist — click a side disc to bring it in, click the centre one to
 * pause and resume.
 *
 * Switching runs a physical sequence: the tonearm lifts and the platter spins
 * down, every disc slides one slot over (the CSS transition on `.vinyl-slot`
 * does the travel), the arm drops back onto the new record, and it spins up as
 * the audio starts.
 *
 * Geometry is stage-space: a 1512 × 612 frame, all discs on one axis.
 */

const STAGE_WIDTH = 1512;
const STAGE_HEIGHT = 612;
const AXIS_Y = 306;

const DISC = 612;
const LABEL = 345;
const LABEL_INSET = (DISC - LABEL) / 2;

/** Slot geometry for offsets from the active disc, straight from the comp. */
const SLOTS: Record<number, { cx: number; size: number; visible: boolean }> = {
  [-2]: { cx: 9.5, size: 191, visible: true },
  [-1]: { cx: 278.5, size: 245, visible: true },
  [0]: { cx: 756.5, size: DISC, visible: true },
  [1]: { cx: 1246.5, size: 245, visible: true },
  [2]: { cx: 1526.5, size: 191, visible: true },
};

/** Parked off-stage, so a disc wrapping round the ring never crosses the view. */
function slotFor(offset: number) {
  const known = SLOTS[offset];
  if (known) return known;
  const away = Math.abs(offset) - 2;
  return {
    cx: offset < 0 ? -320 - away * 240 : 1840 + away * 240,
    size: 150,
    visible: false,
  };
}

const ARM = { left: 841.5, top: -65, width: 396.053, height: 450.136 };
const ARM_REST = 15;
const ARM_PLAY = 9;
const SPIN_SECONDS = 3.2;

/** Apple artwork URLs carry their size in the path; ask for the size we need. */
function artworkAt(url: string, px: number) {
  return url.replace(/\/\d+x\d+bb\./, `/${px}x${px}bb.`);
}

export function VinylCarousel({
  tracks,
  activeIndex,
  playing,
  onSelect,
  onPlay,
  onTogglePlay,
  advanceRequest,
  analyser,
}: {
  tracks: PlaylistTrack[];
  activeIndex: number;
  playing: boolean;
  /** Point the audio at a track without starting it. */
  onSelect: (index: number) => void;
  /** Start the current track — called when the arm lands. */
  onPlay: () => void;
  onTogglePlay: () => void;
  /** Bump to run the swap sequence onto the next disc (track ended). */
  advanceRequest: number;
  analyser: React.RefObject<AnalyserNode | null>;
}) {
  /* A ring with at least seven positions gives the swap a hidden buffer on
   * both sides, so with four tracks each appears twice. */
  const copies = Math.max(1, Math.ceil(7 / tracks.length));
  const ringSize = tracks.length * copies;

  /* Which ring position is under the arm, plus the one before it. Kept apart
   * from `activeIndex` so a click on the right-hand neighbour always travels
   * right, never the long way round; the previous position tells us which
   * discs are wrapping behind the ring this step. */
  const [ring, setRing] = useState({ active: activeIndex, prev: activeIndex });
  const ringActive = ring.active;
  const moveRing = (k: number) =>
    setRing((current) => ({ active: k, prev: current.active }));

  const half = Math.floor((ringSize - 1) / 2);
  const offsetFrom = (k: number, from: number) => {
    let off = (((k - from) % ringSize) + ringSize) % ringSize;
    if (off > half) off -= ringSize;
    return off;
  };

  const offsets = useMemo(
    () => Array.from({ length: ringSize }, (_, k) => offsetFrom(k, ringActive)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [ringActive, ringSize],
  );

  // A disc whose offset moved more than one slot is wrapping round the back
  // of the ring; it skips the transition so it never streaks across the view.
  const jumped = offsets.map(
    (off, k) => Math.abs(off - offsetFrom(k, ring.prev)) > 1,
  );

  /* ---------------------------------------------------------------- */
  /* Platter + tonearm, GSAP-driven                                     */
  /* ---------------------------------------------------------------- */
  const rotators = useRef<(HTMLDivElement | null)[]>([]);
  const armRef = useRef<HTMLDivElement>(null);
  const spinRef = useRef<gsap.core.Tween | null>(null);
  const sequenceRef = useRef<gsap.core.Timeline | null>(null);
  const reduced = useRef(false);

  useEffect(() => {
    reduced.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    gsap.set(armRef.current, { rotation: ARM_REST });
  }, []);

  const spinUp = (el: HTMLDivElement | null) => {
    if (!el) return;
    if (spinRef.current && spinRef.current.targets()[0] === el) {
      gsap.to(spinRef.current, { timeScale: 1, duration: 0.8, ease: "power2.in" });
      spinRef.current.play();
      return;
    }
    spinRef.current?.kill();
    const tween = gsap.to(el, {
      rotation: "+=360",
      duration: SPIN_SECONDS,
      ease: "none",
      repeat: -1,
    });
    tween.timeScale(reduced.current ? 1 : 0);
    if (!reduced.current) {
      gsap.to(tween, { timeScale: 1, duration: 0.9, ease: "power2.in" });
    }
    spinRef.current = tween;
  };

  const spinDown = () => {
    const tween = spinRef.current;
    if (!tween) return;
    gsap.to(tween, {
      timeScale: 0,
      duration: reduced.current ? 0 : 0.9,
      ease: "power2.out",
      onComplete: () => tween.pause(),
    });
  };

  const armTo = (state: "rest" | "play") => {
    if (!armRef.current) return;
    gsap.to(armRef.current, {
      rotation: state === "play" ? ARM_PLAY : ARM_REST,
      y: 0,
      scale: 1,
      duration: reduced.current ? 0 : 0.6,
      ease: "power2.inOut",
    });
  };

  // Plain play / pause. During a swap the sequence owns the arm.
  useEffect(() => {
    if (sequenceRef.current?.isActive()) return;
    if (playing) {
      spinUp(rotators.current[ringActive]);
      armTo("play");
    } else {
      spinDown();
      armTo("rest");
    }
     
  }, [playing, ringActive]);

  const select = (k: number) => {
    if (sequenceRef.current?.isActive()) return;
    if (k === ringActive) {
      onTogglePlay();
      return;
    }

    const arm = armRef.current;
    const d = reduced.current ? 0 : 1;
    const tl = gsap.timeline({
      onComplete: () => {
        sequenceRef.current = null;
      },
    });
    sequenceRef.current = tl;

    // 1. Head up, platter spinning down.
    tl.to(arm, { rotation: ARM_REST, y: -14, scale: 1.03, duration: 0.45 * d, ease: "power2.out" }, 0);
    if (spinRef.current) {
      tl.to(spinRef.current, { timeScale: 0, duration: 0.8 * d, ease: "power2.out" }, 0);
    }
    // 2. Discs travel (CSS transition, ~1.05s).
    tl.add(() => moveRing(k), 0.35 * d);
    tl.add(() => onSelect(k % tracks.length), 0.36 * d);
    // 3. Head drops onto the new record.
    tl.to(arm, { rotation: ARM_PLAY, y: 0, scale: 1, duration: 0.55 * d, ease: "power2.inOut" }, 1.45 * d);
    // 4. Platter up to speed as the audio starts.
    tl.add(() => {
      spinUp(rotators.current[k]);
      onPlay();
    }, 1.6 * d);
  };

  // A finished track asks for the next disc through the same sequence.
  const lastAdvance = useRef(advanceRequest);
  useEffect(() => {
    if (advanceRequest === lastAdvance.current) return;
    lastAdvance.current = advanceRequest;
    select((ringActive + 1) % ringSize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [advanceRequest]);

  const active = tracks[activeIndex];

  return (
    <div
      className="relative"
      style={{ width: STAGE_WIDTH, height: STAGE_HEIGHT }}
    >
      {/* Colour wash from the active cover, behind everything */}
      {tracks.map((track, i) => (
        <div
          key={`glow-${i}`}
          aria-hidden
          className="vinyl-glow pointer-events-none absolute rounded-full"
          style={{
            left: SLOTS[0].cx - DISC / 2,
            top: 0,
            width: DISC,
            height: DISC,
            opacity: i === activeIndex ? 0.4 : 0,
            backgroundImage: track.artworkUrl
              ? `url(${artworkAt(track.artworkUrl, 300)})`
              : undefined,
            backgroundSize: "cover",
          }}
        />
      ))}

      <div
        className="absolute top-0"
        style={{ left: SLOTS[0].cx - DISC / 2, width: DISC, height: DISC }}
      >
        <HeroSpectrum playing={playing} analyser={analyser} />
      </div>

      {/* The ring of records */}
      {offsets.map((off, k) => {
        const track = tracks[k % tracks.length];
        const slot = slotFor(off);
        const isCentre = off === 0;
        const label = isCentre
          ? playing
            ? `Pause ${track.title}`
            : `Play ${track.title} by ${track.artist}`
          : `Play ${track.title} by ${track.artist}`;

        return (
          <button
            key={k}
            type="button"
            onClick={() => select(k)}
            aria-label={label}
            aria-hidden={!slot.visible}
            tabIndex={slot.visible && Math.abs(off) <= 1 ? 0 : -1}
            data-side={isCentre ? "false" : "true"}
            className="vinyl-slot absolute left-0 top-0 block appearance-none border-0 bg-transparent p-0"
            style={{
              width: DISC,
              height: DISC,
              transform: `translate(${slot.cx - DISC / 2}px, ${AXIS_Y - DISC / 2}px) scale(${slot.size / DISC})`,
              opacity: slot.visible ? 1 : 0,
              zIndex: 10 - Math.abs(off),
              pointerEvents: slot.visible ? "auto" : "none",
              transition: jumped[k] ? "none" : undefined,
            }}
          >
            <div
              ref={(el) => {
                rotators.current[k] = el;
              }}
              className="relative size-full"
            >
              <Image
                src="/assets/hero-vinyl.png"
                alt=""
                width={DISC}
                height={DISC}
                priority={isCentre}
                className="object-cover"
                style={{ width: DISC, height: DISC }}
              />
              {track.artworkUrl ? (
                <Image
                  src={artworkAt(track.artworkUrl, 600)}
                  alt=""
                  width={LABEL}
                  height={LABEL}
                  sizes={`${LABEL}px`}
                  priority={isCentre}
                  className="absolute rounded-full object-cover"
                  style={{ left: LABEL_INSET, top: LABEL_INSET, width: LABEL, height: LABEL }}
                />
              ) : (
                <Image
                  src="/assets/hero-vinyl-label.png"
                  alt=""
                  width={LABEL}
                  height={LABEL}
                  className="absolute rounded-full object-cover"
                  style={{ left: LABEL_INSET, top: LABEL_INSET, width: LABEL, height: LABEL }}
                />
              )}
            </div>
          </button>
        );
      })}

      {/* Tonearm */}
      <div
        className="pointer-events-none absolute z-20 flex items-center justify-center"
        style={{ left: ARM.left, top: ARM.top, width: ARM.width, height: ARM.height }}
      >
        <div ref={armRef}>
          <Image
            src="/assets/hero-tonearm.png"
            alt=""
            width={307}
            height={384}
            priority
            className="object-cover"
            style={{ width: 307.213, height: 383.698 }}
          />
        </div>
      </div>

      <p className="sr-only" aria-live="polite">
        {playing ? "Now playing" : "Selected"}: {active?.title} — {active?.artist}
      </p>
    </div>
  );
}
