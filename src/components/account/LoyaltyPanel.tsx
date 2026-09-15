"use client";

import Image from "next/image";
import { useState } from "react";

import { redeemReward, useLoyalty } from "./loyaltyStore";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import {
  loyaltyCopy,
  loyaltyLifetime,
  loyaltyRewards,
  loyaltyTiers,
  type LoyaltyEntry,
  type LoyaltyReward,
} from "@/data/account";

/**
 * SevenPM Rewards, from Figma 2250:10073: the rewards card with its
 * membership chips, then the Beats ledger grouped by day.
 *
 * A reward belongs to a membership. One from a membership you have not
 * reached reads "Locked" — the chips above filter the same list, so the row
 * has to say why it cannot be taken rather than just hiding.
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

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="m-0 font-[family-name:var(--font-display)] text-[24px] font-bold uppercase leading-8 tracking-[-0.12px] text-content-primary">
      {children}
    </h2>
  );
}

/** The 48px dark tile every row leads with. */
function RowIcon({ src }: { src: string }) {
  return (
    <span className="flex size-12 shrink-0 items-center justify-center overflow-hidden bg-bg-secondary">
      <Image src={src} alt="" width={24} height={24} className="size-6" />
    </span>
  );
}

export function LoyaltyPanel() {
  const { balance, redeemed, entries } = useLoyalty();
  const [pending, setPending] = useState<LoyaltyReward | null>(null);
  const [openEntry, setOpenEntry] = useState<string | null>(null);
  const [filter, setFilter] = useState("all");

  /* Status is banked, not spent: membership reads off everything ever
     earned, so redeeming never costs it. */
  const reachedTiers = loyaltyTiers.filter(
    (tier) => loyaltyLifetime >= tier.threshold,
  );
  const reached = new Set(reachedTiers.map((tier) => tier.id));

  const isRedeemed = (id: string) => redeemed.includes(id);

  const shown =
    filter === "all"
      ? loyaltyRewards
      : loyaltyRewards.filter((reward) => reward.tier === filter);

  const groups: { offset: number; items: LoyaltyEntry[] }[] = [];
  for (const entry of entries) {
    const last = groups.at(-1);
    if (last && last.offset === entry.dayOffset) last.items.push(entry);
    else groups.push({ offset: entry.dayOffset, items: [entry] });
  }

  const redeem = (reward: LoyaltyReward) => {
    redeemReward(reward);
    setPending(null);
  };

  return (
    <section
      className="flex min-w-0 flex-1 flex-col gap-14"
      aria-labelledby="loyalty-title"
    >
      {/* Rewards */}
      <div className="flex flex-col gap-6">
        <span id="loyalty-title">
          <SectionTitle>{loyaltyCopy.title}</SectionTitle>
        </span>

        <div className="flex flex-col gap-6 border border-white/5 p-6">
          <div
            role="tablist"
            aria-label={loyaltyCopy.title}
            className="flex flex-wrap gap-[10px]"
          >
            {[{ id: "all", name: loyaltyCopy.allMemberships }, ...loyaltyTiers].map(
              (chip) => {
                const selected = filter === chip.id;
                return (
                  <button
                    key={chip.id}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    onClick={() => setFilter(chip.id)}
                    className={`flex h-10 cursor-pointer items-center justify-center px-3 font-[family-name:var(--font-display)] text-[15px] font-semibold leading-[22px] tracking-[0.19px] text-content-primary transition-colors ${
                      selected
                        ? "border border-content-primary bg-white/10"
                        : "border border-white/10 bg-white/5 hover:bg-white/10"
                    }`}
                  >
                    {chip.name}
                  </button>
                );
              },
            )}
          </div>

          {shown.length === 0 ? (
            <p className="m-0 py-3 font-[family-name:var(--font-display)] text-[15px] leading-[22px] tracking-[0.15px] text-content-secondary">
              {loyaltyCopy.empty}
            </p>
          ) : (
            <ul className="m-0 flex list-none flex-col p-0">
              {shown.map((reward, index) => {
                const taken = isRedeemed(reward.id);
                const unlocked = reached.has(reward.tier);
                const short = reward.cost - balance;
                const last = index === shown.length - 1;

                return (
                  <li key={reward.id} className="flex items-center gap-4">
                    <RowIcon src={reward.icon} />
                    <span
                      className={`flex min-w-0 flex-1 items-center gap-2 py-3 ${
                        last ? "" : "border-b-[0.5px] border-white/10"
                      }`}
                    >
                      <span className="flex min-w-0 flex-1 flex-col">
                        <span className="truncate font-[family-name:var(--font-display)] text-[15px] leading-[22px] tracking-[0.15px] text-content-primary">
                          {reward.name}
                        </span>
                        <span className="font-[family-name:var(--font-display)] text-[13px] leading-5 tracking-[0.13px] text-content-secondary">
                          {reward.cost.toLocaleString("en-US")}{" "}
                          {loyaltyCopy.unit}
                        </span>
                      </span>

                      {taken ? (
                        <span className="shrink-0 font-[family-name:var(--font-display)] text-[13px] font-semibold leading-5 tracking-[0.16px] text-[#4ade80]">
                          {loyaltyCopy.redeemed}
                        </span>
                      ) : !unlocked ? (
                        <span className="flex shrink-0 items-center justify-center gap-1 bg-white/5 p-3">
                          <Image
                            src="/assets/ic-lock-locked-16.svg"
                            alt=""
                            width={16}
                            height={16}
                            className="size-4"
                          />
                          <span className="px-1 font-[family-name:var(--font-display)] text-[15px] font-semibold leading-[22px] tracking-[0.19px] text-white/30">
                            {loyaltyCopy.locked}
                          </span>
                        </span>
                      ) : short > 0 ? (
                        <span className="shrink-0 font-[family-name:var(--font-display)] text-[13px] leading-5 tracking-[0.13px] text-content-secondary">
                          {loyaltyCopy.short(short)}
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setPending(reward)}
                          className="flex shrink-0 cursor-pointer items-center justify-center bg-white p-3 transition-colors hover:bg-white/90"
                        >
                          <span className="flex h-4 items-center px-1 font-[family-name:var(--font-display)] text-[15px] font-semibold leading-[22px] tracking-[0.19px] text-[#18181b]">
                            {loyaltyCopy.redeem}
                          </span>
                        </button>
                      )}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      {/* Ledger */}
      <div className="flex flex-col gap-6">
        <SectionTitle>{loyaltyCopy.activityTitle}</SectionTitle>

        <div className="flex flex-col gap-6 border border-white/5 p-6">
          {groups.map((group) => (
            <div key={group.offset} className="flex flex-col gap-1">
              <p className="m-0 font-[family-name:var(--font-display)] text-[13px] leading-[22px] tracking-[0.13px] text-content-secondary">
                {dayLabel(group.offset)}
              </p>

              <ul className="m-0 flex list-none flex-col p-0">
                {group.items.map((entry, index) => {
                  const open = openEntry === entry.id;
                  const last = index === group.items.length - 1;
                  return (
                    <li key={entry.id} className="flex items-start gap-4">
                      <RowIcon
                        src={
                          entry.kind === "earn"
                            ? "/assets/ic-plus-16.svg"
                            : "/assets/ic-minus-16.svg"
                        }
                      />
                      <span
                        className={`flex min-w-0 flex-1 flex-col py-3 ${
                          last ? "" : "border-b-[0.5px] border-white/10"
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() =>
                            setOpenEntry(open ? null : entry.id)
                          }
                          aria-expanded={open}
                          aria-controls={`${entry.id}-detail`}
                          className="flex w-full cursor-pointer items-center gap-2 text-left"
                        >
                          <span className="flex min-w-0 flex-1 flex-col">
                            <span className="truncate font-[family-name:var(--font-display)] text-[15px] leading-[22px] tracking-[0.15px] text-content-primary">
                              {entry.label}
                            </span>
                            <span className="font-[family-name:var(--font-display)] text-[13px] leading-5 tracking-[0.13px] text-content-secondary">
                              {entry.time}
                            </span>
                          </span>

                          <span
                            className={`shrink-0 font-[family-name:var(--font-display)] text-[15px] font-semibold leading-[22px] tracking-[0.19px] ${
                              entry.kind === "earn"
                                ? "text-[#4ade80]"
                                : "text-content-primary"
                            }`}
                          >
                            {entry.kind === "earn"
                              ? loyaltyCopy.earned(entry.beats)
                              : loyaltyCopy.beats(entry.beats)}
                          </span>

                          <Image
                            src="/assets/ic-chevron-down-16.svg"
                            alt=""
                            width={16}
                            height={16}
                            className={`size-4 shrink-0 transition-transform duration-300 ${
                              open ? "rotate-180" : ""
                            }`}
                          />
                        </button>

                        <span
                          id={`${entry.id}-detail`}
                          className="grid transition-[grid-template-rows,opacity] duration-400 ease-[cubic-bezier(0.22,1,0.36,1)]"
                          style={{
                            gridTemplateRows: open ? "1fr" : "0fr",
                            opacity: open ? 1 : 0,
                          }}
                        >
                          <span className="overflow-hidden">
                            <span className="block pt-2 font-[family-name:var(--font-display)] text-[13px] leading-5 tracking-[0.13px] text-content-secondary">
                              {entry.detail}
                            </span>
                          </span>
                        </span>
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        <p className="m-0 font-[family-name:var(--font-display)] text-[12px] leading-4 tracking-[0.12px] text-content-secondary">
          {loyaltyCopy.note}
        </p>
      </div>

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
