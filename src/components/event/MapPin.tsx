"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

/**
 * The venue marker. It drops onto the map the first time the panel is seen and
 * then sits over a slow ring that keeps going out from under it, the way a
 * live marker does — enough to say "here", not enough to compete with the
 * "Get directions" button beside it.
 *
 * The drop is held back until the map is actually on screen. A CSS animation
 * on its own would have run and finished while the section was still two
 * screens down, and the visitor would arrive to a pin that had already landed.
 */
export function MapPin({ x, y }: { x: number; y: number }) {
  const el = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = el.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      node.dataset.landed = "true";
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        node.dataset.landed = "true";
      },
      { threshold: 0.3 },
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={el}
      className="map-pin absolute size-14"
      style={{ left: `${x}%`, top: `${y}%` }}
    >
      <span className="map-pin-ring" aria-hidden />
      <Image
        src="/assets/ic-map-pin.svg"
        alt=""
        width={56}
        height={56}
        className="relative size-14"
      />
    </div>
  );
}
