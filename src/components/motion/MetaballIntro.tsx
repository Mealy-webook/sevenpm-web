"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

/**
 * The intro from the reference shot: a cluster of glowing metaballs on black
 * inside a radiating dot grid, which then floods outward in brand colour and
 * swallows the screen before the page arrives.
 *
 * The metaballs are the standard gooey trick rather than canvas: plain
 * circles in a layer under `blur()` then `contrast()`. The blur bleeds each
 * circle into its neighbour and the contrast throws the soft edge away, so
 * two circles that overlap read as one fused lump — which is what makes the
 * cluster look molten rather than like a pile of dots.
 *
 * The dot grid sits over it in `difference`, so the dots are light on the
 * black ground and go dark the moment the yellow passes under them. That
 * inversion is the thing the reference does that sells the flood; a grid
 * that stayed one colour would just be a texture the flood hid.
 *
 * Reduced motion gets the flood without the churn: the sheet fills and
 * leaves, and nothing pulses.
 */

/**
 * The core: a chain of lumps along a slightly tilted axis, not one disc.
 * Under the goo filter they fuse into a single molten band with pinched
 * waists between them, which is the shape the reference has.
 * Offsets and radii in vmin.
 */
const BLOBS = [
  { x: -15, y: 2, r: 3.4 },
  { x: -10.5, y: -2, r: 4.4 },
  { x: -5.5, y: 1.5, r: 5.2 },
  { x: 0, y: -1, r: 5.8 },
  { x: 5.5, y: 2, r: 5.2 },
  { x: 10.5, y: -1.5, r: 4.4 },
  { x: 15, y: 1.5, r: 3.4 },
  { x: -7, y: -6.5, r: 2.6 },
  { x: 7, y: 6.5, r: 2.6 },
];

/**
 * The field: concentric rings rather than a grid, so it reads as radiating
 * from the core the way the reference's does. Radius in vmin, and how many
 * dots sit on that ring.
 */
const RINGS = [
  { r: 11, n: 8 },
  { r: 16, n: 12 },
  { r: 21, n: 16 },
  { r: 26, n: 18 },
  { r: 31, n: 20 },
  { r: 36, n: 22 },
];

/** The fringe colours the reference cycles through. */
const FRINGE = ["#fbeb1c", "#6a7bff", "#ff6ab8", "#57e08a"];

const DOTS = RINGS.flatMap((ring, ringIndex) =>
  Array.from({ length: ring.n }, (_, index) => {
    const angle = (index / ring.n) * Math.PI * 2 + ringIndex * 0.28;
    return {
      x: Math.cos(angle) * ring.r,
      y: Math.sin(angle) * ring.r,
      colour: FRINGE[(ringIndex + index) % FRINGE.length],
      /* The outer rings thin out, as they do in the shot. */
      size: 1.4 - ringIndex * 0.12,
      ring: ringIndex > 1 && (ringIndex + index) % 3 === 0,
    };
  }),
);

export function MetaballIntro({ onDone }: { onDone?: () => void }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const ctx = gsap.context(() => {
      const blobs = gsap.utils.toArray<HTMLElement>("[data-blob]");
      const dots = gsap.utils.toArray<HTMLElement>("[data-dot]");
      const flood = el.querySelector<HTMLElement>("[data-flood]");

      gsap.set(dots, { scale: 0, opacity: 0 });

      const tl = gsap.timeline({
        onComplete: () => onDone?.(),
      });

      /* The grid arrives from the middle out, so the cluster reads as the
         source of everything else. */
      tl.to(dots, {
        scale: 1,
        opacity: 1,
        duration: 0.5,
        ease: "back.out(2)",
        /* DOTS is built ring by ring, so plain order already runs
           outward from the core. */
        stagger: 0.008,
      });

      if (!reduce) {
        /* The churn: each blob drifts on its own rate so the fused shape
           never settles while it is waiting. */
        blobs.forEach((blob, index) => {
          gsap.to(blob, {
            x: `+=${(index % 2 ? 1 : -1) * (6 + (index % 3) * 4)}`,
            y: `+=${(index % 3 ? -1 : 1) * (5 + (index % 4) * 3)}`,
            duration: 1.6 + (index % 5) * 0.35,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
          });
        });
      }

      /* The flood. One blob in the middle of the cluster swells until it is
         bigger than the screen, and the rest go with it — under the goo
         filter they fuse on the way out instead of growing as discs. */
      tl.to(
        blobs,
        {
          scale: 26,
          duration: 1.1,
          ease: "power2.in",
          stagger: { each: 0.03, from: "center" },
        },
        "+=0.55",
      );

      /* Once the screen is brand, the filter has nothing left to shape, so
         a flat sheet takes over and the goo layer goes. Cheaper, and it
         stops the blur chewing frames during the wipe. */
      tl.set(flood, { autoAlpha: 1 })
        .set("[data-goo]", { autoAlpha: 0 })
        .to(dots, { autoAlpha: 0, duration: 0.25 }, "<")
        .to(
          el,
          {
            clipPath: "inset(0 0 100% 0)",
            duration: 0.9,
            ease: "expo.inOut",
          },
          "+=0.25",
        );
    }, el);

    return () => ctx.revert();
  }, [onDone]);

  return (
    <div
      ref={root}
      aria-hidden
      className="fixed inset-0 z-[100] overflow-hidden bg-bg-primary [clip-path:inset(0_0_0_0)]"
    >
      {/* The gooey layer. The blur bleeds, the contrast cuts — together they
          fuse overlapping circles into one shape. */}
      <div
        data-goo
        /* The layer needs its own opaque ground: `contrast()` thresholds
           what is painted, and over a transparent backdrop it has nothing to
           push the soft edge against, so the blobs stay a glow instead of
           becoming shapes. */
        className="absolute inset-0 bg-bg-primary [filter:blur(14px)_contrast(22)]"
      >
        {BLOBS.map((blob, index) => (
          <span
            key={index}
            data-blob
            className="absolute block rounded-full bg-brand"
            style={{
              width: `${blob.r * 2}vmin`,
              height: `${blob.r * 2}vmin`,
              left: `calc(50% + ${blob.x}vmin)`,
              top: `calc(50% + ${blob.y}vmin)`,
              translate: "-50% -50%",
            }}
          />
        ))}
      </div>

      {/* The field, inverting wherever the flood has reached. */}
      <div className="absolute inset-0" style={{ mixBlendMode: "difference" }}>
        {DOTS.map((dot, index) => (
          <span
            key={index}
            data-dot
            className="absolute block rounded-full"
            style={{
              width: `${dot.size}vmin`,
              height: `${dot.size}vmin`,
              left: `calc(50% + ${dot.x.toFixed(2)}vmin)`,
              top: `calc(50% + ${dot.y.toFixed(2)}vmin)`,
              translate: "-50% -50%",
              /* Some are rings, some are solid — the shot mixes the two. */
              background: dot.ring ? "transparent" : dot.colour,
              boxShadow: dot.ring
                ? `0 0 0 0.3vmin ${dot.colour}`
                : `0 0 0.9vmin ${dot.colour}`,
            }}
          />
        ))}
      </div>

      {/* The flat sheet the flood hands over to. */}
      <span
        data-flood
        className="invisible absolute inset-0 block bg-brand opacity-0"
      />
    </div>
  );
}
