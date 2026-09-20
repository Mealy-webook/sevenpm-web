"use client";

/**
 * One clock for everything that moves to the music: the lighting rigs behind
 * the heroes and the pulse on their headings.
 *
 * Whoever is playing hands their analyser over — the festival row on the
 * homepage while spacebar is held, the deck on an event page whenever it is
 * running. The level is the real signal: low-band energy, which is what a
 * crowd hears as the beat.
 *
 * When the music stops, so does everything reading this. There is no idle
 * animation to fall back on — `level` decays to nothing and `motion` glides
 * to nothing behind it, so a rig eases to a standstill instead of cutting out,
 * and the clock then stops ticking entirely until a track hands its analyser
 * back. Lights that keep sweeping over silence are just a screensaver.
 *
 * It is a single shared requestAnimationFrame rather than one per consumer:
 * the analyser must be read once a frame, and two readers smoothing the same
 * signal independently would drift apart and pulse out of step.
 *
 * It also carries the colour the stage is lit in. Whoever is playing hands
 * over the current record's palette (read off its sleeve — see
 * `artworkPalette`), and the rigs read it from here, so a track change is a
 * lighting cue: the beams cross-fade from one record's colours to the next
 * over about a second rather than cutting.
 */

let analyser: AnalyserNode | null = null;
let bins: Uint8Array<ArrayBuffer> | null = null;

/** Smoothed 0–1 level. Fast attack, slow release — a pulse, not a wobble. */
let level = 0;

/**
 * How many bands the spectrum is folded down to. Enough for a meter to read
 * as a meter; anything finer is noise at the sizes these are drawn.
 */
export const BANDS = 8;

/* Smoothed per-band energy, bass on the left. */
const bands = new Float32Array(BANDS);
/**
 * Decaying peak, so a quiet master still fills the range instead of leaving
 * the rig at a permanent half-brightness.
 */
let peak = 0.12;

/**
 * How alive the rig is, 0–1: 1 while a track is connected, easing down after
 * it stops. Sway and drift ride on this rather than on `level`, so a quiet bar
 * in a song does not freeze the lights mid-song.
 */
let motion = 0;

let now = 0;
let frame = 0;
let last = 0;

/**
 * Real-time deadline, in the `performance.now()` timebase, that holds the
 * clock open when something other than the music needs frames — the beams
 * tracking the pointer, say. It cannot be measured in `now`, which only
 * advances while the rig is alive and so would never reach its own deadline.
 */
let wakeUntil = 0;

type Listener = (
  t: number,
  level: number,
  dt: number,
  motion: number,
) => void;
const listeners = new Set<Listener>();

/** `FestivalsStage` calls this when the preview starts and stops. */
export function setStageAnalyser(node: AnalyserNode | null) {
  analyser = node;
  bins = node ? new Uint8Array(new ArrayBuffer(node.frequencyBinCount)) : null;
  if (!node) peak = 0.12;
  /* The clock parks itself once everything has settled, so a track arriving
     has to wake it. */
  if (node && listeners.size) start();
}

function sample(dt: number) {
  /* ~1.2s to spin up or coast down. */
  motion += ((analyser ? 1 : 0) - motion) * Math.min(1, dt * 3.2);

  if (analyser && bins) {
    analyser.getByteFrequencyData(bins);
    /* The kick and the bass: the bottom twelfth of the spectrum. */
    const end = Math.max(4, Math.floor(bins.length * 0.08));
    let sum = 0;
    for (let i = 0; i < end; i += 1) sum += bins[i];
    const raw = sum / end / 255;
    peak = Math.max(raw, peak * 0.9995);
    const target = Math.min(1, raw / Math.max(peak, 0.08));
    level += (target - level) * (target > level ? 0.5 : Math.min(1, dt * 4));

    /* Fold the spectrum into bands on a roughly logarithmic split — even
       slices would give a meter that is all bass and no treble, since most of
       an FFT's bins sit above anything you can hear as pitch. */
    for (let b = 0; b < BANDS; b += 1) {
      const from = Math.floor(bins.length * Math.pow(b / BANDS, 2) * 0.6);
      const to = Math.max(
        from + 1,
        Math.floor(bins.length * Math.pow((b + 1) / BANDS, 2) * 0.6),
      );
      let band = 0;
      for (let i = from; i < to; i += 1) band += bins[i];
      const value = Math.min(1, band / (to - from) / 200);
      bands[b] += (value - bands[b]) * (value > bands[b] ? 0.55 : 0.18);
    }
    return;
  }
  /* Silence: fade out rather than cut. */
  const fall = Math.min(1, dt * 3);
  level += (0 - level) * fall;
  if (level < 0.001) level = 0;
  for (let b = 0; b < BANDS; b += 1) {
    bands[b] += (0 - bands[b]) * fall;
    if (bands[b] < 0.001) bands[b] = 0;
  }
}

function tick(ts: number) {
  const dt = Math.min((ts - last) / 1000, 0.05);
  last = ts;
  /* Time only advances while the rig is alive, so a frozen beam stays exactly
     where the music left it instead of jumping when the next track starts. */
  now += dt * motion;
  sample(dt);
  /* Colour rides real time, not stage time: a cue should land while the rig
     is coasting to a stop as readily as mid-song. */
  blend(dt);
  for (const fn of listeners) fn(now, level, dt, motion);

  const settled = shown.every((colour, i) =>
    colour.every((c, k) => Math.abs(c - target[i][k]) < 0.6),
  );
  if (!analyser && motion < 0.002 && level === 0 && settled && ts >= wakeUntil) {
    /* Everything has come to rest. Park until a track hands us its signal,
       or until something calls `wakeStage`. */
    frame = 0;
    return;
  }
  frame = requestAnimationFrame(tick);
}

function start() {
  if (frame) return;
  last = performance.now();
  frame = requestAnimationFrame(tick);
}

function stop() {
  if (!frame) return;
  cancelAnimationFrame(frame);
  frame = 0;
}

/** Subscribe to the clock. Returns the unsubscribe. */
export function onStageFrame(fn: Listener) {
  listeners.add(fn);
  /* A subscriber joining a parked clock still needs one frame to settle into
     its rest state, so hand it the current values straight away. */
  fn(now, level, 0, motion);
  start();
  return () => {
    listeners.delete(fn);
    if (!listeners.size) stop();
  };
}

/**
 * The current per-band energy, bass first. Read it inside an `onStageFrame`
 * callback; the array is reused every frame rather than reallocated, so copy
 * anything you intend to keep.
 */
export function stageBands() {
  return bands;
}

/**
 * Keep the clock running for a moment even with no music — for motion that
 * answers to the visitor rather than to a track, such as the beams following
 * the pointer. Cheap to call on every pointer move: it only pushes the
 * deadline out, and the clock parks itself again once it passes.
 */
export function wakeStage(ms = 1200) {
  wakeUntil = Math.max(wakeUntil, performance.now() + ms);
  if (listeners.size) start();
}

/* ------------------------------------------------------------------ *
 * Colour
 * ------------------------------------------------------------------ */

export type Rgb = [number, number, number];

/** How many colours a rig can ask for. Three is what a sleeve reliably has. */
const SLOTS = 3;

/** The house look, and where the rig returns when nothing is playing. */
const HOUSE: Rgb = [251, 235, 28];

const target: Rgb[] = Array.from({ length: SLOTS }, () => [...HOUSE] as Rgb);
const shown: Rgb[] = Array.from({ length: SLOTS }, () => [...HOUSE] as Rgb);

/**
 * Hand over the colours of the record now playing, or null to go back to the
 * house yellow. Fewer than three colours are cycled round the slots, so a
 * two-colour sleeve still lights every head.
 */
export function setStagePalette(colours: Rgb[] | null) {
  const next = colours?.length ? colours : [HOUSE];
  for (let i = 0; i < SLOTS; i += 1) {
    target[i] = [...next[i % next.length]] as Rgb;
  }
  /* The clock parks in silence, and a cue that arrives just before the first
     note would otherwise sit in the queue until the music started. */
  wakeStage(1800);
}

/** Cross-fade the shown colours toward the cue. ~1 second, ease-out. */
function blend(dt: number) {
  const k = Math.min(1, dt * 2.6);
  for (let i = 0; i < SLOTS; i += 1) {
    for (let c = 0; c < 3; c += 1) {
      shown[i][c] += (target[i][c] - shown[i][c]) * k;
    }
  }
}

/** A key light's colour, as the `r,g,b` body of an `rgba()`. */
export function stageKey(slot: number) {
  const [r, g, b] = shown[slot % SLOTS];
  return `${Math.round(r)},${Math.round(g)},${Math.round(b)}`;
}

/**
 * A fill light's colour: the same hue lifted most of the way to white. The
 * fills are what keep the keys from flattening into one wash, so they stay
 * near-white and only carry a cast of the record's colour.
 */
export function stageFill(slot: number, mix = 0.76) {
  const [r, g, b] = shown[slot % SLOTS];
  const lift = (v: number) => Math.round(v + (255 - v) * mix);
  return `${lift(r)},${lift(g)},${lift(b)}`;
}

/** True while a real track is driving the level. */
export function stageIsLive() {
  return analyser !== null;
}
