"use client";

/**
 * The turntable's own noises: the needle landing, and the surface it lands on.
 *
 * Synthesised rather than sampled. A needle drop is a filtered noise burst
 * over a low thud, and vinyl surface noise is band-limited hiss with random
 * pops through it — perhaps sixty lines of Web Audio, against an audio file
 * that would need a licence, a download and a place to live. It also means the
 * crackle can run live underneath the track for as long as it plays instead of
 * looping a fixed take.
 *
 * It is deliberately quiet. This is the room the music is playing in, not a
 * sound effect: the drop peaks around a tenth of full scale and the surface
 * sits near a fiftieth.
 *
 * Nothing here is routed through the analyser — that taps the <audio> element
 * — so the lighting rig still moves to the music and not to the hiss.
 */

/** How long the needle takes to land, seconds. Music follows it. */
export const DROP_SECONDS = 0.42;

let ctx: AudioContext | null = null;
let noise: AudioBuffer | null = null;

/** The running surface-noise bed, if one is playing. */
let bed: { source: AudioBufferSourceNode; gain: GainNode } | null = null;
let popTimer: ReturnType<typeof setTimeout> | null = null;

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

/** Two seconds of white noise, reused for everything here. */
function noiseBuffer(context: AudioContext) {
  if (noise) return noise;
  const frames = context.sampleRate * 2;
  noise = context.createBuffer(1, frames, context.sampleRate);
  const data = noise.getChannelData(0);
  for (let i = 0; i < frames; i += 1) data[i] = Math.random() * 2 - 1;
  return noise;
}

/** A single click of dust, a few milliseconds long. */
function pop(context: AudioContext, at: number, level: number) {
  const source = context.createBufferSource();
  source.buffer = noiseBuffer(context);
  source.loop = true;

  const shape = context.createBiquadFilter();
  shape.type = "bandpass";
  shape.frequency.value = 1800 + Math.random() * 2600;
  shape.Q.value = 1.4;

  const gain = context.createGain();
  gain.gain.setValueAtTime(level, at);
  gain.gain.exponentialRampToValueAtTime(0.0001, at + 0.014);

  source.connect(shape).connect(gain).connect(context.destination);
  source.start(at);
  source.stop(at + 0.02);
}

/**
 * The needle landing: a broadband knock, a low thud under it, and a short
 * scrape as it settles into the groove.
 */
export async function needleDrop() {
  const context = audio();
  if (!context) return;
  if (context.state === "suspended") {
    /* Refused because there has been no gesture yet — the music still goes
       ahead without us. */
    try {
      await context.resume();
    } catch {
      return;
    }
  }

  const now = context.currentTime;

  // The knock.
  const knock = context.createBufferSource();
  knock.buffer = noiseBuffer(context);
  knock.loop = true;
  const knockTone = context.createBiquadFilter();
  knockTone.type = "bandpass";
  knockTone.frequency.value = 1400;
  knockTone.Q.value = 0.9;
  const knockGain = context.createGain();
  knockGain.gain.setValueAtTime(0.0001, now);
  knockGain.gain.exponentialRampToValueAtTime(0.1, now + 0.006);
  knockGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.16);
  knock.connect(knockTone).connect(knockGain).connect(context.destination);
  knock.start(now);
  knock.stop(now + 0.2);

  // The thud of the arm's weight.
  const thud = context.createOscillator();
  thud.type = "sine";
  thud.frequency.setValueAtTime(110, now);
  thud.frequency.exponentialRampToValueAtTime(42, now + 0.14);
  const thudGain = context.createGain();
  thudGain.gain.setValueAtTime(0.0001, now);
  thudGain.gain.exponentialRampToValueAtTime(0.085, now + 0.008);
  thudGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);
  thud.connect(thudGain).connect(context.destination);
  thud.start(now);
  thud.stop(now + 0.22);

  // Settling into the groove.
  const scrape = context.createBufferSource();
  scrape.buffer = noiseBuffer(context);
  scrape.loop = true;
  const scrapeTone = context.createBiquadFilter();
  scrapeTone.type = "highpass";
  scrapeTone.frequency.setValueAtTime(5200, now + 0.05);
  scrapeTone.frequency.exponentialRampToValueAtTime(900, now + 0.34);
  const scrapeGain = context.createGain();
  scrapeGain.gain.setValueAtTime(0.0001, now + 0.05);
  scrapeGain.gain.exponentialRampToValueAtTime(0.04, now + 0.1);
  scrapeGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.36);
  scrape.connect(scrapeTone).connect(scrapeGain).connect(context.destination);
  scrape.start(now + 0.05);
  scrape.stop(now + 0.38);

  await new Promise((done) => setTimeout(done, DROP_SECONDS * 1000));
}

/** Surface noise under the track: band-limited hiss, plus dust. */
export function startCrackle() {
  const context = audio();
  if (!context || bed) return;

  const source = context.createBufferSource();
  source.buffer = noiseBuffer(context);
  source.loop = true;

  const low = context.createBiquadFilter();
  low.type = "highpass";
  low.frequency.value = 1200;
  const high = context.createBiquadFilter();
  high.type = "lowpass";
  high.frequency.value = 7000;

  const gain = context.createGain();
  gain.gain.setValueAtTime(0.0001, context.currentTime);
  gain.gain.linearRampToValueAtTime(0.02, context.currentTime + 0.5);

  source.connect(low).connect(high).connect(gain).connect(context.destination);
  source.start();
  bed = { source, gain };

  /* Dust is irregular by nature, so each click schedules the next one rather
     than running off a fixed interval. */
  const scatter = () => {
    if (!bed || !ctx) return;
    pop(ctx, ctx.currentTime + 0.01, 0.02 + Math.random() * 0.05);
    popTimer = setTimeout(scatter, 120 + Math.random() * 900);
  };
  popTimer = setTimeout(scatter, 300);
}

export function stopCrackle() {
  if (popTimer) {
    clearTimeout(popTimer);
    popTimer = null;
  }
  if (!bed || !ctx) return;

  const { source, gain } = bed;
  bed = null;
  const end = ctx.currentTime + 0.35;
  gain.gain.cancelScheduledValues(ctx.currentTime);
  gain.gain.setValueAtTime(gain.gain.value, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(0.0001, end);
  source.stop(end + 0.05);
}
