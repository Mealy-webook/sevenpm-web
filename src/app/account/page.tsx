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
 *
 * VIP box requests are the third chip here rather than a screen of their own,
 * so `?tab=requests` opens on them — that is where the enquiry form and the
 * old /account/requests URL both send people.
 */
export default async function AccountPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab } = await searchParams;
  const upcoming = bookings.filter(
    (b) => new Date(b.endsAt) >= new Date(),
  ).length;

  return (
    <AccountShell
      activeId={tab === "requests" ? "requests" : "bookings"}
      counts={{ bookings: upcoming }}
    >
      <BookingsPanel
        bookings={bookings}
        initialTab={tab === "requests" ? "Requests" : "Upcoming"}
      />
    </AccountShell>
  );
}
