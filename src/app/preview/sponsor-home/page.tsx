import type { Metadata } from "next";

import { MotionProvider } from "@/components/motion/MotionProvider";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SponsorDialogProvider } from "@/components/sponsor/SponsorDialog";
import { SponsorHomePage } from "@/components/sponsor/directions/SponsorOptions";
import { SponsorVariantBar } from "@/components/sponsor/directions/SponsorVariantBar";

export const metadata: Metadata = {
  title: "Become a sponsor — home — SEVENPM",
};

/**
 * Become a sponsor, one of three options built from the site's own
 * sections. The enquiry form is a pop-up opened from every call to action.
 * Preview furniture until one is chosen; /sponsor is unchanged meanwhile.
 */
export default function Page() {
  return (
    <SponsorDialogProvider>
      <MotionProvider />
      <SiteHeader />
      <SponsorVariantBar current="sponsor-home" />
      <main>
        <SponsorHomePage />
      </main>
      <SiteFooter />
    </SponsorDialogProvider>
  );
}
