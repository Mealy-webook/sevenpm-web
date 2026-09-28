import type { Metadata } from "next";

import { AccountShell } from "@/components/account/AccountShell";
import { LoyaltyPanel } from "@/components/account/LoyaltyPanel";

export const metadata: Metadata = {
  title: "SevenPM Rewards — SEVENPM",
  robots: { index: false },
};

/** Account — SevenPM Rewards, from Figma 2250:10073. */
export default function LoyaltyPage() {
  return (
    <AccountShell activeId="loyalty" detail>
      <LoyaltyPanel />
    </AccountShell>
  );
}
