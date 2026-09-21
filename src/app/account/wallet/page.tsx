import type { Metadata } from "next";

import { AccountShell } from "@/components/account/AccountShell";
import { LoyaltyBanner } from "@/components/account/LoyaltyBanner";
import { WalletPanel } from "@/components/account/WalletPanel";
import {
  bookings,
  walletBalance,
  walletCurrency,
  walletTransactions,
} from "@/data/account";

export const metadata: Metadata = {
  title: "Wallet — SEVENPM",
  robots: { index: false },
};

/** Account — wallet, from Figma 2449:37101. The band is the Rewards one
 *  without the greeting, as Payments has it. */
export default function WalletPage() {
  const upcoming = bookings.filter(
    (b) => new Date(b.endsAt) >= new Date(),
  ).length;

  return (
    <AccountShell
      activeId="wallet"
      counts={{ bookings: upcoming }}
      banner={<LoyaltyBanner greet={false} showExpiry={false} />}
    >
      <WalletPanel
        balance={walletBalance}
        currency={walletCurrency}
        transactions={walletTransactions}
      />
    </AccountShell>
  );
}
