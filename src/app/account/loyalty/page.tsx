import type { Metadata } from "next";

import { AccountShell } from "@/components/account/AccountShell";
import { LoyaltyBanner } from "@/components/account/LoyaltyBanner";
import { LoyaltyPanel } from "@/components/account/LoyaltyPanel";
import { bookings } from "@/data/account";

export const metadata: Metadata = {
  title: "SevenPM Rewards — SEVENPM",
  robots: { index: false },
};

/** Account — SevenPM Rewards, from Figma 2250:10073. */
export default function LoyaltyPage() {
  const upcoming = bookings.filter(
    (b) => new Date(b.endsAt) >= new Date(),
  ).length;

  return (
    <AccountShell
      activeId="loyalty"
      counts={{ bookings: upcoming }}
      banner={<LoyaltyBanner />}
    >
      <LoyaltyPanel />
    </AccountShell>
  );
}
