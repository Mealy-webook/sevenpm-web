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
 * Geometry measured off the reference frame rather than guessed. The shot's
 * browser panel is 470 x 220 video pixels, and within it:
 *
 *   core      103 x 100, dead centre  -> 22% of the viewport's width, round
 *   dot pitch ~22px on both axes      -> 4.7% of the viewport's width
 *   field     dots out to r = 156px   -> 33% of the viewport's width
 *
 * The dots sit on a square lattice clipped to a circle, which is why the
 * field reads as radial while its rows and columns still line up. Two
 * earlier passes got this wrong in opposite directions: a full-screen grid
 * with no circle, then rings with no lattice.
 *
 * The disc is wider than the panel is tall, so it is cropped top and bottom
 * — as it is in the shot.
 */
const PITCH = 4.7; // vw between dots
const FIELD = 33; // vw, radius of the disc the lattice is clipped to
const CORE = 11; // vw, radius of the fused core

/**
 * The core. An even rosette fuses into a rounded square with regular lobes;
 * the shot's mass is irregular, so the ring is uneven in angle, distance and
 * size, with two satellites pulling the outline further off-round.
 */
const BLOBS = [
  { x: 0, y: 0, r: 5.6 },
  { x: 4.9, y: -1.2, r: 4.3 },
  { x: 2.6, y: 4.6, r: 3.8 },
  { x: -2.9, y: 4.3, r: 4.5 },
  { x: -5.1, y: -0.8, r: 4.0 },
  { x: -2.4, y: -4.8, r: 4.4 },
  { x: 3.1, y: -4.4, r: 3.6 },
  { x: 7.4, y: 2.4, r: 2.8 },
  { x: -6.9, y: -3.4, r: 2.6 },
];

/** The fringe colours the shot cycles through. */
const FRINGE = ["#fbeb1c", "#4fc3f7", "#ff6ab8", "#57e08a"];

/* The lattice, clipped to the disc and with the core's own area left out —
   the shot has no free dots inside the molten mass. */
const SPAN = Math.ceil(FIELD / PITCH);
const DOTS: { x: number; y: number; colour: string; ring: boolean }[] = [];
for (let row = -SPAN; row <= SPAN; row += 1) {
  for (let col = -SPAN; col <= SPAN; col += 1) {
    const x = col * PITCH;
    const y = row * PITCH;
    const r = Math.hypot(x, y);
    if (r > FIELD || r < CORE * 0.55) continue;
    DOTS.push({
      x,
      y,
      colour: FRINGE[(row + col + 8) % FRINGE.length],
      ring: (row * 3 + col) % 4 === 0,
    });
  }
}

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
        /* Each dot back to its own rim fade, not a flat 1 — animating them
           all to full opacity throws the falloff away and the disc turns
           into a hard cut-out circle. */
        opacity: (_index: number, target: HTMLElement) =>
          Number(target.dataset.fade ?? 1),
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
              width: `${blob.r * 2}vw`,
              height: `${blob.r * 2}vw`,
              left: `calc(50% + ${blob.x.toFixed(2)}vw)`,
              top: `calc(50% + ${blob.y.toFixed(2)}vw)`,
              translate: "-50% -50%",
            }}
          />
        ))}
      </div>

      {/* The field, inverting wherever the flood has reached. */}
      <div className="absolute inset-0" style={{ mixBlendMode: "difference" }}>
        {DOTS.map((dot, index) => {
          /* Dimmer toward the rim, which is what makes the disc read as a
             field rather than as a cut-out circle. */
          const fade = 1 - (Math.hypot(dot.x, dot.y) / FIELD) * 0.72;
          return (
            <span
              key={index}
              data-dot
              data-fade={fade.toFixed(2)}
              className="absolute block rounded-full"
              style={{
                width: "0.95vw",
                height: "0.95vw",
                left: `calc(50% + ${dot.x.toFixed(2)}vw)`,
                top: `calc(50% + ${dot.y.toFixed(2)}vw)`,
                translate: "-50% -50%",
                opacity: fade.toFixed(2),
                background: dot.ring ? "transparent" : dot.colour,
                boxShadow: dot.ring
                  ? `0 0 0 0.26vw ${dot.colour}`
                  : `0 0 0.8vw ${dot.colour}`,
              }}
            />
          );
        })}
      </div>

      {/* The flat sheet the flood hands over to. */}
      <span
        data-flood
        className="invisible absolute inset-0 block bg-brand opacity-0"
      />
    </div>
  );
}
