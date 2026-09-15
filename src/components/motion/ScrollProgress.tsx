"use client";

import { useEffect, useRef } from "react";

/**
 * A hairline of brand yellow across the top of the page, filling as you go.
 *
 * It scales an always-present bar rather than animating width, so the browser
 * can keep it on the compositor and never lays the page out to draw it. The
 * bar is fixed, painted above the sticky header, and lets every pointer event
 * straight through.
 *
 * The read is deliberately passive — a scroll listener, not a ScrollTrigger.
 * The page already runs Lenis and a stack of pinned triggers; adding another
 * one to move a 2px rule would be paying for machinery twice.
 */
export function ScrollProgress() {
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = bar.current;
    if (!el) return;

    let frame = 0;

    const paint = () => {
      frame = 0;
      const doc = document.documentElement;
      const travel = doc.scrollHeight - window.innerHeight;
      /* A page that does not scroll has no progress to report. */
      const progress = travel > 0 ? Math.min(1, window.scrollY / travel) : 0;
      el.style.scale = `${progress.toFixed(4)} 1`;
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(paint);
    };

    paint();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[2px]"
    >
      <div
        ref={bar}
        className="h-full w-full origin-left bg-brand"
        style={{ scale: "0 1" }}
      />
    </div>
  );
}
