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

  return (
    <div className="flex w-full flex-col justify-center gap-2">
      <h1
        /* 160 in the 293 column, which is what makes the name break across
           two lines and fill it — Daltown is condensed enough that a smaller
           size fits "Ahmed Mealy" on one line and looks like a caption.
           
           Sized against the height the column actually has, because the whole
           sidebar has to stand above the fold. Everything under the name —
           chip, year, five rows, divider, logout — is a fixed 417, the column
           starts 168 below the top of the screen, and two lines of this face
           come to 1.5 times the size. So the name gets what is left, up to
           the comp's 160: at 900 that is the full 160, at 768 it is 85. */
        className="m-0 font-daltown text-[clamp(56px,14vw,120px)] uppercase leading-[0.73] text-white [overflow-wrap:anywhere] lg:text-[clamp(56px,calc((100svh-640px)/1.5),160px)]"
        data-no-split
      >
        {accountUser.name}
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
