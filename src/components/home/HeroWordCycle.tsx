"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

import { READY_EVENT, introPending } from "@/components/motion/Preloader";

/**
 * The hero's second line, turning between its words: MORE MUSIC, then
 * MORE LIFE — the brand line, "More music, more life", said one half at a
 * time.
 *
 * The line is a one-word mask. Every few seconds the word in it rolls up
 * and out while the next rolls in from below, on the same expo curve the
 * window in MORE opens on. The mask's width eases to the incoming word's
 * in the same move, so the centred headline never jumps when a short word
 * replaces a long one.
 *
 * It waits for the preloader, as the window does — a turn that starts
 * behind the loading sheet is already mid-word when the sheet lifts — and
 * holds still for reduced motion, showing the first word.
 *
 * Decorative: the heading's accessible text is the whole line, so the
 * words here are hidden from assistive tech by the headline's own
 * `aria-hidden`.
 */
/* How far a word travels to leave the mask: past the extra room the mask
   keeps above and below the line, so no glyph edge lingers in view. */
const OUT = 150;

export function HeroWordCycle({
  words,
  hold = 2.4,
}: {
  words: string[];
  /** Seconds each word stays before the next one rolls in. */
  hold?: number;
}) {
  const mask = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = mask.current;
    if (!el || words.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const items = Array.from(el.querySelectorAll<HTMLElement>("[data-word]"));
    let tl: gsap.core.Timeline | null = null;
    let start: (() => void) | null = null;

    const ctx = gsap.context(() => {
      /* Everything but the first word waits below the line. */
      gsap.set(items.slice(1), { yPercent: OUT });
      gsap.set(el, { width: items[0].offsetWidth });

      start = () => {
        tl = gsap.timeline({ repeat: -1, delay: hold });
        items.forEach((current, i) => {
          const next = items[(i + 1) % items.length];
          tl!
            .to(current, { yPercent: -OUT, duration: 0.8, ease: "expo.inOut" })
            .fromTo(
              next,
              { yPercent: OUT },
              { yPercent: 0, duration: 0.8, ease: "expo.inOut" },
              "<",
            )
            .to(
              el,
              {
                width: () => next.offsetWidth,
                duration: 0.8,
                ease: "expo.inOut",
              },
              "<",
            )
            .set(current, { yPercent: OUT })
            .to({}, { duration: hold });
        });
      };

      if (introPending()) {
        document.addEventListener(READY_EVENT, start, { once: true });
      } else {
        start();
      }
    }, el);

    /* Fonts can land after mount and change the words' widths. */
    const refit = () => {
      const shown =
        items.find((w) => Number(gsap.getProperty(w, "yPercent")) === 0) ??
        items[0];
      gsap.set(el, { width: shown.offsetWidth });
    };
    document.fonts?.ready.then(refit).catch(() => {});
    window.addEventListener("resize", refit);

    return () => {
      window.removeEventListener("resize", refit);
      if (start) document.removeEventListener(READY_EVENT, start);
      tl?.kill();
      ctx.revert();
    };
  }, [words, hold]);

  return (
    /* Daltown's glyphs run past its tight 0.723em line box, so the mask
       keeps 0.2em of room above and below — padding, cancelled by an equal
       negative margin, so the line's layout does not move. */
    <span
      ref={mask}
      className="relative -my-[0.2em] inline-block overflow-hidden whitespace-nowrap py-[0.2em] align-top"
    >
      {words.map((word, i) => (
        <span
          key={word}
          data-word
          className={
            /* `w-max`: each word is as wide as itself, never the mask's
               width — the mask is sized from these. */
            i === 0
              ? "relative block w-max"
              : "absolute left-1/2 top-[0.2em] block w-max -translate-x-1/2"
          }
        >
          {word}
        </span>
      ))}
    </span>
  );
}
