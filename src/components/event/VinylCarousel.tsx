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
 * Geometry is stage-space: a 1512 × 612 frame, all discs on one axis, and
 * everything on it sits whole and clear of its neighbours.
 */

const STAGE_WIDTH = 1512;
const STAGE_HEIGHT = 612;
const AXIS_Y = 306;

const DISC = 612;
const LABEL = 345;
const LABEL_INSET = (DISC - LABEL) / 2;
/** Glow layer box — a third of the disc, scaled ×3 by `.vinyl-glow`. */
const GLOW = DISC / 3;

/**
 * Slot geometry.
 *
 * A 612 centre on a 1512 stage leaves 450px a side for a whole record, two
 * gaps and half of the next, which fixes the neighbours at 250:
 * 37 + 250 + 38 + 125 = 450.
 *
 * The outer pair is the exception: it is placed on the *viewport* edge, not
 * the stage's. The stage is a fixed 1512 frame scaled to fit, so on most
 * windows it is narrower than the screen — cutting at its edge put the cut
 * 45px inside the page with black either side of it. `edge` marks those two
 * slots so the component can position them from the measured scale instead.
 */
const SLOTS: Record<
  number,
  { cx: number; size: number; visible: boolean; edge?: -1 | 1 }
> = {
  [-2]: { cx: 0, size: 250, visible: true, edge: -1 },
  [-1]: { cx: 287.5, size: 250, visible: true },
  [0]: { cx: 756.5, size: DISC, visible: true },
  [1]: { cx: 1224.5, size: 250, visible: true },
  [2]: { cx: STAGE_WIDTH, size: 250, visible: true, edge: 1 },
};

/** Parked off-stage, so a disc wrapping round the ring never crosses the view. */
function slotFor(offset: number): {
  cx: number;
  size: number;
  visible: boolean;
  edge?: -1 | 1;
} {
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
/* 33⅓ RPM, the speed an LP actually turns: one revolution every 1.8 seconds.
   The platter still eases up to it and coasts down, which is the part that
   reads as a real deck rather than a looping GIF. */
const RPM = 100 / 3;
const SPIN_SECONDS = 60 / RPM;

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
  stepRequest,
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
  /** External prev/next (the floating player): a new `id` runs one step. */
  stepRequest?: { id: number; dir: -1 | 1 };
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

  /**
   * Half the viewport, in stage units. The stage is a fixed 1512 frame
   * scaled to fit, and the scale is not knowable from here — so it is
   * measured: rendered width over 1512. The outer records are then placed
   * at the centre plus or minus this, which puts them on the screen's edge
   * at any scale, and the screen cuts them in half.
   *
   * Defaults to half the stage, which is where they sat before, so the
   * first paint is never wrong-looking.
   */
  const stageRef = useRef<HTMLDivElement>(null);
  const [edgeX, setEdgeX] = useState(STAGE_WIDTH / 2);

  useEffect(() => {
    /* How far the screen's edge is from the stage's centre, in stage units.
    
       The scale is read straight off `--hero-stage-scale`, which is
       registered with `@property` so it computes to a number rather than to
       the raw `min(tan(...))` expression. That makes this exact and
       immediate.
    
       Measuring the rendered stage instead does not work, and three
       attempts proved it: a ResizeObserver on the stage (whose layout box
       never changes, so it fires once, early), a settle-detector (a slow
       tween holds still to half a pixel, so it settled mid-travel), and a
       schedule of timers (right in the end, but only from 2s in — the first
       seconds a visitor sees had the records at the stage's edge, which is
       the bug this is fixing). The wrapper above carries
       `data-reveal="scale"` and travels from 0.88, so anything that reads
       the rendered box is reading that animation, not the layout. */
    const measure = () => {
      const scale = Number(
        getComputedStyle(document.documentElement).getPropertyValue(
          "--hero-stage-scale",
        ),
      );
      if (scale > 0) setEdgeX(window.innerWidth / scale / 2);
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(document.documentElement);
    return () => observer.disconnect();
  }, []);
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
      gsap.to(spinRef.current, {
        timeScale: 1,
        duration: 0.8,
        ease: "power2.in",
      });
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
    tl.to(
      arm,
      {
        rotation: ARM_REST,
        y: -14,
        scale: 1.03,
        duration: 0.45 * d,
        ease: "power2.out",
      },
      0,
    );
    if (spinRef.current) {
      tl.to(
        spinRef.current,
        { timeScale: 0, duration: 0.8 * d, ease: "power2.out" },
        0,
      );
    }
    // 2. Discs travel (CSS transition, ~1.05s).
    tl.add(() => moveRing(k), 0.35 * d);
    tl.add(() => onSelect(k % tracks.length), 0.36 * d);
    // 3. Head drops onto the new record.
    tl.to(
      arm,
      {
        rotation: ARM_PLAY,
        y: 0,
        scale: 1,
        duration: 0.55 * d,
        ease: "power2.inOut",
      },
      1.45 * d,
    );
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

  const lastStep = useRef(stepRequest?.id ?? 0);
  useEffect(() => {
    if (!stepRequest || stepRequest.id === lastStep.current) return;
    lastStep.current = stepRequest.id;
    select((ringActive + stepRequest.dir + ringSize) % ringSize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stepRequest]);

  const active = tracks[activeIndex];
  const previousTrack = ring.prev % tracks.length;
  const glowTracks =
    previousTrack === activeIndex
      ? [activeIndex]
      : [previousTrack, activeIndex];

  return (
    <div
      ref={stageRef}
      /* No clip here: the outer records are cut by the screen, not by this
         box, which is narrower than the screen on most windows. */
      className="relative"
      style={{ width: STAGE_WIDTH, height: STAGE_HEIGHT }}
    >
      {/* Colour wash from the active cover, behind everything. Only the
       *  current and the outgoing cover are mounted — a blurred layer costs
       *  paint even at opacity 0 — and each is a third of the disc size,
       *  scaled up in CSS, so the blur runs over a ninth of the pixels. */}
      {glowTracks.map((i) => {
        const track = tracks[i];
        return (
          <div
            key={`glow-${i}`}
            aria-hidden
            className="vinyl-glow pointer-events-none absolute rounded-full"
            style={{
              left: SLOTS[0].cx - GLOW / 2,
              top: AXIS_Y - GLOW / 2,
              width: GLOW,
              height: GLOW,
              opacity: i === activeIndex ? 0.4 : 0,
              backgroundImage: track.artworkUrl
                ? `url(${artworkAt(track.artworkUrl, 300)})`
                : undefined,
              backgroundSize: "cover",
            }}
          />
        );
      })}

      <div
        className="absolute top-0"
        style={{ left: SLOTS[0].cx - DISC / 2, width: DISC, height: DISC }}
      >
        <HeroSpectrum playing={playing} analyser={analyser} />
      </div>

      {/* The ring of records. Clipped on x only so the outer pair is halved
          by the stage edges — on the ring alone, because the stage also
          holds the spectrum canvas, which runs well past both edges and was
          being chopped when the clip sat on the stage. `clip` rather than
          `hidden` keeps the y axis visible for the tonearm. */}
      <div className="absolute inset-0 [overflow-x:clip]">
        {offsets.map((off, k) => {
          const track = tracks[k % tracks.length];
          const base = slotFor(off);
          /* The outer pair rides the screen edge rather than the stage's. */
          const slot = base.edge
            ? { ...base, cx: SLOTS[0].cx + base.edge * edgeX }
            : base;
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
              data-cursor={isCentre ? (playing ? "Pause" : "Play") : "Play"}
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
                    style={{
                      left: LABEL_INSET,
                      top: LABEL_INSET,
                      width: LABEL,
                      height: LABEL,
                    }}
                  />
                ) : (
                  <Image
                    src="/assets/hero-vinyl-label.png"
                    alt=""
                    width={LABEL}
                    height={LABEL}
                    className="absolute rounded-full object-cover"
                    style={{
                      left: LABEL_INSET,
                      top: LABEL_INSET,
                      width: LABEL,
                      height: LABEL,
                    }}
                  />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Tonearm */}
      <div
        className="pointer-events-none absolute z-20 flex items-center justify-center"
        style={{
          left: ARM.left,
          top: ARM.top,
          width: ARM.width,
          height: ARM.height,
        }}
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
        {playing ? "Now playing" : "Selected"}: {active?.title} —{" "}
        {active?.artist}
      </p>
    </div>
  );
}
