"use client";

import Image from "next/image";

import { sevenpmCard, sevenpmCardCopy } from "@/data/account";

/**
 * The SEVENPM cashless card on the wallet page — Figma 2449:37101.
 *
 * The card face beside what it is for, the wallet's balance under that, and
 * the two things you can do with it. The comp folds the balance into this
 * block, which is why the wallet no longer carries a separate balance panel
 * above it: one number, in the place that explains what spends it.
 *
 * It holds no float of its own — the balance printed here is the wallet's,
 * and Top up is the wallet's own. The wallet history is already full of
 * venue spends ("Bar — Anfa Park · 3 drinks"); a second pot would make every
 * one of those rows ambiguous about where the money came from.
 *
 * The face is the comp's: a gold gradient with one broad sweep of 6% black
 * across it, which is the export laid over the gradient rather than an
 * approximation of it. Card faces are the one place the house square-edge
 * rule gives way — a card has rounded corners because a card has rounded
 * corners, and the saved cards on the payments page already do.
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
      className="flex flex-col gap-6 border border-white/5 p-6 lg:flex-row lg:items-center"
    >
      <div className="relative aspect-[335/185] w-full shrink-0 overflow-hidden rounded-[24px] bg-[linear-gradient(180deg,#fbeb1c_0%,#958c11_100%)] lg:w-[461px]">
        {/* The comp's sweep: 6% black over the gold, curved so the top-right
            stays bright. */}
        <Image
          src="/assets/card-gold-sweep.svg"
          alt=""
          fill
          aria-hidden
          className="pointer-events-none object-cover"
        />

        <div className="relative flex h-full flex-col justify-between p-6">
          <Image
            src="/assets/wordmark.svg"
            alt="SEVENPM"
            width={1272}
            height={238}
            className="h-[18px] w-auto"
          />

          <span className="flex flex-col gap-1">
            <span className="font-[family-name:var(--font-display)] text-[18px] font-bold uppercase leading-6 tracking-[-0.09px] text-content-primary">
              {sevenpmCard.masked}
            </span>
            <span className="font-[family-name:var(--font-display)] text-[13px] leading-5 tracking-[0.13px] text-content-primary">
              {copy.expiry(sevenpmCard.expiry)}
            </span>
          </span>
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

        <div className="flex flex-wrap items-center gap-6">
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <span className="truncate font-[family-name:var(--font-display)] text-[13px] font-medium uppercase leading-5 tracking-[0.13px] text-content-secondary">
              {copy.balanceLabel}
            </span>
            <p className="m-0 flex items-end gap-2 font-daltown text-[56px] leading-[39px]">
              <span className="text-white">
                {balance.toLocaleString("en-US")}
              </span>
              <span className="text-brand">{currency}</span>
            </p>
          </div>

          <button
            type="button"
            onClick={onTopUp}
            data-magnetic="0.15"
            className="flex shrink-0 cursor-pointer items-center justify-center gap-2 bg-white px-5 py-4 font-[family-name:var(--font-display)] text-[17px] font-semibold leading-6 text-[#18181b] transition-colors hover:bg-brand"
          >
            <Image
              src="/assets/ic-plus-20.svg"
              alt=""
              width={20}
              height={20}
              className="size-5"
            />
            {copy.topUp}
          </button>
        </div>

        <button
          type="button"
          onClick={onDetails}
          className="btn-secondary flex w-full cursor-pointer items-center justify-center px-5 py-4 font-[family-name:var(--font-display)] text-[17px] font-semibold leading-6 text-content-primary"
        >
          {copy.details}
        </button>
      </div>
    </section>
  );
}
