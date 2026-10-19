import type { Metadata } from "next";

import { MotionProvider } from "@/components/motion/MotionProvider";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SponsorDialogProvider } from "@/components/sponsor/SponsorDialog";
import { SponsorPlanPage } from "@/components/sponsor/directions/SponsorPlan";
import { SponsorVariantBar } from "@/components/sponsor/directions/SponsorVariantBar";

export const metadata: Metadata = {
  title: "Become a sponsor — plan — SEVENPM",
};

/**
 * Become a sponsor, one of three new directions from the benchmark's brief.
 * The enquiry is a two-step pop-up (deck first, brief optional) opened from
 * every call to action. /sponsor is unchanged until one is chosen.
 */
export default function Page() {
  return (
    <SponsorDialogProvider>
      <MotionProvider />
      <SiteHeader />
      <SponsorVariantBar current="sponsor-plan" />
      <main>
        <SponsorPlanPage />
      </main>
      <SiteFooter />
    </SponsorDialogProvider>
  );
}
