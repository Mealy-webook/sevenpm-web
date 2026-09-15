"use client";

import Image from "next/image";
import { useState } from "react";

import { HowToEarnDialog } from "./HowToEarnDialog";
import { useLoyalty } from "./loyaltyStore";
import { TickingValue } from "@/components/ui/RollingNumber";
import {
  accountUser,
  loyaltyCopy,
  loyaltyLifetime,
  loyaltyTiers,
} from "@/data/account";

/**
 * The band at the top of SevenPM Rewards, from Figma 2250:10099. It replaces
 * the account shell's usual name band: the greeting and the membership chip
 * on the left, the Beats card on the right.
 *
 * The balance comes from the shared store so redeeming in the panel below
 * moves the number up here too — and it counts down to the new figure rather
 * than cutting to it, which is the whole feedback for a redemption that
 * happens two sections away.
 *
 * The card carries the balance in Daltown 64/44, the distance to the next
 * membership, when Beats expire, and the membership track — reached stops in
 * brand yellow with a tick, the rest outlined with a lock.
 *
 * The track reads off the data rather than being drawn by hand: with 500 Beats
 * earned all time, Crowd and Front row are reached and Back stage is 500 away,
 * which is exactly what the comp shows. The chip is the one place the comp
 * disagrees with itself — it says "Crowd Member" while the track marks Front
 * row as reached, so the chip names the highest membership actually held.
 */
/** Module-level so `TickingValue` gets the same function every render. */
const beats = (value: number) =>
  Math.round(value).toLocaleString("en-US");

export function LoyaltyBanner({
  /** Rewards greets you by name; Payments (2205:7060) just states it. */
  greet = true,
  /** Only the Rewards comp carries the expiry line. */
  showExpiry = true,
}: {
  greet?: boolean;
  showExpiry?: boolean;
} = {}) {
  const { balance } = useLoyalty();
  const [howToOpen, setHowToOpen] = useState(false);

  const tier =
    [...loyaltyTiers]
      .reverse()
      .find((item) => loyaltyLifetime >= item.threshold) ?? loyaltyTiers[0];
  const next = loyaltyTiers.find((item) => item.threshold > loyaltyLifetime);
  const reachedIndex = loyaltyTiers.findIndex((item) => item.id === tier.id);

  return (
    <section className="bg-bg-secondary">
      <div className="shell flex flex-col gap-10 py-12 lg:flex-row lg:items-start lg:justify-between lg:gap-12">
        {/* Greeting */}
        <div className="flex min-w-0 flex-col gap-6">
          <h1 className="account-name display-text m-0 text-left" data-no-split>
            {greet ? loyaltyCopy.greeting(accountUser.name) : accountUser.name}
          </h1>

          <div className="flex flex-wrap items-center gap-3">
            <span className="flex items-center gap-2 border border-white/10 bg-white/5 p-2 pr-4">
              <Image
                src="/assets/ic-crown-24.svg"
                alt=""
                width={24}
                height={24}
                className="size-6 shrink-0"
              />
              <span className="font-[family-name:var(--font-display)] text-[15px] font-semibold leading-6 tracking-[0.19px] text-content-primary">
                {loyaltyCopy.memberLabel(tier.name)}
              </span>
            </span>
            <span className="font-[family-name:var(--font-display)] text-[12px] leading-4 tracking-[0.12px] text-content-secondary">
              {loyaltyCopy.memberSince}
            </span>
          </div>
        </div>

        {/* Beats card */}
        <div className="flex w-full shrink-0 flex-col gap-3 border border-white/5 bg-bg-secondary px-6 pb-11 pt-6 lg:w-[610px]">
          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="m-0 flex items-end gap-2 font-daltown text-[48px] uppercase leading-[44px] xl:text-[64px]">
                <TickingValue
                  value={balance}
                  format={beats}
                  className="tabular-nums text-white"
                />
                <span className="text-brand">{loyaltyCopy.unit}</span>
              </p>

              <button
                type="button"
                onClick={() => setHowToOpen(true)}
                className="btn-secondary flex shrink-0 cursor-pointer items-center justify-center gap-1 p-[10px]"
              >
                <Image
                  src="/assets/ic-info-13.svg"
                  alt=""
                  width={16}
                  height={16}
                  className="size-4"
                />
                <span className="px-1 font-[family-name:var(--font-display)] text-[13px] font-semibold leading-5 tracking-[0.16px] text-content-primary">
                  {loyaltyCopy.howTo}
                </span>
              </button>
            </div>

            <p className="m-0 font-[family-name:var(--font-display)] text-[15px] leading-[22px] tracking-[0.15px] text-content-secondary">
              {next ? (
                <>
                  {loyaltyCopy.toNextLead}{" "}
                  {loyaltyCopy.toNext(next.threshold - loyaltyLifetime)}{" "}
                  <span className="font-bold text-content-primary">
                    {next.name}
                  </span>{" "}
                  {loyaltyCopy.toNextTail}
                </>
              ) : (
                loyaltyCopy.topTier
              )}
            </p>
          </div>

          {showExpiry && (
            <p className="m-0 font-[family-name:var(--font-sans)] text-[13px] leading-5 tracking-[0.13px] text-content-secondary">
              {loyaltyCopy.expiry(loyaltyCopy.expiring, loyaltyCopy.expiresAt)}
            </p>
          )}

          {/* Membership track */}
          <ol className="m-0 flex list-none items-start gap-1 p-0 pb-6">
            {loyaltyTiers.map((item, index) => {
              const reached = loyaltyLifetime >= item.threshold;
              const current = item.id === tier.id;
              return (
                <li key={item.id} className="contents">
                  {index > 0 && (
                    <span
                      aria-hidden
                      className={`mt-[10.5px] h-[3px] min-w-px flex-1 ${
                        index <= reachedIndex
                          ? "tier-rail bg-white"
                          : "bg-white/5"
                      }`}
                      style={{ "--rail-delay": `${index * 0.5}s` } as React.CSSProperties}
                    />
                  )}
                  <span className="flex shrink-0 flex-col items-center gap-2">
                    <span
                      className={`flex size-6 shrink-0 items-center justify-center overflow-hidden ${
                        reached ? "bg-brand" : "border border-white/10 p-1"
                      }`}
                    >
                      <Image
                        src={
                          reached
                            ? "/assets/ic-tier-check.svg"
                            : "/assets/ic-tier-lock.svg"
                        }
                        alt=""
                        width={reached ? 24 : 16}
                        height={reached ? 24 : 16}
                        className={reached ? "size-6" : "size-4"}
                      />
                    </span>
                    <span
                      className={`whitespace-nowrap font-[family-name:var(--font-display)] text-[12px] font-bold leading-4 tracking-[0.12px] ${
                        current ? "text-content-primary" : "text-content-secondary"
                      }`}
                    >
                      {item.name}
                    </span>
                  </span>
                </li>
              );
            })}
          </ol>
        </div>
      </div>

      {howToOpen && <HowToEarnDialog onClose={() => setHowToOpen(false)} />}
    </section>
  );
}
