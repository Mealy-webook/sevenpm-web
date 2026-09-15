"use client";

import gsap from "gsap";
import { useEffect, useRef } from "react";

/**
 * Two ways of changing a number without it simply blinking to the new one.
 *
 * `Odometer` is a strip of every digit it could show, slid to the right one —
 * a real wheel rather than a crossfade, which is why it needs to know the
 * ceiling. Counts here are small and capped, so the whole strip is cheaper
 * than any of the ways of faking it.
 *
 * `TickingValue` travels between two figures, handing each step back to the
 * caller's formatter so currency and separators stay however the design set
 * them. Money should land on its new total, not cut to it.
 *
 * Both render the finished value on the server and settle on it if they never
 * run, which is the only thing that matters about a price or a quantity.
 */

export function Odometer({
  value,
  /** Highest value the wheel has to carry. */
  max,
  /** Line box of one digit, px — the strip steps by exactly this. */
  step = 22,
  className = "",
}: {
  value: number;
  max: number;
  step?: number;
  className?: string;
}) {
  return (
    <span className={`relative block overflow-hidden ${className}`}>
      {/* The number itself, for anything that reads rather than looks. */}
      <span className="sr-only">{value}</span>
      <span
        aria-hidden
        className="odometer-strip block"
        style={{ height: step, translate: `0 ${-value * step}px` }}
      >
        {Array.from({ length: max + 1 }, (_, digit) => (
          <span
            key={digit}
            className="block text-center"
            style={{ height: step, lineHeight: `${step}px` }}
          >
            {digit}
          </span>
        ))}
      </span>
    </span>
  );
}

export function TickingValue({
  value,
  format,
  className = "",
}: {
  value: number;
  /** Must be stable across renders — a module-level function, not a closure. */
  format: (value: number) => string;
  className?: string;
}) {
  const el = useRef<HTMLSpanElement>(null);
  const from = useRef(value);

  useEffect(() => {
    const node = el.current;
    if (!node) return;

    const start = from.current;
    from.current = value;
    if (start === value) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      node.textContent = format(value);
      return;
    }

    const travelling = { n: start };
    const tween = gsap.to(travelling, {
      n: value,
      duration: 0.55,
      ease: "power2.out",
      onUpdate: () => {
        node.textContent = format(travelling.n);
      },
      onComplete: () => {
        node.textContent = format(value);
      },
    });

    return () => {
      /* Interrupted mid-count: the next change starts from where this one got
         to, so a fast series of taps reads as one continuous figure. */
      from.current = travelling.n;
      tween.kill();
    };
  }, [value, format]);

  return (
    <span ref={el} className={className}>
      {format(value)}
    </span>
  );
}
