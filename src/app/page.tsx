import type { Metadata } from "next";

import { INTRO_FLAG_SCRIPT, Preloader } from "@/components/motion/Preloader";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { FestivalsRow } from "@/components/home/FestivalsRow";
import { GalleryBento } from "@/components/home/GalleryBento";
import { HomeHero } from "@/components/home/HomeHero";
import { HomeMarquee } from "@/components/home/HomeMarquee";
import { HomePillars } from "@/components/home/HomePillars";
import { HomeStory } from "@/components/home/HomeStory";
import { NewsSection } from "@/components/home/NewsSection";
import { NewsletterSection } from "@/components/home/NewsletterSection";
import { festivals, galleryImages, homeCopy, newsItems } from "@/data/home";

export const metadata: Metadata = {
  title: "SEVENPM — More music, more life",
  description: homeCopy.intro,
};

/**
 * Homepage, from Figma node 15:202.
 *
 * The order is the comp's: the hero, upcoming events, the kinetic band,
 * mission/vision/values, the news, the founding block, the gallery and the
 * newsletter. The partners band the page used to end on is gone; the event page still carries the same block as
 * its sponsors.
 *
 * The figures section the page used to carry is not in the comp and is
 * gone with it. The gallery is the scrubbed mosaic rather than the comp's
 * two drifting rows, which is still `HomeGallery` if we go back.
 */
export default function Home() {
  return (
    <>
      {/* Sets the "already seen" flag on <html> before the loader's own markup
          is parsed, so a second visit this session never flashes yellow. */}
      <script dangerouslySetInnerHTML={{ __html: INTRO_FLAG_SCRIPT }} />
      {/* The loader is the homepage's, not the site's. Rendered ahead of
          `MotionProvider` so it can claim the hold during render. */}
      <Preloader />
      <MotionProvider />
      <SiteHeader logoSize={100} />
      <main>
        <HomeHero />

        {/* The order is the comp's (15:202): the programme, the kinetic band
            and mission/vision/values, the news, who SEVENPM is, the gallery,
            then the newsletter. */}
        <FestivalsRow festivals={festivals} />

        <HomeMarquee />
        <HomePillars />

        <NewsSection items={newsItems} />

        <HomeStory />

        {/* Gallery: the mosaic scrubs open as you scroll through it. The
            comp gives this section no title, so it has none. */}
        <section id="gallery" className="relative py-16 xl:py-24">
          <GalleryBento images={galleryImages} />
        </section>

        <NewsletterSection />
      </main>
      <SiteFooter />
    </>
  );
}
