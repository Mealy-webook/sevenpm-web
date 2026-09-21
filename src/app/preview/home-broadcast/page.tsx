import type { Metadata } from "next";

import { MotionProvider } from "@/components/motion/MotionProvider";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SponsorsSection } from "@/components/event/SponsorsSection";
import { PreviewSwitch } from "@/components/home/redesign/PreviewSwitch";
import {
  BroadcastHero,
  BroadcastSchedule,
} from "@/components/home/options/broadcast/BroadcastPage";
import { jazzablanca } from "@/data/events";

export const metadata: Metadata = {
  title: "Homepage option D — Broadcast — SEVENPM",
  robots: { index: false },
};

/**
 * Homepage option D: the page as a night's programme.
 *
 * The company is named after a time, so the page keeps one. The hero is the
 * top of the hour — an on-air lamp, a level meter, 19:00 in the display face
 * and tonight's listing beside it — and every section under it is a slot with
 * its own timecode on a rail down the left. A strip of running text sits
 * between groups of slots the way a channel runs its own listings.
 *
 * It is the most systematic of the options: one rule, applied the whole way
 * down, with the artwork appearing as monitors rather than as posters.
 */
export default function HomeBroadcastPreview() {
  return (
    <>
      <MotionProvider />
      <SiteHeader logoSize={100} />
      <main>
        <BroadcastHero />
        <BroadcastSchedule />
        <SponsorsSection event={jazzablanca} />
      </main>
      <SiteFooter />
      <PreviewSwitch />
    </>
  );
}
