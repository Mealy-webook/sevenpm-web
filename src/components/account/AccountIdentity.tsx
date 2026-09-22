"use client";

import Image from "next/image";

import { useLoyalty } from "./loyaltyStore";
import {
  accountUser,
  loyaltyCopy,
  loyaltyLifetime,
  loyaltyTiers,
} from "@/data/account";

/**
 * Who is signed in, at the top of the account sidebar — from Figma
 * 2467:17847.
 *
 * The name is set in the display face at 160/116 inside the 293 column, so it
 * breaks across two lines and fills it; under it the membership sits in a
 * brand-tinted chip and the joining year in the caption size.
 *
 * This replaces the full-width member band that used to run under the header
 * on every account tab. The Beats card that lived in that band is on the
 * rewards screen now, which is the one screen it belongs to.
 *
 * The membership is read rather than written down: the highest tier whose
 * threshold the lifetime total has passed.
 */
export function AccountIdentity() {
  /* Subscribing keeps the chip honest if a redemption ever changes the tier
     while the page is open. */
  useLoyalty();

  const tier =
    [...loyaltyTiers]
      .reverse()
      .find((item) => loyaltyLifetime >= item.threshold) ?? loyaltyTiers[0];

  const [first, ...rest] = accountUser.name.split(" ");
  const last = rest.join(" ");

  return (
    <div className="flex w-full flex-col justify-center gap-2 [container-type:inline-size]">
      {/*
        One name per line, set as big as the column allows.

        Two limits decide the size, and it takes the smaller. Across: a
        five-letter word in this face is about 74% of the column's width per
        line, so 74cqw fills it exactly. Down: everything under the name —
        chip, year, five rows, divider, logout — is a fixed 417, the column
        starts 168 below the top of the screen, and two lines at this leading
        come to 1.36 times the size, so the name gets what is left of the
        screen. On a tall window the width wins and the name fills the column;
        on a short one the height wins and the whole menu still stands above
        the fold.
      */}
      <h1
        className="m-0 flex flex-col font-daltown text-[clamp(56px,17vw,132px)] uppercase leading-[0.68] text-white lg:text-[clamp(56px,min(74cqw,calc((100svh-602px)/1.36)),240px)]"
        data-no-split
      >
        <span className="block">{first}</span>
        {last && <span className="block">{last}</span>}
      </h1>

      <div className="flex flex-col items-start justify-center gap-2">
        <span className="flex items-center gap-1 bg-brand/10 px-3 py-2">
          <Image
            src="/assets/ic-crown-24.svg"
            alt=""
            width={20}
            height={20}
            className="size-5 shrink-0"
          />
          <span className="whitespace-nowrap font-[family-name:var(--font-display)] text-[13px] font-semibold leading-5 tracking-[0.16px] text-brand">
            {loyaltyCopy.memberLabel(tier.name)}
          </span>
        </span>
        <span className="font-[family-name:var(--font-display)] text-[12px] leading-4 tracking-[0.12px] text-content-secondary">
          {loyaltyCopy.memberSince}
        </span>
      </div>
    </div>
  );
}
