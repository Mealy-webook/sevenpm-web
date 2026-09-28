"use client";

import { useSyncExternalStore } from "react";

import type { Booking } from "@/data/account";
import { bookings as seed } from "@/data/account";

/**
 * The bookings the account shows.
 *
 * A booking made in the journey has to turn up here — without this module it
 * did not: the confirmation was the end of it, and the account went on
 * listing only the demo booking it shipped with.
 *
 * Nothing is persisted and nothing is sent anywhere, which is how the VIP
 * requests behave too (see [[requestsStore]]). A reload puts the demo back,
 * which is what a prototype should do; swap this for the real client the day
 * there is one and no component changes.
 */

let state: Booking[] = seed;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

export function useBookings() {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    () => state,
    () => seed,
  );
}

/**
 * Record a confirmed order. Newest first, so a booking just made is the one
 * you see. Re-recording the same order number is a no-op: the confirmation
 * re-renders, and a booking must not be listed twice for it.
 */
export function addBooking(booking: Booking) {
  if (state.some((item) => item.id === booking.id)) return;
  state = [booking, ...state];
  emit();
}

/** How many are still to come — what the sidebar counts. */
export function countUpcoming(list: Booking[], now = new Date()) {
  return list.filter((item) => new Date(item.endsAt ?? item.startsAt) >= now)
    .length;
}
