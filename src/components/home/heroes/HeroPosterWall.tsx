"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { festivals, festivalsRowOrder } from "@/data/home";
import { HeroLead, HeroName } from "./HeroShell";

/**
 * A · Poster wall.
 *
 * The four festival posters stood full height across the screen, in
 * luminosity, each drifting at its own rate as you scroll. The name is
 * knocked over them. Hovering a column brings that festival back to colour,
 * so the hero is also the first place you can pick one.
 *
 * It earns its keep by putting the work on the screen immediately — the
 * current hero shows a texture, this shows what SEVENPM actually puts on.
 */
export function HeroPosterWall() {
  const root = useRef<HTMLElement>(null);
  const [live, setLive] = useState<string | null>(null);

  const cards = festivalsRowOrder
    .map((id) => festivals.find((f) => f.id === id))
    .filter((f): f is (typeof festivals)[number] => Boolean(f?.card));

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", () => {
        const columns = gsap.utils.toArray<HTMLElement>("[data-column]");
        columns.forEach((column, index) => {
          gsap.to(column, {
            yPercent: index % 2 ? -12 : -22,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top top",
              end: "bottom top",
              scrub: 0.6,
            },
          });
        });
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      className="relative flex h-svh w-full items-center justify-center overflow-hidden bg-bg-primary"
    >
      <div aria-hidden className="absolute inset-0 grid grid-cols-4">
        {cards.map((festival) => (
          <span
            key={festival.id}
            data-column
            onMouseEnter={() => setLive(festival.id)}
            onMouseLeave={() => setLive(null)}
            className="relative block h-[128%] -translate-y-[6%]"
          >
            <Image
              src={festival.card as string}
              alt=""
              fill
              sizes="25vw"
              priority
              className={`object-cover transition-[filter,opacity] duration-700 ${
                live === festival.id
                  ? "opacity-100"
                  : "opacity-70 grayscale brightness-75"
              }`}
            />
          </span>
        ))}
      </div>

      {/* Enough scrim for the name to hold over four posters at once. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_75%_60%_at_50%_50%,rgba(11,11,14,0.92),rgba(11,11,14,0.6)_65%,rgba(11,11,14,0.85))]"
      />

      <div className="shell pointer-events-none relative z-10 flex flex-col items-center gap-5">
        <HeroName />
        <HeroLead />
      </div>
    </section>
  );
}
