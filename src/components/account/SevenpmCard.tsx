"use client";

import Image from "next/image";

import { sevenpmCardCopy } from "@/data/account";

/**
 * The SEVENPM cashless card on the wallet page — Figma 2479:24999.
 *
 * The comp draws the card as an object rather than as a card face: a brand
 * card tucked into a black leather wallet, with the balance and Top up
 * printed on the leather. Beside it sit what the card is for and Apple's
 * "Add to Apple Wallet" badge.
 *
 * Only the leather is a raster — Figma exports it at 1×, which a dark,
 * low-frequency texture survives. The card is CSS so its edge and the
 * wordmark stay sharp on a 2× screen, and the balance is live text, not
 * part of the picture.
 *
 * Tapping the wallet opens the pay code. The comp draws no control for it,
 * and the card itself is the natural place: it is what you hand over at the
 * till.
 *
 * Card faces are the one place the house square-edge rule gives way — a card
 * has rounded corners because a card has rounded corners, and Apple's badge
 * has the geometry Apple specifies.
 */
export function SevenpmCard({
  balance,
  currency,
  onDetails,
  onTopUp,
}: {
  balance: number;
  currency: string;
  onDetails: () => void;
  onTopUp: () => void;
}) {
  const copy = sevenpmCardCopy;

  return (
    <section
      aria-labelledby="sevenpm-card-title"
      className="flex flex-col gap-8 lg:flex-row lg:items-center lg:gap-8"
    >
      {/* The wallet: 412 × 250 in the comp, and everything inside it is
          placed as a share of that box so it scales as one object. */}
      <div className="relative aspect-[412/250] w-full shrink-0 overflow-hidden bg-bg-primary lg:w-[412px]">
        {/* The card, behind the pocket. */}
        <span className="absolute left-[5.31%] right-[5.05%] top-0 block h-[81.04%] overflow-hidden rounded-[18px] bg-brand">
          {/* The comp's sweep, angled across the face. */}
          <span
            aria-hidden
            className="absolute inset-y-[1.5%] left-[0.3%] right-[16.8%] block opacity-50"
            style={{
              backgroundImage:
                "linear-gradient(109.43deg, rgba(255,255,255,0) 31.99%, rgb(255,255,255) 50.37%, rgba(255,255,255,0) 68.76%)",
            }}
          />
          <Image
            src="/assets/wordmark.svg"
            alt="SEVENPM"
            width={1272}
            height={238}
            className="absolute left-[5.9%] top-[7.9%] w-[31.2%]"
          />
        </span>

        {/* The pocket. Its own ground is the page's, so it hides the card
            exactly where the comp does. */}
        <Image
          src="/assets/wallet-leather.png"
          alt=""
          width={412}
          height={226}
          aria-hidden
          className="absolute inset-x-0 top-[17.2%] block w-full"
        />

        <button
          type="button"
          onClick={onDetails}
          aria-label={copy.detailsTitle}
          className="absolute inset-0 block cursor-pointer"
        />

        <div className="pointer-events-none absolute left-[5.83%] right-[5.83%] top-[70%] flex items-center gap-6">
          <span className="flex min-w-0 flex-1 flex-col gap-1">
            <span className="truncate font-[family-name:var(--font-display)] text-[12px] leading-4 tracking-[0.12px] text-content-secondary">
              {copy.balanceLabel}
            </span>
            <span className="flex items-end gap-1 font-daltown uppercase">
              <span className="text-[56px] leading-[39px] text-content-primary">
                {balance.toLocaleString("en-US")}
              </span>
              <span className="text-[36px] leading-6 text-brand">
                {currency}
              </span>
            </span>
          </span>

          <button
            type="button"
            onClick={onTopUp}
            className="pointer-events-auto flex shrink-0 cursor-pointer items-center justify-center gap-1 bg-white p-3 font-[family-name:var(--font-display)] text-[15px] font-semibold leading-[22px] tracking-[0.1875px] text-[#18181b] transition-colors hover:bg-brand"
          >
            <Image
              src="/assets/ic-plus-20.svg"
              alt=""
              width={16}
              height={16}
              className="size-4"
            />
            <span className="px-1">{copy.topUp}</span>
          </button>
        </div>
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-6">
        <div className="flex flex-col gap-1">
          <h3
            id="sevenpm-card-title"
            className="m-0 font-[family-name:var(--font-display)] text-[18px] font-bold uppercase leading-6 tracking-[-0.09px] text-content-primary"
          >
            {copy.title}
          </h3>
          <p className="m-0 font-[family-name:var(--font-display)] text-[13px] leading-5 tracking-[0.13px] text-content-secondary">
            {copy.blurb}
          </p>
        </div>

        {/* Apple's badge, built to its own geometry with Apple's glyph. */}
        <button
          type="button"
          className="flex w-full cursor-pointer items-center justify-center gap-[5px] rounded-[7px] border-[0.67px] border-[#a6a6a6] bg-black py-[7.5px] pl-[10px] pr-3 transition-colors hover:bg-[#1a1a1a]"
        >
          <Image
            src="/assets/apple-wallet-icon.png"
            alt=""
            width={148}
            height={109}
            className="h-[27px] w-[37px]"
          />
          <span className="font-[system-ui,-apple-system,'SF_Pro',sans-serif] text-[15px] leading-none text-white">
            {copy.appleWallet}
          </span>
        </button>
      </div>
    </section>
  );
}
