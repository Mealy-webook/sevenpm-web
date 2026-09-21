import type { Metadata } from "next";

import { MotionProvider } from "@/components/motion/MotionProvider";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SponsorsSection } from "@/components/event/SponsorsSection";
import { PreviewSwitch } from "@/components/home/redesign/PreviewSwitch";
import {
  ArtefactsHero,
  ArtefactsSections,
} from "@/components/home/options/artefacts/ArtefactsPage";
import { jazzablanca } from "@/data/events";

export const metadata: Metadata = {
  title: "Homepage option E — Artefacts — SEVENPM",
  robots: { index: false },
};

/**
 * Homepage option E: the page as the things you leave a festival holding.
 *
 * The hero is an admit-one ticket with a tear-off stub, perforation and
 * barcode included. Under it the sections are objects too — the figures
 * printed along a wristband, the festivals as cassettes on a shelf, the
 * house as a folded programme, the news as postcards, the photographs as
 * prints in a sleeve, the newsletter as a reply card.
 *
 * Every object lifts a little under the cursor and straightens as it does.
 * That is the option's only motion, and it is what makes the page feel
 * handled rather than scrolled.
 */
export default function HomeArtefactsPreview() {
  return (
    <>
      <MotionProvider />
      <SiteHeader logoSize={100} />
      <main>
        <ArtefactsHero />
        <ArtefactsSections />
        <SponsorsSection event={jazzablanca} />
      </main>
      <SiteFooter />
      <PreviewSwitch />
    </>
  );
}
