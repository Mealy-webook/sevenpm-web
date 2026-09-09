"use client";

import { useEffect, useRef } from "react";

/**
 * Taps a Web Audio analyser off the hero's <audio> element so the visualiser
 * can read the real signal.
 *
 * The graph is built once, lazily, on the first play — which is a user gesture,
 * so the AudioContext is allowed to start. `createMediaElementSource` may only
 * be called once per element, hence the refs.
 *
 * Reading the samples needs the audio to be CORS-clean; the Apple previews in
 * `events.ts` are (`access-control-allow-origin: *`), and the <audio> element
 * carries `crossOrigin="anonymous"`. If a future source isn't, the analyser
 * simply reads silence and the wave falls back to its idle drift.
 */
export function useAudioAnalyser(
  audioRef: React.RefObject<HTMLAudioElement | null>,
  playing: boolean,
) {
  const analyserRef = useRef<AnalyserNode | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);

  useEffect(() => {
    if (!playing) return;
    const audio = audioRef.current;
    if (!audio) return;

    if (!analyserRef.current) {
      try {
        const Ctor =
          window.AudioContext ??
          (window as unknown as { webkitAudioContext?: typeof AudioContext })
            .webkitAudioContext;
        if (!Ctor) return;

        const ctx = new Ctor();
        const source = ctx.createMediaElementSource(audio);
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 2048;
        analyser.smoothingTimeConstant = 0.7;
        source.connect(analyser);
        analyser.connect(ctx.destination);

        ctxRef.current = ctx;
        sourceRef.current = source;
        analyserRef.current = analyser;
      } catch {
        // No analyser — the wave keeps its idle drift.
      }
    }

    void ctxRef.current?.resume();
  }, [audioRef, playing]);

  useEffect(() => {
    const ctx = ctxRef.current;
    return () => {
      void ctx?.close();
    };
  }, []);

  return analyserRef;
}
