"use client";

import { useEffect } from "react";
import { gsap } from "gsap";

/**
 * The hero's polaroids lean toward the cursor.
 *
 * The scroll drift is `data-parallax`, which `MotionProvider` already drives;
 * this is the other half — a small, slow lean that follows the pointer across
 * the hero, each card by its own depth so the pair separates rather than
 * moving as one sheet.
 *
 * It listens on the section, not on the cards: they are
 * `pointer-events-none` so the hero stays clickable through them, which means
 * they never receive a hover of their own.
 *
 * GSAP owns `transform` on the card, folding its `rotate` in along the way.
 * The centring lives on the wrapper above as a `translate`, which nothing
 * animates — so the lean, the scroll drift and the reveal compose into one
 * matrix without any of them losing the card's position or its tilt.
 */
export function HeroDrift() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    /* A lean toward the cursor means nothing without one, and the cards are
       hidden below `lg` anyway. */
    if (!window.matchMedia("(hover: hover) and (min-width: 1024px)").matches)
      return;

    const cards = gsap.utils.toArray<HTMLElement>("[data-hero-drift]");
    const section = cards[0]?.closest("section");
    if (!section) return;

    const movers = cards.map((el) => ({
      depth: Number(el.dataset.heroDrift) || 1,
      x: gsap.quickTo(el, "x", { duration: 0.9, ease: "power3.out" }),
      y: gsap.quickTo(el, "y", { duration: 0.9, ease: "power3.out" }),
    }));

    const move = (event: PointerEvent) => {
      const box = section.getBoundingClientRect();
      /* −1 to 1 from the middle of the hero, so the lean is about where the
         cursor is on the page rather than how big the window happens to be. */
      const across =
        (event.clientX - (box.left + box.width / 2)) / (box.width / 2);
      const down =
        (event.clientY - (box.top + box.height / 2)) / (box.height / 2);
      movers.forEach((mover) => {
        mover.x(across * 20 * mover.depth);
        mover.y(down * 14 * mover.depth);
      });
    };

    const rest = () =>
      movers.forEach((mover) => {
        mover.x(0);
        mover.y(0);
      });

    section.addEventListener("pointermove", move);
    section.addEventListener("pointerleave", rest);
    return () => {
      section.removeEventListener("pointermove", move);
      section.removeEventListener("pointerleave", rest);
    };
  }, []);

  return null;
}
