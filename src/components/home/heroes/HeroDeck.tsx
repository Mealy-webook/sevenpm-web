"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";

import { festivals, homeCopy } from "@/data/home";
import { HeroLead } from "./HeroShell";

/**
 * D · Deck.
 *
 * The record from the festival cards on a deck, turning, with the tonearm
 * down on it and the featured festival named as what is playing. The name
 * sits beside it rather than over it, so nothing needs a scrim.
 *
 * It is the only option that uses the two assets already in the project
 * and unused since the hero was rebuilt — `hero-vinyl.png` and
 * `hero-tonearm.png` — and the only one whose motion is the brand's own
 * object rather than a treatment laid over a photograph.
 *
 * The record turns on its own clock. Reduced motion stops it and leaves the
 * deck sitting there, which is what a deck does between records.
 */
export function HeroDeck() {
  const disc = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = disc.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const spin = gsap.to(el, {
      rotate: 360,
      duration: 12,
      ease: "none",
      repeat: -1,
    });
    return () => {
      spin.kill();
    };
  }, []);

  const featured =
    festivals.find((f) => f.id === "jazzablanca") ?? festivals[0];

  return (
    <section className="relative flex h-svh w-full items-center overflow-hidden bg-bg-primary">
      <div className="shell grid w-full grid-cols-1 items-center gap-7 lg:grid-cols-[1fr_minmax(0,46%)] lg:gap-10">
        <div className="flex flex-col items-start gap-5">
          <h1
            /* Its own size rather than the shared one: this heading has
               a column to fit, not a screen. */
            className="m-0 w-full font-daltown text-[clamp(56px,11vw,150px)] uppercase leading-[0.78] text-white"
            data-no-split
          >
            {homeCopy.heroTitle}
          </h1>
          <HeroLead className="!max-w-[520px] !text-left" />
          <span className="mt-2 flex items-center gap-3 font-[family-name:var(--font-display)] text-[12px] font-bold uppercase leading-4 tracking-[3px] text-content-secondary">
            <span className="block size-2 rounded-full bg-brand" />
            Now playing
            <span className="text-white">{featured.name}</span>
          </span>
        </div>

        {/* The deck. The arm is fixed and the record turns under it. */}
        {/* Smaller while the two stack, or the deck runs off the fold. */}
        <div className="relative mx-auto aspect-square w-[min(29vh,250px)] lg:w-[min(58vh,520px)]">
          <div ref={disc} className="absolute inset-0 will-change-transform">
            <Image
              src="/assets/hero-vinyl.png"
              alt=""
              fill
              sizes="520px"
              priority
              className="object-contain"
            />
            <span className="absolute left-1/2 top-1/2 block size-[51%] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full">
              <Image
                src={featured.card ?? "/assets/gallery-2.jpg"}
                alt=""
                fill
                sizes="266px"
                className="object-cover"
              />
              <span className="absolute left-1/2 top-1/2 block size-[7%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#0b0b0e] ring-1 ring-black/60" />
            </span>
          </div>
          <Image
            src="/assets/hero-tonearm.png"
            alt=""
            width={482}
            height={602}
            aria-hidden
            className="pointer-events-none absolute -right-[12%] -top-[8%] w-[46%] origin-top-right"
          />
        </div>
      </div>
    </section>
  );
}
