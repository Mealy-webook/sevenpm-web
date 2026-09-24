"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";

import FaultyTerminal from "@/components/ui/FaultyTerminal";

/**
 * The hero's ground: React Bits' FaultyTerminal, tinted brand.
 *
 * Two things it needs that the component does not do for itself.
 *
 * It is a full-screen fragment shader on a rAF loop, and the hero is the
 * top of a long page — left running it would burn a GPU core for the whole
 * scroll. An observer pauses it the moment the hero leaves the viewport.
 *
 * And it holds nothing back on its own, so a scrim goes over it: the
 * headline and the standfirst sit on this, and a terminal at full strength
 * behind live type is unreadable.
 */
const QUERY = "(prefers-reduced-motion: reduce)";

/* Subscribed rather than read in an effect: setting state synchronously from
   an effect cascades a second render, and the server has no media query to
   read at all. */
function subscribe(onChange: () => void) {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

export function HeroTerminal() {
  const holder = useRef<HTMLDivElement>(null);
  const [offscreen, setOffscreen] = useState(false);

  const reduced = useSyncExternalStore(
    subscribe,
    useCallback(() => window.matchMedia(QUERY).matches, []),
    useCallback(() => false, []),
  );

  useEffect(() => {
    const el = holder.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setOffscreen(!entry.isIntersecting),
      { rootMargin: "120px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const paused = reduced || offscreen;

  return (
    <div ref={holder} aria-hidden className="absolute inset-0 z-0">
      <FaultyTerminal
        scale={1.6}
        gridMul={[2, 1]}
        digitSize={1.3}
        timeScale={0.4}
        pause={paused}
        scanlineIntensity={0.5}
        glitchAmount={1}
        flickerAmount={0.8}
        noiseAmp={1}
        chromaticAberration={0}
        dither={0.4}
        curvature={0.12}
        tint="#fbeb1c"
        mouseReact
        mouseStrength={0.35}
        pageLoadAnimation
        brightness={0.62}
      />

      {/* The scrim. Heaviest through the middle band, where the headline and
          the standfirst sit. */}
      <span className="pointer-events-none absolute inset-0 block bg-[radial-gradient(ellipse_70%_55%_at_50%_45%,rgba(11,11,14,0.88),rgba(11,11,14,0.45)_60%,rgba(11,11,14,0.75))]" />
    </div>
  );
}
