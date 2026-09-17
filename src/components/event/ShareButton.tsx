"use client";

import Image from "next/image";
import { useState } from "react";

import { ShareDialog } from "./ShareDialog";
import { shareUrl } from "./shareLink";
import { useSignedIn } from "@/components/auth/session";
import { shareCopy } from "@/data/account";

/**
 * "Share" on the event page.
 *
 * Where the browser has a share sheet of its own it hands off to that — it
 * reaches Messages, WhatsApp and everything else already on the phone, which
 * no list of three links can match. Everywhere else it opens our own sheet.
 *
 * Either way the link carries the visitor's referral code when they are signed
 * in, so a booking made through it can be credited back in Beats.
 */
export function ShareButton({ eventName }: { eventName: string }) {
  const account = useSignedIn();
  const [open, setOpen] = useState(false);

  const share = async () => {
    if (typeof navigator.share === "function") {
      try {
        await navigator.share({
          title: `${eventName} — SEVENPM`,
          text: shareCopy.subtitle,
          url: shareUrl(Boolean(account)),
        });
        return;
      } catch {
        /* Dismissed, or the sheet refused. Fall through to ours rather than
           leaving the press with nothing to show for it. */
      }
    }
    setOpen(true);
  };

  return (
    <>
      <button
        type="button"
        onClick={share}
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
