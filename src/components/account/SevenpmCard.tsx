"use client";

import Image from "next/image";

import {
  accountUser,
  sevenpmCard,
  sevenpmCardCopy,
} from "@/data/account";

/**
 * The SEVENPM card on the wallet page: a card face beside what it is for.
 *
 * It spends the wallet rather than holding a float of its own — see the note
 * on `sevenpmCard` — so the balance printed on it is the wallet's, and
 * topping up is the same button that tops up the wallet. Two balances would
 * have made every "Bar — Anfa Park" row in the history ambiguous about which
 * pot it came out of.
 *
 * The face is drawn, like the saved cards on the payments page: brand paper
 * this time rather than charcoal, so the one you pay the venue with is not
 * mistaken at a glance for the Visa you paid for the ticket with.
 */
export function SevenpmCard({
  balance,
  currency,
  onPay,
  onTopUp,
}: {
  balance: number;
  currency: string;
  onPay: () => void;
  onTopUp: () => void;
}) {
  const copy = sevenpmCardCopy;

  return (
    <section
      aria-labelledby="sevenpm-card-title"
      className="flex flex-col gap-6 border border-white/5 bg-bg-secondary p-6 lg:flex-row lg:items-center"
    >
      {/* The face */}
      <div className="relative aspect-[335/200] w-full shrink-0 overflow-hidden bg-brand lg:w-[320px]">
        <div
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(126deg,rgba(255,255,255,0.45)_0%,rgba(255,255,255,0)_38%,rgba(0,0,0,0.12)_100%)]"
        />
        <div className="relative flex h-full flex-col justify-between p-5">
          <div className="flex items-start justify-between gap-3">
            <Image
              src="/assets/wordmark.svg"
              alt="SEVENPM"
              width={1272}
              height={238}
              className="h-[18px] w-auto brightness-0"
            />
            <span className="font-[family-name:var(--font-display)] text-[11px] font-bold uppercase leading-4 tracking-[1.1px] text-[#18181b]/70">
              {sevenpmCard.scheme}
            </span>
          </div>

          <p className="m-0 font-daltown text-[26px] uppercase leading-none tabular-nums text-[#18181b]">
            {sevenpmCard.number}
          </p>

          <div className="flex items-end justify-between gap-3">
            <span className="flex flex-col">
              <span className="font-[family-name:var(--font-display)] text-[10px] uppercase leading-[14px] tracking-[1px] text-[#18181b]/60">
                {copy.holder}
              </span>
              <span className="font-[family-name:var(--font-display)] text-[13px] font-semibold uppercase leading-5 tracking-[0.16px] text-[#18181b]">
                {accountUser.name}
              </span>
            </span>
            <span className="flex flex-col items-end">
              <span className="font-[family-name:var(--font-display)] text-[10px] uppercase leading-[14px] tracking-[1px] text-[#18181b]/60">
                {copy.member}
              </span>
              <span className="font-[family-name:var(--font-display)] text-[13px] font-semibold leading-5 tracking-[0.16px] tabular-nums text-[#18181b]">
                {sevenpmCard.since}
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* What it is for */}
      <div className="flex min-w-0 flex-1 flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h3
            id="sevenpm-card-title"
            className="m-0 font-[family-name:var(--font-display)] text-[18px] font-bold uppercase leading-6 tracking-[-0.09px] text-content-primary"
          >
            {copy.title}
          </h3>
          <p className="m-0 font-[family-name:var(--font-display)] text-[13px] font-semibold leading-5 tracking-[0.16px] text-brand">
            {copy.strap}
          </p>
        </div>

        <p className="m-0 font-[family-name:var(--font-display)] text-[13px] leading-5 tracking-[0.13px] text-content-secondary">
          {copy.blurb}
        </p>

        <p className="m-0 flex items-baseline gap-2">
          <span className="font-[family-name:var(--font-display)] text-[12px] uppercase leading-4 tracking-[1.2px] text-content-secondary">
            {copy.balanceLabel}
          </span>
          <span className="font-[family-name:var(--font-display)] text-[17px] font-semibold leading-6 tabular-nums text-content-primary">
            {balance.toLocaleString("en-US")} {currency}
          </span>
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onPay}
            className="flex cursor-pointer items-center justify-center gap-2 bg-white px-5 py-3 font-[family-name:var(--font-display)] text-[15px] font-semibold leading-[22px] tracking-[0.19px] text-[#18181b] transition-colors hover:bg-white/90"
          >
            <Image
              src="/assets/ic-payment-24.svg"
              alt=""
              width={20}
              height={20}
              className="size-5"
            />
            {copy.pay}
          </button>
          <button
            type="button"
            onClick={onTopUp}
            className="btn-secondary flex cursor-pointer items-center justify-center px-5 py-3 font-[family-name:var(--font-display)] text-[15px] font-semibold leading-[22px] tracking-[0.19px] text-content-primary"
          >
            {copy.topUp}
          </button>
        </div>
      </div>
    </section>
  );
}
