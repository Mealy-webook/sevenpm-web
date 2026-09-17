"use client";

/**
 * A whoosh for the confirmation page — the sound of something arriving.
 *
 * Synthesised, like the needle drop in `vinylNoise.ts`: white noise through a
 * band-pass whose centre sweeps up and back down while the level swells and
 * falls with it, over a soft low thump for weight. A sample would want a
 * licence, a download and a home; this is thirty lines that owe nobody.
 *
 * Everything is scheduled on the audio clock in one call, so there are no
 * timers and nothing to stop. It is quiet on purpose — a flourish under the
 * confetti, not an alert — and it never holds anything up: it fires on a
 * best-effort basis and returns at once. This runs after a click on Pay, so
 * the browser lets the context start.
 */

let ctx: AudioContext | null = null;

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

/** Total length of the sound, in seconds. */
const LENGTH = 0.9;

export function whoosh() {
  try {
    const context = audio();
    if (!context) return;
    if (context.state === "suspended") void context.resume();
    const now = context.currentTime;

    /* The air: a second of white noise. */
    const frames = Math.ceil(context.sampleRate * LENGTH);
    const buffer = context.createBuffer(1, frames, context.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < frames; i += 1) data[i] = Math.random() * 2 - 1;

    const source = context.createBufferSource();
    source.buffer = buffer;

    /* The sweep: a narrow band that climbs from a rumble to a hiss and
       settles back, which is what makes noise read as movement. */
    const band = context.createBiquadFilter();
    band.type = "bandpass";
    band.Q.value = 1.4;
    band.frequency.setValueAtTime(220, now);
    band.frequency.exponentialRampToValueAtTime(2400, now + 0.32);
    band.frequency.exponentialRampToValueAtTime(600, now + LENGTH);

    /* The swell, peaking as the sweep does. */
    const level = context.createGain();
    level.gain.setValueAtTime(0.0001, now);
    level.gain.exponentialRampToValueAtTime(0.16, now + 0.28);
    level.gain.exponentialRampToValueAtTime(0.0001, now + LENGTH);

    source.connect(band).connect(level).connect(context.destination);
    source.start(now);
    source.stop(now + LENGTH);

    /* The weight under it: one low sine, pitched down as it fades. */
    const thump = context.createOscillator();
    const thumpLevel = context.createGain();
    thump.type = "sine";
    thump.frequency.setValueAtTime(140, now + 0.2);
    thump.frequency.exponentialRampToValueAtTime(48, now + 0.6);
    thumpLevel.gain.setValueAtTime(0.0001, now + 0.2);
    thumpLevel.gain.exponentialRampToValueAtTime(0.12, now + 0.26);
    thumpLevel.gain.exponentialRampToValueAtTime(0.0001, now + 0.7);
    thump.connect(thumpLevel).connect(context.destination);
    thump.start(now + 0.2);
    thump.stop(now + 0.72);
  } catch {
    /* No Web Audio — the page is no worse for it. */
  }
}
