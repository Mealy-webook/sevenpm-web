"use client";

import { useSyncExternalStore } from "react";

/**
 * VIP box enquiries, from sending one to paying for it.
 *
 * A box is arranged rather than bought, so a request has a life of its own
 * after the form closes: the team reviews it, prices it, and the visitor
 * accepts or declines before any money is asked for. That is four states,
 * and the account needs somewhere to show them — without it a sent enquiry
 * simply disappears, which is what it did before this module existed.
 *
 * Nothing is persisted and nothing is sent anywhere. A reload puts the demo
 * back, which is what a prototype should do; swap this for the real client
 * the day there is one and no component changes.
 */

export type RequestStatus =
  /** Sent. Waiting on the team. */
  | "review"
  /** Priced. Waiting on the visitor. */
  | "quoted"
  /** Accepted. A payment link has been sent. */
  | "accepted"
  | "paid"
  | "declined";

export type BoxRequest = {
  reference: string;
  eventName: string;
  eventSlug: string;
  /** Which nights, already written out. */
  nights: string;
  guests: number;
  /** How the team will reach them. */
  email: string;
  status: RequestStatus;
  /** Set once the team has priced it. */
  quote?: number;
  /** One line under the quote — what it covers. */
  quoteNote?: string;
};

/**
 * One request already in flight, so the account shows the interesting state
 * rather than only an empty list. It is dated and referenced like a real
 * one; a freshly sent enquiry lands beside it in "review".
 */
const seed: BoxRequest[] = [
  {
    reference: "VIP-4C81A2",
    eventName: "Jazzablanca",
    eventSlug: "jazzablanca",
    nights: "18 Sep, 19 Sep",
    guests: 10,
    email: "ahmed@gmail.com",
    status: "quoted",
    quote: 12000,
    quoteNote: "Box for 10, both nights, catering and parking included.",
  },
];

let state: BoxRequest[] = seed;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

export function useRequests() {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    () => state,
    () => seed,
  );
}

/** Sending the form. Re-sending the same reference does not duplicate it. */
export function addRequest(request: BoxRequest) {
  if (state.some((item) => item.reference === request.reference)) return;
  state = [request, ...state];
  emit();
}

export function setRequestStatus(reference: string, status: RequestStatus) {
  state = state.map((item) =>
    item.reference === reference ? { ...item, status } : item,
  );
  emit();
}

/** How many are waiting on the visitor rather than on the team. */
export function countAwaitingYou(requests: BoxRequest[]) {
  return requests.filter(
    (item) => item.status === "quoted" || item.status === "accepted",
  ).length;
}
