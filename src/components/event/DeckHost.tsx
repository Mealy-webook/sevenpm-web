"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

import { MiniPlayer } from "./MiniPlayer";
import {
  requestAdvance,
  requestStep,
  setPlaying,
  togglePlaying,
  useDeck,
} from "./deckStore";
import { useAudioAnalyser } from "./useAudioAnalyser";
import { needleDrop } from "./vinylNoise";
import { setStageAnalyser } from "@/components/motion/stageAudio";

/**
 * The one <audio> element on the site, mounted in the root layout.
 *
 * It lives here rather than in the event hero so that walking into the booking
 * journey does not kill the music. A media element cannot be moved between
 * parents without the browser stopping playback, so the only way to survive a
 * route change is never to have been inside the route.
 *
 * Everything that has to follow the element follows it here: the analyser the
 * lighting rig reads, the needle drop, and the floating player that takes over
 * once the deck itself is off screen.
 */

/** Shared so the deck on the event page can drive its own visualiser. */
export const analyserRef: { current: AnalyserNode | null } = { current: null };

export function DeckHost() {
  const deck = useDeck();
  const router = useRouter();
  const pathname = usePathname();
  const audioRef = useRef<HTMLAudioElement>(null);
  const blocked = useRef(false);

  const track = deck.tracks[deck.activeIndex];
  const analyser = useAudioAnalyser(audioRef, deck.playing);

  /* Hand the live node to whoever draws with it. */
  useEffect(() => {
    analyserRef.current = analyser.current;
    setStageAnalyser(deck.playing ? analyser.current : null);
    return () => setStageAnalyser(null);
  }, [deck.playing, analyser]);

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
     deck cannot be reached — scrolled past it, or on another route. */
  const reachable = pathname === deck.eventHref && deck.deckOnScreen;

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
        visible={Boolean(track) && !reachable}
        onToggle={togglePlaying}
        onPrev={() => requestStep(-1)}
        onNext={() => requestStep(1)}
        onOpen={() => router.push(deck.eventHref)}
      />
    </>
  );
}
