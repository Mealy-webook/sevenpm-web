import type { Metadata } from "next";

import { MotionProvider } from "@/components/motion/MotionProvider";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { NewsletterSection } from "@/components/home/NewsletterSection";
import { HeroSpotlight } from "@/components/home/heroes/HeroSpotlight";

export const metadata: Metadata = {
  title: "Hero — Spotlight — SEVENPM",
  robots: { index: false },
};

/** Hero option: Spotlight. Review chrome; the live homepage is untouched. */
export default function HeroSpotlightPreview() {
  return (
    <>
      <MotionProvider />
      <SiteHeader logoSize={100} />
      <main>
        <HeroSpotlight />
        {/* What it releases into, so the join can be judged. */}
        <NewsletterSection />
      </main>
      <SiteFooter />
    </>
  );
}
