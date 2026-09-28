import type { Metadata } from "next";

import { AccountShell } from "@/components/account/AccountShell";
import { PaymentsPanel } from "@/components/account/PaymentsPanel";
import { paymentCards } from "@/data/account";

export const metadata: Metadata = {
  title: "Payments — SEVENPM",
  robots: { index: false },
};

/**
 * Account — payments, from Figma 2205:7060. The comp puts the Beats card at
 * the top of this page, the same band SevenPM Rewards uses, so the banner is
 * shared rather than duplicated.
 */
export default function PaymentsPage() {
  return (
    <AccountShell activeId="payments">
      <PaymentsPanel cards={paymentCards} />
    </AccountShell>
  );
}
