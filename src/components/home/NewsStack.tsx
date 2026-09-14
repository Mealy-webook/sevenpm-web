"use client";

import { Children, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Stacking cards. Each child sits in a sticky wrapper pinned a few pixels
 * lower than the one before, so as the page scrolls the cards pile up under
 * the heading. A scrubbed ScrollTrigger scales the card underneath back and
 * dims it as the next one slides over. Spacers give each card its own stretch
 * of scroll; the last card's spacer is shorter so the section ends normally.
 */
export function NewsStack({ children }: { children: React.ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const items = Children.toArray(children);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const wrappers = gsap.utils.toArray<HTMLElement>(".news-stack__item");
      wrappers.forEach((wrapper, i) => {
        const next = wrappers[i + 1];
        if (!next) return;
        const card = wrapper.firstElementChild as HTMLElement | null;
        if (!card) return;
        gsap.to(card, {
          scale: 0.94,
          filter: "brightness(0.72)",
          ease: "none",
          scrollTrigger: {
            trigger: next,
            start: "top bottom-=120",
            end: "top top+=160",
            scrub: true,
          },
        });
      });
    }, el);
    return () => ctx.revert();
  }, [items.length]);

  return (
    <div ref={root} className="news-stack relative w-full">
      {items.map((child, i) => (
        <div
          key={i}
          className="news-stack__item w-full"
          style={
            {
              "--stack-index": i,
              // Scroll room for the pile: each card except the last gets a
              // stretch of viewport to travel before the next takes over.
              marginBottom: i < items.length - 1 ? "45vh" : 0,
            } as React.CSSProperties
          }
        >
          {child}
        </div>
      ))}
    </div>
  );
}
