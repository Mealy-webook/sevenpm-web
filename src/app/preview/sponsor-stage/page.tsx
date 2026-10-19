import type { Metadata } from "next";

import { MotionProvider } from "@/components/motion/MotionProvider";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SponsorDialogProvider } from "@/components/sponsor/SponsorDialog";
import { SponsorStage } from "@/components/sponsor/directions/SponsorStage";
import { SponsorVariantBar } from "@/components/sponsor/directions/SponsorVariantBar";

export const metadata: Metadata = {
  title: "Become a sponsor — stage — SEVENPM",
};

/**
 * Become a sponsor, one of three full-page directions. The enquiry form is
 * a pop-up opened from every call to action (SponsorDialog). Preview
 * furniture until a direction is chosen; /sponsor is unchanged meanwhile.
 */
export default function Page() {
  return (
    <SponsorDialogProvider>
      <MotionProvider />
      <SiteHeader />
      <SponsorVariantBar current="sponsor-stage" />
      <main>
        <SponsorStage />
      </main>
      <SiteFooter />
    </SponsorDialogProvider>
  );
}
