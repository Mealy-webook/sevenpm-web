import type { Metadata } from "next";

import { MotionProvider } from "@/components/motion/MotionProvider";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { NewsletterSection } from "@/components/home/NewsletterSection";
import { HeroPosterWall } from "@/components/home/heroes/HeroPosterWall";

export const metadata: Metadata = {
  title: "Hero — Poster wall — SEVENPM",
  robots: { index: false },
};

/** Hero option: Poster wall. Review chrome; the live homepage is untouched. */
export default function HeroPosterWallPreview() {
  return (
    <>
      <MotionProvider />
      <SiteHeader logoSize={100} />
      <main>
        <HeroPosterWall />
        {/* What it releases into, so the join can be judged. */}
        <NewsletterSection />
      </main>
      <SiteFooter />
    </>
  );
}
