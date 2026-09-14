import type { Metadata } from "next";

import { AccountShell } from "@/components/account/AccountShell";
import { ProfilePanel } from "@/components/account/ProfilePanel";
import {
  bookings,
  paymentCards,
  profileFields,
  profilePreferences,
  profileToggles,
  securityFields,
} from "@/data/account";

export const metadata: Metadata = {
  title: "Profile — SEVENPM",
  robots: { index: false },
};

/** Account — profile. Composed in the account system; no Figma comp. */
export default function ProfilePage() {
  const upcoming = bookings.filter(
    (b) => new Date(b.endsAt) >= new Date(),
  ).length;

  return (
    <AccountShell
      activeId="profile"
      counts={{ bookings: upcoming }}
      showEmail={false}
    >
      <ProfilePanel
        fields={profileFields}
        preferences={profilePreferences}
        toggles={profileToggles}
        cards={paymentCards}
        security={securityFields}
      />
    </AccountShell>
  );
}
