"use client";

import { useSyncExternalStore } from "react";

import type { PlaylistTrack } from "@/data/events";

/**
 * What is playing, kept above the router.
 *
 * The deck used to own its own <audio> element inside the event page's hero,
 * which meant the music stopped the moment you pressed "Get your ticket" —
 * the element went with the route. The element now lives in `DeckHost`,
 * mounted once in the root layout, and this is the state it plays from.
 *
 * Nothing is persisted. A reload is a new session and starts silent, which is
 * the only polite default for audio.
 */

export type Deck = {
  tracks: PlaylistTrack[];
  activeIndex: number;
  playing: boolean;
  /** The event this deck belongs to, so the mini player can offer a way back. */
  eventName: string;
  eventHref: string;
  /** Bumped when a track ends and the next one should be dealt. */
  advanceRequest: number;
  /** Bumped by the mini player's skip buttons. */
  stepRequest?: { id: number; dir: -1 | 1 };
  /**
   * Whether the deck itself is on screen. The floating player is the deck's
   * stand-in, so it appears exactly when the deck cannot be reached — scrolled
   * past it, or on another route entirely.
   */
  deckOnScreen: boolean;
};

const empty: Deck = {
  tracks: [],
  activeIndex: 0,
  playing: false,
  eventName: "",
  eventHref: "",
  advanceRequest: 0,
  deckOnScreen: false,
};

let state: Deck = empty;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((fn) => fn());
}

function set(next: Partial<Deck>) {
  state = { ...state, ...next };
  emit();
}

export function useDeck() {
  return useSyncExternalStore(
    (fn) => {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
    () => state,
    () => empty,
  );
}

/**
 * An event page announcing its playlist. Re-announcing the same event leaves
 * playback alone — otherwise returning from the booking journey would stop
 * the music this whole module exists to keep running.
 */
export function loadDeck(deck: {
  tracks: PlaylistTrack[];
  eventName: string;
  eventHref: string;
}) {
  if (state.eventHref === deck.eventHref) return;
  state = { ...empty, ...deck };
  emit();
}

export function selectTrack(index: number) {
  set({ activeIndex: index, playing: false });
}

export function setPlaying(playing: boolean) {
  if (state.playing === playing) return;
  set({ playing });
}

export function togglePlaying() {
  set({ playing: !state.playing });
}

export function requestAdvance() {
  set({ advanceRequest: state.advanceRequest + 1 });
}

export function setDeckOnScreen(on: boolean) {
  if (state.deckOnScreen === on) return;
  set({ deckOnScreen: on });
}

export function requestStep(dir: -1 | 1) {
  set({ stepRequest: { id: (state.stepRequest?.id ?? 0) + 1, dir } });
}
