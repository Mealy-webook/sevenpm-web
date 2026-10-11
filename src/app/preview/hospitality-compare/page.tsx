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
import { CompareTable } from "@/components/hospitality/variants/CompareTable";
import { VariantBar } from "@/components/hospitality/variants/VariantBar";

export const metadata: Metadata = {
  title: "The comparison — Hospitality options — SEVENPM",
};

/**
 * Hospitality, direction: the comparison.
 *
 * Every package against every other in one wide table — capacity, price and what is in each one.
 *
 * One of six built side by side. Everything outside the package presentation
 * is shared with the live page, so what differs between them is only the
 * thing being chosen.
 */
export default function Page() {
  return (
    <>
      <MotionProvider />
      <SiteHeader />
      <VariantBar current="hospitality-compare" />
      <main>
        <HospitalityHero />
        <HospitalityHighlights />
        <CompareTable />
        <HospitalityHow />
        <HospitalityFaq />
        <HospitalityCta />
      </main>
      <SiteFooter />
    </>
  );
}
