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

/** Account — wallet. Composed in the account system; no Figma comp. */
export default function WalletPage() {
  const upcoming = bookings.filter(
    (b) => new Date(b.endsAt) >= new Date(),
  ).length;

  return (
    <AccountShell activeId="wallet" counts={{ bookings: upcoming }} showEmail={false}>
      <WalletPanel
        balance={walletBalance}
        currency={walletCurrency}
        transactions={walletTransactions}
      />
    </AccountShell>
  );
}
