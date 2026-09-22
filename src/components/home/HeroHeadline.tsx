"use client";

import gsap from "gsap";
import { useEffect, useRef } from "react";

import { StagePulse } from "@/components/motion/StagePulse";
import { homeCopy } from "@/data/home";

/**
 * "MORE" and then a word that keeps changing — MUSIC, then LIFE, then back.
 * One line from 640px up, stacked into two below it where there is no width
 * for both. The
 * brand line is the same either way round; this just says it a word at a time
 * instead of all at once, so the hero is never quite still.
 *
 * The whole block also pulses with the music: `stageAudio` hands over the real
 * low-band level while the festival row's preview is playing, and a 122 BPM
 * house beat when it is not. The lighting rig behind the hero reads the same
 * clock, so the headline and the beams hit together.
 *
 * Two elements, two jobs. GSAP owns the characters' transforms for the swap;
 * `StagePulse` only ever writes `scale` on the wrapper above them. Sharing a
 * node between the two would have them overwriting each other every frame.
 *
 * `data-no-split` keeps MotionProvider's character split off this heading — it
 * would re-split the words mid-swap. The entrance below is the same motion
 * that split would have given it.
 */

/** Seconds a word holds before the next one takes over. */
const HOLD = 2.6;

const letters = (word: string) =>
  [...word].map((char, i) => (
    <span key={`${char}-${i}`} className="inline-block" data-char>
      {char}
    </span>
  ));

export function HeroHeadline() {
  const root = useRef<HTMLHeadingElement>(null);

  /* Entrance, then the word cycle. */
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const chars = (scope: Element) => scope.querySelectorAll("[data-char]");
    const lead = el.querySelector("[data-lead]");
    const slots = Array.from(el.querySelectorAll<HTMLElement>("[data-word]"));
    if (!lead || slots.length < 2) return;

    const ctx = gsap.context(() => {
      gsap.set(chars(lead), { yPercent: 60, opacity: 0, rotate: 4 });
      slots.forEach((slot, i) => {
        gsap.set(chars(slot), {
          yPercent: i === 0 ? 60 : 55,
          opacity: 0,
          rotate: i === 0 ? 4 : 8,
        });
      });

      const settle = {
        yPercent: 0,
        opacity: 1,
        rotate: 0,
        duration: 1.1,
        ease: "expo.out",
        stagger: 0.022,
      };

      gsap
        .timeline()
        .to(chars(lead), settle)
        .to(chars(slots[0]), settle, 0.12);

      /* One leg per word, so the cycle works for any number of them. */
      const cycle = gsap.timeline({ repeat: -1, delay: HOLD });
      slots.forEach((slot, i) => {
        const next = slots[(i + 1) % slots.length];
        cycle
          /* Short travel and an early fade: a character leaving is clear of
             the ink before it reaches the line above it. */
          .to(chars(slot), {
            yPercent: -45,
            rotate: -7,
            opacity: 0,
            duration: 0.42,
            ease: "power2.in",
            stagger: 0.02,
          })
          .fromTo(
            chars(next),
            { yPercent: 55, rotate: 8, opacity: 0 },
            {
              yPercent: 0,
              rotate: 0,
              opacity: 1,
              duration: 0.9,
              ease: "expo.out",
              stagger: 0.026,
            },
            "-=0.18",
          )
          .to({}, { duration: HOLD });
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <h1
      ref={root}
      className="display-text hero-headline w-full"
      data-no-split
      aria-label={homeCopy.heroTitle}
    >
      <StagePulse className="origin-center">
        <span
          aria-hidden
          className="flex flex-col items-center justify-center whitespace-nowrap sm:flex-row sm:gap-[0.2em]"
        >
          <span data-lead>{letters(homeCopy.heroLead)}</span>
          {/* Every word shares one grid cell, so the line holds the width of
              the longest of them and nothing reflows mid-swap. */}
          <span className="grid justify-items-center">
            {homeCopy.heroWords.map((word) => (
              <span
                key={word}
                data-word
                className="col-start-1 row-start-1 block whitespace-nowrap text-brand"
              >
                {letters(word)}
              </span>
            ))}
          </span>
        </span>
      </StagePulse>
    </h1>
  );
}
