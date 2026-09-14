import type { Metadata } from "next";

import { AccountShell } from "@/components/account/AccountShell";
import { LoyaltyPanel } from "@/components/account/LoyaltyPanel";
import { bookings } from "@/data/account";

export const metadata: Metadata = {
  title: "Loyalty program — SEVENPM",
  robots: { index: false },
};

/** Account — loyalty. Composed in the account system; no Figma comp. */
export default function LoyaltyPage() {
  const upcoming = bookings.filter(
    (b) => new Date(b.endsAt) >= new Date(),
  ).length;

  return (
    <AccountShell activeId="loyalty" counts={{ bookings: upcoming }}>
      <LoyaltyPanel />
    </AccountShell>
  );
}
