import type { Metadata } from "next";

import { MotionProvider } from "@/components/motion/MotionProvider";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SponsorsSection } from "@/components/event/SponsorsSection";
import { PreviewSwitch } from "@/components/home/redesign/PreviewSwitch";
import { PosterHero } from "@/components/home/options/poster/PosterHero";
import {
  PosterClippings,
  PosterContact,
  PosterCoupon,
  PosterStats,
  PosterStory,
  PosterWall,
} from "@/components/home/options/poster/PosterSections";
import { jazzablanca } from "@/data/events";

export const metadata: Metadata = {
  title: "Homepage option C — Poster wall — SEVENPM",
  robots: { index: false },
};

/**
 * Homepage option C: the whole page as printed matter.
 *
 * The premise is that SEVENPM's own artwork is the loudest thing it owns, so
 * the page is a wall those posters are pasted to. The hero is a bill, tilted
 * and taped; every section under it is set like a page of print — a numbered
 * slug line, hairline rules, no cards — and the photographs are paper:
 * pasted prints, cuttings, a contact strip.
 *
 * The hero is included, which is the difference from options A and B. It
 * drops the lighting truss and the image trail; the tilt and the paper carry
 * the energy instead, and nothing is animated on load.
 */
export default function HomePosterPreview() {
  return (
    <>
      <MotionProvider />
      <SiteHeader logoSize={100} />
      <main>
        <PosterHero />
        <PosterStats />
        <PosterWall />
        <PosterStory />
        <PosterClippings />
        <PosterContact />
        <SponsorsSection event={jazzablanca} />
        <PosterCoupon />
      </main>
      <SiteFooter />
      <PreviewSwitch />
    </>
  );
}
