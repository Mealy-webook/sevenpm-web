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
import { TierLadder } from "@/components/hospitality/variants/TierLadder";
import { VariantBar } from "@/components/hospitality/variants/VariantBar";

export const metadata: Metadata = {
  title: "The ladder — Hospitality options — SEVENPM",
};

/**
 * Hospitality, direction: the ladder.
 *
 * Packages as ascending plinths, so the shape of the offer reads before a word does.
 *
 * One of twenty-one built side by side. Everything outside the package
 * presentation is shared with the live page, so what differs between them is
 * only the thing being chosen.
 */
export default function Page() {
  return (
    <>
      <MotionProvider />
      <SiteHeader />
      <VariantBar current="hospitality-ladder" />
      <main>
        <HospitalityHero />
        <HospitalityHighlights />
        <TierLadder />
        <HospitalityHow />
        <HospitalityFaq />
        <HospitalityCta />
      </main>
      <SiteFooter />
    </>
  );
}
