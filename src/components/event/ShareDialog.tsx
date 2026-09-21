"use client";

import Image from "next/image";
import { useEffect, useId, useMemo, useState } from "react";

import { shareUrl } from "./shareLink";
import { useSignedIn } from "@/components/auth/session";
import { Sheet } from "@/components/ui/Sheet";
import { referral, shareCopy } from "@/data/account";

/**
 * Share & earn, from Figma 2389:12972: the reward stated in the subtitle, four
 * round share targets, then the link itself.
 *
 * "More" is the native share sheet. Putting it last, behind the three named
 * apps, is the right way round for the web: the browsers that have a share
 * sheet are phones, where it reaches everything installed, and the ones that
 * do not are desktops, where the three named targets are all there is. Either
 * way nothing here is a dead end.
 *
 * Signed out there is no code to tag the link with, so it goes out untagged
 * and the subtitle says why rather than promising Beats that could never be
 * credited.
 *
 * The field is the copy control, as the comp draws it — the whole row is the
 * button, not just the word "Copy".
 */

type Target = {
  id: string;
  label: string;
  icon: string;
  /** Absent for "More", which is handed to the browser instead. */
  href?: (url: string, text: string) => string;
};

const TARGETS: Target[] = [
  {
    id: "facebook",
    label: "Facebook",
    icon: "/assets/ic-share-facebook.svg",
    href: (url) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  },
  {
    id: "whatsapp",
    label: "WhatsApp",
    icon: "/assets/ic-share-whatsapp.svg",
    href: (url, text) =>
      `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`,
  },
  {
    id: "messenger",
    label: "Messenger",
    icon: "/assets/ic-share-messenger.svg",
    href: (url) =>
      `https://www.facebook.com/dialog/send?link=${encodeURIComponent(url)}&redirect_uri=${encodeURIComponent(url)}&app_id=`,
  },
  { id: "more", label: "More", icon: "/assets/ic-share-more.svg" },
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
     is signed in, and a copy in state is only a second version that can go
     stale. */
  const url = useMemo(() => shareUrl(Boolean(account)), [account]);
  const text = `${eventName} — SEVENPM`;

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
    } catch {
      /* Clipboard refused. Nothing to recover — the link is on screen. */
    }
  };

  const openNative = async () => {
    try {
      await navigator.share({ title: text, url });
    } catch {
      /* Dismissed, or unsupported. The named targets are still there. */
    }
  };

  /* The browser's own sheet is only offered where there is one. */
  const shown = TARGETS.filter(
    (target) =>
      target.href ||
      (typeof navigator !== "undefined" && typeof navigator.share === "function"),
  );

  return (
    <Sheet
      open
      onClose={onClose}
      title={shareCopy.title}
      subtitle={
        account ? shareCopy.subtitle(referral.beats) : shareCopy.signedOut
      }
      titleId={titleId}
      closeLabel={shareCopy.cancel}
    >
      <div className="flex flex-col gap-4 px-5 pb-5 pt-4">
        {/* Share to */}
        <section className="flex flex-col gap-2">
          <h3 className="m-0 font-[family-name:var(--font-display)] text-[15px] font-semibold leading-[22px] tracking-[0.19px] text-content-primary">
            {shareCopy.targets}
          </h3>
          <ul className="m-0 flex list-none items-start gap-2 p-0">
            {shown.map((target) => {
              const face = (
                <>
                  {/* The one round thing in the sheet: these read as app
                      badges, and a square badge reads as a tile. */}
                  <span className="flex aspect-square w-full items-center justify-center overflow-hidden border border-white/10 transition-colors group-hover:border-white/30">
                    <Image
                      src={target.icon}
                      alt=""
                      width={24}
                      height={24}
                      className="size-6"
                    />
                  </span>
                  <span className="w-full truncate text-center font-[family-name:var(--font-display)] text-[13px] font-semibold leading-5 tracking-[0.16px] text-content-primary">
                    {target.label}
                  </span>
                </>
              );

              return (
                <li key={target.id} className="min-w-0 flex-1">
                  {target.href ? (
                    <a
                      href={target.href(url, text)}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="group flex cursor-pointer flex-col items-center gap-2"
                    >
                      {face}
                    </a>
                  ) : (
                    <button
                      type="button"
                      onClick={openNative}
                      className="group flex w-full cursor-pointer flex-col items-center gap-2"
                    >
                      {face}
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        </section>

        {/* OR */}
        <div className="flex items-center justify-center gap-4 py-1">
          <span aria-hidden className="h-px flex-1 bg-white/10" />
          <span className="font-[family-name:var(--font-display)] text-[15px] leading-[22px] tracking-[0.15px] text-content-primary">
            {shareCopy.or}
          </span>
          <span aria-hidden className="h-px flex-1 bg-white/10" />
        </div>

        {/* Your link */}
        <section className="flex flex-col gap-2">
          <h3 className="m-0 font-[family-name:var(--font-display)] text-[15px] font-semibold leading-[22px] tracking-[0.19px] text-content-primary">
            {shareCopy.linkLabel}
          </h3>
          <button
            type="button"
            onClick={copy}
            aria-label={`${shareCopy.copyHint} — ${url}`}
            className="flex w-full cursor-pointer items-center gap-3 border-[0.5px] border-white/10 bg-white/5 py-3 pl-4 pr-2 text-left transition-colors hover:bg-white/10"
          >
            <span className="flex h-9 min-w-0 flex-1 items-center">
              <span className="truncate font-[family-name:var(--font-display)] text-[17px] leading-6 tracking-[0.085px] text-content-primary">
                {url}
              </span>
            </span>
            <span className="btn-secondary flex shrink-0 items-center justify-center p-1.5">
              <Image
                src="/assets/ic-copy-16.svg"
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
            </span>
          </button>
        </section>
      </div>
    </Sheet>
  );
}
