"use client";

import { useRef } from "react";

/**
 * Leans a ticket stub toward the cursor — the card turns a few degrees to
 * face wherever the pointer is over it, and returns flat when it leaves.
 *
 * The rotation lives on this wrapper and nowhere else. Inside it,
 * `.ticket-stub-scale` already owns a `transform: scale()` for the responsive
 * step-down and the stub itself owns `.lift`; three writers on one node would
 * be three ways to lose the other two.
 *
 * Smoothing is a CSS transition rather than a rAF follower. The pointer only
 * moves when there is a pointer, so paying for a frame loop per stub to chase
 * it would be a lot of machinery for a 7° lean.
 *
 * The perforated ends pull away from the card at the same time, off the
 * `data-lean` attribute set here rather than off `:hover`. One source for both
 * halves of the gesture: a stub cannot end up leaning with its ends closed,
 * or torn open while lying flat.
 */

/** How far the card turns at the very edge, degrees. */
const TILT = 7;

export function StubTilt({ children }: { children: React.ReactNode }) {
  const el = useRef<HTMLDivElement>(null);

  const lean = (event: React.PointerEvent<HTMLDivElement>) => {
    const node = el.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    node.dataset.lean = "true";
    const box = node.getBoundingClientRect();
    /* −1 … 1 from the centre of the card. */
    const x = (event.clientX - box.left) / box.width - 0.5;
    const y = (event.clientY - box.top) / box.height - 0.5;
    node.style.transform = `rotateY(${(x * TILT * 2).toFixed(2)}deg) rotateX(${(-y * TILT * 2).toFixed(2)}deg)`;
  };

  const flatten = () => {
    const node = el.current;
    if (!node) return;
    node.style.transform = "";
    delete node.dataset.lean;
  };

  return (
    <div
      ref={el}
      className="stub-tilt"
      onPointerMove={lean}
      onPointerLeave={flatten}
    >
      {children}
    </div>
  );
}
