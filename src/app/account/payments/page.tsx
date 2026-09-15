import type { Metadata } from "next";

import { AccountShell } from "@/components/account/AccountShell";
import { LoyaltyBanner } from "@/components/account/LoyaltyBanner";
import { PaymentsPanel } from "@/components/account/PaymentsPanel";
import {
  billingDetails,
  bookings,
  paymentCards,
  receipts,
} from "@/data/account";

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
  const upcoming = bookings.filter(
    (b) => new Date(b.endsAt) >= new Date(),
  ).length;

  return (
    <AccountShell
      activeId="payments"
      counts={{ bookings: upcoming }}
      banner={<LoyaltyBanner greet={false} showExpiry={false} />}
    >
      <PaymentsPanel
        cards={paymentCards}
        billing={billingDetails}
        receipts={receipts}
      />
    </AccountShell>
  );
}
