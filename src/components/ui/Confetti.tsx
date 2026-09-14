"use client";

import { useEffect, useRef } from "react";

/**
 * A single burst of confetti, fired once when this mounts and then cleaned
 * up. Canvas rather than a hundred DOM nodes, and no dependency: the whole
 * thing is a few dozen rectangles under gravity.
 *
 * Paper only, no sound and no repeat. It sits out entirely under
 * prefers-reduced-motion — a celebration nobody asked for is just motion.
 */

type Piece = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  w: number;
  h: number;
  spin: number;
  angle: number;
  colour: string;
  /** Flips the rectangle edge-on as it tumbles. */
  phase: number;
};

const COLOURS = ["#fbeb1c", "#ffffff", "#a1a1aa", "#fff35a"];

export function Confetti({
  count = 90,
  duration = 4200,
}: {
  count?: number;
  /** Stop and tear down after this long, whatever is still falling. */
  duration?: number;
}) {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const el = canvas.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = el.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(2, window.devicePixelRatio || 1);
    let width = 0;
    let height = 0;

    const size = () => {
      width = el.clientWidth;
      height = el.clientHeight;
      el.width = width * dpr;
      el.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    size();
    window.addEventListener("resize", size);

    /* Two cannons at the lower corners, angled inwards — a burst from the
       top edge reads as falling debris rather than celebration. */
    const pieces: Piece[] = Array.from({ length: count }, (_, index) => {
      const left = index % 2 === 0;
      const spread = (Math.random() - 0.5) * 0.9;
      const power = 13 + Math.random() * 9;
      return {
        x: left ? width * 0.08 : width * 0.92,
        y: height * 0.78,
        vx: (left ? 1 : -1) * (power * (0.55 + Math.random() * 0.35)),
        vy: -power * (0.9 + Math.random() * 0.5) + spread,
        w: 6 + Math.random() * 6,
        h: 9 + Math.random() * 8,
        spin: (Math.random() - 0.5) * 0.4,
        angle: Math.random() * Math.PI,
        colour: COLOURS[index % COLOURS.length],
        phase: Math.random() * Math.PI * 2,
      };
    });

    const began = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const elapsed = now - began;
      ctx.clearRect(0, 0, width, height);

      let alive = false;
      for (const p of pieces) {
        p.vy += 0.34; // gravity
        p.vx *= 0.992; // drag
        p.x += p.vx;
        p.y += p.vy;
        p.angle += p.spin;
        p.phase += 0.14;

        if (p.y - p.h < height) alive = true;

        // Squashing the width by the tumble phase reads as paper turning over.
        const flat = Math.abs(Math.cos(p.phase));
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        ctx.globalAlpha = Math.max(0, 1 - elapsed / duration);
        ctx.fillStyle = p.colour;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w * flat + 1, p.h);
        ctx.restore();
      }

      if (alive && elapsed < duration) {
        frame = requestAnimationFrame(tick);
      } else {
        ctx.clearRect(0, 0, width, height);
      }
    };
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", size);
    };
  }, [count, duration]);

  return (
    <canvas
      ref={canvas}
      aria-hidden
      /* Under the custom cursor (z-90) and above the page, but inert. */
      className="pointer-events-none fixed inset-0 z-[60] size-full"
    />
  );
}
