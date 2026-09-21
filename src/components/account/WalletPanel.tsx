"use client";

import Image from "next/image";
import { useState } from "react";

import type { WalletTransaction } from "@/data/account";
import { formatAmount, walletCopy } from "@/data/account";
import { TopUpDialog } from "./TopUpDialog";
import { SevenpmCard } from "./SevenpmCard";
import { VenuePayDialog } from "./VenuePayDialog";

/**
 * Wallet, from Figma 2196:12516. The panel title, then a balance card
 * (label, Daltown 56/39 amount with the currency in brand yellow, white
 * "Top up" button) and a transactions card grouped by day.
 *
 * Rows carry a chevron in the comp, so they expand: the detail line —
 * what the money was actually for — is what opens.
 */

const dayLabel = (offset: number) => {
  if (offset === 0) return "Today";
  if (offset === 1) return "Yesterday";
  return `${offset} days ago`;
};

export function WalletPanel({
  balance,
  currency,
  transactions,
}: {
  balance: number;
  currency: string;
  transactions: WalletTransaction[];
}) {
  const [openId, setOpenId] = useState<string | null>(null);
  const [topUpOpen, setTopUpOpen] = useState(false);
  const [payOpen, setPayOpen] = useState(false);
  /* Top-ups made on this page. They live in state rather than in the data
     file because nothing is persisted — a reload starts over. */
  const [topUps, setTopUps] = useState<WalletTransaction[]>([]);

  const currentBalance =
    balance + topUps.reduce((sum, tx) => sum + tx.amount, 0);
  const allTransactions = [...topUps, ...transactions];

  // Group in place: the list is already newest first.
  const groups: { offset: number; items: WalletTransaction[] }[] = [];
  for (const tx of allTransactions) {
    const last = groups.at(-1);
    if (last && last.offset === tx.dayOffset) last.items.push(tx);
    else groups.push({ offset: tx.dayOffset, items: [tx] });
  }

  return (
    <section
      className="flex min-w-0 flex-1 flex-col gap-6"
      aria-labelledby="wallet-title"
    >
      <h2
        id="wallet-title"
        className="m-0 font-[family-name:var(--font-display)] text-[26px] font-bold uppercase leading-8 tracking-[-0.13px] text-content-primary"
      >
        {walletCopy.title}
      </h2>

      {/* The card, carrying the balance — 2449:37101 folds the two into one
          block, so the wallet no longer has a balance panel of its own. */}
      <SevenpmCard
        balance={currentBalance}
        currency={currency}
        onDetails={() => setPayOpen(true)}
        onTopUp={() => setTopUpOpen(true)}
      />

      {payOpen && (
        <VenuePayDialog
          balance={currentBalance}
          currency={currency}
          onClose={() => setPayOpen(false)}
          onTopUp={() => {
            setPayOpen(false);
            setTopUpOpen(true);
          }}
        />
      )}

      {/* Transactions */}
      <div
        className="flex flex-col gap-6 border border-white/5 p-6"
      >
        <h3 className="m-0 font-[family-name:var(--font-display)] text-[18px] font-bold uppercase leading-6 tracking-[-0.09px] text-content-primary">
          {walletCopy.transactionsTitle}
        </h3>

        {allTransactions.length === 0 ? (
          /* 2449:37101's empty state — a receipt and a clock, not the
             cassette the other account panels use. */
          <div className="flex min-h-[254px] flex-col items-center justify-center gap-2">
            <Image
              src={walletCopy.emptyArt}
              alt=""
              width={1536}
              height={1024}
              className="h-[138px] w-[207px] object-contain"
            />
            <p className="m-0 w-full text-center font-[family-name:var(--font-display)] text-[22px] font-bold uppercase leading-7 tracking-[-0.11px] text-content-primary">
              {walletCopy.empty}
            </p>
          </div>
        ) : (
          groups.map((group) => (
            <div key={group.offset} className="flex flex-col">
              <p className="m-0 pb-1 font-[family-name:var(--font-display)] text-[15px] font-semibold leading-[22px] tracking-[0.19px] text-content-secondary">
                {dayLabel(group.offset)}
              </p>
              <ul className="m-0 flex list-none flex-col p-0">
                {group.items.map((tx) => {
                  const incoming = tx.kind === "topup";
                  const open = openId === tx.id;
                  return (
                    <li key={tx.id} className="flex items-start gap-4">
                      <span
                        className="mt-3 flex size-10 shrink-0 items-center justify-center bg-bg-tertiary p-2"
                        aria-hidden
                      >
                        <Image
                          src={
                            incoming
                              ? "/assets/ic-tx-in.svg"
                              : "/assets/ic-tx-out.svg"
                          }
                          alt=""
                          width={24}
                          height={24}
                          className="size-6"
                        />
                      </span>

                      <div className="flex min-w-0 flex-1 flex-col border-b-[0.5px] border-white/10 py-3">
                        <div className="flex min-w-0 items-center gap-2">
                          <span className="flex min-w-0 flex-1 flex-col">
                            <span className="truncate font-[family-name:var(--font-display)] text-[15px] leading-[22px] tracking-[0.15px] text-content-primary">
                              {tx.label}
                            </span>
                            <span className="font-[family-name:var(--font-display)] text-[13px] leading-5 tracking-[0.13px] text-content-secondary">
                              {tx.time}
                            </span>
                          </span>
                          <span
                            className={`whitespace-nowrap font-[family-name:var(--font-display)] text-[15px] font-semibold leading-[22px] tracking-[0.19px] ${
                              incoming
                                ? "text-[#22c55e]"
                                : "text-content-primary"
                            }`}
                          >
                            {formatAmount(tx.amount, currency)}
                          </span>
                          <button
                            type="button"
                            aria-expanded={open}
                            aria-controls={`${tx.id}-detail`}
                            aria-label={`Details of ${tx.label}, ${tx.time}`}
                            onClick={() => setOpenId(open ? null : tx.id)}
                            className="flex cursor-pointer items-center justify-center p-1.5 transition-opacity hover:opacity-70"
                          >
                            <Image
                              src="/assets/ic-chevron-down-16.svg"
                              alt=""
                              width={16}
                              height={16}
                              className={`size-4 transition-transform duration-300 ${
                                open ? "rotate-180" : ""
                              }`}
                            />
                          </button>
                        </div>

                        {/* 0fr → 1fr opens without measuring */}
                        <div
                          id={`${tx.id}-detail`}
                          className="grid transition-[grid-template-rows,opacity] duration-400 ease-[cubic-bezier(0.22,1,0.36,1)]"
                          style={{
                            gridTemplateRows: open ? "1fr" : "0fr",
                            opacity: open ? 1 : 0,
                          }}
                        >
                          <span className="overflow-hidden">
                            <span className="block pt-2 font-[family-name:var(--font-display)] text-[13px] leading-5 tracking-[0.13px] text-content-secondary">
                              {tx.detail}
                            </span>
                          </span>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))
        )}
      </div>

      {topUpOpen && (
        <TopUpDialog
          balance={currentBalance}
          currency={currency}
          onClose={() => setTopUpOpen(false)}
          onTopUp={(amount) =>
            setTopUps((current) => [
              {
                id: `topup-${Date.now()}`,
                kind: "topup",
                label: walletCopy.topUpCta,
                time: new Date().toLocaleTimeString("en-US", {
                  hour: "numeric",
                  minute: "2-digit",
                }),
                detail: walletCopy.topUp.doneBody(
                  `${amount.toLocaleString("en-US")} ${currency}`,
                ),
                amount,
                dayOffset: 0,
              },
              ...current,
            ])
          }
        />
      )}
    </section>
  );
}
