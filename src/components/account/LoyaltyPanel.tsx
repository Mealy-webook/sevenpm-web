"use client";

import Image from "next/image";
import { useState } from "react";

import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import {
  loyaltyActivity,
  loyaltyBalance,
  loyaltyCopy,
  loyaltyEarn,
  loyaltyRewards,
  loyaltyTiers,
  type LoyaltyEntry,
  type LoyaltyReward,
} from "@/data/account";

/**
 * Loyalty, no Figma comp — assembled from the account system's own parts: the
 * wallet's balance card, the payments page's rows and the event page's chips.
 *
 * Redeeming spends Beats on this page and logs the movement, which is as far
 * as a prototype should go; the panel says so at the bottom rather than
 * leaving someone to find out.
 */

const dayLabel = (offset: number) => {
  if (offset === 0) return "Today";
  if (offset === 1) return "Yesterday";
  return `${offset} days ago`;
};

function Card({
  title,
  children,
  className = "",
}: {
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`flex flex-col gap-6 border border-white/5 p-6 ${className}`}
      data-reveal="up"
    >
      {title && (
        <h3 className="m-0 font-[family-name:var(--font-display)] text-[18px] font-bold uppercase leading-6 tracking-[-0.09px] text-content-primary">
          {title}
        </h3>
      )}
      {children}
    </div>
  );
}

export function LoyaltyPanel() {
  const [spent, setSpent] = useState(0);
  const [redeemed, setRedeemed] = useState<string[]>([]);
  const [extra, setExtra] = useState<LoyaltyEntry[]>([]);
  const [pending, setPending] = useState<LoyaltyReward | null>(null);

  const balance = loyaltyBalance - spent;

  const tier =
    [...loyaltyTiers].reverse().find((item) => balance >= item.threshold) ??
    loyaltyTiers[0];
  const next = loyaltyTiers.find((item) => item.threshold > balance);
  const floor = tier.threshold;
  const progress = next
    ? Math.min(100, ((balance - floor) / (next.threshold - floor)) * 100)
    : 100;

  const entries = [...extra, ...loyaltyActivity];

  const redeem = (reward: LoyaltyReward) => {
    setSpent((current) => current + reward.cost);
    setRedeemed((current) => [...current, reward.id]);
    setExtra((current) => [
      {
        id: `r-${reward.id}-${Date.now()}`,
        label: reward.name,
        detail: loyaltyCopy.redeemed,
        beats: -reward.cost,
        dayOffset: 0,
      },
      ...current,
    ]);
    setPending(null);
  };

  return (
    <section
      className="flex min-w-0 flex-1 flex-col gap-6"
      aria-labelledby="loyalty-title"
    >
      <h2
        id="loyalty-title"
        className="m-0 font-[family-name:var(--font-display)] text-[26px] font-bold uppercase leading-8 tracking-[-0.13px] text-content-primary"
      >
        {loyaltyCopy.title}
      </h2>

      {/* Balance and tier */}
      <div
        className="flex flex-col gap-6 border border-white/5 bg-bg-secondary p-6"
        data-reveal="up"
      >
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col gap-2">
            <span className="font-[family-name:var(--font-display)] text-[13px] font-medium uppercase leading-5 tracking-[0.13px] text-content-secondary">
              {loyaltyCopy.balanceLabel}
            </span>
            <p className="m-0 flex items-end gap-2 font-daltown text-[56px] leading-[39px]">
              <span className="text-white">
                {balance.toLocaleString("en-US")}
              </span>
              <span className="text-brand">{loyaltyCopy.unit}</span>
            </p>
          </div>

          <div className="flex flex-col gap-1 sm:items-end">
            <span className="flex items-center gap-2 self-start bg-brand px-3 py-[6px] font-[family-name:var(--font-display)] text-[13px] font-semibold uppercase leading-5 tracking-[0.16px] text-[#18181b] sm:self-auto">
              <Image
                src="/assets/ic-star-12.svg"
                alt=""
                width={12}
                height={12}
                className="size-3"
              />
              {loyaltyCopy.tierLabel(tier.name)}
            </span>
            <span className="font-[family-name:var(--font-display)] text-[12px] leading-4 tracking-[0.12px] text-content-secondary">
              {loyaltyCopy.memberSince}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span className="h-1 w-full bg-white/10">
            <span
              className="block h-full bg-brand transition-[width] duration-500"
              style={{ width: `${progress}%` }}
            />
          </span>
          <p className="m-0 font-[family-name:var(--font-display)] text-[13px] leading-5 tracking-[0.13px] text-content-secondary">
            {next
              ? loyaltyCopy.toNext(next.threshold - balance, next.name)
              : loyaltyCopy.topTier}
          </p>
        </div>
      </div>

      {/* Tiers */}
      <Card title={loyaltyCopy.tiersTitle}>
        <ul className="m-0 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2">
          {loyaltyTiers.map((item) => {
            const current = item.id === tier.id;
            const reached = balance >= item.threshold;
            return (
              <li
                key={item.id}
                className={`flex flex-col gap-3 border p-4 transition-colors ${
                  current
                    ? "border-brand bg-white/5"
                    : "border-white/10 bg-white/[0.02]"
                }`}
              >
                <div className="flex items-baseline justify-between gap-3">
                  <span className="font-[family-name:var(--font-display)] text-[17px] font-bold uppercase leading-6 text-content-primary">
                    {item.name}
                  </span>
                  <span
                    className={`font-[family-name:var(--font-display)] text-[12px] leading-4 tracking-[0.12px] ${
                      reached ? "text-brand" : "text-content-secondary"
                    }`}
                  >
                    {item.threshold.toLocaleString("en-US")}+
                  </span>
                </div>
                <ul className="m-0 flex list-none flex-col gap-1 p-0">
                  {item.perks.map((perk) => (
                    <li
                      key={perk}
                      className="flex gap-2 font-[family-name:var(--font-display)] text-[13px] leading-5 tracking-[0.13px] text-content-secondary"
                    >
                      <span aria-hidden>·</span>
                      {perk}
                    </li>
                  ))}
                </ul>
                {current && (
                  <span className="font-[family-name:var(--font-display)] text-[12px] font-semibold uppercase leading-4 tracking-[0.12px] text-brand">
                    {loyaltyCopy.currentTier}
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      </Card>

      {/* Ways to earn */}
      <Card title={loyaltyCopy.earnTitle}>
        <ul className="m-0 flex list-none flex-col p-0">
          {loyaltyEarn.map((item, index) => (
            <li
              key={item.id}
              className={`flex items-center gap-4 py-4 ${
                index < loyaltyEarn.length - 1
                  ? "border-b-[0.5px] border-white/10"
                  : ""
              }`}
            >
              <Image
                src={item.icon}
                alt=""
                width={24}
                height={24}
                className="size-6 shrink-0"
              />
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="font-[family-name:var(--font-display)] text-[15px] font-semibold leading-[22px] tracking-[0.19px] text-content-primary">
                  {item.label}
                </span>
                <span className="font-[family-name:var(--font-display)] text-[13px] leading-5 tracking-[0.13px] text-content-secondary">
                  {item.detail}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </Card>

      {/* Rewards */}
      <Card title={loyaltyCopy.rewardsTitle}>
        <ul className="m-0 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2">
          {loyaltyRewards.map((reward) => {
            const taken = redeemed.includes(reward.id);
            const short = reward.cost - balance;
            return (
              <li
                key={reward.id}
                className="flex flex-col gap-3 border border-white/10 bg-white/[0.02] p-4"
              >
                <Image
                  src={reward.icon}
                  alt=""
                  width={24}
                  height={24}
                  className="size-6"
                />
                <span className="flex flex-col gap-1">
                  <span className="font-[family-name:var(--font-display)] text-[15px] font-semibold leading-[22px] tracking-[0.19px] text-content-primary">
                    {reward.name}
                  </span>
                  <span className="font-[family-name:var(--font-display)] text-[13px] leading-5 tracking-[0.13px] text-content-secondary">
                    {reward.description}
                  </span>
                </span>
                <div className="mt-auto flex items-center justify-between gap-3 pt-2">
                  <span className="font-[family-name:var(--font-display)] text-[15px] font-semibold leading-[22px] tracking-[0.19px] text-brand">
                    {reward.cost.toLocaleString("en-US")} {loyaltyCopy.unit}
                  </span>
                  {taken ? (
                    <span className="font-[family-name:var(--font-display)] text-[13px] font-semibold leading-5 tracking-[0.16px] text-[#4ade80]">
                      {loyaltyCopy.redeemed}
                    </span>
                  ) : short > 0 ? (
                    <span className="font-[family-name:var(--font-display)] text-[12px] leading-4 tracking-[0.12px] text-content-secondary">
                      {loyaltyCopy.short(short)}
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setPending(reward)}
                      className="btn-secondary flex shrink-0 cursor-pointer items-center justify-center p-1.5"
                    >
                      <span className="flex h-4 items-center px-1 font-[family-name:var(--font-display)] text-[13px] font-semibold leading-4 tracking-[0.16px] text-content-primary">
                        {loyaltyCopy.redeem}
                      </span>
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </Card>

      {/* Activity */}
      <Card title={loyaltyCopy.activityTitle}>
        <ul className="m-0 flex list-none flex-col p-0">
          {entries.map((entry, index) => (
            <li
              key={entry.id}
              className={`flex items-center gap-4 py-4 ${
                index < entries.length - 1
                  ? "border-b-[0.5px] border-white/10"
                  : ""
              }`}
            >
              <Image
                src={
                  entry.beats > 0 ? "/assets/ic-tx-in.svg" : "/assets/ic-tx-out.svg"
                }
                alt=""
                width={24}
                height={24}
                className="size-6 shrink-0"
              />
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="truncate font-[family-name:var(--font-display)] text-[15px] font-semibold leading-[22px] tracking-[0.19px] text-content-primary">
                  {entry.label}
                </span>
                <span className="font-[family-name:var(--font-display)] text-[13px] leading-5 tracking-[0.13px] text-content-secondary">
                  {dayLabel(entry.dayOffset)} · {entry.detail}
                </span>
              </span>
              <span
                className={`shrink-0 font-[family-name:var(--font-display)] text-[15px] font-semibold leading-[22px] tracking-[0.19px] ${
                  entry.beats > 0 ? "text-[#4ade80]" : "text-content-primary"
                }`}
              >
                {entry.beats > 0 ? "+" : "−"}
                {Math.abs(entry.beats).toLocaleString("en-US")}
              </span>
            </li>
          ))}
        </ul>
      </Card>

      <p className="m-0 font-[family-name:var(--font-display)] text-[12px] leading-4 tracking-[0.12px] text-content-secondary">
        {loyaltyCopy.note}
      </p>

      {pending && (
        <ConfirmDialog
          title={loyaltyCopy.confirmTitle}
          body={loyaltyCopy.confirmBody(pending.name, pending.cost)}
          cancelLabel={loyaltyCopy.cancel}
          confirmLabel={loyaltyCopy.redeem}
          onCancel={() => setPending(null)}
          onConfirm={() => redeem(pending)}
        />
      )}
    </section>
  );
}
