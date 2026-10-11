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
import { LongRead } from "@/components/hospitality/variants/LongRead";
import { VariantBar } from "@/components/hospitality/variants/VariantBar";

export const metadata: Metadata = {
  title: "The long read — Hospitality options — SEVENPM",
};

/**
 * Hospitality, direction: the long read.
 *
 * Prose that argues the case, with packages set in as pull-outs where the argument reaches them.
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
      <VariantBar current="hospitality-longread" />
      <main>
        <HospitalityHero />
        <HospitalityHighlights />
        <LongRead />
        <HospitalityHow />
        <HospitalityFaq />
        <HospitalityCta />
      </main>
      <SiteFooter />
    </>
  );
}
