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
import { DossierSheets } from "@/components/hospitality/variants/DossierSheets";
import { VariantBar } from "@/components/hospitality/variants/VariantBar";

export const metadata: Metadata = {
  title: "Dossier sheets — Hospitality options — SEVENPM",
};

/**
 * Hospitality, direction: dossier sheets.
 *
 * Each package a printed sheet taped to the page, the spec set as a ruled docket. The newsletter's taped bill, carrying a brief.
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
      <VariantBar current="hospitality-dossier" />
      <main>
        <HospitalityHero />
        <HospitalityHighlights />
        <DossierSheets />
        <HospitalityHow />
        <HospitalityFaq />
        <HospitalityCta />
      </main>
      <SiteFooter />
    </>
  );
}
