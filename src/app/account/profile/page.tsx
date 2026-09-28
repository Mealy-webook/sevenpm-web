import type { Metadata } from "next";

import { AccountShell } from "@/components/account/AccountShell";
import { ProfilePanel } from "@/components/account/ProfilePanel";
import { profileSections } from "@/data/account";

export const metadata: Metadata = {
  title: "Profile — SEVENPM",
  robots: { index: false },
};

/** Account — profile, from Figma 2173:26214. */
export default function ProfilePage() {
  return (
    <AccountShell activeId="profile" detail>
      <ProfilePanel sections={profileSections} />
    </AccountShell>
  );
}
