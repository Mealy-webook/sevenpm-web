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
import { StackedCards } from "@/components/hospitality/variants/StackedCards";
import { VariantBar } from "@/components/hospitality/variants/VariantBar";

export const metadata: Metadata = {
  title: "The stack — Hospitality options — SEVENPM",
};

/**
 * Hospitality, direction: the stack.
 *
 * Each package sticks as the next slides over it, dealing the set into a pile.
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
      <VariantBar current="hospitality-stack" />
      <main>
        <HospitalityHero />
        <HospitalityHighlights />
        <StackedCards />
        <HospitalityHow />
        <HospitalityFaq />
        <HospitalityCta />
      </main>
      <SiteFooter />
    </>
  );
}
