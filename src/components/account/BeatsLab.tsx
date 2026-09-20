"use client";

import { useState } from "react";

import { earnBeats, redeemReward, useLoyalty } from "./loyaltyStore";
import { loyaltyRewards } from "@/data/account";

/**
 * Replays the Beats announcement on demand. The confirmation fires it once
 * and is a whole booking away, which makes it hard to look at twice.
 *
 * Review chrome, not part of the site.
 */
export function BeatsLab() {
  const { balance } = useLoyalty();
  const [plays, setPlays] = useState(0);

  /* A fresh order number each time, or the store refuses to pay twice. The
     play count supplies it — a clock reading would too, but the compiler
     counts that as an impurity even inside a handler. */
  const play = (amount: number) => {
    setPlays((n) => n + 1);
    earnBeats(`lab-${plays}-${amount}`, amount, "Preview");
  };

  /* Spending takes the number down with none of the fanfare — worth being
     able to see that it stays quiet. */
  const spend = () => {
    const affordable = loyaltyRewards.find((reward) => reward.cost <= balance);
    if (affordable) redeemReward(affordable);
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="m-0 font-[family-name:var(--font-display)] text-[32px] font-black uppercase leading-10 tracking-[-0.5px] text-white">
          Beats motion
        </h1>
        <p className="m-0 max-w-[640px] font-[family-name:var(--font-display)] text-[15px] leading-[22px] tracking-[0.19px] text-content-secondary">
          The banner drops in under the chip, the beats scatter out of it and
          arc into the chip, and the counter&rsquo;s wheels roll up as they
          land. Press a button and watch the top right. The banner stays until
          you dismiss it.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        {[100, 250, 1000].map((amount) => (
          <button
            key={amount}
            type="button"
            onClick={() => play(amount)}
            className="flex h-12 cursor-pointer items-center border border-white/10 bg-white/5 px-5 font-[family-name:var(--font-display)] text-[15px] font-semibold leading-[22px] tracking-[0.19px] text-content-primary transition-colors hover:bg-white/10"
          >
            Earn {amount.toLocaleString("en-US")}
          </button>
        ))}
        <button
          type="button"
          onClick={spend}
          className="flex h-12 cursor-pointer items-center px-5 font-[family-name:var(--font-display)] text-[15px] font-semibold leading-[22px] tracking-[0.19px] text-content-secondary transition-colors hover:text-white"
        >
          Spend some
        </button>
      </div>

      <p className="m-0 font-[family-name:var(--font-display)] text-[13px] leading-5 tracking-[0.13px] text-content-secondary">
        Balance {balance.toLocaleString("en-US")} · played {plays}{" "}
        {plays === 1 ? "time" : "times"}
      </p>
    </div>
  );
}
