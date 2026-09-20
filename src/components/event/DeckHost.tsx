"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

import { MiniPlayer } from "./MiniPlayer";
import {
  requestAdvance,
  requestStep,
  setPlaying,
  setResumeAt,
  togglePlaying,
  useDeck,
} from "./deckStore";
import { useAudioAnalyser } from "./useAudioAnalyser";
import { needleDrop } from "./vinylNoise";
import { paletteFrom } from "@/components/motion/artworkPalette";
import { setStageAnalyser, setStagePalette } from "@/components/motion/stageAudio";

/**
 * The one <audio> element on the site, mounted in the root layout.
 *
 * It lives here rather than in the event hero so that walking into the booking
 * journey does not kill the music. A media element cannot be moved between
 * parents without the browser stopping playback, so the only way to survive a
 * route change is never to have been inside the route.
 *
 * Everything that has to follow the element follows it here: the analyser the
 * lighting rig reads, the colour it is lit in, the needle drop, and the
 * floating player that takes over once the deck itself is off screen.
 */

/** Shared so the deck on the event page can drive its own visualiser. */
export const analyserRef: { current: AnalyserNode | null } = { current: null };

/**
 * The element itself, so a screen taking the music over can read where it got
 * to and carry on from there — and write a position back on the way out.
 */
export const deckAudioRef: { current: HTMLAudioElement | null } = {
  current: null,
};

export function DeckHost() {
  const deck = useDeck();
  const router = useRouter();
  const pathname = usePathname();
  const audioRef = useRef<HTMLAudioElement>(null);
  const blocked = useRef(false);

  useEffect(() => {
    deckAudioRef.current = audioRef.current;
    return () => {
      deckAudioRef.current = null;
    };
  }, []);

  const track = deck.tracks[deck.activeIndex];
  const analyser = useAudioAnalyser(audioRef, deck.playing);

  /* Hand the live node to whoever draws with it. */
  useEffect(() => {
    analyserRef.current = analyser.current;
    setStageAnalyser(deck.playing ? analyser.current : null);
    return () => setStageAnalyser(null);
  }, [deck.playing, analyser]);

  /* Light the room in the record's own colours, read off its sleeve. The
     rig cross-fades to them, so putting a track on is a lighting cue.

     The palette is not given up when the music pauses — a paused record is
     still the record on the deck. It goes back to the house yellow only when
     the deck has nothing on it at all. */
  const artwork = track?.artworkUrl;
  useEffect(() => {
    if (!artwork) {
      setStagePalette(null);
      return;
    }
    let live = true;
    paletteFrom(artwork).then((palette) => {
      /* A slow read that lands after the next track is already on would
         light the room in the wrong record. */
      if (live) setStagePalette(palette);
    });
    return () => {
      live = false;
    };
  }, [artwork]);

  /* Drop the needle, then bring the track in behind it. The wait is whatever
     the drop said it needed and nothing more — zero when the browser would
     not let it sound, so silence never holds the music up. */
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!deck.playing) {
      audio.pause();
      return;
    }
    if (!track?.audioSrc) return;

    const start = () => {
      audio.play().catch(() => {
        blocked.current = true;
        setPlaying(false);
      });
    };

    const wait = needleDrop();
    if (!wait) {
      start();
      return;
    }
    const timer = setTimeout(start, wait);
    return () => clearTimeout(timer);
  }, [deck.playing, deck.activeIndex, track?.audioSrc]);

  /* A screen handing the music back says where it got to. The element cannot
     be seeked until it knows how long the track is, so this waits for the
     metadata and then spends the position — once. */
  const resume = deck.resumeAt;
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !resume) return;
    if (resume.index !== deck.activeIndex) return;

    const seek = () => {
      if (Number.isFinite(audio.duration)) {
        audio.currentTime = Math.min(resume.time, audio.duration);
      }
      setResumeAt(undefined);
    };

    if (audio.readyState >= 1) seek();
    else audio.addEventListener("loadedmetadata", seek, { once: true });
    return () => audio.removeEventListener("loadedmetadata", seek);
  }, [resume, deck.activeIndex]);

  /* Autoplay is refused until the visitor has interacted. When that is what
     stopped us, arm the first gesture so the music starts the moment they
     touch anything. */
  useEffect(() => {
    let spent = false;
    const kick = () => {
      if (spent) return;
      spent = true;
      off();
      if (blocked.current) setPlaying(true);
    };
    const off = () => {
      window.removeEventListener("pointerdown", kick);
      window.removeEventListener("keydown", kick);
    };
    window.addEventListener("pointerdown", kick);
    window.addEventListener("keydown", kick);
    return off;
  }, []);

  /* The floating player stands in for the deck, so it shows exactly when the
     deck cannot be reached — scrolled past it, or on another route — and not
     at all where a screen has put up a player of its own. */
  const reachable = pathname === deck.eventHref && deck.deckOnScreen;
  const wanted = Boolean(track) && !reachable && !deck.handedOver;

  return (
    <>
      {/* The element is the truth about playback: a stall, a media-session
          pause or an OS interruption must not leave the platter turning. */}
      <audio
        ref={audioRef}
        src={track?.audioSrc}
        crossOrigin="anonymous"
        preload="none"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={requestAdvance}
      />

      <MiniPlayer
        track={track}
        playing={deck.playing}
        visible={wanted}
        onToggle={togglePlaying}
        onPrev={() => requestStep(-1)}
        onNext={() => requestStep(1)}
        onOpen={() => router.push(deck.eventHref)}
      />
    </>
  );
}
