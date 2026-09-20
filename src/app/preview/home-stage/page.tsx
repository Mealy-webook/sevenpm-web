import type { Metadata } from "next";

import { MotionProvider } from "@/components/motion/MotionProvider";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { GallerySection } from "@/components/event/GallerySection";
import { SponsorsSection } from "@/components/event/SponsorsSection";
import { DisplayHeading } from "@/components/ui/DisplayHeading";
import { FestivalsStage } from "@/components/home/FestivalsStage";
import { HomeHero } from "@/components/home/HomeHero";
import { ClosingStage } from "@/components/home/redesign/ClosingStage";
import { NewsStage } from "@/components/home/redesign/NewsStage";
import { PreviewSwitch } from "@/components/home/redesign/PreviewSwitch";
import { StatsStrip } from "@/components/home/redesign/StatsStrip";
import { StoryStage } from "@/components/home/redesign/StoryStage";
import { WordMarquee } from "@/components/home/redesign/WordMarquee";
import { jazzablanca } from "@/data/events";
import { festivals, newsItems } from "@/data/home";

export const metadata: Metadata = {
  title: "Homepage option A — Stage — SEVENPM",
  robots: { index: false },
};

/**
 * Homepage, option A: the event page's treatment. Every section is one
 * screen with one idea in it — the figures fold into the hero's screen, the
 * festivals get a stage with the names running under it, the story and the
 * news each fill a screen, the gallery is the event page's pile of prints,
 * and the newsletter closes the page rather than trailing it. Same content
 * and assets as the page at `/`.
 */
export default function HomeStagePreview() {
  return (
    <>
      <MotionProvider />
      <SiteHeader logoSize={100} />
      <main>
        {/* Hero and the figures share the first screen. */}
        <div className="flex min-h-[calc(100svh-var(--header-h,0px))] flex-col justify-between">
          <HomeHero />
          <div className="shell pb-6">
            <StatsStrip />
          </div>
        </div>

        <section
          id="festivals"
          className="section-screen relative py-16 [overflow-x:clip] xl:py-24"
        >
          <div className="shell flex flex-col items-center gap-12">
            <DisplayHeading reveal="clip">Festivals</DisplayHeading>
          </div>
          <div className="mt-12">
            <FestivalsStage festivals={festivals} />
          </div>
          {/* The names, running under the posters like the line-up runs
              under the event's deck. */}
          <WordMarquee
            words={festivals.map((festival) => festival.name)}
            tone="ghost"
            size="md"
            className="mt-12"
          />
        </section>

        <StoryStage />
        <NewsStage items={newsItems} />
        <GallerySection event={jazzablanca} />
        <SponsorsSection event={jazzablanca} />
        <ClosingStage />
      </main>
      <SiteFooter />
      <PreviewSwitch />
    </>
  );
}
