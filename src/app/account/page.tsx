import type { Metadata } from "next";
import { Suspense } from "react";

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
export default function AccountPage() {
  const upcoming = bookings.filter(
    (b) => new Date(b.endsAt) >= new Date(),
  ).length;

  /* `?tab=` is read inside the panel and the sidebar rather than here: a page
     that reads `searchParams` cannot be rendered statically. */
  return (
    <AccountShell activeId="bookings" counts={{ bookings: upcoming }}>
      <Suspense fallback={null}>
        <BookingsPanel bookings={bookings} />
      </Suspense>
    </AccountShell>
  );
}
