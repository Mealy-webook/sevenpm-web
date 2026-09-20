"use client";

import type { Rgb } from "./stageAudio";

/**
 * The colours a record is lit in, read off its own sleeve.
 *
 * The artwork is drawn into a 32-square canvas and its pixels are sorted by
 * hue. What comes back is the two or three hues the sleeve is actually made
 * of — not its average, which for almost any cover is mud.
 *
 * Every colour is then pushed into a band a stage lamp can work in: a beam
 * has to be bright enough to see against near-black and saturated enough to
 * read as a colour at all, so a dark sleeve gives a deep version of its own
 * hue rather than a beam nobody can see. Hue is never touched — that is the
 * part that belongs to the record.
 *
 * A sleeve with no colour in it (a black-and-white cover) returns null, and
 * the rig keeps its house yellow. Inventing a hue for a monochrome sleeve
 * would be making it up.
 *
 * Cross-origin artwork that does not allow reads taints the canvas and throws
 * on the way out; that is caught and also gives null.
 */

const SIZE = 32;
/** Hue buckets. Twelve is 30° each — enough to tell a red sleeve from an
 *  orange one without splitting one colour across two lamps. */
const BUCKETS = 12;

const cache = new Map<string, Rgb[] | null>();
const pending = new Map<string, Promise<Rgb[] | null>>();

function rgbToHsl(r: number, g: number, b: number) {
  const rr = r / 255;
  const gg = g / 255;
  const bb = b / 255;
  const max = Math.max(rr, gg, bb);
  const min = Math.min(rr, gg, bb);
  const l = (max + min) / 2;
  const d = max - min;
  if (!d) return { h: 0, s: 0, l };
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h: number;
  if (max === rr) h = ((gg - bb) / d + (gg < bb ? 6 : 0)) / 6;
  else if (max === gg) h = ((bb - rr) / d + 2) / 6;
  else h = ((rr - gg) / d + 4) / 6;
  return { h, s, l };
}

function hslToRgb(h: number, s: number, l: number): Rgb {
  if (!s) {
    const v = Math.round(l * 255);
    return [v, v, v];
  }
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const channel = (t: number) => {
    let x = t;
    if (x < 0) x += 1;
    if (x > 1) x -= 1;
    if (x < 1 / 6) return p + (q - p) * 6 * x;
    if (x < 1 / 2) return q;
    if (x < 2 / 3) return p + (q - p) * (2 / 3 - x) * 6;
    return p;
  };
  return [
    Math.round(channel(h + 1 / 3) * 255),
    Math.round(channel(h) * 255),
    Math.round(channel(h - 1 / 3) * 255),
  ];
}

function read(image: HTMLImageElement): Rgb[] | null {
  const canvas = document.createElement("canvas");
  canvas.width = SIZE;
  canvas.height = SIZE;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return null;
  ctx.drawImage(image, 0, 0, SIZE, SIZE);

  /* Throws on a tainted canvas — cross-origin artwork served without CORS. */
  const { data } = ctx.getImageData(0, 0, SIZE, SIZE);

  const weight = new Float64Array(BUCKETS);
  const hueX = new Float64Array(BUCKETS);
  const hueY = new Float64Array(BUCKETS);
  const sat = new Float64Array(BUCKETS);

  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] < 128) continue;
    const { h, s, l } = rgbToHsl(data[i], data[i + 1], data[i + 2]);
    /* Ignore what a lamp cannot use: the near-black, the near-white and the
       grey. They are most of a sleeve and none of its colour. */
    if (s < 0.22 || l < 0.12 || l > 0.9) continue;
    const bucket = Math.min(BUCKETS - 1, Math.floor(h * BUCKETS));
    /* Mid-tones describe a hue better than the extremes do. */
    const w = s * (1 - Math.abs(l - 0.5) * 1.1);
    weight[bucket] += w;
    /* Hue is circular: 359° and 1° are neighbours, so it is averaged as a
       direction rather than as a number. */
    hueX[bucket] += Math.cos(h * Math.PI * 2) * w;
    hueY[bucket] += Math.sin(h * Math.PI * 2) * w;
    sat[bucket] += s * w;
  }

  const total = weight.reduce((sum, value) => sum + value, 0);
  /* A cover with almost no colour in it: leave the rig alone. */
  if (total < SIZE * SIZE * 0.02) return null;

  const ranked = Array.from(weight.keys())
    .filter((bucket) => weight[bucket] > total * 0.06)
    .sort((a, b) => weight[b] - weight[a])
    .slice(0, 3);
  if (!ranked.length) return null;

  return ranked.map((bucket) => {
    let h = Math.atan2(hueY[bucket], hueX[bucket]) / (Math.PI * 2);
    if (h < 0) h += 1;
    const s = Math.min(0.95, Math.max(0.6, sat[bucket] / weight[bucket]));
    /* A fixed, bright lightness: this is the colour of a lamp, not of the
       sleeve's ink, and every beam has to carry the same weight of light. */
    return hslToRgb(h, s, 0.6);
  });
}

/** The stage colours for a piece of artwork. Resolves to null if it has none
 *  to give, or could not be read. */
export function paletteFrom(src: string): Promise<Rgb[] | null> {
  const known = cache.get(src);
  if (known !== undefined) return Promise.resolve(known);
  const running = pending.get(src);
  if (running) return running;

  const job = new Promise<Rgb[] | null>((resolve) => {
    const image = new Image();
    /* Without this the canvas is tainted and `getImageData` throws. Apple's
       artwork CDN allows it; anything that does not simply gives null. */
    image.crossOrigin = "anonymous";
    image.onload = () => {
      let result: Rgb[] | null = null;
      try {
        result = read(image);
      } catch {
        /* Tainted, or no 2D context. */
      }
      resolve(result);
    };
    image.onerror = () => resolve(null);
    image.src = src;
  }).then((result) => {
    cache.set(src, result);
    pending.delete(src);
    return result;
  });

  pending.set(src, job);
  return job;
}
