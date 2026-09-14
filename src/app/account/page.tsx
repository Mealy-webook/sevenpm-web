import type { Metadata } from "next";

import { AccountShell } from "@/components/account/AccountShell";
import { BookingsPanel } from "@/components/account/BookingsPanel";
import { bookings } from "@/data/account";

export const metadata: Metadata = {
  title: "My bookings — SEVENPM",
  robots: { index: false },
};

/**
 * Account — bookings, from Figma 2173:25780 (empty) and 2173:25975 (one
 * upcoming booking). The frame around it lives in `AccountShell`.
 */
export default function AccountPage() {
  const upcoming = bookings.filter(
    (b) => new Date(b.endsAt) >= new Date(),
  ).length;

  return (
    <AccountShell activeId="bookings" counts={{ bookings: upcoming }}>
      <BookingsPanel bookings={bookings} />
    </AccountShell>
  );
}
