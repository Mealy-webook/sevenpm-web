"use client";

import { useEffect, useRef, useState } from "react";

/**
 * The hand-drawn yellow loop around "NEWS" (Figma 2017:732, a 406 × 247
 * stroke rotated −4.1°). Inlined so the stroke can draw itself on the first
 * time it scrolls into view.
 */
export function Scribble() {
  const ref = useRef<SVGSVGElement>(null);
  const [drawn, setDrawn] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setDrawn(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <svg
      ref={ref}
      viewBox="0 0 410.454 251.126"
      width="406.041"
      height="246.716"
      className="scribble absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-[4.1deg] overflow-visible"
      data-drawn={drawn}
      fill="none"
      aria-hidden
    >
      <path
        d="M306.778 58.5116C151.671 -24.6194 9.42187 48.4088 2.7722 118.065C-16.266 317.494 450.289 271.354 405.17 98.0281C387.66 30.7646 238.525 -27.7254 61.0126 19.0666"
        stroke="#FBEB1C"
        strokeWidth="4.40942"
        strokeLinecap="round"
        pathLength="1"
      />
    </svg>
  );
}
