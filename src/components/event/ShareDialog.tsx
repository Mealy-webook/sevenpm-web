"use client";

import Image from "next/image";
import { useEffect, useId, useMemo, useState } from "react";

import { shareUrl } from "./shareLink";
import { useSignedIn } from "@/components/auth/session";
import { Sheet } from "@/components/ui/Sheet";
import { referral, shareCopy } from "@/data/account";

/**
 * Share an event, and say what sharing is worth.
 *
 * The point of the sheet is the Beats line: a plain share button gives people
 * no reason to press it, and the referral reward is the reason. It is the same
 * 500 the rewards programme promises for bringing someone new, read from one
 * constant so the two cannot drift.
 *
 * Signed out there is no code to tag the link with, so the link goes out
 * untagged and the sheet says why rather than promising Beats that could never
 * be credited.
 *
 * Where the browser has a share sheet of its own — every phone — the button
 * hands off to it instead of opening this. A native sheet reaches the apps
 * people actually use; a list of four is a worse version of it.
 */

type Target = { id: string; label: string; icon: string; href: (u: string, t: string) => string };

/* Only the networks we hold a real mark for and that have a share URL. There
   is deliberately no WhatsApp here: it is the channel most people in Morocco
   would actually use, but we have no licensed mark for it and drawing one by
   hand would be wrong. The native sheet — which is what phones get, and where
   WhatsApp lives — covers it. */
const TARGETS: Target[] = [
  {
    id: "x",
    label: "X",
    icon: "/assets/ic-social-x.svg",
    href: (url, text) =>
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
  },
  {
    id: "facebook",
    label: "Facebook",
    icon: "/assets/ic-social-facebook.svg",
    href: (url) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  },
];

export function ShareDialog({
  eventName,
  onClose,
}: {
  eventName: string;
  onClose: () => void;
}) {
  const titleId = useId();
  const account = useSignedIn();
  const [copied, setCopied] = useState(false);

  /* Derived, not stored: the link is a function of the address bar and of who
     is signed in, and keeping a copy in state only creates a second version
     of it that can go stale. */
  const url = useMemo(() => shareUrl(Boolean(account)), [account]);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  const text = `${eventName} — SEVENPM`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
    } catch {
      /* Clipboard refused — the field below is selectable, so there is still
         a way to take the link. */
    }
  };

  return (
    <Sheet
      open
      onClose={onClose}
      title={shareCopy.title}
      subtitle={shareCopy.subtitle}
      titleId={titleId}
      closeLabel={shareCopy.cancel}
    >
      <div className="flex flex-col gap-5 px-5 pb-5 pt-4">
        {/* What it is worth */}
        <section className="flex items-start gap-3 border border-white/10 bg-white/5 p-4">
          <Image
            src="/assets/ic-beats-earn.svg"
            alt=""
            width={24}
            height={24}
            className="size-6 shrink-0"
          />
          <span className="flex min-w-0 flex-col gap-1">
            <span className="font-[family-name:var(--font-display)] text-[15px] font-semibold leading-[22px] tracking-[0.19px] text-brand">
              {shareCopy.earn(referral.beats)}
            </span>
            <span className="font-[family-name:var(--font-display)] text-[13px] leading-5 tracking-[0.13px] text-content-secondary">
              {account ? shareCopy.earnDetail : shareCopy.signedOut}
            </span>
          </span>
        </section>

        {/* Where to */}
        <section className="flex flex-col gap-2">
          <h3 className="m-0 font-[family-name:var(--font-display)] text-[13px] font-bold uppercase leading-5 tracking-[0.16px] text-content-primary">
            {shareCopy.targets}
          </h3>
          <ul className="m-0 flex list-none gap-2 p-0">
            {TARGETS.map((target) => (
              <li key={target.id} className="flex-1">
                <a
                  href={url ? target.href(url, text) : undefined}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="btn-secondary flex h-full cursor-pointer flex-col items-center justify-center gap-2 p-3"
                >
                  <Image
                    src={target.icon}
                    alt=""
                    width={24}
                    height={24}
                    className="size-6"
                  />
                  <span className="font-[family-name:var(--font-display)] text-[12px] leading-4 tracking-[0.12px] text-content-primary">
                    {target.label}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </section>

        {/* The link itself */}
        <section className="flex flex-col gap-2">
          <h3 className="m-0 font-[family-name:var(--font-display)] text-[13px] font-bold uppercase leading-5 tracking-[0.16px] text-content-primary">
            {shareCopy.linkLabel}
          </h3>
          <div className="flex items-stretch gap-2">
            <input
              readOnly
              value={url}
              aria-label={shareCopy.linkLabel}
              onFocus={(event) => event.currentTarget.select()}
              className="min-w-0 flex-1 border border-white/10 bg-white/5 px-3 font-[family-name:var(--font-display)] text-[13px] leading-5 tracking-[0.13px] text-content-secondary outline-none focus:border-white/30"
            />
            <button
              type="button"
              onClick={copy}
              className="btn-secondary flex shrink-0 cursor-pointer items-center gap-1 p-3"
            >
              <Image
                src="/assets/ic-copy-20.svg"
                alt=""
                width={16}
                height={16}
                className="size-4"
              />
              <span
                className={`px-1 font-[family-name:var(--font-display)] text-[13px] font-semibold leading-5 tracking-[0.16px] ${
                  copied ? "text-[#22c55e]" : "text-content-primary"
                }`}
              >
                {copied ? shareCopy.copied : shareCopy.copy}
              </span>
            </button>
          </div>
        </section>
      </div>
    </Sheet>
  );
}
