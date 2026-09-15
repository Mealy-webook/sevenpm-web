"use client";

/**
 * The sound of dropping the needle: the click of it landing, the weight of the
 * arm behind it, and a moment of groove hiss before the track comes in. The
 * hiss carries on under the first second of music and then it is gone.
 *
 * Synthesised rather than sampled. A needle drop is a click over a low thud
 * and a short scrape; groove noise is band-limited hiss with dust through it.
 * That is maybe a hundred lines of Web Audio against an audio file that would
 * need a licence, a download and somewhere to live.
 *
 * The whole thing is scheduled on the audio clock in one go — every envelope,
 * every speck of dust — so it needs no timers, cannot be left running, and
 * nothing has to remember to stop it.
 *
 * It is deliberately quiet: this is the room the record is playing in, not a
 * sound effect.
 *
 * Nothing here goes through the analyser, which taps the <audio> element, so
 * the lighting rig moves to the music and not to the hiss. And nothing here is
 * ever allowed to hold the music up: a browser will not start an AudioContext
 * before the visitor has interacted with the page, and a `resume()` asked for
 * too early can sit unresolved rather than failing — so this reports how long
 * it needs and returns zero when it made no sound, instead of handing the
 * caller a promise to wait on.
 */

/** Needle down to the groove settling. */
const DROP = 0.45;
/** Groove hiss on its own before the track starts. */
const LEAD = 0.8;
/** How long the hiss lasts under the opening of the track. */
const TAIL = 1.1;

let ctx: AudioContext | null = null;
let noise: AudioBuffer | null = null;

function audio() {
  if (ctx) return ctx;
  const Ctor =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;
  if (!Ctor) return null;
  ctx = new Ctor();
  return ctx;
}

/** Two seconds of white noise, the raw material for everything here. */
function noiseBuffer(context: AudioContext) {
  if (noise) return noise;
  const frames = context.sampleRate * 2;
  noise = context.createBuffer(1, frames, context.sampleRate);
  const data = noise.getChannelData(0);
  for (let i = 0; i < frames; i += 1) data[i] = Math.random() * 2 - 1;
  return noise;
}

type Band = {
  type: BiquadFilterType;
  from: number;
  /** Sweep to this by `until`, if given. */
  to?: number;
  q?: number;
};

/**
 * A shaped burst of noise: one filter, one gain envelope, scheduled and
 * self-stopping. Everything but the low thud is built from this.
 */
function burst(
  context: AudioContext,
  at: number,
  length: number,
  peak: number,
  band: Band,
  attack = 0.004,
) {
  const source = context.createBufferSource();
  source.buffer = noiseBuffer(context);
  source.loop = true;

  const filter = context.createBiquadFilter();
  filter.type = band.type;
  filter.frequency.setValueAtTime(band.from, at);
  if (band.to) filter.frequency.exponentialRampToValueAtTime(band.to, at + length);
  if (band.q) filter.Q.value = band.q;

  const gain = context.createGain();
  gain.gain.setValueAtTime(0.0001, at);
  gain.gain.exponentialRampToValueAtTime(peak, at + attack);
  gain.gain.exponentialRampToValueAtTime(0.0001, at + length);

  source.connect(filter).connect(gain).connect(context.destination);
  source.start(at);
  source.stop(at + length + 0.02);
}

/**
 * Drops the needle and runs the groove under the opening of the track.
 *
 * Returns how many milliseconds the caller should hold the music back — zero
 * if nothing sounded, because silence must never delay a track.
 */
export function needleDrop() {
  const context = audio();
  if (!context) return 0;

  if (context.state !== "running") {
    /* Ask to start, but never wait on the answer. The next play gets it. */
    void context.resume().catch(() => {});
    return 0;
  }

  const t = context.currentTime;

  /* The click of the tip meeting the record — brief and bright, the part that
     actually reads as "needle" rather than as a generic thump. */
  burst(context, t, 0.03, 0.14, { type: "highpass", from: 2600 }, 0.001);

  /* The arm's weight coming down through the plinth. */
  const thud = context.createOscillator();
  thud.type = "sine";
  thud.frequency.setValueAtTime(150, t);
  thud.frequency.exponentialRampToValueAtTime(48, t + 0.13);
  const thudGain = context.createGain();
  thudGain.gain.setValueAtTime(0.0001, t);
  thudGain.gain.exponentialRampToValueAtTime(0.09, t + 0.008);
  thudGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.22);
  thud.connect(thudGain).connect(context.destination);
  thud.start(t);
  thud.stop(t + 0.24);

  /* Body under the click, so it lands on something. */
  burst(context, t, 0.12, 0.07, { type: "lowpass", from: 320 }, 0.003);

  /* Settling across a groove or two before it sits down. */
  burst(context, t + 0.04, 0.26, 0.045, {
    type: "bandpass",
    from: 4200,
    to: 900,
    q: 0.8,
  });

  /* The groove itself: it comes up after the needle settles, plays alone
     through the lead-in, and is gone shortly after the music arrives. */
  const groove = context.createBufferSource();
  groove.buffer = noiseBuffer(context);
  groove.loop = true;

  const low = context.createBiquadFilter();
  low.type = "highpass";
  low.frequency.value = 900;
  const high = context.createBiquadFilter();
  high.type = "lowpass";
  high.frequency.value = 6500;

  const grooveGain = context.createGain();
  const grooveStart = t + DROP * 0.4;
  const musicAt = t + DROP + LEAD;
  const grooveEnd = musicAt + TAIL;
  grooveGain.gain.setValueAtTime(0.0001, grooveStart);
  grooveGain.gain.exponentialRampToValueAtTime(0.03, grooveStart + 0.18);
  grooveGain.gain.setValueAtTime(0.03, musicAt);
  grooveGain.gain.exponentialRampToValueAtTime(0.0001, grooveEnd);

  groove
    .connect(low)
    .connect(high)
    .connect(grooveGain)
    .connect(context.destination);
  groove.start(grooveStart);
  groove.stop(grooveEnd + 0.05);

  /* Dust. Scattered by hand across the window rather than spaced evenly,
     because evenly spaced clicks read as a fault rather than as a record. */
  for (let at = grooveStart + 0.1; at < grooveEnd - 0.1; ) {
    burst(
      context,
      at,
      0.012,
      0.025 + Math.random() * 0.045,
      { type: "bandpass", from: 1800 + Math.random() * 2800, q: 1.4 },
      0.001,
    );
    at += 0.09 + Math.random() * 0.5;
  }

  return (DROP + LEAD) * 1000;
}
