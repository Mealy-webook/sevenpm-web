import type { Metadata } from "next";

import { AccountShell } from "@/components/account/AccountShell";
import { ProfilePanel } from "@/components/account/ProfilePanel";
import { bookings, profileSections } from "@/data/account";

export const metadata: Metadata = {
  title: "Profile — SEVENPM",
  robots: { index: false },
};

/** Account — profile, from Figma 2173:26214. */
export default function ProfilePage() {
  const upcoming = bookings.filter(
    (b) => new Date(b.endsAt) >= new Date(),
  ).length;

  return (
    <AccountShell activeId="profile" counts={{ bookings: upcoming }}>
      <ProfilePanel sections={profileSections} />
    </AccountShell>
  );
}
