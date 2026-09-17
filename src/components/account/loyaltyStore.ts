"use client";

import { useSyncExternalStore } from "react";

import {
  loyaltyActivity,
  loyaltyBalance,
  type LoyaltyEntry,
  type LoyaltyReward,
} from "@/data/account";

/**
 * What redeeming changes, shared between the banner and the panel.
 *
 * The two sit in different slots of the account shell — the band at the top
 * and the content column below — so the balance cannot live in either one's
 * state without the other showing a stale number.
 *
 * Nothing is persisted on purpose. A reload puts the demo balance back, which
 * is what a prototype should do; swap this module for the real client the day
 * there is one and neither component changes.
 */

type State = {
  balance: number;
  redeemed: string[];
  entries: LoyaltyEntry[];
};

let state: State = {
  balance: loyaltyBalance,
  redeemed: [],
  entries: loyaltyActivity,
};

const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return state;
}

/** The server has no redemptions of its own, so it renders the demo state. */
const serverState: State = {
  balance: loyaltyBalance,
  redeemed: [],
  entries: loyaltyActivity,
};

function getServerSnapshot() {
  return serverState;
}

export function useLoyalty() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function redeemReward(reward: LoyaltyReward) {
  if (state.redeemed.includes(reward.id)) return;
  if (state.balance < reward.cost) return;

  state = {
    balance: state.balance - reward.cost,
    redeemed: [...state.redeemed, reward.id],
    entries: [
      {
        id: `r-${reward.id}-${Date.now()}`,
        kind: "burn",
        label: "Burn beats",
        time: new Date().toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
        }),
        detail: reward.name,
        beats: -reward.cost,
        dayOffset: 0,
      },
      ...state.entries,
    ],
  };
  listeners.forEach((listener) => listener());
}

/* Orders already credited, so a confirmation that mounts twice — React's
   development double-invocation, or a re-render of the page — pays once. */
const credited = new Set<string>();

/**
 * Credit Beats for a booking. The confirmation page calls this with the order
 * number, and the header's chip and the account's activity feed pick it up
 * through the same subscription redeeming uses.
 *
 * The lifetime total (`loyaltyLifetime`, which sets the membership) is a
 * constant in the data and is not touched here: earning is real enough for a
 * prototype when the spendable balance moves.
 */
export function earnBeats(orderNumber: string, amount: number, detail: string) {
  if (credited.has(orderNumber)) return;
  credited.add(orderNumber);

  state = {
    ...state,
    balance: state.balance + amount,
    entries: [
      {
        id: `e-${orderNumber}`,
        kind: "earn",
        label: "Earn beats",
        time: new Date().toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
        }),
        detail,
        beats: amount,
        dayOffset: 0,
      },
      ...state.entries,
    ],
  };
  listeners.forEach((listener) => listener());
}
