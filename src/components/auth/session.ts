"use client";

import { useSyncExternalStore } from "react";

/**
 * A stand-in for the session. There is no auth service behind this build, so
 * "signed in" is a single flag held in memory for the life of the tab: the
 * logout flow can show its real consequence — the header drops to the
 * logged-out state — without pretending an account system exists.
 *
 * It is held in `sessionStorage` so the logged-out state survives a reload —
 * without that, logging out and refreshing put the demo account straight back
 * and the header looked broken. A new tab starts signed in again, which is
 * what you want from a prototype and is impossible to mistake for real auth.
 *
 * Swap the three functions below for the real client the day there is one; no
 * component needs to change.
 */

const KEY = "sevenpm.signed-in";

function stored() {
  if (typeof window === "undefined") return true;
  try {
    return window.sessionStorage.getItem(KEY) !== "false";
  } catch {
    /* Private windows and blocked site data both throw here. */
    return true;
  }
}

function remember(value: boolean) {
  try {
    window.sessionStorage.setItem(KEY, String(value));
  } catch {
    /* Nothing to do: the flag still lives for this page. */
  }
}

let signedIn = stored();
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
  remember(false);
  listeners.forEach((listener) => listener());
}

export function signIn() {
  if (signedIn) return;
  signedIn = true;
  remember(true);
  listeners.forEach((listener) => listener());
}
