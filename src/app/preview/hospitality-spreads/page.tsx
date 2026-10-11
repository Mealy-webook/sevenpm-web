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
import { SpreadBands } from "@/components/hospitality/variants/SpreadBands";
import { VariantBar } from "@/components/hospitality/variants/VariantBar";

export const metadata: Metadata = {
  title: "Full-bleed spreads — Hospitality options — SEVENPM",
};

/**
 * Hospitality, direction: full-bleed spreads.
 *
 * No cards at all: each package takes the full width as a photographic band with its name laid over the picture.
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
      <VariantBar current="hospitality-spreads" />
      <main>
        <HospitalityHero />
        <HospitalityHighlights />
        <SpreadBands />
        <HospitalityHow />
        <HospitalityFaq />
        <HospitalityCta />
      </main>
      <SiteFooter />
    </>
  );
}
