"use client";

import Image from "next/image";

import type { PlaylistTrack } from "@/data/events";

/**
 * Floating player for the event page. Slides in at the bottom of the viewport
 * once the hero deck scrolls out of view and mirrors its state: the cover
 * spins while playing, prev/next run the same arm-and-disc swap on the deck.
 * Clicking the cover scrolls back to the deck.
 */

function artworkAt(url: string, px: number) {
  return url.replace(/\/\d+x\d+bb\./, `/${px}x${px}bb.`);
}

const btn =
  "flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-full transition-[background-color,transform] duration-300 active:scale-95";

export function MiniPlayer({
  track,
  playing,
  visible,
  onToggle,
  onPrev,
  onNext,
  onOpen,
}: {
  track: PlaylistTrack | undefined;
  playing: boolean;
  visible: boolean;
  onToggle: () => void;
  onPrev: () => void;
  onNext: () => void;
  onOpen: () => void;
}) {
  if (!track) return null;

  return (
    <div
      className="mini-player fixed inset-x-4 bottom-4 z-40 mx-auto flex w-auto max-w-[420px] items-center gap-3 border border-white/10 bg-[rgba(24,24,27,0.72)] p-2 pr-3 shadow-[0_24px_64px_rgba(0,0,0,0.5)] backdrop-blur-2xl sm:inset-x-auto sm:right-6 sm:bottom-6 sm:w-[400px]"
      data-visible={visible}
      data-playing={playing}
      role="region"
      aria-label="Now playing"
      aria-hidden={!visible}
    >
      <button
        type="button"
        onClick={onOpen}
        aria-label="Back to the record player"
        tabIndex={visible ? 0 : -1}
        className="relative block size-14 shrink-0 cursor-pointer overflow-hidden rounded-full bg-black"
      >
        <span className="cover absolute inset-0 block rounded-full">
          <Image
            src="/assets/hero-vinyl.png"
            alt=""
            fill
            sizes="56px"
            className="object-cover"
          />
          {track.artworkUrl && (
            <span className="absolute inset-[22%] block overflow-hidden rounded-full">
              <Image
                src={artworkAt(track.artworkUrl, 100)}
                alt=""
                fill
                sizes="32px"
                className="object-cover"
              />
            </span>
          )}
        </span>
      </button>

      <div className="flex min-w-0 flex-1 flex-col">
        <span className="truncate font-[family-name:var(--font-display)] text-[15px] font-semibold leading-[22px] text-content-primary">
          {track.title}
        </span>
        <span className="truncate font-[family-name:var(--font-display)] text-[13px] leading-5 text-content-secondary">
          {track.artist}
        </span>
      </div>

      <div className="flex items-center">
        <button
          type="button"
          onClick={onPrev}
          aria-label="Previous track"
          tabIndex={visible ? 0 : -1}
          className={`${btn} text-content-primary hover:bg-white/10`}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden
          >
            <path d="M5 4h2v12H5zM15.5 4.6v10.8a.6.6 0 0 1-.95.49L7.3 10.49a.6.6 0 0 1 0-.98l7.25-5.4a.6.6 0 0 1 .95.49Z" />
          </svg>
        </button>
        <button
          type="button"
          onClick={onToggle}
          aria-label={playing ? `Pause ${track.title}` : `Play ${track.title}`}
          aria-pressed={playing}
          tabIndex={visible ? 0 : -1}
          className={`${btn} bg-brand text-[#0b0b0e] hover:bg-[#fff35a]`}
        >
          {playing ? (
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden
            >
              <path d="M5 4h3.5v12H5zM11.5 4H15v12h-3.5z" />
            </svg>
          ) : (
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden
            >
              <path d="M6.5 4.3v11.4a.6.6 0 0 0 .92.5l8.6-5.7a.6.6 0 0 0 0-1L7.42 3.8a.6.6 0 0 0-.92.5Z" />
            </svg>
          )}
        </button>
        <button
          type="button"
          onClick={onNext}
          aria-label="Next track"
          tabIndex={visible ? 0 : -1}
          className={`${btn} text-content-primary hover:bg-white/10`}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden
          >
            <path d="M13 4h2v12h-2zM4.5 4.6v10.8a.6.6 0 0 0 .95.49l7.25-5.4a.6.6 0 0 0 0-.98L5.45 4.11a.6.6 0 0 0-.95.49Z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
