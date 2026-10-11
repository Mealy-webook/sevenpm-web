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
import { PassesGrid } from "@/components/hospitality/variants/PassesGrid";
import { VariantBar } from "@/components/hospitality/variants/VariantBar";

export const metadata: Metadata = {
  title: "Passes, not cards — Hospitality options — SEVENPM",
};

/**
 * Hospitality, direction: passes, not cards.
 *
 * Each package is a physical pass: picture, Daltown name, and the price torn off behind a perforation. The flagship takes brand yellow.
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
      <VariantBar current="hospitality-passes" />
      <main>
        <HospitalityHero />
        <HospitalityHighlights />
        <PassesGrid />
        <HospitalityHow />
        <HospitalityFaq />
        <HospitalityCta />
      </main>
      <SiteFooter />
    </>
  );
}
