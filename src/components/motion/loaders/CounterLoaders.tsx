"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import gsap from "gsap";

import type { LoaderProps } from "./LoaderOptions";
import { festivals } from "@/data/home";

/**
 * Three takes on the counter, the option that was chosen, each one about a
 * festival rather than about loading.
 *
 * They share the same skeleton — a figure climbing to 100 in the display face
 * while something fills underneath, then the sheet leaves upward — and differ
 * in what the climbing is for: levels coming up at a soundcheck, the line-up
 * rolling past, or the doors opening.
 */

/** Bar heights for the meter. Fixed, not random: a loader that looks
 *  different on every render is a loader you cannot art-direct, and
 *  `Math.random` in a component body is impure besides. */
const LEVELS = [
  0.32, 0.55, 0.41, 0.78, 0.6, 0.94, 0.48, 0.71, 0.36, 0.83, 0.52, 0.66, 0.29,
  0.88, 0.45, 0.74, 0.58, 0.97, 0.39, 0.63, 0.5, 0.81, 0.34, 0.69, 0.57, 0.91,
  0.43, 0.76, 0.3, 0.85, 0.54, 0.68, 0.37, 0.79, 0.61, 0.46, 0.72, 0.33, 0.86,
  0.49,
];

function useLoader(
  run: boolean,
  build: (tl: gsap.core.Timeline, root: HTMLDivElement) => void,
  onDone?: () => void,
) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el || !run) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ onComplete: onDone });
      build(tl, el);
    }, el);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [run]);

  return root;
}

const SHEET =
  "absolute inset-0 z-[80] flex items-center justify-center overflow-hidden bg-bg-primary";

/** The count, written into an element rather than tweened as text. */
function runCount(
  tl: gsap.core.Timeline,
  selector: string,
  duration: number,
  at: number,
) {
  const state = { n: 0 };
  tl.to(
    state,
    {
      n: 100,
      duration,
      ease: "power2.inOut",
      onUpdate() {
        const el = document.querySelector(selector);
        if (el) el.textContent = String(Math.round(state.n)).padStart(2, "0");
      },
    },
    at,
  );
}

/* ------------------------------------------------------------------ *
 * A1 · Soundcheck
 * ------------------------------------------------------------------ */

/**
 * The levels come up. The figure is the gain, the rule is a meter of forty
 * bars that fills left to right and keeps moving while it fills, and the line
 * under it reads like a stage manager's checklist.
 *
 * At 100 the meter peaks once — every bar to full — and the sheet goes.
 */
export function LoaderSoundcheck({ run, onDone }: LoaderProps) {
  const root = useLoader(
    run,
    (tl) => {
      gsap.set("[data-s-num]", { yPercent: 120, opacity: 0 });
      gsap.set("[data-s-bar]", { scaleY: 0.06, transformOrigin: "50% 100%" });
      gsap.set("[data-s-meta]", { opacity: 0, y: 8 });

      /* The bars breathe for the whole intro, each at its own rate, so the
         meter reads as live rather than as a progress bar in disguise. */
      gsap.utils.toArray<HTMLElement>("[data-s-bar]").forEach((bar, index) => {
        gsap.to(bar, {
          scaleY: LEVELS[index % LEVELS.length],
          duration: 0.36 + (index % 5) * 0.08,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          delay: (index % 7) * 0.05,
        });
      });

      tl.to("[data-s-num]", {
        yPercent: 0,
        opacity: 1,
        duration: 0.5,
        ease: "expo.out",
      })
        .to("[data-s-meta]", { opacity: 1, y: 0, duration: 0.5 }, 0.15)
        /* The meter lights up left to right as the gain comes up. */
        .to(
          "[data-s-bar]",
          {
            backgroundColor: "#fbeb1c",
            duration: 1.3,
            ease: "power2.inOut",
            stagger: { each: 0.03, from: "start" },
          },
          0,
        );

      runCount(tl, "[data-s-num]", 1.3, 0);

      tl.to(
        "[data-s-bar]",
        { scaleY: 1, duration: 0.18, ease: "power2.out", overwrite: true },
        1.45,
      )
        .to("[data-s-num]", { yPercent: -120, duration: 0.4, ease: "power3.in" }, 1.7)
        .to("[data-s-meta]", { opacity: 0, duration: 0.3 }, 1.7)
        .to("[data-s-sheet]", { yPercent: -100, duration: 0.7, ease: "expo.inOut" }, 1.8);
    },
    onDone,
  );

  return (
    <div ref={root} className="absolute inset-0">
      <div data-s-sheet className={SHEET}>
        <div className="flex w-full max-w-[880px] flex-col gap-6 px-8">
          <div className="flex items-end justify-between gap-6">
            <div className="overflow-hidden">
              <span
                data-s-num
                className="block font-daltown text-[clamp(72px,18vw,220px)] uppercase leading-[0.8] tabular-nums text-white"
              >
                00
              </span>
            </div>
            <span
              data-s-meta
              className="pb-3 font-[family-name:var(--font-display)] text-[12px] font-bold uppercase leading-4 tracking-[3px] text-content-secondary"
            >
              Soundcheck
            </span>
          </div>

          {/* Forty bars: the meter. */}
          <span
            aria-hidden
            className="flex h-[54px] w-full items-end gap-[3px]"
          >
            {LEVELS.map((level, index) => (
              <span
                key={index}
                data-s-bar
                className="block h-full flex-1 bg-white/15"
                style={{ height: `${28 + level * 26}px` }}
              />
            ))}
          </span>

          <span
            data-s-meta
            className="font-[family-name:var(--font-display)] text-[12px] font-bold uppercase leading-4 tracking-[3px] text-content-secondary"
          >
            Levels · stage · doors
          </span>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * A2 · Line-up roll
 * ------------------------------------------------------------------ */

/**
 * The counter with the bill rolling beside it: the festivals flick past on a
 * strip, one per beat, and land on SEVENPM as the figure reaches 100.
 *
 * It is the loader saying what is on rather than saying "loading".
 */
export function LoaderLineup({ run, onDone }: LoaderProps) {
  const names = [...festivals.map((f) => f.name), "Sevenpm"];

  const root = useLoader(
    run,
    (tl) => {
      /* yPercent is a share of the strip's own height, so moving on by one
         name is 100 / names. */
      const perName = 100 / names.length;
      gsap.set("[data-l-num]", { yPercent: 120, opacity: 0 });
      gsap.set("[data-l-rule]", { scaleX: 0, transformOrigin: "left center" });
      gsap.set("[data-l-strip]", { yPercent: 0 });

      tl.to("[data-l-num]", {
        yPercent: 0,
        opacity: 1,
        duration: 0.45,
        ease: "expo.out",
      })
        .to("[data-l-rule]", { scaleX: 1, duration: 1.4, ease: "power2.inOut" }, 0)
        /* One name per step, snapped so a name is never caught mid-slide. */
        .to(
          "[data-l-strip]",
          {
            yPercent: -perName * (names.length - 1),
            duration: 1.4,
            ease: `steps(${names.length - 1})`,
          },
          0,
        )
        .to("[data-l-num]", { yPercent: -120, duration: 0.4, ease: "power3.in" }, 1.6)
        .to("[data-l-strip]", { opacity: 0, duration: 0.3 }, 1.6)
        .to("[data-l-sheet]", { yPercent: -100, duration: 0.7, ease: "expo.inOut" }, 1.7);

      runCount(tl, "[data-l-num]", 1.4, 0);
    },
    onDone,
  );

  return (
    <div ref={root} className="absolute inset-0">
      <div data-l-sheet className={SHEET}>
        <div className="flex w-full max-w-[880px] flex-col gap-6 px-8">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="overflow-hidden">
              <span
                data-l-num
                className="block font-daltown text-[clamp(72px,18vw,220px)] uppercase leading-[0.8] tabular-nums text-white"
              >
                00
              </span>
            </div>

            {/* The bill, one line tall, rolling. */}
            <span
              aria-hidden
              className="block h-[40px] min-w-0 flex-1 overflow-hidden"
            >
              <span data-l-strip className="block">
                {names.map((name) => (
                  <span
                    key={name}
                    className="flex h-[40px] items-center justify-end truncate font-[family-name:var(--font-display)] text-[clamp(18px,2.4vw,34px)] font-bold uppercase leading-[40px] tracking-[-0.02em] text-brand"
                  >
                    {name}
                  </span>
                ))}
              </span>
            </span>
          </div>

          <span data-l-rule className="block h-[3px] w-full bg-brand" />
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * A3 · Doors
 * ------------------------------------------------------------------ */

/**
 * The count is the wait outside: a crowd photograph behind it comes up from
 * black as the figure climbs, and at 100 the doors part — two panels, from
 * the middle — and the sheet is gone.
 */
export function LoaderDoors({ run, onDone }: LoaderProps) {
  const root = useLoader(
    run,
    (tl) => {
      gsap.set("[data-o-num]", { yPercent: 120, opacity: 0 });
      gsap.set("[data-o-photo]", { opacity: 0, scale: 1.12 });
      gsap.set("[data-o-meta]", { opacity: 0, y: 8 });
      gsap.set("[data-o-left]", { xPercent: 0 });
      gsap.set("[data-o-right]", { xPercent: 0 });

      tl.to("[data-o-num]", {
        yPercent: 0,
        opacity: 1,
        duration: 0.45,
        ease: "expo.out",
      })
        .to("[data-o-meta]", { opacity: 1, y: 0, duration: 0.5 }, 0.15)
        .to(
          "[data-o-photo]",
          { opacity: 0.55, scale: 1, duration: 1.4, ease: "power2.inOut" },
          0,
        )
        .to("[data-o-num]", { opacity: 0, duration: 0.3, ease: "power2.in" }, 1.5)
        .to("[data-o-meta]", { opacity: 0, duration: 0.3 }, 1.5)
        /* Doors. */
        .to(
          "[data-o-left]",
          { xPercent: -100, duration: 0.8, ease: "expo.inOut" },
          1.6,
        )
        .to(
          "[data-o-right]",
          { xPercent: 100, duration: 0.8, ease: "expo.inOut" },
          1.6,
        );

      runCount(tl, "[data-o-num]", 1.4, 0);
    },
    onDone,
  );

  return (
    <div ref={root} className="absolute inset-0">
      <div className="pointer-events-none absolute inset-0 z-[80] overflow-hidden">
        {/* Two halves of one sheet, so the split is the doors opening. */}
        <span
          data-o-left
          className="absolute inset-y-0 left-0 block w-1/2 overflow-hidden bg-bg-primary"
        >
          <span className="absolute inset-0 block overflow-hidden">
            <span data-o-photo className="absolute inset-0 block">
              <Image
                src="/assets/gallery-3.jpg"
                alt=""
                fill
                sizes="50vw"
                className="object-cover object-right"
                priority
              />
            </span>
          </span>
        </span>
        <span
          data-o-right
          className="absolute inset-y-0 right-0 block w-1/2 overflow-hidden bg-bg-primary"
        >
          <span className="absolute inset-0 block overflow-hidden">
            <span data-o-photo className="absolute inset-0 block">
              <Image
                src="/assets/gallery-3.jpg"
                alt=""
                fill
                sizes="50vw"
                className="object-cover object-left"
                priority
              />
            </span>
          </span>
        </span>

        <div className="absolute inset-0 z-[1] flex flex-col items-center justify-center gap-4">
          <span
            data-o-meta
            className="font-[family-name:var(--font-display)] text-[12px] font-bold uppercase leading-4 tracking-[3px] text-white/70"
          >
            Doors open in
          </span>
          <span
            data-o-num
            className="block font-daltown text-[clamp(72px,18vw,220px)] uppercase leading-[0.8] tabular-nums text-white"
          >
            00
          </span>
        </div>
      </div>
    </div>
  );
}
