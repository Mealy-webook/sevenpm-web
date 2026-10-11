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
import { QuoteFirst } from "@/components/hospitality/variants/QuoteFirst";
import { VariantBar } from "@/components/hospitality/variants/VariantBar";

export const metadata: Metadata = {
  title: "Form first — Hospitality options — SEVENPM",
};

/**
 * Hospitality, direction: form first.
 *
 * The page inverted: the quote form opens it, the packages sit underneath as reference.
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
      <VariantBar current="hospitality-quotefirst" />
      <main>
        <HospitalityHero />
        <HospitalityHighlights />
        <QuoteFirst />
        <HospitalityHow />
        <HospitalityFaq />
        <HospitalityCta />
      </main>
      <SiteFooter />
    </>
  );
}
