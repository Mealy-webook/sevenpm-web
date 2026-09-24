"use client";

import { useEffect, useRef, useState } from "react";

import styles from "./HomeMarquee.module.css";

/**
 * The kinetic band between the festivals and the founding block — Figma
 * 2465:6936.
 *
 * Daltown at 120 on a 90 line box, the line alternating between an outlined
 * "More music" and a solid "More life". The comp draws it as a static
 * overflowing row; here it travels, which is the only thing a band of
 * repeated words can usefully do.
 *
 * The loop works by holding an even number of identical units and animating
 * the track to −50%: at the end of the cycle the second half is sitting
 * exactly where the first half started, so the jump back is invisible.
 *
 * That only holds if half the track is at least as wide as the screen. With
 * a fixed four copies it was not — half the track measured 701px against a
 * 744px viewport, so the tail ran out mid-cycle and left black behind it.
 * The count is measured instead: enough units to cover two screens, rounded
 * up to an even number, re-measured when the band resizes.
 *
 * Each unit carries its own trailing gap rather than the track using
 * `gap`, so the track is exactly `units × unitWidth` and −50% lands on a
 * unit boundary rather than half a gap off it.
 */

const WORDS = ["More music", "More life"];

export function HomeMarquee({ reverse = false }: { reverse?: boolean }) {
  const band = useRef<HTMLDivElement>(null);
  const unit = useRef<HTMLDivElement>(null);
  const [units, setUnits] = useState(4);

  useEffect(() => {
    const bandEl = band.current;
    if (!bandEl) return;

    /* Measured from the observer rather than called here: setting state
       synchronously inside an effect cascades an extra render, and the
       observer delivers a first entry on its own anyway. */
    const observer = new ResizeObserver(() => {
      const unitWidth = unit.current?.getBoundingClientRect().width ?? 0;
      if (!unitWidth) return;
      const needed = Math.ceil((bandEl.clientWidth * 2) / unitWidth);
      setUnits(Math.max(4, needed + (needed % 2)));
    });
    observer.observe(bandEl);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      aria-hidden
      className="relative flex overflow-hidden py-14 xl:py-20"
    >
      <div
        ref={band}
        className={styles.band}
        data-direction={reverse ? "reverse" : undefined}
      >
        <div className={styles.track}>
          {Array.from({ length: units }, (_, copy) => (
            <div
              key={copy}
              ref={copy === 0 ? unit : undefined}
              data-unit
              className={styles.unit}
            >
              {WORDS.map((word, index) => (
                <span
                  key={word}
                  className={`${styles.word} ${
                    index % 2 ? "text-white" : styles.ghost
                  }`}
                >
                  {word}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
