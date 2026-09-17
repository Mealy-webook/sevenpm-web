"use client";

import { accountUser, referral } from "@/data/account";

/**
 * The link that gets shared: this page, cleaned of any fragment or inherited
 * referral tag, and tagged with the sharer's own code when there is an account
 * to credit.
 *
 * One function rather than two, because the button and the sheet must produce
 * the same link — a native share that credited someone different from the
 * copied one would be a bug nobody would think to look for.
 *
 * Returns "" on the server, where there is no location to read.
 */
export function shareUrl(signedIn: boolean) {
  if (typeof window === "undefined") return "";
  const here = new URL(window.location.href);
  here.hash = "";
  here.searchParams.delete(referral.param);
  if (signedIn) here.searchParams.set(referral.param, accountUser.referralCode);
  return here.toString();
}
