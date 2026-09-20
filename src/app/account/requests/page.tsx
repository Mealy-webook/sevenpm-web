import type { Metadata } from "next";

import { AccountShell } from "@/components/account/AccountShell";
import { RequestsPanel } from "@/components/account/RequestsPanel";

export const metadata: Metadata = {
  title: "VIP box requests — SEVENPM",
  robots: { index: false },
};

/** Where a VIP box enquiry lives once the form has closed. */
export default function RequestsPage() {
  return (
    <AccountShell activeId="requests">
      <RequestsPanel />
    </AccountShell>
  );
}
