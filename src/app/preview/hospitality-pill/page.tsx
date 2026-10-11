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
import { PillPackages } from "@/components/hospitality/variants/PillPackages";
import { VariantBar } from "@/components/hospitality/variants/VariantBar";

export const metadata: Metadata = {
  title: "The hero's pill, carried through — Hospitality options — SEVENPM",
};

/**
 * Hospitality, direction: the hero's pill, carried through.
 *
 * Every name set in Daltown with a pill-shaped window cut through it and the picture dropped into the hole, as MORE does in the hero.
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
      <VariantBar current="hospitality-pill" />
      <main>
        <HospitalityHero />
        <HospitalityHighlights />
        <PillPackages />
        <HospitalityHow />
        <HospitalityFaq />
        <HospitalityCta />
      </main>
      <SiteFooter />
    </>
  );
}
