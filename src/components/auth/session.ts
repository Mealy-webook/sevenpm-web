"use client";

import { useSyncExternalStore } from "react";

/**
 * A stand-in for the session. There is no auth service behind this build, so
 * "signed in" is a single flag held in memory for the life of the tab: the
 * logout flow can show its real consequence — the header drops to the
 * logged-out state — without pretending an account system exists.
 *
 * Nothing is persisted on purpose. A reload puts the demo account back, which
 * is what you want from a prototype and is impossible to mistake for real
 * sign-out. Swap the three functions below for the real client the day there
 * is one; no component needs to change.
 */

let signedIn = true;
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return signedIn;
}

/** The server has no session of its own, so it always renders signed in. */
function getServerSnapshot() {
  return true;
}

export function useSignedIn() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function signOut() {
  if (!signedIn) return;
  signedIn = false;
  listeners.forEach((listener) => listener());
}

export function signIn() {
  if (signedIn) return;
  signedIn = true;
  listeners.forEach((listener) => listener());
}
