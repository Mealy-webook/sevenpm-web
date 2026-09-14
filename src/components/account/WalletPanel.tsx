"use client";

import Image from "next/image";
import { useState } from "react";

import type { WalletTransaction } from "@/data/account";
import { formatAmount, walletCopy } from "@/data/account";

/**
 * Wallet panel. No Figma comp for this screen — it is composed from the
 * account system: the same section title, the chip filters from Bookings and
 * the bordered card from the booking row. The balance sits in a dark card
 * with the amount in Daltown, the currency in brand yellow, and the top-up
 * amounts as chips; the history below is one row per transaction.
 */

const dateFormat = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "Africa/Casablanca",
});

function Arrow({ incoming }: { incoming: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path
        d={incoming ? "M10 4v12m0 0 5-5m-5 5-5-5" : "M10 16V4m0 0 5 5m-5-5-5 5"}
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="square"
      />
    </svg>
  );
}

export function WalletPanel({
  balance,
  currency,
  transactions,
}: {
  balance: number;
  currency: string;
  transactions: WalletTransaction[];
}) {
  const [filter, setFilter] = useState(walletCopy.filters[0].label);
  const active = walletCopy.filters.find((f) => f.label === filter);
  const shown = transactions.filter(
    (t) => !active?.kind || t.kind === active.kind,
  );

  return (
    <section
      className="flex min-w-0 flex-1 flex-col gap-6"
      aria-labelledby="wallet-title"
    >
      <div className="flex flex-col gap-1">
        <h2
          id="wallet-title"
          className="m-0 font-[family-name:var(--font-display)] text-[26px] font-bold uppercase leading-8 tracking-[-0.13px] text-content-primary"
        >
          {walletCopy.title}
        </h2>
        <p className="m-0 font-[family-name:var(--font-display)] text-[13px] leading-5 tracking-[0.13px] text-content-secondary">
          {walletCopy.description}
        </p>
      </div>

      {/* Balance */}
      <div
        className="flex flex-col gap-6 border border-white/5 bg-bg-secondary p-6 lg:flex-row lg:items-end lg:justify-between"
        data-reveal="up"
      >
        <div className="flex min-w-0 flex-col gap-2">
          <span className="font-[family-name:var(--font-display)] text-[13px] font-semibold uppercase leading-5 tracking-[1.56px] text-content-secondary">
            {walletCopy.balanceLabel}
          </span>
          <p className="m-0 flex items-baseline gap-3 font-daltown text-[64px] leading-[0.9] text-white xl:text-[88px]">
            {balance.toLocaleString("en-US")}
            <span className="text-brand">{currency}</span>
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <span className="font-[family-name:var(--font-display)] text-[13px] leading-5 tracking-[0.13px] text-content-secondary">
            {walletCopy.topUpLabel}
          </span>
          <div className="flex flex-wrap items-center gap-3">
            {walletCopy.topUpAmounts.map((amount) => (
              <button
                key={amount}
                type="button"
                className="flex h-10 cursor-pointer items-center justify-center border border-white/10 bg-white/5 px-3 font-[family-name:var(--font-display)] text-[15px] font-semibold leading-[22px] tracking-[0.19px] text-content-primary transition-colors hover:border-content-primary hover:bg-white/10"
              >
                {amount} {currency}
              </button>
            ))}
            <a
              href="#top-up"
              data-magnetic="0.15"
              className="sweep flex h-10 items-center justify-center bg-brand px-5 font-[family-name:var(--font-display)] text-[15px] font-semibold leading-[22px] text-[#0b0b0e]"
            >
              <span className="relative z-10">{walletCopy.topUpCta}</span>
            </a>
          </div>
        </div>
      </div>

      {/* History */}
      <div className="flex flex-col gap-4">
        <div
          role="tablist"
          aria-label="Transaction type"
          className="flex flex-wrap gap-4"
        >
          {walletCopy.filters.map(({ label }) => {
            const selected = filter === label;
            return (
              <button
                key={label}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => setFilter(label)}
                className={`flex h-10 cursor-pointer items-center justify-center border p-3 font-[family-name:var(--font-display)] text-[15px] font-semibold leading-[22px] tracking-[0.19px] text-content-primary transition-colors ${
                  selected
                    ? "border-content-primary bg-white/10"
                    : "border-white/10 bg-white/5 hover:bg-white/10"
                }`}
              >
                <span className="px-1">{label}</span>
              </button>
            );
          })}
        </div>

        {shown.length === 0 ? (
          <div
            className="flex min-h-[200px] flex-1 flex-col items-center justify-center gap-4"
            data-reveal="up"
          >
            <Image
              src="/assets/sticker-cassette.png"
              alt=""
              width={256}
              height={233}
              className="h-auto w-[156px]"
            />
            <p className="m-0 w-full text-center font-[family-name:var(--font-display)] text-[22px] font-bold uppercase leading-7 tracking-[-0.11px] text-content-primary">
              {walletCopy.empty}
            </p>
          </div>
        ) : (
          <ul
            className="m-0 flex list-none flex-col p-0"
            data-reveal="up"
            data-reveal-stagger
          >
            {shown.map((tx) => {
              const incoming = tx.kind === "topup";
              return (
                <li
                  key={tx.id}
                  className="flex items-center gap-4 border-b border-white/5 py-4"
                >
                  <span
                    className={`flex size-10 shrink-0 items-center justify-center rounded-full ${
                      incoming
                        ? "bg-[#22c55e]/10 text-[#22c55e]"
                        : "bg-white/5 text-content-primary"
                    }`}
                    aria-hidden
                  >
                    <Arrow incoming={incoming} />
                  </span>
                  <span className="flex min-w-0 flex-1 flex-col">
                    <span className="truncate font-[family-name:var(--font-display)] text-[15px] leading-[22px] tracking-[0.15px] text-content-primary">
                      {tx.label}
                    </span>
                    <span className="truncate font-[family-name:var(--font-display)] text-[13px] leading-5 tracking-[0.13px] text-content-secondary">
                      {tx.context}
                    </span>
                  </span>
                  <span className="flex shrink-0 flex-col items-end">
                    <span
                      className={`whitespace-nowrap font-[family-name:var(--font-display)] text-[15px] font-semibold leading-[22px] tracking-[0.19px] ${
                        incoming ? "text-[#22c55e]" : "text-content-primary"
                      }`}
                    >
                      {formatAmount(tx.amount, currency)}
                    </span>
                    <time
                      dateTime={tx.date}
                      className="whitespace-nowrap font-[family-name:var(--font-display)] text-[13px] leading-5 tracking-[0.13px] text-content-secondary"
                    >
                      {dateFormat.format(new Date(tx.date))}
                    </time>
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}
