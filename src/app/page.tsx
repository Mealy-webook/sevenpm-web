import type { Metadata } from "next";

import { MotionProvider } from "@/components/motion/MotionProvider";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SponsorsSection } from "@/components/event/SponsorsSection";
import { DisplayHeading } from "@/components/ui/DisplayHeading";
import { FestivalsStage } from "@/components/home/FestivalsStage";
import { HomeGallery } from "@/components/home/HomeGallery";
import { HomeHero } from "@/components/home/HomeHero";
import { HomeStats } from "@/components/home/HomeStats";
import { HomeStory } from "@/components/home/HomeStory";
import { NewsSection } from "@/components/home/NewsSection";
import { NewsletterSection } from "@/components/home/NewsletterSection";
import { jazzablanca } from "@/data/events";
import { festivals, galleryRows, homeCopy, newsItems } from "@/data/home";

export const metadata: Metadata = {
  title: "SEVENPM — More music, more life",
  description: homeCopy.intro,
};

/** Homepage, from Figma node 15:202. */
export default function Home() {
  return (
    <>
      <MotionProvider />
      <SiteHeader logoSize={100} />
      <main>
        <HomeHero />
        <HomeStats />

        <section
          id="festivals"
          className="relative py-16 xl:py-24 [overflow-x:clip]"
        >
          <div className="shell flex flex-col items-center gap-12">
            <DisplayHeading reveal="clip">Festivals</DisplayHeading>
          </div>
          <div className="mt-12">
            <FestivalsStage festivals={festivals} />
          </div>
        </section>

        <HomeStory />
        <NewsSection items={newsItems} />
        <HomeGallery rows={galleryRows} />
        {/* Partners are the same block as the event page's sponsors. */}
        <SponsorsSection event={jazzablanca} />
        <NewsletterSection />
      </main>
      <SiteFooter />
    </>
  );
}
