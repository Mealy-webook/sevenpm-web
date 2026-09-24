"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { HeroHeadline } from "@/components/home/HeroHeadline";
import { StageMeter } from "@/components/motion/StageMeter";
import { festivals, homeCopy, homeStoryFounded } from "@/data/home";

/**
 * The hero with the reference's background: a column of oversized words
 * travelling behind the content while the screen holds.
 *
 * In the Lagunitas shot the giant word is solid and the product sits on top
 * of it. That works because the thing in front is opaque. Here the thing in
 * front is the headline, and solid type behind live type is unreadable — so
 * the band runs at low opacity. It is the same movement; it has to be a
 * watermark rather than a poster, and that is a constraint of putting it
 * behind words rather than behind an object.
 *
 * The words are the festivals plus the two the site already says about
 * itself, so the band reads as a bill of what SEVENPM puts on.
 */

const BAND = [
  homeStoryFounded,
  ...festivals.map((festival) => festival.name),
  "More life",
];

export function KineticHero() {
  const section = useRef<HTMLElement>(null);
  const screen = useRef<HTMLDivElement>(null);
  const band = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sectionEl = section.current;
    const screenEl = screen.current;
    const bandEl = band.current;
    if (!sectionEl || !screenEl || !bandEl) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        /* The column is taller than the screen; it travels by exactly the
           difference, so the last word lands where the first one started.
           Measured at refresh so a resize re-reads it. */
        const travel = () =>
          Math.max(0, bandEl.scrollHeight - screenEl.clientHeight);

        const tween = gsap.fromTo(
          bandEl,
          { y: 0 },
          {
            y: () => -travel(),
            ease: "none",
            scrollTrigger: {
              trigger: sectionEl,
              start: "top top",
              end: "bottom bottom",
              pin: screenEl,
              scrub: 0.7,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          },
        );

        return () => {
          tween.scrollTrigger?.kill();
          tween.kill();
        };
      });
    }, sectionEl);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={section} className="relative isolate h-[220vh]">
      <div
        ref={screen}
        className="relative flex h-svh w-full items-center justify-center overflow-hidden"
      >
        {/* The band. Behind everything, cropped by the screen, and running
            wider than the frame so every word is cut by both edges the way
            the reference's are. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 z-0 flex flex-col items-center"
          ref={band}
        >
          {BAND.map((word) => (
            <span
              key={word}
              className="whitespace-nowrap font-daltown uppercase leading-[0.82] tracking-[0.02em] text-white/[0.09]"
              style={{
                fontSize: `clamp(80px, calc(118vw / ${(word.length * 0.44).toFixed(2)}), 340px)`,
              }}
            >
              {word}
            </span>
          ))}
        </div>

        <div className="shell relative z-10 flex w-full flex-col items-center gap-4">
          <HeroHeadline />
          <p
            className="max-w-[786px] text-center font-[family-name:var(--font-display)] text-[18px] leading-[1.6] text-content-secondary"
            data-split="lines"
            data-reveal-delay="0.12"
          >
            {homeCopy.intro}
          </p>
        </div>

        <StageMeter className="absolute bottom-10 right-[var(--shell-gutter)] z-10 hidden items-end gap-0.5 xl:flex" />
      </div>
    </section>
  );
}
