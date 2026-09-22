"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

export const READY_EVENT = "sevenpm:ready";

/**
 * True until the intro has finished, and re-initialised to true by every full
 * page load. `MotionProvider` reads it to know whether to hold its reveals —
 * it must not hold on a client-side navigation, where no intro runs and no
 * ready event will ever come.
 */
let pending = true;

export function introPending() {
  return pending;
}

/**
 * First-visit intro: the soundcheck.
 *
 * The figure is the gain and the meter under it is the progress bar — forty
 * bars that light left to right, one bar per two and a half per cent, while
 * the count climbs with them. The bars that are lit keep moving, each at its
 * own rate, so the meter reads as levels coming up rather than as a progress
 * bar wearing a costume. At 100 every bar peaks once and the sheet wipes up.
 *
 * The bar is honest about what it is waiting for. It runs to 90 over about
 * two and a half seconds and holds there until the window has actually
 * loaded, with a beat at the hold even when the page was ready early, then
 * finishes.
 * A page that is already loaded therefore never stalls at 90, and a slow one
 * never shows 100 over an empty screen.
 *
 * It plays on every load, refresh included: it is the site's front door and
 * a door you only see once is a door you never see. Client-side navigation
 * does not replay it — the component mounts once per document. While it runs
 * the body is scroll-locked (which also pauses Lenis) and `MotionProvider`
 * holds its reveals until `sevenpm:ready`.
 *
 * It makes no sound: a first load has had no gesture yet and the browser
 * would refuse the context, and a loader that only sometimes has audio is
 * worse than one that never does.
 *
 * The sheet is brand yellow, so everything on it is ink rather than white:
 * the figure, the corner labels and the bars, lit and unlit alike.
 */

/**
 * Resting heights for the meter, as a share of the tallest bar. A fixed table
 * rather than random numbers: a loader that looks different on every visit
 * cannot be art-directed, and `Math.random` in a component body is impure.
 */
const LEVELS = [
  0.32, 0.55, 0.41, 0.78, 0.6, 0.94, 0.48, 0.71, 0.36, 0.83, 0.52, 0.66, 0.29,
  0.88, 0.45, 0.74, 0.58, 0.97, 0.39, 0.63, 0.5, 0.81, 0.34, 0.69, 0.57, 0.91,
  0.43, 0.76, 0.3, 0.85, 0.54, 0.68, 0.37, 0.79, 0.61, 0.46, 0.72, 0.33, 0.86,
  0.49,
];

/** How far the count gets before it waits for the page itself. */
const HOLD_AT = 0.9;

/* Timings, in seconds. The climb was 1.4 and the whole intro was over in
   about two: too quick to read the meter, let alone the figure. */
const CLIMB = 2.6;
/** A beat at 90 even when the page is already loaded, so the hold shows. */
const HOLD_BEAT = 0.45;
const FINISH = 0.7;
const PEAK = 0.22;
const WIPE = 0.9;

export function Preloader() {
  // Rendered from the first frame so a first visit never flashes the page;
  // the decision to run or drop it is made on mount.
  const [phase, setPhase] = useState<"pending" | "run" | "done">("pending");
  const active = phase === "run";
  const root = useRef<HTMLDivElement>(null);
  const counter = useRef<HTMLSpanElement>(null);
  const meter = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const id = requestAnimationFrame(() => {
      if (reduce) {
        pending = false;
        document.dispatchEvent(new Event(READY_EVENT));
        setPhase("done");
      } else {
        setPhase("run");
      }
    });
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    if (!active) return;
    const el = root.current;
    const num = counter.current;
    const meterEl = meter.current;
    if (!el || !num || !meterEl) return;

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const bars = Array.from(
      meterEl.querySelectorAll<HTMLElement>("[data-pre-bar]"),
    );

    /* One value drives both readouts, which is what makes the meter a
       progress bar rather than a decoration that happens to run alongside
       one. A bar is lit once the progress passes its own share. */
    const state = { p: 0 };
    const lit = new Set<number>();
    const paint = () => {
      num.textContent = String(Math.round(state.p * 100)).padStart(2, "0");
      const count = Math.round(state.p * bars.length);
      bars.forEach((bar, index) => {
        if (index < count && !lit.has(index)) {
          lit.add(index);
          gsap.to(bar, {
            backgroundColor: "#18181b",
            duration: 0.25,
            ease: "power2.out",
          });
          /* Lit bars move. Each gets its own rate so the meter never
             marches in step. */
          gsap.to(bar, {
            scaleY: LEVELS[index % LEVELS.length],
            duration: 0.34 + (index % 5) * 0.08,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
          });
        }
      });
    };

    gsap.set(bars, { scaleY: 0.08, transformOrigin: "50% 100%" });

    const finish = () => {
      pending = false;
      document.body.style.overflow = previous;
      document.dispatchEvent(new Event(READY_EVENT));
      setPhase("done");
    };

    /* The release needs both: the meter at the hold, and the document
       loaded. Whichever lands second starts the last ten per cent, so a page
       that was ready before the loader finished climbing never snaps, and a
       slow one never shows 100 early. */
    let atHold = false;
    let loaded = document.readyState === "complete";
    let released = false;
    const maybeRelease = () => {
      if (!atHold || !loaded || released) return;
      released = true;
      release();
    };
    const onLoaded = () => {
      loaded = true;
      maybeRelease();
    };

    if (!loaded) window.addEventListener("load", onLoaded, { once: true });
    /* Nothing waits forever. */
    const failsafe = gsap.delayedCall(6, onLoaded);

    const tl = gsap.timeline({ onComplete: finish });

    tl.fromTo(
      "[data-pre-num]",
      { yPercent: 120, opacity: 0 },
      { yPercent: 0, opacity: 1, duration: 0.5, ease: "expo.out" },
      0,
    )
      .fromTo(
        "[data-pre-meta]",
        { y: 10, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: "power3.out", stagger: 0.06 },
        0.1,
      )
      /* Levels up to 90, then the page decides. */
      .to(
        state,
        { p: HOLD_AT, duration: CLIMB, ease: "power2.inOut", onUpdate: paint },
        0,
      )
      .call(() => {
        atHold = true;
        maybeRelease();
      })
      .addPause();

    /* The last ten per cent belongs to the document. */
    const release = () => {
      const rest = gsap.timeline({ delay: HOLD_BEAT });
      rest
        .to(state, {
          p: 1,
          duration: FINISH,
          ease: "power2.out",
          onUpdate: paint,
          onComplete: paint,
        })
        /* The peak: every bar to full, once. */
        .to(
          bars,
          { scaleY: 1, duration: PEAK, ease: "power2.out", overwrite: true },
          ">-0.05",
        )
        .to(
          "[data-pre-num], [data-pre-meta]",
          { y: -14, opacity: 0, duration: 0.45, ease: "power3.in" },
          ">0.15",
        )
        .to(
          el,
          { clipPath: "inset(0 0 100% 0)", duration: WIPE, ease: "expo.inOut" },
          "<0.1",
        )
        .add(() => tl.play());
    };

    return () => {
      tl.kill();
      failsafe.kill();
      gsap.killTweensOf(bars);
      window.removeEventListener("load", onLoaded);
      document.body.style.overflow = previous;
    };
  }, [active]);

  if (phase === "done") return null;

  return (
    <div
      ref={root}
      className="preloader fixed inset-0 z-[100] flex flex-col justify-between overflow-hidden bg-brand px-4 py-6 sm:px-6 xl:px-8 xl:py-12"
      aria-hidden
    >
      <div className="flex items-center justify-between">
        <span
          data-pre-meta
          className="font-[family-name:var(--font-display)] text-[13px] font-semibold uppercase tracking-[1.56px] text-[#18181b]/70"
        >
          More music
        </span>
        <span
          data-pre-meta
          className="font-[family-name:var(--font-display)] text-[13px] font-semibold uppercase tracking-[1.56px] text-[#18181b]/70"
        >
          More life
        </span>
      </div>

      {/* Full width. The meter is the progress bar, and a progress bar that
          stops short of the edges looks like it is missing something. */}
      <div className="flex w-full flex-col gap-6">
        {/* The figure centred over the meter, with its label under it. The
            two used to sit at opposite ends of the line, which read as a
            heading and a caption rather than as one readout. */}
        <div className="flex flex-col items-center gap-3">
          <span className="block overflow-hidden">
            <span
              ref={counter}
              data-pre-num
              className="block text-center font-daltown text-[clamp(72px,18vw,220px)] uppercase leading-[0.8] tabular-nums text-[#18181b]"
            >
              00
            </span>
          </span>
          <span
            data-pre-meta
            className="font-[family-name:var(--font-display)] text-[12px] font-bold uppercase leading-4 tracking-[3px] text-[#18181b]/70"
          >
            Soundcheck
          </span>
        </div>

        {/* The meter: forty bars, one per two and a half per cent. */}
        <div ref={meter} className="flex h-[54px] w-full items-end gap-[3px]">
          {LEVELS.map((level, index) => (
            <span
              key={index}
              data-pre-bar
              className="block flex-1 bg-[#18181b]/15"
              style={{ height: `${28 + level * 26}px` }}
            />
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span
          data-pre-meta
          className="font-[family-name:var(--font-display)] text-[12px] font-bold uppercase leading-4 tracking-[3px] text-[#18181b]/70"
        >
          Levels · stage · doors
        </span>
        <span
          data-pre-meta
          className="font-[family-name:var(--font-display)] text-[12px] font-bold uppercase leading-4 tracking-[3px] text-[#18181b]/70"
        >
          Casablanca
        </span>
      </div>
    </div>
  );
}
