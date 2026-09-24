"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import {
  festivals,
  homeCopy,
  homePillars,
  homeStoryStatement,
} from "@/data/home";

/**
 * Kinetic intro — the Lagunitas IPA treatment (Sleekmesh), applied here.
 *
 * In the reference an oversized word sits behind a bottle that stays pinned
 * centre-stage; as you scroll the word travels up and out of frame while the
 * next one rises from below, always behind the product and always cropped by
 * the edges of the screen. Nothing about the subject moves.
 *
 * The subject here is a record rather than a bottle, and the label changes
 * with the word — so the thing you are looking at belongs to the beat you
 * are reading. The record turns on its own clock, not the scroll's: a record
 * that stops when you stop scrolling reads as broken.
 *
 * Every word and every line of copy below is already in `data/home.ts`.
 *
 * The travel is one screen per beat. Under reduced motion the pin comes off
 * and the three beats become three ordinary screens, which is the same
 * content without the hijack.
 */

const BEATS = [
  { word: "More music", copy: homeCopy.intro, festival: "jazzablanca" },
  { word: "More life", copy: homePillars[0].body, festival: "tanjazz" },
  { word: "Sevenpm", copy: homeStoryStatement, festival: "village-casa-anfa" },
];

export function KineticIntro() {
  const section = useRef<HTMLElement>(null);
  const screen = useRef<HTMLDivElement>(null);
  const disc = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sectionEl = section.current;
    const screenEl = screen.current;
    const discEl = disc.current;
    if (!sectionEl || !screenEl || !discEl) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      /* The record's own clock. Independent of the scrub so it keeps
         turning while you are still. */
      const spin = gsap.to(discEl, {
        rotate: 360,
        duration: 14,
        ease: "none",
        repeat: -1,
      });

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const words = gsap.utils.toArray<HTMLElement>("[data-beat-word]");
        const caps = gsap.utils.toArray<HTMLElement>("[data-beat-copy]");
        const labels = gsap.utils.toArray<HTMLElement>("[data-beat-label]");

        /* Far enough to clear the frame, close enough that the word
             leaving and the word arriving are both on screen through the
             hand-off. At 130 there was a beat in the middle with no type
             at all. */
        const TRAVEL = 78;

        gsap.set(words.slice(1), { yPercent: TRAVEL });
        gsap.set(caps.slice(1), { autoAlpha: 0, y: 24 });
        gsap.set(labels.slice(1), { autoAlpha: 0 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionEl,
            start: "top top",
            end: "bottom bottom",
            pin: screenEl,
            scrub: 0.8,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        for (let i = 0; i < BEATS.length - 1; i += 1) {
          /* A beat holds, then hands over: the word leaves through the top
             as the next arrives from the bottom, both at a constant rate so
             the hand-off reads as one movement. */
          tl.to({}, { duration: 0.55 });
          tl.to(words[i], { yPercent: -TRAVEL, ease: "none", duration: 1 });
          tl.to(words[i + 1], { yPercent: 0, ease: "none", duration: 1 }, "<");
          tl.to(caps[i], { autoAlpha: 0, y: -24, duration: 0.45 }, "<");
          tl.to(caps[i + 1], { autoAlpha: 1, y: 0, duration: 0.5 }, "<0.35");
          tl.to(labels[i], { autoAlpha: 0, duration: 0.55 }, "<0.1");
          tl.to(labels[i + 1], { autoAlpha: 1, duration: 0.55 }, "<");
        }
        tl.to({}, { duration: 0.55 });

        return () => {
          tl.scrollTrigger?.kill();
          tl.kill();
        };
      });

      /* Reduced motion: no pin, so nothing would move the later beats out
         of the way and all three words would sit on top of each other.
         Show the first beat only, on one screen. */
      mm.add("(prefers-reduced-motion: reduce)", () => {
        const rest = (name: string) =>
          gsap.utils.toArray<HTMLElement>(`[${name}]`).slice(1);
        gsap.set(sectionEl, { height: "100svh" });
        gsap.set(
          [
            ...rest("data-beat-word"),
            ...rest("data-beat-copy"),
            ...rest("data-beat-label"),
          ],
          { autoAlpha: 0 },
        );
        spin.pause();
      });

      return () => spin.kill();
    }, sectionEl);

    return () => ctx.revert();
  }, []);

  const art = (id: string) =>
    festivals.find((f) => f.id === id)?.card ?? "/assets/gallery-2.jpg";

  return (
    <section
      ref={section}
      aria-label="SEVENPM"
      /* One screen of travel per beat, plus one to read the last on. */
      style={{ height: `${BEATS.length * 100}vh` }}
      className="relative"
    >
      <div
        ref={screen}
        className="relative flex h-svh w-full items-center justify-center overflow-hidden"
      >
        {/* The type, behind everything and cropped by the screen. Each word
            owns a screen of its own, so moving it by 130% carries it clear
            of the frame — sized to its text it would travel only its own
            line box, about 120px, and the three would sit in a heap. */}
        <div aria-hidden className="absolute inset-0 z-0">
          {BEATS.map((beat) => (
            <div
              key={beat.word}
              data-beat-word
              className="absolute inset-0 grid place-items-center"
            >
              {/* Solid, not a watermark. The reference sets its word in
                  full-strength brand colour and lets the product overlap
                  it; a tinted-down version reads as background texture and
                  the whole effect goes with it. */}
              {/* Sized to the screen rather than to a fixed clamp, because
                  a short word at a fixed size is narrower than the record
                  and vanishes behind it. Daltown runs about 0.44em to the
                  character, so this lands every word at roughly the same
                  width whatever its length — which is what the reference
                  does, where each word spans the frame. */}
              <span
                className="whitespace-nowrap font-daltown uppercase leading-[0.78] tracking-[0.02em] text-white"
                style={{
                  fontSize: `clamp(90px, calc(112vw / ${(beat.word.length * 0.44).toFixed(2)}), 380px)`,
                }}
              >
                {beat.word}
              </span>
            </div>
          ))}
        </div>

        {/* The record. One image, with the beat's label laid over its own. */}
        {/* Smaller than the word, so the word still reads either side of
            it — the reference's bottle is tall and narrow for the same
            reason. */}
        <div className="relative z-10 aspect-square w-[min(42vh,380px)]">
          <div ref={disc} className="relative size-full will-change-transform">
            <Image
              src="/assets/hero-vinyl.png"
              alt=""
              fill
              sizes="560px"
              priority
              className="object-contain"
            />
            {/* The label sits where the pressing's own label is: dead centre,
                51% of the disc. */}
            <span className="absolute left-1/2 top-1/2 block size-[51%] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full">
              {BEATS.map((beat) => (
                <span
                  key={beat.word}
                  data-beat-label
                  className="absolute inset-0 block"
                >
                  <Image
                    src={art(beat.festival)}
                    alt=""
                    fill
                    sizes="286px"
                    className="object-cover"
                  />
                </span>
              ))}
              <span className="absolute left-1/2 top-1/2 block size-[7%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#0b0b0e] ring-1 ring-black/60" />
            </span>
          </div>
        </div>

        {/* The line that belongs to the beat, low and left of the record
            where the word is not — the reference keeps its copy out of the
            type's band for the same reason. */}
        <div className="pointer-events-none absolute bottom-10 left-0 z-20 grid w-full max-w-[460px] px-[var(--shell-gutter)] sm:bottom-14">
          {BEATS.map((beat) => (
            <p
              key={beat.word}
              data-beat-copy
              className="col-start-1 row-start-1 m-0 font-[family-name:var(--font-display)] text-[15px] leading-6 tracking-[0.085px] text-content-secondary sm:text-[17px] sm:leading-7"
            >
              {beat.copy}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
