"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import gsap from "gsap";

import { festivals } from "@/data/home";
import {
  LoaderDoors,
  LoaderLineup,
  LoaderSoundcheck,
} from "./CounterLoaders";

/**
 * Four alternatives to the needle-drop intro, written to the same contract so
 * any of them can replace it: each fills its parent, plays once when `run`
 * turns true, and calls `onDone` when the sheet has left.
 *
 * They are deliberately shorter than the record — about a second and a half
 * to the reveal — because the thing people are waiting for is the site.
 */

export type LoaderProps = {
  /** Flips to true to play. Going false and true again replays. */
  run: boolean;
  onDone?: () => void;
};

/** Shared: run a timeline under a context and tear it down on unmount. */
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
    // `build` is re-created every render by design; `run` is the gate.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [run]);

  return root;
}

const SHEET =
  "absolute inset-0 z-[80] flex items-center justify-center overflow-hidden bg-bg-primary";

/* ------------------------------------------------------------------ *
 * A · Counter
 * ------------------------------------------------------------------ */

/**
 * The figure does the waiting: 00 to 100 in the display face, a brand rule
 * filling underneath it, then the whole sheet leaves upward.
 */
export function LoaderCounter({ run, onDone }: LoaderProps) {
  const root = useLoader(
    run,
    (tl) => {
      const count = { n: 0 };
      gsap.set("[data-c-num]", { yPercent: 120, opacity: 0 });
      gsap.set("[data-c-rule]", { scaleX: 0, transformOrigin: "left center" });

      tl.to("[data-c-num]", {
        yPercent: 0,
        opacity: 1,
        duration: 0.5,
        ease: "expo.out",
      })
        .to(
          count,
          {
            n: 100,
            duration: 1.3,
            ease: "power2.inOut",
            onUpdate() {
              const el = document.querySelector("[data-c-num]");
              if (el) el.textContent = String(Math.round(count.n)).padStart(2, "0");
            },
          },
          0,
        )
        .to("[data-c-rule]", { scaleX: 1, duration: 1.3, ease: "power2.inOut" }, 0)
        .to("[data-c-num]", { yPercent: -120, duration: 0.4, ease: "power3.in" }, 1.5)
        .to(
          "[data-c-sheet]",
          { yPercent: -100, duration: 0.7, ease: "expo.inOut" },
          1.6,
        );
    },
    onDone,
  );

  return (
    <div ref={root} className="absolute inset-0">
      <div data-c-sheet className={SHEET}>
        <div className="flex w-full max-w-[880px] flex-col gap-6 px-8">
          <div className="overflow-hidden">
            <span
              data-c-num
              className="block font-daltown text-[clamp(96px,22vw,280px)] uppercase leading-[0.8] tabular-nums text-white"
            >
              00
            </span>
          </div>
          <span data-c-rule className="block h-[3px] w-full bg-brand" />
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * B · Wordmark
 * ------------------------------------------------------------------ */

/**
 * The name builds letter by letter behind masks — the menu's own motion — and
 * the finished lockup lifts the sheet away with it.
 */
export function LoaderWordmark({ run, onDone }: LoaderProps) {
  const root = useLoader(
    run,
    (tl) => {
      gsap.set("[data-w-letter]", { yPercent: 110, rotate: 6 });
      gsap.set("[data-w-rule]", { scaleX: 0, transformOrigin: "center" });

      tl.to("[data-w-letter]", {
        yPercent: 0,
        rotate: 0,
        duration: 0.7,
        ease: "expo.out",
        stagger: 0.06,
      })
        .to("[data-w-rule]", { scaleX: 1, duration: 0.6, ease: "expo.out" }, 0.5)
        .to("[data-w-lockup]", { yPercent: -140, duration: 0.6, ease: "power3.in" }, 1.4)
        .to(
          "[data-w-sheet]",
          { yPercent: -100, duration: 0.7, ease: "expo.inOut" },
          1.5,
        );
    },
    onDone,
  );

  return (
    <div ref={root} className="absolute inset-0">
      <div data-w-sheet className={SHEET}>
        <div data-w-lockup className="flex flex-col items-center gap-4">
          <span className="flex">
            {"SEVENPM".split("").map((letter, index) => (
              <span key={`${letter}-${index}`} className="block overflow-hidden">
                <span
                  data-w-letter
                  className="block font-daltown text-[clamp(48px,11vw,140px)] uppercase leading-[0.85] text-white"
                >
                  {letter}
                </span>
              </span>
            ))}
          </span>
          <span data-w-rule className="block h-[3px] w-[min(70vw,520px)] bg-brand" />
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * C · Poster deal
 * ------------------------------------------------------------------ */

/**
 * The season deals itself: the posters land on a pile one after another, the
 * pile fans, and the whole hand is thrown off the top of the screen.
 */
export function LoaderPosters({ run, onDone }: LoaderProps) {
  const root = useLoader(
    run,
    (tl) => {
      const cards = gsap.utils.toArray<HTMLElement>("[data-p-card]");
      gsap.set(cards, { yPercent: 140, rotate: 0, opacity: 0 });

      tl.to(cards, {
        yPercent: 0,
        opacity: 1,
        duration: 0.5,
        ease: "power3.out",
        stagger: 0.1,
      })
        .to(
          cards,
          {
            rotate: (i: number) => (i - (cards.length - 1) / 2) * 9,
            x: (i: number) => (i - (cards.length - 1) / 2) * 90,
            duration: 0.6,
            ease: "expo.out",
          },
          0.7,
        )
        .to(
          cards,
          {
            yPercent: -160,
            duration: 0.5,
            ease: "power3.in",
            stagger: { each: 0.05, from: "center" },
          },
          1.5,
        )
        .to(
          "[data-p-sheet]",
          { yPercent: -100, duration: 0.7, ease: "expo.inOut" },
          1.7,
        );
    },
    onDone,
  );

  return (
    <div ref={root} className="absolute inset-0">
      <div data-p-sheet className={SHEET}>
        <div className="relative flex h-[min(52vh,420px)] w-full items-center justify-center">
          {festivals.slice(0, 5).map((festival) => (
            <span
              key={festival.id}
              data-p-card
              className="absolute block h-full w-auto"
            >
              <Image
                src={festival.poster.src}
                alt=""
                width={festival.poster.width}
                height={festival.poster.height}
                className="h-full w-auto object-cover"
                priority
              />
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * D · Curtain
 * ------------------------------------------------------------------ */

/**
 * Two brand panels close over the page, hold for a beat with the mark between
 * them, and part like a stage curtain.
 */
export function LoaderCurtain({ run, onDone }: LoaderProps) {
  const root = useLoader(
    run,
    (tl) => {
      gsap.set("[data-d-left]", { xPercent: -100 });
      gsap.set("[data-d-right]", { xPercent: 100 });
      gsap.set("[data-d-mark]", { opacity: 0, scale: 0.9 });

      tl.to("[data-d-left]", { xPercent: 0, duration: 0.6, ease: "expo.inOut" })
        .to("[data-d-right]", { xPercent: 0, duration: 0.6, ease: "expo.inOut" }, 0)
        .to(
          "[data-d-mark]",
          { opacity: 1, scale: 1, duration: 0.5, ease: "expo.out" },
          0.45,
        )
        .to("[data-d-mark]", { opacity: 0, duration: 0.3, ease: "power2.in" }, 1.4)
        .to(
          "[data-d-left]",
          { xPercent: -100, duration: 0.8, ease: "expo.inOut" },
          1.5,
        )
        .to(
          "[data-d-right]",
          { xPercent: 100, duration: 0.8, ease: "expo.inOut" },
          1.5,
        );
    },
    onDone,
  );

  return (
    <div ref={root} className="absolute inset-0">
      <div className="pointer-events-none absolute inset-0 z-[80] overflow-hidden">
        <span
          data-d-left
          className="absolute inset-y-0 left-0 block w-1/2 bg-brand"
        />
        <span
          data-d-right
          className="absolute inset-y-0 right-0 block w-1/2 bg-brand"
        />
        <span
          data-d-mark
          className="absolute left-1/2 top-1/2 block -translate-x-1/2 -translate-y-1/2 font-daltown text-[clamp(40px,8vw,104px)] uppercase leading-none text-[#0b0b0e]"
        >
          Sevenpm
        </span>
      </div>
    </div>
  );
}

export const LOADERS = [
  {
    id: "soundcheck",
    label: "A1 · Soundcheck",
    note: "The counter is the gain. Forty bars light up left to right as the levels come up, breathing the whole time, and peak once at 100.",
    Component: LoaderSoundcheck,
  },
  {
    id: "lineup",
    label: "A2 · Line-up roll",
    note: "The counter with the bill beside it: the festivals flick past one per beat and land on SEVENPM as the figure reaches 100.",
    Component: LoaderLineup,
  },
  {
    id: "doors",
    label: "A3 · Doors",
    note: "The count is the wait outside. A crowd photograph comes up from black behind it, and at 100 the doors part from the middle.",
    Component: LoaderDoors,
  },
  {
    id: "counter",
    label: "A · Counter (as shown before)",
    note: "The figure does the waiting. 00 to 100 in the display face with a brand rule filling under it, then the sheet leaves upward.",
    Component: LoaderCounter,
  },
  {
    id: "wordmark",
    label: "B · Wordmark",
    note: "The name builds a letter at a time behind masks, the way the menu moves, and the finished lockup takes the sheet with it.",
    Component: LoaderWordmark,
  },
  {
    id: "posters",
    label: "C · Poster deal",
    note: "The season deals itself onto a pile, fans out, and the whole hand is thrown off the top of the screen.",
    Component: LoaderPosters,
  },
  {
    id: "curtain",
    label: "D · Curtain",
    note: "Two brand panels close over the page, hold with the mark between them, and part like a stage curtain.",
    Component: LoaderCurtain,
  },
] as const;
