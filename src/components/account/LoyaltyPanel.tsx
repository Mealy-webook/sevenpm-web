"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import {
  loyaltyActivity,
  loyaltyBalance,
  loyaltyCopy,
  loyaltyEarn,
  loyaltyLifetime,
  loyaltyRewards,
  loyaltyTiers,
  loyaltyTopUpRate,
  type LoyaltyEntry,
  type LoyaltyReward,
} from "@/data/account";

/**
 * Loyalty, no Figma comp — assembled from the account system's own parts and
 * played as a board rather than read as a document.
 *
 * The ladder is one rail instead of four stacked cards: the tiers are nodes
 * you can prod, a token marks where you stand, and only the selected tier's
 * perks are on screen. Earn and spend sit side by side, and the ledger stays
 * folded until asked for. That keeps the programme to about one screen.
 *
 * The tier comes from Beats earned all time, never from the spendable
 * balance: redeeming a reward must not demote you for using the programme.
 *
 * Redeeming spends Beats here and logs the movement, which is as far as a
 * prototype should go; the note at the bottom says so rather than leaving
 * someone to find out.
 */

const dayLabel = (offset: number) => {
  if (offset === 0) return "Today";
  if (offset === 1) return "Yesterday";
  return `${offset} days ago`;
};

/** Rolls a number to its new value, unless less motion was asked for. */
function useCountUp(value: number) {
  const [shown, setShown] = useState(value);
  const from = useRef(value);

  useEffect(() => {
    const start = from.current;
    from.current = value;
    if (start === value) return;
    const began = performance.now();
    /* Zero rather than an early setState: the first frame then lands on the
       final value, and the effect never triggers a cascading render. */
    const span = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? 0
      : 700;
    let frame = 0;
    const tick = (now: number) => {
      const t = span === 0 ? 1 : Math.min(1, (now - began) / span);
      // easeOutCubic: quick off the mark, settles onto the number
      const eased = 1 - (1 - t) ** 3;
      setShown(Math.round(start + (value - start) * eased));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value]);

  return shown;
}

function Lock() {
  return (
    <svg viewBox="0 0 16 16" className="size-3 shrink-0" fill="none" aria-hidden>
      <path
        d="M4.5 7V5a3.5 3.5 0 1 1 7 0v2M3.5 7h9v6h-9z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function Tick() {
  return (
    <svg viewBox="0 0 16 16" className="size-3" fill="none" aria-hidden>
      <path d="M2 8.5 6 12.5 14 3.5" stroke="currentColor" strokeWidth="2.5" />
    </svg>
  );
}

function Card({
  title,
  trailing,
  children,
}: {
  title: string;
  trailing?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 border border-white/5 p-6">
      <div className="flex items-center justify-between gap-3">
        <h3 className="m-0 font-[family-name:var(--font-display)] text-[18px] font-bold uppercase leading-6 tracking-[-0.09px] text-content-primary">
          {title}
        </h3>
        {trailing}
      </div>
      {children}
    </div>
  );
}

export function LoyaltyPanel() {
  const [spent, setSpent] = useState(0);
  const [redeemed, setRedeemed] = useState<string[]>([]);
  const [extra, setExtra] = useState<LoyaltyEntry[]>([]);
  const [pending, setPending] = useState<LoyaltyReward | null>(null);
  const [flash, setFlash] = useState<string | null>(null);
  const [ledgerOpen, setLedgerOpen] = useState(false);
  const [armed, setArmed] = useState(false);

  const balance = loyaltyBalance - spent;
  const shown = useCountUp(balance);

  /* Status is banked, not spent: the tier reads off everything ever earned,
     so redeeming never costs it. */
  const tier =
    [...loyaltyTiers]
      .reverse()
      .find((item) => loyaltyLifetime >= item.threshold) ?? loyaltyTiers[0];
  const next = loyaltyTiers.find((item) => item.threshold > loyaltyLifetime);
  const [openTier, setOpenTier] = useState(tier.id);
  const detail = loyaltyTiers.find((item) => item.id === openTier) ?? tier;

  /* The rail fills from empty on arrival. Armed a beat after mount so the
     transition has a from-state to travel out of. */
  useEffect(() => {
    const id = window.setTimeout(() => setArmed(true), 80);
    return () => window.clearTimeout(id);
  }, []);

  /* The nodes sit at even intervals, so the fill has to be measured in
     segments too — against raw Beats it would stop nowhere near the tier you
     are actually on, because the thresholds are not evenly spaced. */
  const reachedIndex = loyaltyTiers.findIndex((item) => item.id === tier.id);
  const withinSegment = next
    ? (loyaltyLifetime - tier.threshold) / (next.threshold - tier.threshold)
    : 0;
  const railFill = armed
    ? ((reachedIndex + withinSegment) / (loyaltyTiers.length - 1)) * 100
    : 0;

  const entries = [...extra, ...loyaltyActivity];

  /* What is closest to hand: the cheapest thing still unclaimed. Named in the
     Spend header so the card answers "what can I actually get" at a glance. */
  const nearest = loyaltyRewards
    .filter((reward) => !redeemed.includes(reward.id))
    .sort((a, b) => a.cost - b.cost)[0];

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
    setFlash(reward.id);
    window.setTimeout(() => setFlash(null), 1200);
  };

  return (
    <section
      className="flex min-w-0 flex-1 flex-col gap-4"
      aria-labelledby="loyalty-title"
    >
      <h2
        id="loyalty-title"
        className="m-0 font-[family-name:var(--font-display)] text-[26px] font-bold uppercase leading-8 tracking-[-0.13px] text-content-primary"
      >
        {loyaltyCopy.title}
      </h2>

      {/* The board: balance, the ladder as a rail, and one tier's perks */}
      <div className="flex flex-col gap-6 border border-white/5 bg-bg-secondary p-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex flex-col gap-1">
            <span className="font-[family-name:var(--font-display)] text-[13px] font-medium uppercase leading-5 tracking-[0.13px] text-content-secondary">
              {loyaltyCopy.balanceLabel}
            </span>
            <p className="m-0 flex items-end gap-2 font-daltown text-[56px] leading-[39px] xl:text-[64px]">
              <span className="tabular-nums text-white">
                {shown.toLocaleString("en-US")}
              </span>
              <span className="text-brand">{loyaltyCopy.unit}</span>
            </p>
            <span className="font-[family-name:var(--font-display)] text-[12px] leading-4 tracking-[0.12px] text-content-secondary">
              {loyaltyCopy.lifetimeLabel(loyaltyLifetime)}
            </span>
          </div>

          <div className="flex flex-col items-start gap-1 sm:items-end">
            <span className="flex items-center gap-2 bg-brand px-3 py-[6px] font-[family-name:var(--font-display)] text-[13px] font-semibold uppercase leading-5 tracking-[0.16px] text-[#18181b]">
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

        {/* The ladder */}
        <div className="flex flex-col gap-3">
          <div className="relative pt-1">
            <span
              aria-hidden
              className="absolute inset-x-3 top-[14px] block h-[3px] bg-white/10"
            />
            <span
              aria-hidden
              className="absolute left-3 top-[14px] block h-[3px] bg-brand transition-[width] duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{ width: `calc(${railFill}% - 12px)` }}
            />
            {/* You are here: the token rides the track at your lifetime
                position, between the nodes rather than snapped to one. */}
            <span
              aria-hidden
              className="loyalty-token absolute top-[14px] z-10 block size-[10px] -translate-x-1/2 -translate-y-[3.5px] rotate-45 border-2 border-bg-secondary bg-brand transition-[left] duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{ left: `${railFill}%` }}
            />
            <ol className="relative m-0 flex list-none justify-between p-0">
              {loyaltyTiers.map((item) => {
                const reached = loyaltyLifetime >= item.threshold;
                const selected = item.id === openTier;
                const here = item.id === tier.id;
                return (
                  <li key={item.id} className="flex min-w-0">
                    <button
                      type="button"
                      onClick={() => setOpenTier(item.id)}
                      aria-pressed={selected}
                      className="group flex cursor-pointer flex-col items-center gap-2"
                    >
                      <span
                        className={`flex size-[26px] items-center justify-center border-2 transition-transform duration-300 ${
                          reached
                            ? "border-brand bg-brand text-[#18181b]"
                            : "border-white/20 bg-bg-secondary text-content-secondary"
                        } ${selected ? "scale-110" : "group-hover:scale-105"}`}
                      >
                        {reached ? <Tick /> : <Lock />}
                      </span>
                      <span
                        className={`whitespace-nowrap font-[family-name:var(--font-display)] text-[11px] font-semibold uppercase leading-4 tracking-[0.11px] transition-colors sm:text-[12px] ${
                          selected
                            ? "text-content-primary"
                            : "text-content-secondary group-hover:text-content-primary"
                        }`}
                      >
                        {item.name}
                      </span>
                      <span className="h-3 font-[family-name:var(--font-display)] text-[10px] font-semibold uppercase leading-3 tracking-[0.1px] text-brand">
                        {here ? loyaltyCopy.currentTier : ""}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </div>

          <p className="m-0 font-[family-name:var(--font-display)] text-[13px] leading-5 tracking-[0.13px] text-content-secondary">
            {next
              ? loyaltyCopy.toNext(next.threshold - loyaltyLifetime, next.name)
              : loyaltyCopy.topTier}
          </p>
        </div>

        {/* Only the tier you prodded */}
        <div className="flex flex-col gap-2 border-t-[0.5px] border-white/10 pt-4">
          <div className="flex items-baseline justify-between gap-3">
            <span className="font-[family-name:var(--font-display)] text-[15px] font-bold uppercase leading-6 tracking-[0.19px] text-content-primary">
              {detail.name}
            </span>
            <span
              className={`font-[family-name:var(--font-display)] text-[12px] leading-4 tracking-[0.12px] ${
                loyaltyLifetime >= detail.threshold
                  ? "text-brand"
                  : "text-content-secondary"
              }`}
            >
              {loyaltyLifetime >= detail.threshold
                ? loyaltyCopy.reached
                : loyaltyCopy.locked(detail.threshold - loyaltyLifetime)}
            </span>
          </div>
          {loyaltyLifetime < detail.threshold && (
            <p className="m-0 font-[family-name:var(--font-display)] text-[12px] leading-4 tracking-[0.12px] text-brand">
              {loyaltyCopy.route(
                Math.ceil(
                  (detail.threshold - loyaltyLifetime) / loyaltyTopUpRate,
                ),
              )}
            </p>
          )}
          <ul key={detail.id} className="m-0 flex list-none flex-wrap gap-2 p-0">
            {detail.perks.map((perk, index) => (
              <li
                key={perk}
                className="loyalty-perk border border-white/10 bg-white/5 px-3 py-2 font-[family-name:var(--font-display)] text-[13px] leading-5 tracking-[0.13px] text-content-secondary"
                style={{ animationDelay: `${index * 60}ms` }}
              >
                {perk}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Earn and spend, side by side */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <Card title={loyaltyCopy.earnTitle}>
          <ul className="m-0 flex list-none flex-col p-0">
            {loyaltyEarn.map((item, index) => (
              <li
                key={item.id}
                className={`flex items-center gap-3 py-3 ${
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
                  <span className="font-[family-name:var(--font-display)] text-[12px] leading-4 tracking-[0.12px] text-content-secondary">
                    {item.detail}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </Card>

        <Card
          title={loyaltyCopy.rewardsTitle}
          trailing={
            nearest ? (
              <span className="font-[family-name:var(--font-display)] text-[12px] leading-4 tracking-[0.12px] text-content-secondary">
                {balance >= nearest.cost
                  ? loyaltyCopy.nearestReady(nearest.name)
                  : loyaltyCopy.nearest(nearest.name, nearest.cost - balance)}
              </span>
            ) : undefined
          }
        >
          <ul className="m-0 grid list-none grid-cols-1 gap-3 p-0 sm:grid-cols-2">
            {loyaltyRewards.map((reward) => {
              const taken = redeemed.includes(reward.id);
              const short = reward.cost - balance;
              const affordable = short <= 0 && !taken;
              return (
                <li
                  key={reward.id}
                  className={`loyalty-reward flex flex-col gap-2 border p-3 transition-all duration-300 ${
                    taken
                      ? "border-[#4ade80]/40 bg-[#4ade80]/5"
                      : affordable
                        ? "border-white/10 bg-white/[0.02] hover:-translate-y-[2px] hover:border-brand"
                        : "border-white/10 bg-white/[0.02] opacity-70"
                  } ${flash === reward.id ? "is-won" : ""}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <Image
                      src={reward.icon}
                      alt=""
                      width={24}
                      height={24}
                      className="size-6"
                    />
                    <span className="font-[family-name:var(--font-display)] text-[13px] font-semibold leading-5 tracking-[0.16px] text-brand">
                      {reward.cost.toLocaleString("en-US")}
                    </span>
                  </div>
                  <span className="font-[family-name:var(--font-display)] text-[14px] font-semibold leading-5 tracking-[0.14px] text-content-primary">
                    {reward.name}
                  </span>
                  <span className="font-[family-name:var(--font-display)] text-[12px] leading-4 tracking-[0.12px] text-content-secondary">
                    {reward.description}
                  </span>
                  <div className="mt-auto pt-1">
                    {taken ? (
                      <span className="font-[family-name:var(--font-display)] text-[12px] font-semibold uppercase leading-4 tracking-[0.12px] text-[#4ade80]">
                        {loyaltyCopy.redeemed}
                      </span>
                    ) : short > 0 ? (
                      <span className="flex flex-col gap-1">
                        <span
                          aria-hidden
                          className="block h-[3px] w-full bg-white/10"
                        >
                          <span
                            className="block h-full bg-brand/60 transition-[width] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
                            style={{
                              width: `${Math.min(100, (balance / reward.cost) * 100)}%`,
                            }}
                          />
                        </span>
                        <span className="font-[family-name:var(--font-display)] text-[11px] leading-4 tracking-[0.11px] text-content-secondary">
                          {loyaltyCopy.short(short)}
                        </span>
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setPending(reward)}
                        className="btn-secondary flex cursor-pointer items-center justify-center p-1.5"
                      >
                        <span className="flex h-4 items-center px-1 font-[family-name:var(--font-display)] text-[12px] font-semibold uppercase leading-4 tracking-[0.12px] text-content-primary">
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
      </div>

      {/* The ledger, folded away */}
      <Card
        title={loyaltyCopy.activityTitle}
        trailing={
          <button
            type="button"
            onClick={() => setLedgerOpen((open) => !open)}
            aria-expanded={ledgerOpen}
            className="btn-secondary flex cursor-pointer items-center justify-center p-1.5"
          >
            <span className="flex h-4 items-center px-1 font-[family-name:var(--font-display)] text-[12px] font-semibold uppercase leading-4 tracking-[0.12px] text-content-primary">
              {ledgerOpen ? "Hide" : `Show ${entries.length}`}
            </span>
          </button>
        }
      >
        <div
          className="grid transition-[grid-template-rows,opacity] duration-400 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{
            gridTemplateRows: ledgerOpen ? "1fr" : "0fr",
            opacity: ledgerOpen ? 1 : 0,
          }}
        >
          <ul className="m-0 flex list-none flex-col overflow-hidden p-0">
            {entries.map((entry, index) => (
              <li
                key={entry.id}
                className={`flex items-center gap-3 py-3 ${
                  index < entries.length - 1
                    ? "border-b-[0.5px] border-white/10"
                    : ""
                }`}
              >
                <Image
                  src={
                    entry.beats > 0
                      ? "/assets/ic-tx-in.svg"
                      : "/assets/ic-tx-out.svg"
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
                  <span className="font-[family-name:var(--font-display)] text-[12px] leading-4 tracking-[0.12px] text-content-secondary">
                    {dayLabel(entry.dayOffset)} · {entry.detail}
                  </span>
                </span>
                <span
                  className={`shrink-0 tabular-nums font-[family-name:var(--font-display)] text-[15px] font-semibold leading-[22px] tracking-[0.19px] ${
                    entry.beats > 0 ? "text-[#4ade80]" : "text-content-primary"
                  }`}
                >
                  {entry.beats > 0 ? "+" : "−"}
                  {Math.abs(entry.beats).toLocaleString("en-US")}
                </span>
              </li>
            ))}
          </ul>
        </div>
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
