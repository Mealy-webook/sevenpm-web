"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";

import { DisplayHeading } from "@/components/ui/DisplayHeading";

/**
 * Homepage gallery, from Figma 2020:1977: two rows of 404 × 269 tiles with a
 * 32px gap, each row offset so tiles bleed past both edges. The rows drift in
 * opposite directions on a GSAP loop and pause while hovered.
 */

const TILE_W = 404;
const TILE_H = 269;
const GAP = 32;

export function HomeGallery({ rows }: { rows: string[][] }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.utils
        .toArray<HTMLElement>("[data-gallery-track]")
        .forEach((track, i) => {
          const count = Number(track.dataset.count);
          const distance = count * (TILE_W + GAP);
          const dir = i % 2 === 0 ? 1 : -1;
          gsap.set(track, { x: dir === 1 ? 0 : -distance });
          const tween = gsap.to(track, {
            x: dir === 1 ? -distance : 0,
            duration: 60 + i * 12,
            ease: "none",
            repeat: -1,
          });
          track.addEventListener("mouseenter", () =>
            gsap.to(tween, { timeScale: 0.15, duration: 0.6 }),
          );
          track.addEventListener("mouseleave", () =>
            gsap.to(tween, { timeScale: 1, duration: 0.6 }),
          );
        });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section id="gallery" className="relative py-16 xl:py-24 [overflow-x:clip]">
      <div className="shell flex flex-col items-center gap-12">
        <DisplayHeading reveal="clip">Gallery</DisplayHeading>
      </div>

      <div
        ref={root}
        className="mt-12 flex w-full flex-col gap-8"
        data-reveal="up"
      >
        {rows.map((row, i) => (
          <div key={i} className="relative w-full" style={{ height: TILE_H }}>
            <div
              data-gallery-track
              data-count={row.length}
              className="absolute left-1/2 top-0 flex"
              style={{
                gap: GAP,
                // Two copies side by side; the loop travels one copy's length.
                marginLeft:
                  -((row.length * (TILE_W + GAP)) / 2) -
                  (i % 2 ? TILE_W / 2 : 0),
              }}
            >
              {[...row, ...row].map((src, k) => (
                <div
                  key={k}
                  className="gallery-tile relative shrink-0 overflow-hidden bg-[#27272a]"
                  style={{ width: TILE_W, height: TILE_H }}
                >
                  <Image
                    src={src}
                    alt=""
                    fill
                    sizes="404px"
                    className="object-cover"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
