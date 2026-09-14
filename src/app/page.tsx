import type { Metadata } from "next";
import Image from "next/image";

import { MotionProvider } from "@/components/motion/MotionProvider";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SponsorsSection } from "@/components/event/SponsorsSection";
import { FestivalsStage } from "@/components/home/FestivalsStage";
import { HomeGallery } from "@/components/home/HomeGallery";
import { HomeHero } from "@/components/home/HomeHero";
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

        <section
          id="festivals"
          className="relative py-16 xl:py-24 [overflow-x:clip]"
        >
          <div className="shell flex flex-col items-center gap-12">
            <h2
              className="display-box w-full"
              data-reveal="clip"
              style={
                {
                  "--display-line-box": "208px",
                  "--display-art-width": "487px",
                } as React.CSSProperties
              }
            >
              <Image
                src="/assets/head-festivals.png"
                alt="Festivals"
                width={487}
                height={179}
                unoptimized
                style={{ height: "auto" }}
              />
            </h2>
          </div>
          <div className="mt-12">
            <FestivalsStage festivals={festivals} />
          </div>
        </section>

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
