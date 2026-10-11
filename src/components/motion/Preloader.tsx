"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

export const READY_EVENT = "sevenpm:ready";

/**
 * True only while an intro is actually going to play.
 *
 * It starts false because the loader is no longer mounted site-wide: it lives
 * on the homepage alone. `MotionProvider` reads this to decide whether to hold
 * its reveals, and on every other route there is no loader to wait for — were
 * this to default to true, nothing would ever dispatch `sevenpm:ready` and the
 * page would sit at its from-state forever.
 *
 * The loader claims it during render (see `claimIntro`), which is before any
 * layout effect runs, so `MotionProvider` still sees the right answer.
 */
let pending = false;

export function introPending() {
  return pending;
}

/** Session key for "this visitor has already seen the intro". */
const VISIT_KEY = "sevenpm:intro-seen";

/**
 * Has the intro already played this visit?
 *
 * `sessionStorage` rather than `localStorage`: "once per visit" means once per
 * tab session, so closing the tab and coming back tomorrow earns the front
 * door again. It can throw outright in a private window or with site data
 * blocked, so every access is wrapped — a storage failure means the intro
 * plays, which is the old behaviour and the safe one.
 */
function introSeen() {
  try {
    return sessionStorage.getItem(VISIT_KEY) === "1";
  } catch {
    return false;
  }
}

function markIntroSeen() {
  try {
    sessionStorage.setItem(VISIT_KEY, "1");
  } catch {
    /* Nothing to do: the intro simply plays again next time. */
  }
}

/**
 * Run before the loader's own markup is parsed, so a repeat visit never shows
 * a frame of yellow before React hydrates and takes it away. Paired with the
 * `html[data-intro-seen] .preloader { display: none }` rule in globals.css.
 */
export const INTRO_FLAG_SCRIPT = `try{if(sessionStorage.getItem('${VISIT_KEY}')==='1')document.documentElement.dataset.introSeen='1'}catch(e){}`;

/**
 * Called by the loader as it renders, to tell `MotionProvider` that a hold is
 * coming. Render, not an effect: every render in the tree finishes before the
 * first layout effect, so this lands in time; an effect would not.
 */
function claimIntro() {
  if (typeof window === "undefined") return;
  if (introSeen()) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  pending = true;
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
 * It plays once per visit, on the homepage, and nowhere else. The component
 * is mounted by `src/app/page.tsx` rather than the root layout, so every
 * other route — the booking journey above all — never renders it at all and
 * cannot be covered by it. Within a visit, `sessionStorage` keeps it from
 * replaying on a refresh or on a later return to the homepage; a new tab is a
 * new visit and sees it again. While it runs the body is scroll-locked (which
 * also pauses Lenis) and `MotionProvider` holds its reveals until
 * `sevenpm:ready`.
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
   about two: too quick to read the meter, let alone the figure.
   
   The tail was never seen until the release was fixed — the loader used to
   cut out at 90 — so these were tuned blind. Trimmed on first sight of them:
   at their old values the page did not begin to lift until about 4.2s, which
   is slower than the cut it replaced. The hero now starts moving at roughly
   the moment the old build simply vanished. */
const CLIMB = 2;
/** A beat at 90 even when the page is already loaded, so the hold shows. */
const HOLD_BEAT = 0.12;
const FINISH = 0.45;
const PEAK = 0.2;
const WIPE = 0.7;

export function Preloader() {
  // Rendered from the first frame so a first visit never flashes the page;
  // the decision to run or drop it is made on mount.
  const [phase, setPhase] = useState<"pending" | "run" | "done">("pending");
  const active = phase === "run";
  const root = useRef<HTMLDivElement>(null);
  const counter = useRef<HTMLSpanElement>(null);
  const meter = useRef<HTMLDivElement>(null);

  /* Declared during render so `MotionProvider` knows whether to hold before
     its layout effect runs. Calling it from an effect would be a frame late
     and the hero would have revealed itself behind the sheet. */
  claimIntro();

  useEffect(() => {
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    /* Skipped when the visitor has had it already this session, or asked for
       less motion. The page still has to be handed over in both cases —
       `MotionProvider` is waiting on the same event either way. */
    const skip = reduce || introSeen();
    const id = requestAnimationFrame(() => {
      if (skip) {
        pending = false;
        document.dispatchEvent(new Event(READY_EVENT));
        setPhase("done");
      } else {
        /* Marked as it starts, not as it ends: a visitor who reloads midway
           through has still seen the front door and should not be shown it
           again. */
        markIntroSeen();
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

    /* Hand the page over to its own motion.
     *
     * Fired as the sheet starts to lift, not once it has gone: the reveals
     * take about a second to play, so waiting for the wipe to finish left a
     * beat of bare page before the headline moved. Starting them behind the
     * sheet means the hero is already in motion by the time it clears.
     *
     * Idempotent — the wipe calls it, and `finish` calls it again in case the
     * timeline is cut short. */
    let handedOff = false;
    const handOff = () => {
      if (handedOff) return;
      handedOff = true;
      pending = false;
      document.dispatchEvent(new Event(READY_EVENT));
    };

    const finish = () => {
      handOff();
      document.body.style.overflow = previous;
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

    /* No `onComplete: finish` here. The climb ends on `.addPause()`, and the
       playhead reaching that end fired onComplete anyway — so the loader tore
       itself down at 90 and the release never ran: no last ten per cent, no
       peak, and no wipe. The sheet simply cut out. `finish` belongs at the end
       of the release, which is where it is now. */
    const tl = gsap.timeline();

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
          { y: -14, opacity: 0, duration: 0.4, ease: "power3.in" },
          ">0",
        )
        .to(
          el,
          {
            clipPath: "inset(0 0 100% 0)",
            duration: WIPE,
            ease: "expo.inOut",
            /* On the tween itself rather than as a callback positioned at
               "<": the page is handed over the instant the sheet starts to
               lift, so the hero plays behind it instead of after it. */
            onStart: handOff,
          },
          "<0.1",
        )
        .add(finish);
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
        {/* The figure, centred over the meter. */}
        <div className="flex flex-col items-center">
          <span className="block overflow-hidden">
            <span
              ref={counter}
              data-pre-num
              className="block text-center font-daltown text-[clamp(72px,18vw,220px)] uppercase leading-[0.8] tabular-nums text-[#18181b]"
            >
              00
            </span>
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
