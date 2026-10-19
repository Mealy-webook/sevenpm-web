import type { Metadata } from "next";

import { MotionProvider } from "@/components/motion/MotionProvider";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SponsorDialogProvider } from "@/components/sponsor/SponsorDialog";
import {
  SponsorAsk,
  SponsorAudienceRow,
  SponsorCaseRail,
  SponsorFormatGrid,
  SponsorLogos,
  SponsorPitch,
  SponsorSteps,
} from "@/components/sponsor/SponsorPageSections";
import { sponsorCopy } from "@/data/sponsor";

export const metadata: Metadata = {
  title: "Become a sponsor — SEVENPM",
  description: sponsorCopy.intro,
};

/**
 * `/sponsor`, from Figma 2640:6784, section for section: the pitch, the
 * logo row, the audience and the case studies — then the formats, the
 * four steps and the closing ask from the earlier page. The enquiry is the
 * pop-up, so the page carries no form of its own. Everything in square brackets is
 * waiting on content.
 */
export default function SponsorPage() {
  return (
    <SponsorDialogProvider>
      <MotionProvider />
      <SiteHeader />
      <main>
        <SponsorPitch />
        <SponsorLogos />
        <SponsorAudienceRow />
        <SponsorCaseRail />
        <SponsorFormatGrid />
        <SponsorSteps />
        <SponsorAsk />
      </main>
      <SiteFooter />
    </SponsorDialogProvider>
  );
}
