import type { Metadata } from "next";

import { MotionProvider } from "@/components/motion/MotionProvider";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import {
  HospitalityCta,
  HospitalityFaq,
  HospitalityHero,
  HospitalityHighlights,
  HospitalityHow,
} from "@/components/hospitality/HospitalitySections";
import { NightTimeline } from "@/components/hospitality/variants/NightTimeline";
import { VariantBar } from "@/components/hospitality/variants/VariantBar";

export const metadata: Metadata = {
  title: "The night, hour by hour — Hospitality options — SEVENPM",
};

/**
 * Hospitality, direction: the night, hour by hour.
 *
 * Doors at seven to last call at midnight, with the package chosen above and the evening filling in underneath.
 *
 * One of eleven built side by side. Everything outside the package
 * presentation is shared with the live page, so what differs between them is
 * only the thing being chosen.
 */
export default function Page() {
  return (
    <>
      <MotionProvider />
      <SiteHeader />
      <VariantBar current="hospitality-night" />
      <main>
        <HospitalityHero />
        <HospitalityHighlights />
        <NightTimeline />
        <HospitalityHow />
        <HospitalityFaq />
        <HospitalityCta />
      </main>
      <SiteFooter />
    </>
  );
}
