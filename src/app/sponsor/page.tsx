import type { Metadata } from "next";

import { MotionProvider } from "@/components/motion/MotionProvider";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SponsorCases } from "@/components/sponsor/SponsorCases";
import { SponsorForm } from "@/components/sponsor/SponsorForm";
import {
  SponsorFormats,
  SponsorHow,
} from "@/components/sponsor/SponsorFormats";
import {
  SponsorAudience,
  SponsorHero,
  SponsorStats,
  SponsorTrust,
} from "@/components/sponsor/SponsorSections";
import { sponsorCopy } from "@/data/sponsor";

export const metadata: Metadata = {
  title: "Become a sponsor — SEVENPM",
  description: sponsorCopy.intro,
};

/**
 * `/sponsor`, from `Become Sponsor_website mockups.pdf`.
 *
 * The mockup's order, section for section: the pitch, the numbers, the
 * partners, the audience, the case studies on a light band, the five formats,
 * the four steps, and the enquiry. Photographs are slots until the shoot
 * lands, and everything in square brackets is waiting on content.
 */
export default function SponsorPage() {
  return (
    <>
      <MotionProvider />
      <SiteHeader />
      <main>
        <SponsorHero />
        <SponsorStats />
        <SponsorTrust />
        <SponsorAudience />
        <SponsorCases />
        <SponsorFormats />
        <SponsorHow />
        <SponsorForm />
      </main>
      <SiteFooter />
    </>
  );
}
