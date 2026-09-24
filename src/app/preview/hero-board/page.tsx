import type { Metadata } from "next";

import { MotionProvider } from "@/components/motion/MotionProvider";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { NewsletterSection } from "@/components/home/NewsletterSection";
import { HeroBoard } from "@/components/home/heroes/HeroBoard";

export const metadata: Metadata = {
  title: "Hero — Board — SEVENPM",
  robots: { index: false },
};

/** Hero option: Board. Review chrome; the live homepage is untouched. */
export default function HeroBoardPreview() {
  return (
    <>
      <MotionProvider />
      <SiteHeader logoSize={100} />
      <main>
        <HeroBoard />
        <NewsletterSection />
      </main>
      <SiteFooter />
    </>
  );
}
