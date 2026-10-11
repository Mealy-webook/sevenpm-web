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
import { TheDifference } from "@/components/hospitality/variants/TheDifference";
import { VariantBar } from "@/components/hospitality/variants/VariantBar";

export const metadata: Metadata = {
  title: "The difference — Hospitality options — SEVENPM",
};

/**
 * Hospitality, direction: the difference.
 *
 * The same evening in two columns: a standing ticket against the package, line for line.
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
      <VariantBar current="hospitality-difference" />
      <main>
        <HospitalityHero />
        <HospitalityHighlights />
        <TheDifference />
        <HospitalityHow />
        <HospitalityFaq />
        <HospitalityCta />
      </main>
      <SiteFooter />
    </>
  );
}
