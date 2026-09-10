"use client";

import { useEffect, useRef } from "react";

/**
 * The spectrum bars running behind the record.
 *
 * A canvas equaliser fed by the <audio> analyser. Bars rise from the record's
 * horizontal axis, windowed so the row fades out at both ends rather than
 * stopping dead, and each bar attacks instantly but releases slowly with a
 * peak cap that falls behind it — which is what makes an equaliser read as
 * musical rather than as a bar chart.
 *
 * Idle it settles into a low, slowly drifting row at the same 16% white as the
 * rest of the hero furniture.
 */

/* Sized and placed like the traces in the comp: 1495 wide, centred on the
 * record's horizontal axis. Coordinates are relative to the record's box. */
const WIDTH = 1495;
const HEIGHT = 324;
const LEFT = -442;
const TOP = 151;

const BAR_W = 6;
const GAP = 5;
const PITCH = BAR_W + GAP;
const MAX_BAR = 148; // before the end-taper
const IDLE_BAR = 5;

export function HeroSpectrum({
  playing,
  analyser,
}: {
  playing: boolean;
  analyser: React.RefObject<AnalyserNode | null>;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const playingRef = useRef(playing);
  useEffect(() => {
    playingRef.current = playing;
  }, [playing]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    canvas.width = WIDTH * dpr;
    canvas.height = HEIGHT * dpr;
    ctx.scale(dpr, dpr);

    // Only paint while the hero is actually on screen.
    let visible = true;
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
      },
      { rootMargin: "120px" },
    );
    observer.observe(canvas);

    const mid = HEIGHT / 2;
    const count = Math.floor(WIDTH / PITCH);
    const offset = (WIDTH - (count * PITCH - GAP)) / 2;

    const heights = new Float32Array(count);
    const peaks = new Float32Array(count);
    let bins: Uint8Array | null = null;
    let frame = 0;
    let smoothed = 0;

    /** Cosine window — zero at both ends, 1 in the middle. */
    const windowAt = (i: number) =>
      0.5 - 0.5 * Math.cos((i / (count - 1)) * Math.PI * 2);

    // Bars rise from `mid`, so the ramp runs bottom-to-top: hot at the base,
    // cooling towards the tips.
    const gradient = ctx.createLinearGradient(0, mid, 0, mid - MAX_BAR);
    gradient.addColorStop(0, "rgba(251, 235, 28, 1)");
    gradient.addColorStop(0.55, "rgba(251, 235, 28, 0.95)");
    gradient.addColorStop(1, "rgba(232, 34, 86, 0.85)");

    let tick = 0;
    const render = (now: number) => {
      frame = requestAnimationFrame(render);
      if (!visible) return;
      // Idle drift is slow; a quarter of the frames is plenty for it.
      tick += 1;
      if (!playingRef.current && tick % 4 !== 0) return;

      const node = analyser.current;
      const isPlaying = playingRef.current;
      const live = Boolean(node) && isPlaying;

      if (node) {
        if (!bins || bins.length !== node.frequencyBinCount) {
          bins = new Uint8Array(node.frequencyBinCount);
        }
        node.getByteFrequencyData(bins as Uint8Array<ArrayBuffer>);
      }

      const t = now / 1000;
      let energy = 0;

      for (let i = 0; i < count; i += 1) {
        let target: number;

        if (live && bins) {
          // Bins spread across the row, weighted so bass doesn't swamp the
          // left end and the top octaves aren't a dead flat tail.
          const idx = Math.floor(Math.pow(i / count, 1.55) * 420);
          const mag =
            (bins[idx] + bins[Math.min(idx + 1, bins.length - 1)]) / 510;
          energy += mag;
          target = mag * MAX_BAR * windowAt(i);
        } else {
          // Resting row: a slow travelling ripple.
          target =
            (IDLE_BAR + Math.sin(i * 0.22 - t * 1.6) * 3) * windowAt(i);
        }

        // Instant attack, slow release.
        heights[i] =
          target > heights[i] ? target : heights[i] + (target - heights[i]) * 0.14;

        peaks[i] =
          heights[i] > peaks[i] ? heights[i] : Math.max(0, peaks[i] - 1.1);
      }

      const level = live ? Math.min(1, (energy / count) * 2.4) : 0;
      smoothed += (level - smoothed) * 0.2;

      ctx.clearRect(0, 0, WIDTH, HEIGHT);

      const still = reduced.matches;
      const lit = isPlaying && !still;

      /* Every bar goes into ONE path and is filled once. The glow is a single
       * shadowBlur pass over that path — doing it per bar was ~136 blur
       * rasterisations a frame and is what dropped playback to ~23fps. */
      ctx.beginPath();
      for (let i = 0; i < count; i += 1) {
        const h = still ? IDLE_BAR * windowAt(i) : Math.max(1, heights[i]);
        ctx.roundRect(offset + i * PITCH, mid - h, BAR_W, h, [BAR_W / 2, BAR_W / 2, 0, 0]);
      }
      ctx.fillStyle = lit ? gradient : "rgba(255,255,255,0.16)";
      ctx.shadowColor = "rgba(251, 235, 28, 0.75)";
      ctx.shadowBlur = lit ? 12 + smoothed * 22 : 0;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Peak caps, one path, only while there is signal to chase.
      if (lit) {
        ctx.beginPath();
        for (let i = 0; i < count; i += 1) {
          const pk = peaks[i];
          if (pk < 6) continue;
          ctx.rect(offset + i * PITCH, mid - pk - 3, BAR_W, 2);
        }
        ctx.fillStyle = `rgba(255,255,255,${0.35 + smoothed * 0.45})`;
        ctx.fill();
      }
    };

    frame = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [analyser]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none absolute"
      style={{ left: LEFT, top: TOP, width: WIDTH, height: HEIGHT }}
    />
  );
}
