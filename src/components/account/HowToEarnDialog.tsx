"use client";

import Image from "next/image";
import { useId } from "react";

import { Sheet, SheetSubmit } from "@/components/ui/Sheet";
import { loyaltyCopy, loyaltyHowTo, loyaltyTiers } from "@/data/account";

/**
 * "How to earn beats", behind the button on the Beats card. No Figma comp —
 * built from the sheet the booking journey already uses, so it matches every
 * other dialog on the site.
 *
 * It answers the three questions the card raises and stops: where Beats come
 * from, what decides your membership, and when they expire.
 */
export function HowToEarnDialog({ onClose }: { onClose: () => void }) {
  const titleId = useId();

  return (
    <Sheet
      open
      onClose={onClose}
      title={loyaltyHowTo.title}
      subtitle={loyaltyHowTo.intro}
      titleId={titleId}
      closeLabel={loyaltyCopy.cancel}
      footer={
        <div className="px-5 pb-5 pt-2">
          <SheetSubmit onClick={onClose}>{loyaltyHowTo.done}</SheetSubmit>
        </div>
      }
    >
      <div className="flex flex-col gap-5 px-5 pt-4">
        {/* Ways to earn */}
        <section className="flex flex-col gap-1">
          <h3 className="m-0 font-[family-name:var(--font-display)] text-[13px] font-bold uppercase leading-5 tracking-[0.16px] text-content-primary">
            {loyaltyHowTo.earnTitle}
          </h3>
          <ul className="m-0 flex list-none flex-col p-0">
            {loyaltyHowTo.earn.map((item, index) => (
              <li
                key={item.id}
                className={`flex items-center gap-3 py-3 ${
                  index < loyaltyHowTo.earn.length - 1
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
                  <span className="font-[family-name:var(--font-display)] text-[15px] leading-[22px] tracking-[0.15px] text-content-primary">
                    {item.label}
                  </span>
                  <span className="font-[family-name:var(--font-display)] text-[12px] leading-4 tracking-[0.12px] text-content-secondary">
                    {item.detail}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* Memberships */}
        <section className="flex flex-col gap-2 border-t-[0.5px] border-white/10 pt-4">
          <h3 className="m-0 font-[family-name:var(--font-display)] text-[13px] font-bold uppercase leading-5 tracking-[0.16px] text-content-primary">
            {loyaltyHowTo.membershipTitle}
          </h3>
          <p className="m-0 font-[family-name:var(--font-display)] text-[12px] leading-4 tracking-[0.12px] text-content-secondary">
            {loyaltyHowTo.membershipBody}
          </p>
          <ul className="m-0 flex list-none flex-wrap gap-2 p-0 pt-1">
            {loyaltyTiers.map((tier) => (
              <li
                key={tier.id}
                className="flex items-baseline gap-2 border border-white/10 bg-white/5 px-3 py-2"
              >
                <span className="font-[family-name:var(--font-display)] text-[13px] font-semibold leading-5 tracking-[0.16px] text-content-primary">
                  {tier.name}
                </span>
                <span className="font-[family-name:var(--font-display)] text-[11px] leading-4 tracking-[0.11px] text-brand">
                  {tier.threshold.toLocaleString("en-US")}+
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* Expiry */}
        <section className="flex flex-col gap-2 border-t-[0.5px] border-white/10 pt-4">
          <h3 className="m-0 font-[family-name:var(--font-display)] text-[13px] font-bold uppercase leading-5 tracking-[0.16px] text-content-primary">
            {loyaltyHowTo.expiryTitle}
          </h3>
          <p className="m-0 font-[family-name:var(--font-display)] text-[12px] leading-4 tracking-[0.12px] text-content-secondary">
            {loyaltyHowTo.expiryBody}
          </p>
        </section>
      </div>
    </Sheet>
  );
}
