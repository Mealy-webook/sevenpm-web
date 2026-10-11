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
import { PackageIndex } from "@/components/hospitality/variants/PackageIndex";
import { VariantBar } from "@/components/hospitality/variants/VariantBar";

export const metadata: Metadata = {
  title: "Type-led index — Hospitality options — SEVENPM",
};

/**
 * Hospitality, direction: type-led index.
 *
 * Packages as ruled rows at display size, one picture to the side that follows the cursor. The About page's festival index, applied here.
 *
 * One of three built side by side for comparison. Everything outside the
 * package presentation — the hero, the promises, the steps, the FAQ and the
 * closing band — is shared with the live page, so what differs between the
 * three is only the thing being chosen between.
 */
export default function Page() {
  return (
    <>
      <MotionProvider />
      <SiteHeader />
      <VariantBar current="hospitality-index" />
      <main>
        <HospitalityHero />
        <HospitalityHighlights />
        <PackageIndex />
        <HospitalityHow />
        <HospitalityFaq />
        <HospitalityCta />
      </main>
      <SiteFooter />
    </>
  );
}
