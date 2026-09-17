"use client";

import { useEffect, useRef } from "react";

import { onStageFrame, wakeStage } from "./stageAudio";

/**
 * Stage lighting behind a hero — a truss of beams hung at the very top of the
 * page, swaying on their own slow cycles and flaring with the music the way a
 * lighting desk drives them. Haze drifts through the light so the beams read
 * as volume rather than as flat triangles.
 *
 * Everything here comes from `stageAudio`, which the heading pulses off too,
 * so the hero moves as one. When the music stops the rig coasts to a
 * standstill and holds its last position, still lit: `motion` takes the sway
 * and the drift down with it, and `level` takes the flare. Nothing loops in
 * silence.
 *
 * The heads track the pointer, the way moving heads on a real truss follow a
 * performer. Each one turns at its own rate, so they arrive raggedly rather
 * than snapping to the cursor as one — and none of them points all the way at
 * it. A head aimed exactly at the pointer puts its hottest, narrowest part
 * under the cursor, which is where the copy is; `reach` holds each one back so
 * the rig leans without ever spotlighting the text.
 *
 * Following answers to the visitor rather than to the music, so it keeps
 * working when nothing is playing — which means waking the clock, since it
 * parks itself in silence.
 *
 * The layer is taller than the hero — it reaches up past the header to the
 * document top, which is where the lamps hang. Its box is what bounds the
 * light, so nothing needs clipping.
 *
 * The scrims live in here rather than in the hero for the same reason. They
 * have to cover exactly the box the canvas covers; a scrim that stopped at the
 * top of the hero left a hard seam under the header, with lit canvas above it
 * and dimmed canvas below.
 *
 * `scrim` says where the copy is. A hero with its text ranged left can be lit
 * hard on the right; one with centred text over a busy stage cannot, and gets
 * an even wash instead.
 *
 * Canvas, not DOM: this is a dozen overlapping additive gradients a frame,
 * which is one composited layer instead of a stack of blurred elements. It
 * renders into a backing store at a third of CSS resolution and is upscaled,
 * which costs a ninth of the fill and hands back the softness for free.
 *
 * Two deliberate limits:
 *
 * - The beams brighten and dim; they never cut to black and back. A
 *   full-width flash at beat tempo is a photosensitivity risk, so every
 *   flare rides on top of an already-lit beam and the total is capped well
 *   short of white.
 * - Under prefers-reduced-motion the rig paints one still frame rather than
 *   nothing. The hero stays lit, it just stops moving.
 *
 * It also stops rendering whenever the hero scrolls out of view or the tab
 * goes to the background — nobody should pay battery for light they are not
 * looking at.
 */

/** Backing store scale. Upscaling this is where the haze comes from. */
const RES = 0.3;

const YELLOW = "251,235,28";
const WHITE = "255,255,255";

type Beam = {
  /** Pivot along the truss, as a fraction of width. */
  x: number;
  /** Rest angle from straight down, radians. Negative leans left. */
  base: number;
  /** How far the head swings either side of `base`. */
  sway: number;
  /** Radians per second of that swing. */
  speed: number;
  phase: number;
  /** Half-width where the beam lands, as a fraction of height. */
  spread: number;
  colour: string;
  /** Brightness between punches, and how much a punch adds. */
  idle: number;
  punch: number;
  /**
   * How far toward the pointer this head is willing to turn, 0–1. Never 1:
   * see the note above about not spotlighting the copy.
   */
  reach: number;
  /** How fast its motor is, in units of "fraction closed per second". */
  motor: number;
};

/* Six heads across the truss: yellow carries the brand, two whites keep the
   yellows from flattening into one wash. Each takes the punch on its own slow
   cycle, so the bar has a shape instead of six beams throbbing as one. */
const BEAMS: Beam[] = [
  { x: 0.08, base: 0.34, sway: 0.1, speed: 0.55, phase: 0, spread: 0.42, colour: YELLOW, idle: 0.3, punch: 0.5, reach: 0.5, motor: 2.6 },
  { x: 0.26, base: 0.16, sway: 0.14, speed: 0.4, phase: 1.9, spread: 0.3, colour: WHITE, idle: 0.16, punch: 0.42, reach: 0.64, motor: 3.6 },
  { x: 0.42, base: -0.08, sway: 0.11, speed: 0.63, phase: 3.4, spread: 0.36, colour: YELLOW, idle: 0.26, punch: 0.46, reach: 0.7, motor: 4.3 },
  { x: 0.58, base: 0.1, sway: 0.13, speed: 0.47, phase: 0.8, spread: 0.34, colour: YELLOW, idle: 0.28, punch: 0.52, reach: 0.7, motor: 3.0 },
  { x: 0.76, base: -0.2, sway: 0.09, speed: 0.58, phase: 2.6, spread: 0.29, colour: WHITE, idle: 0.15, punch: 0.4, reach: 0.6, motor: 4.7 },
  { x: 0.93, base: -0.36, sway: 0.12, speed: 0.44, phase: 4.7, spread: 0.44, colour: YELLOW, idle: 0.3, punch: 0.48, reach: 0.46, motor: 2.3 },
];

/** How many specks of haze drift through the light. */
const MOTES = 34;

type Mote = { x: number; y: number; r: number; vx: number; vy: number };

export function ConcertLights({
  scrim = "left",
}: {
  scrim?: "left" | "even";
}) {
  const layer = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const box = layer.current;
    const el = canvas.current;
    const host = box?.parentElement;
    if (!box || !el || !host) return;

    const ctx = el.getContext("2d");
    if (!ctx) return;

    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let width = 0;
    let height = 0;
    let motes: Mote[] = [];

    /* Where the pointer is, as a fraction of the lit box, and how much of the
       rig is currently answering to it. `following` eases so the heads lift
       their eyes rather than jumping the moment the cursor arrives. */
    let pointer = { x: 0.5, y: 0.6 };
    let wanted = 0;
    let following = 0;
    /* Each head's own eased angle, so their motors can differ. */
    const aims = BEAMS.map((b) => b.base);

    const seed = () => {
      motes = Array.from({ length: MOTES }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: 1 + Math.random() * 1.6,
        vx: (Math.random() - 0.5) * 3,
        /* Haze rises: warm air off a crowd, not falling snow. */
        vy: -(2 + Math.random() * 5),
      }));
    };

    /**
     * One beam, drawn three times: a wide dim skirt, then narrower and
     * brighter, so the edges fall off instead of ending on a hard line.
     */
    const beam = (b: Beam, angle: number, level: number) => {
      const px = b.x * width;
      /* Just above the top edge: the lamps read as hung off the page itself. */
      const py = -height * 0.02;
      const len = height * 1.75;
      const dx = Math.sin(angle);
      const dy = Math.cos(angle);
      const nx = Math.cos(angle);
      const ny = -Math.sin(angle);
      const ex = px + dx * len;
      const ey = py + dy * len;
      const src = width * 0.006;

      for (const [w, a] of [
        [1, 0.3],
        [0.55, 0.4],
        [0.24, 0.55],
      ] as const) {
        const half = b.spread * height * w;
        const alpha = level * a;
        const grad = ctx.createLinearGradient(px, py, ex, ey);
        grad.addColorStop(0, `rgba(${b.colour},${alpha})`);
        grad.addColorStop(0.5, `rgba(${b.colour},${alpha * 0.38})`);
        grad.addColorStop(1, `rgba(${b.colour},0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.moveTo(px - nx * src, py - ny * src);
        ctx.lineTo(px + nx * src, py + ny * src);
        ctx.lineTo(ex + nx * half, ey + ny * half);
        ctx.lineTo(ex - nx * half, ey - ny * half);
        ctx.closePath();
        ctx.fill();
      }

      /* The lamp itself, blooming where the beam leaves the truss. */
      const bloom = ctx.createRadialGradient(px, py, 0, px, py, height * 0.5);
      bloom.addColorStop(0, `rgba(${b.colour},${level * 0.5})`);
      bloom.addColorStop(1, `rgba(${b.colour},0)`);
      ctx.fillStyle = bloom;
      ctx.beginPath();
      ctx.arc(px, py, height * 0.5, 0, Math.PI * 2);
      ctx.fill();
    };

    const draw = (t: number, env: number, life: number) => {
      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = "lighter";

      for (let i = 0; i < BEAMS.length; i += 1) {
        const b = BEAMS[i];
        const angle = still
          ? b.base
          : aims[i] + Math.sin(t * b.speed + b.phase) * b.sway * life;
        /* Whose turn it is to take the punch, rotating slowly between heads. */
        const turn = 0.58 + 0.42 * Math.sin(t * 0.5 + b.phase);
        beam(b, angle, b.idle + b.punch * env * turn);
      }

      const pulse = 0.1 + env * 0.32;
      ctx.fillStyle = `rgba(${YELLOW},${pulse})`;
      for (const m of motes) {
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalCompositeOperation = "source-over";
    };

    const step = (dt: number, life: number) => {
      following += (wanted - following) * Math.min(1, dt * 3.5);

      for (let i = 0; i < BEAMS.length; i += 1) {
        const b = BEAMS[i];
        /* The angle this head would need to point at the pointer. Angles here
           are measured from straight down, which is what `beam` expects. */
        const px = b.x * width;
        const py = -height * 0.02;
        const toPointer = Math.atan2(
          pointer.x * width - px,
          Math.max(1, pointer.y * height - py),
        );
        const target = b.base + (toPointer - b.base) * b.reach * following;
        aims[i] += (target - aims[i]) * Math.min(1, dt * b.motor);
      }

      for (const m of motes) {
        m.x += m.vx * dt * life;
        m.y += m.vy * dt * life;
        if (m.y < -4) {
          m.y = height + 4;
          m.x = Math.random() * width;
        }
        if (m.x < -4) m.x = width + 4;
        if (m.x > width + 4) m.x = -4;
      }
    };

    let off: (() => void) | null = null;
    let visible = true;
    /* Last frame's values, so a resize can repaint exactly what was on screen
       rather than snapping the rig back to its rest state. */
    let seen = { t: 0, level: 0, life: 0 };

    const run = () => {
      if (off || !visible || still) return;
      off = onStageFrame((t, level, dt, life) => {
        seen = { t, level, life };
        step(dt, life);
        draw(t, level, life);
      });
    };

    const halt = () => {
      off?.();
      off = null;
    };

    const resize = () => {
      const rect = host.getBoundingClientRect();
      /* How far the hero sits below the top of the document — the canvas
         stretches up over that gap so the beams start at the page top. */
      const above = rect.top + window.scrollY;
      box.style.top = `${-above}px`;
      box.style.height = `${rect.height + above}px`;
      width = Math.max(1, Math.round(rect.width * RES));
      height = Math.max(1, Math.round((rect.height + above) * RES));
      el.width = width;
      el.height = height;
      seed();
      /* Repaint straight away so a resize never leaves the hero dark, and so
         the reduced-motion still frame has something to be. */
      draw(seen.t, seen.level, seen.life);
    };

    resize();
    run();

    const ro = new ResizeObserver(resize);
    ro.observe(host);

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) run();
        else halt();
      },
      { threshold: 0 },
    );
    io.observe(host);

    /* The canvas cannot take pointer events itself — the whole layer is
       `pointer-events-none` so the hero underneath stays usable — so the move
       is read off the window and mapped into the lit box. */
    const onPointer = (event: PointerEvent) => {
      if (still) return;
      const rect = box.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      /* Off the lit box, the heads return to their rest angles rather than
         chasing a cursor that is somewhere else on the page. */
      const inside = x >= 0 && x <= 1 && y >= 0 && y <= 1;
      wanted = inside ? 1 : 0;
      if (inside) pointer = { x, y };
      wakeStage();
    };

    const onLeave = () => {
      wanted = 0;
      wakeStage();
    };

    const onVisibility = () => {
      if (document.hidden) halt();
      else run();
    };
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pointermove", onPointer, { passive: true });
    document.addEventListener("pointerleave", onLeave);

    return () => {
      halt();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pointermove", onPointer);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div
      ref={layer}
      aria-hidden
      className="pointer-events-none absolute left-0 w-full"
    >
      <canvas ref={canvas} className="absolute inset-0 size-full blur-[10px]" />
      <div
        className={
          scrim === "left"
            ? /* Heaviest where the headline sits, thinning to nothing on the
                 right so the light still reads at full strength somewhere. */
              "absolute inset-0 bg-[linear-gradient(100deg,rgba(11,11,14,0.92)_0%,rgba(11,11,14,0.72)_38%,rgba(11,11,14,0.28)_66%,rgba(11,11,14,0)_100%)]"
            : /* Centred copy has no safe side, so the wash is even and the
                 beams are left brightest up by the truss where nothing sits. */
              "absolute inset-0 bg-[linear-gradient(to_bottom,rgba(11,11,14,0.28)_0%,rgba(11,11,14,0.46)_14%,rgba(11,11,14,0.62)_28%,rgba(11,11,14,0.76)_46%,rgba(11,11,14,0.86)_70%,rgba(11,11,14,0.9)_100%)]"
        }
      />
      {/* And a landing into the section below. */}
      <div className="absolute inset-x-0 bottom-0 h-64 bg-[linear-gradient(to_bottom,rgba(11,11,14,0)_0%,rgba(11,11,14,0.55)_55%,var(--color-bg-primary)_100%)]" />
    </div>
  );
}
