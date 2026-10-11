import type { Metadata } from "next";

import { MotionProvider } from "@/components/motion/MotionProvider";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { Manifesto } from "@/components/hospitality/night/Manifesto";
import { NightHero } from "@/components/hospitality/night/NightHero";
import { Rooms } from "@/components/hospitality/night/Rooms";
import { RunningOrder } from "@/components/hospitality/night/RunningOrder";
import { Rsvp } from "@/components/hospitality/night/Rsvp";
import { SmallPrint } from "@/components/hospitality/night/SmallPrint";
import { hospitalityCopy } from "@/data/hospitality";

export const metadata: Metadata = {
  title: "Hospitality — the evening — SEVENPM",
  description: hospitalityCopy.intro,
};

/**
 * The clock design, kept as a preview.
 *
 * Built around one idea — the page is the evening — and replaced on the live
 * route by the paper design. Kept so the two can be compared rather than
 * remembered.
 *
 * Twenty-one earlier directions each redesigned the package block and left
 * the rest of the page alone — the same hero, the same three small cards,
 * the same four steps, the same accordion. That was the problem. None of
 * them could land, because the page around them was never designed.
 *
 * This replaces all of it. The spine is the clock, which SEVENPM is named
 * for: doors at seven, the spaces at eight, the headline at ten, last call
 * at midnight. The hero cuts a window through the O of HOSPITALITY the way
 * the homepage cuts one through MORE, and the rooms repeat that shape at
 * size, which is what makes the page belong to this site rather than to a
 * template.
 *
 * The four booking steps are folded into the running order rather than
 * keeping a section of their own: they are what happens before seven, so
 * they are its first hour.
 */
export default function HospitalityPage() {
  return (
    <>
      <MotionProvider />
      <SiteHeader />
      <main>
        <NightHero />
        <Manifesto />
        <Rooms />
        <RunningOrder />
        <SmallPrint />
        <Rsvp />
      </main>
      <SiteFooter />
    </>
  );
}
