"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * The two crossed "GET YOUR TICKETS" ribbons between the hero and the ticket
 * tiers. Geometry is lifted from Figma node 2091:52682 — each ribbon is a
 * 3917 × 68 strip rotated about the centre of its bounding box.
 *
 * The scroll runs the strips on a GSAP loop rather than a CSS keyframe so the
 * page's scroll velocity can push them: flick down and they speed up and lean
 * forward, flick up and they run backwards.
 */

const RIBBON_ITEMS = 9;
/** 357px of text + 82px gap = one slot; the loop travels exactly 9 slots. */
const SLOT = 439;
const LOOP_DISTANCE = SLOT * RIBBON_ITEMS;

type RibbonSpec = {
  tone: "light" | "brand";
  rotate: number;
  left: number;
  top: number;
  width: number;
  height: number;
  /** Base seconds for one loop; negative runs right-to-left. */
  duration: number;
  direction: 1 | -1;
};

const RIBBONS: RibbonSpec[] = [
  {
    tone: "light",
    rotate: -6.84,
    left: -37,
    top: -286,
    width: 3897.228,
    height: 533.938,
    duration: 46,
    direction: 1,
  },
  {
    tone: "brand",
    rotate: 2.24,
    left: -14,
    top: 38,
    width: 3916.661,
    height: 221.213,
    duration: 38,
    direction: -1,
  },
];

export function TicketsMarquee() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const tracks = gsap.utils.toArray<HTMLElement>("[data-ribbon-track]");
      const tweens = tracks.map((track) => {
        const spec = RIBBONS[Number(track.dataset.ribbonTrack)];
        gsap.set(track, { x: spec.direction === 1 ? 0 : -LOOP_DISTANCE });
        return gsap.to(track, {
          x: spec.direction === 1 ? -LOOP_DISTANCE : 0,
          duration: spec.duration,
          ease: "none",
          repeat: -1,
        });
      });

      // Scroll velocity nudges the loop speed, then eases back to 1×.
      let resetTimer = 0;
      ScrollTrigger.create({
        onUpdate: (self) => {
          const boost = gsap.utils.clamp(
            -6,
            6,
            1 + Math.abs(self.getVelocity()) / 420,
          );
          const signed = self.direction === 1 ? boost : -boost;
          tweens.forEach((tween) =>
            gsap.to(tween, {
              timeScale: signed,
              duration: 0.25,
              overwrite: true,
            }),
          );
          window.clearTimeout(resetTimer);
          resetTimer = window.setTimeout(() => {
            tweens.forEach((tween) =>
              gsap.to(tween, { timeScale: 1, duration: 1.2, overwrite: true }),
            );
          }, 140);
        },
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={rootRef}
      className="relative z-10 h-[230px] [overflow-x:clip] [overflow-y:visible]"
      role="presentation"
      aria-label="Get your tickets"
    >
      <div className="pointer-events-none absolute inset-0 mx-auto max-w-[1512px]">
        {RIBBONS.map((spec, index) => (
          <div
            key={spec.tone}
            className="absolute flex items-center justify-center"
            style={{
              left: spec.left,
              top: spec.top,
              width: spec.width,
              height: spec.height,
            }}
          >
            <div style={{ transform: `rotate(${spec.rotate}deg)` }}>
              <div
                className={`w-[3917px] overflow-hidden px-6 py-3 shadow-[0px_4px_2px_rgba(0,0,0,0.25)] ${
                  spec.tone === "brand" ? "bg-brand" : "bg-white"
                }`}
              >
                <div
                  data-ribbon-track={index}
                  className="flex w-max items-center gap-[82px]"
                >
                  {Array.from({ length: RIBBON_ITEMS * 2 }).map((_, i) => (
                    <span
                      key={i}
                      aria-hidden={i >= RIBBON_ITEMS}
                      className="shrink-0 whitespace-nowrap font-[family-name:var(--font-display)] text-[40px] font-bold uppercase leading-[1.1] text-black"
                    >
                      Get your tickets
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
