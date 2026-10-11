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
import { PackageGrid } from "@/components/hospitality/PackageGrid";
import { hospitalityCopy } from "@/data/hospitality";

export const metadata: Metadata = {
  title: "Hospitality — SEVENPM",
  description: hospitalityCopy.intro,
};

/**
 * `/hospitality`, from `Hospitality_website mockups.pdf` (pages one and two).
 *
 * The mockup's order: the hero, the three promises, the package grid with its
 * festival filter, the four steps, the FAQ, and the yellow band. Each package
 * has its own page at `/hospitality/[slug]`.
 */
export default function HospitalityPage() {
  return (
    <>
      <MotionProvider />
      <SiteHeader />
      <main>
        <HospitalityHero />
        <HospitalityHighlights />
        <PackageGrid />
        <HospitalityHow />
        <HospitalityFaq />
        <HospitalityCta />
      </main>
      <SiteFooter />
    </>
  );
}
