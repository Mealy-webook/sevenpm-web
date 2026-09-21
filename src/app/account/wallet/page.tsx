import type { Metadata } from "next";

import { AccountShell } from "@/components/account/AccountShell";
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

/** Account — wallet, from Figma 2449:37101. The member band comes from the
 *  shell (2449:37125), same as every other account tab. */
export default function WalletPage() {
  const upcoming = bookings.filter(
    (b) => new Date(b.endsAt) >= new Date(),
  ).length;

  return (
    <AccountShell activeId="wallet" counts={{ bookings: upcoming }}>
      <WalletPanel
        balance={walletBalance}
        currency={walletCurrency}
        transactions={walletTransactions}
      />
    </AccountShell>
  );
}
