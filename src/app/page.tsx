import type { Metadata } from "next";

import { MotionProvider } from "@/components/motion/MotionProvider";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SponsorsSection } from "@/components/event/SponsorsSection";
import { DisplayHeading } from "@/components/ui/DisplayHeading";
import { FestivalsStage } from "@/components/home/FestivalsStage";
import { GalleryBento } from "@/components/home/GalleryBento";
import { HomeHero } from "@/components/home/HomeHero";
import { HomeMarquee } from "@/components/home/HomeMarquee";
import { HomePillars } from "@/components/home/HomePillars";
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
 * The comp's order: the hero, the festival stage, the kinetic band, the
 * founding block, mission/vision/values, the gallery, the news, the
 * newsletter and the partners.
 *
 * The figures section the page used to carry is not in the comp and is
 * gone with it. The gallery is the scrubbed mosaic rather than the comp's
 * two drifting rows, which is still `HomeGallery` if we go back.
 */
export default function Home() {
  return (
    <>
      <MotionProvider />
      <SiteHeader logoSize={100} />
      <main>
        <HomeHero />

        {/* The stage. 80 from the hero to the title, as the comp has it. */}
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

        <HomeMarquee />
        <HomeStory />
        <HomePillars />

        {/* Gallery: the mosaic scrubs open as you scroll through it. The
            comp gives this section no title, so it has none. */}
        <section id="gallery" className="relative py-16 xl:py-24">
          <GalleryBento images={galleryImages} />
        </section>

        <NewsSection items={newsItems} />
        <NewsletterSection />
        {/* Partners are the same block as the event page's sponsors. */}
        <SponsorsSection event={jazzablanca} />
      </main>
      <SiteFooter />
    </>
  );
}
