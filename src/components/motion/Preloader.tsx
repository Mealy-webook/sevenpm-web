"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

export const SEEN_KEY = "sevenpm:seen";
export const READY_EVENT = "sevenpm:ready";

/**
 * First-visit intro: the needle drop.
 *
 * The deck's record sits on a black stage. It spins up to 33⅓, the tonearm
 * swings in and lands, and a ring of brand light draws itself round the disc
 * as the count runs to 100 — the load is one revolution's worth of waiting.
 * When the ring closes the sheet lifts and the site is, in effect, playing.
 * It is the same record, label and arm the event page's deck uses, at the
 * deck's own geometry, so the hero it lifts onto reads as a continuation and
 * not a second idea.
 *
 * Shown once per session — repeat visits within the tab go straight to the
 * page. While it runs the body is scroll-locked (which also pauses Lenis)
 * and `MotionProvider` holds its reveals until `sevenpm:ready`.
 *
 * It makes no sound: a first load has had no gesture yet and the browser
 * would refuse the context, and a loader that only sometimes has audio is
 * worse than one that never does.
 */

/* The deck's own numbers (VinylCarousel): a 612 disc, a 345 label, and the
   arm box placed off the disc's top-left corner. The stage is 800 × 680 with
   the disc dropped 68 so the arm's pivot clears the top. */
const DISC = 612;
const LABEL = 345;
const LABEL_INSET = (DISC - LABEL) / 2;
const DISC_TOP = 68;
const ARM = { left: 391, top: 3, width: 396.053, height: 450.136 };
const ARM_REST = 15;
const ARM_PLAY = 9;
const SPIN_SECONDS = 60 / (100 / 3);
/* The ring sits just outside the disc. */
const RING_R = DISC / 2 + 22;
const RING_C = 2 * Math.PI * RING_R;

export function Preloader() {
  // Rendered from the first frame so a first visit never flashes the page;
  // the decision to run or drop it is made on mount.
  const [phase, setPhase] = useState<"pending" | "run" | "done">("pending");
  const active = phase === "run";
  const root = useRef<HTMLDivElement>(null);
  const counter = useRef<HTMLSpanElement>(null);
  const record = useRef<HTMLDivElement>(null);
  const platter = useRef<HTMLDivElement>(null);
  const arm = useRef<HTMLDivElement>(null);
  const ring = useRef<SVGCircleElement>(null);

  useEffect(() => {
    let show = false;
    try {
      show = !sessionStorage.getItem(SEEN_KEY);
    } catch {
      show = false;
    }
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const id = requestAnimationFrame(() => {
      if (!show || reduce) {
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
    if (!el || !num || !platter.current || !arm.current || !ring.current) {
      return;
    }

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const state = { n: 0 };
    const tl = gsap.timeline({
      onComplete: () => {
        try {
          sessionStorage.setItem(SEEN_KEY, "1");
        } catch {
          /* private mode */
        }
        document.body.style.overflow = previous;
        document.dispatchEvent(new Event(READY_EVENT));
        setPhase("done");
      },
    });

    /* The platter turns for the whole intro. It starts stopped and is eased
       up to speed the way the deck does it — a record does not snap to
       33⅓ — and the timeline runs its own clock alongside. */
    const spin = gsap.to(platter.current, {
      rotation: "+=360",
      duration: SPIN_SECONDS,
      ease: "none",
      repeat: -1,
    });
    spin.timeScale(0);

    tl.fromTo(
      record.current,
      { scale: 0.92, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.8, ease: "expo.out" },
      0,
    )
      .fromTo(
        "[data-pre-meta]",
        { y: 12, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: "power3.out", stagger: 0.06 },
        0.1,
      )
      /* Spin up. */
      .to(spin, { timeScale: 1, duration: 1, ease: "power2.in" }, 0.3)
      /* The arm comes across from its rest and lands: a small lift while it
         travels, then down onto the groove. */
      .fromTo(
        arm.current,
        { rotation: ARM_REST, y: -10, scale: 1.02 },
        { rotation: ARM_PLAY, duration: 0.7, ease: "power2.inOut" },
        0.55,
      )
      .to(arm.current, { y: 0, scale: 1, duration: 0.35, ease: "power2.in" }, 1.1)
      /* One revolution of waiting: the ring closes and the count runs. */
      .fromTo(
        ring.current,
        { strokeDashoffset: RING_C },
        { strokeDashoffset: 0, duration: 1.9, ease: "power2.inOut" },
        0.4,
      )
      .to(
        state,
        {
          n: 100,
          duration: 1.9,
          ease: "power2.inOut",
          onUpdate: () => {
            num.textContent = String(Math.round(state.n)).padStart(3, "0");
          },
        },
        0.4,
      )
      /* Everything but the record leaves, then the sheet lifts off it. */
      .to(
        "[data-pre-meta]",
        { y: -14, opacity: 0, duration: 0.45, ease: "power3.in" },
        2.35,
      )
      .to(ring.current, { opacity: 0, duration: 0.3 }, 2.35)
      .to(
        el,
        { clipPath: "inset(0 0 100% 0)", duration: 0.9, ease: "expo.inOut" },
        2.5,
      );

    return () => {
      tl.kill();
      spin.kill();
      document.body.style.overflow = previous;
    };
  }, [active]);

  if (phase === "done") return null;

  return (
    <div
      ref={root}
      className="preloader fixed inset-0 z-[100] flex flex-col justify-between overflow-hidden bg-bg-primary p-6 xl:p-12"
      aria-hidden
    >
      <div className="flex items-center justify-between" data-pre-meta>
        <span className="font-[family-name:var(--font-display)] text-[13px] font-semibold uppercase tracking-[1.56px] text-content-secondary">
          More music
        </span>
        <span className="font-[family-name:var(--font-display)] text-[13px] font-semibold uppercase tracking-[1.56px] text-content-secondary">
          More life
        </span>
      </div>

      {/* The stage: fixed geometry, scaled to fit whatever is left between
          the two rows. */}
      <div className="pre-stage relative mx-auto" ref={record}>
        <div
          className="absolute left-0 top-0"
          style={{ width: 800, height: 680, transformOrigin: "top left" }}
        >
          {/* Ring of light, just outside the disc. */}
          <svg
            className="absolute"
            style={{
              left: DISC / 2 - RING_R,
              top: DISC_TOP + DISC / 2 - RING_R,
              width: RING_R * 2,
              height: RING_R * 2,
            }}
            viewBox={`0 0 ${RING_R * 2} ${RING_R * 2}`}
          >
            <circle
              cx={RING_R}
              cy={RING_R}
              r={RING_R - 1}
              fill="none"
              stroke="rgba(255,255,255,0.06)"
              strokeWidth="1"
            />
            <circle
              ref={ring}
              cx={RING_R}
              cy={RING_R}
              r={RING_R - 1}
              fill="none"
              stroke="var(--color-brand)"
              strokeWidth="2"
              strokeLinecap="butt"
              strokeDasharray={RING_C}
              strokeDashoffset={RING_C}
              transform={`rotate(-90 ${RING_R} ${RING_R})`}
            />
          </svg>

          {/* The record. The platter is what turns. */}
          <div
            className="absolute left-0"
            style={{ top: DISC_TOP, width: DISC, height: DISC }}
          >
            <div ref={platter} className="relative size-full">
              <Image
                src="/assets/hero-vinyl.png"
                alt=""
                width={DISC}
                height={DISC}
                priority
                className="object-cover"
                style={{ width: DISC, height: DISC }}
              />
              <Image
                src="/assets/hero-vinyl-label.png"
                alt=""
                width={LABEL}
                height={LABEL}
                priority
                className="absolute rounded-full object-cover"
                style={{
                  left: LABEL_INSET,
                  top: LABEL_INSET,
                  width: LABEL,
                  height: LABEL,
                }}
              />
            </div>
          </div>

          {/* The tonearm, at the deck's own offset from the disc. */}
          <div
            className="pointer-events-none absolute flex items-center justify-center"
            style={{
              left: ARM.left,
              top: ARM.top,
              width: ARM.width,
              height: ARM.height,
            }}
          >
            <div ref={arm}>
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
        </div>
      </div>

      <div className="flex w-full items-end justify-between gap-8">
        <div className="w-[34%] max-w-[420px]" data-pre-meta>
          <Image
            src="/assets/wordmark.svg"
            alt=""
            width={1272}
            height={238}
            priority
            className="h-auto w-full"
          />
        </div>
        <div className="flex flex-col items-end gap-2" data-pre-meta>
          <span
            ref={counter}
            className="font-daltown text-[72px] leading-none text-brand xl:text-[120px]"
          >
            000
          </span>
          <span className="font-[family-name:var(--font-display)] text-[13px] font-semibold uppercase tracking-[1.56px] text-content-secondary">
            33⅓ rpm
          </span>
        </div>
      </div>
    </div>
  );
}
