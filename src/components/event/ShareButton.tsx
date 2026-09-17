"use client";

import Image from "next/image";
import { useState } from "react";

import { ShareDialog } from "./ShareDialog";
import { shareCopy } from "@/data/account";

/**
 * "Share & Earn" on the event page.
 *
 * It always opens our own sheet. The browser's share sheet is still reachable
 * — it is the "More" tile inside — but it is no longer what the button does,
 * because handing straight off would skip the one thing the sheet exists to
 * say: that sharing pays in Beats.
 *
 * The link carries the visitor's referral code when they are signed in, so a
 * booking made through it can be credited back.
 */
export function ShareButton({ eventName }: { eventName: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="btn-secondary flex cursor-pointer items-center justify-center gap-1 p-3"
      >
        <Image
          src="/assets/ic-share-16.svg"
          alt=""
          width={16}
          height={16}
          className="size-4"
        />
        <span className="px-1 font-[family-name:var(--font-display)] text-[15px] font-semibold leading-[22px] tracking-[0.19px] text-content-primary">
          {shareCopy.open}
        </span>
      </button>

      {open && (
        <ShareDialog eventName={eventName} onClose={() => setOpen(false)} />
      )}
    </>
  );
}
