import type { Metadata } from "next";
import { Suspense } from "react";

import { AccountShell } from "@/components/account/AccountShell";
import { BookingsPanel } from "@/components/account/BookingsPanel";

export const metadata: Metadata = {
  title: "My bookings — SEVENPM",
  robots: { index: false },
};

/**
 * Bookings on its own screen.
 *
 * `/account` is the menu on a narrow window, so the panel needs a route of
 * its own to open into — the same arrangement as the other four entries.
 * From `lg` this and `/account` draw the same thing.
 */
export default function BookingsPage() {
  return (
    <AccountShell activeId="bookings" detail>
      <Suspense fallback={null}>
        <BookingsPanel />
      </Suspense>
    </AccountShell>
  );
}
