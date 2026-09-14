"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

export const SEEN_KEY = "sevenpm:seen";
export const READY_EVENT = "sevenpm:ready";

/**
 * First-visit intro: a counter runs to 100 under the SEVENPM wordmark, then
 * the sheet lifts. Shown once per session — repeat visits within the tab go
 * straight to the page. While it runs the body is scroll-locked (which also
 * pauses Lenis) and `MotionProvider` holds its reveals until `sevenpm:ready`.
 */
export function Preloader() {
  // Rendered from the first frame so a first visit never flashes the page;
  // the decision to run or drop it is made on mount.
  const [phase, setPhase] = useState<"pending" | "run" | "done">("pending");
  const active = phase === "run";
  const root = useRef<HTMLDivElement>(null);
  const counter = useRef<HTMLSpanElement>(null);
  const bar = useRef<HTMLDivElement>(null);

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
    if (!el || !num) return;

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

    tl.fromTo(
      "[data-pre-mark]",
      { yPercent: 30, opacity: 0 },
      { yPercent: 0, opacity: 1, duration: 0.9, ease: "expo.out" },
      0,
    )
      .to(
        state,
        {
          n: 100,
          duration: 1.4,
          ease: "power2.inOut",
          onUpdate: () => {
            num.textContent = String(Math.round(state.n)).padStart(3, "0");
          },
        },
        0.1,
      )
      .fromTo(
        bar.current,
        { scaleX: 0 },
        { scaleX: 1, duration: 1.4, ease: "power2.inOut" },
        0.1,
      )
      .to(
        "[data-pre-mark], [data-pre-meta]",
        { yPercent: -40, opacity: 0, duration: 0.5, ease: "power3.in" },
        1.55,
      )
      .to(
        el,
        { clipPath: "inset(0 0 100% 0)", duration: 0.9, ease: "expo.inOut" },
        1.7,
      );

    return () => {
      tl.kill();
      document.body.style.overflow = previous;
    };
  }, [active]);

  if (phase === "done") return null;

  return (
    <div
      ref={root}
      className="preloader fixed inset-0 z-[100] flex flex-col justify-between bg-bg-primary p-6 xl:p-12"
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
      <div className="flex w-full items-end justify-between gap-8">
        <div className="w-[60%] max-w-[900px]" data-pre-mark>
          <Image
            src="/assets/wordmark.svg"
            alt=""
            width={1272}
            height={238}
            priority
            className="h-auto w-full"
          />
        </div>
        <span
          ref={counter}
          className="font-daltown text-[96px] leading-none text-brand xl:text-[160px]"
          data-pre-meta
        >
          000
        </span>
      </div>
      <div ref={bar} className="h-px w-full origin-left bg-brand" />
    </div>
  );
}
