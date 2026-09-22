import type { Metadata } from "next";

import { MotionProvider } from "@/components/motion/MotionProvider";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SponsorsSection } from "@/components/event/SponsorsSection";
import { DisplayHeading } from "@/components/ui/DisplayHeading";
import { FestivalsStage } from "@/components/home/FestivalsStage";
import { GalleryBento } from "@/components/home/GalleryBento";
import { HomeStats } from "@/components/home/HomeStats";
import { HomeStory } from "@/components/home/HomeStory";
import { NewsSection } from "@/components/home/NewsSection";
import { NewsletterSection } from "@/components/home/NewsletterSection";
import { jazzablanca } from "@/data/events";
import { festivals, galleryImages, homeCopy, newsItems } from "@/data/home";

export const metadata: Metadata = {
  title: "SEVENPM — More music, more life",
  description: homeCopy.intro,
};

/**
 * Homepage, from Figma node 15:202.
 *
 * The page opens on the festivals, not on a headline. The comp carries no
 * "More music more life" screen: the header sits straight above the poster
 * stage, and what SEVENPM is gets answered further down by the founding
 * paragraph. The old hero is still in the tree — options A and B under
 * /preview use it — it is simply not what the homepage leads with.
 *
 * Order is the comp's, which also puts the newsletter before the partners.
 */
export default function Home() {
  return (
    <>
      <MotionProvider />
      <SiteHeader logoSize={100} />
      <main>
        {/* The stage, as the first thing on the page. 80 from the header to
            the title, as the comp's frame has it. */}
        <section
          id="festivals"
          className="relative pb-16 pt-12 xl:pb-24 xl:pt-20 [overflow-x:clip]"
        >
          <div className="shell flex flex-col items-center gap-12">
            <DisplayHeading reveal="clip">Festivals</DisplayHeading>
          </div>
          <div className="mt-12">
            <FestivalsStage festivals={festivals} />
          </div>
        </section>

        <HomeStory />
        <HomeStats />
        <NewsSection items={newsItems} />
        {/* Gallery: the mosaic scrubs open as you scroll through it. */}
        <section id="gallery" className="relative py-16 xl:py-24">
          <div className="shell flex flex-col items-center gap-12">
            <DisplayHeading reveal="clip">Gallery</DisplayHeading>
          </div>
          <div className="mt-12">
            <GalleryBento images={galleryImages} />
          </div>
        </section>
        <NewsletterSection />
        {/* Partners are the same block as the event page's sponsors. */}
        <SponsorsSection event={jazzablanca} />
      </main>
      <SiteFooter />
    </>
  );
}
