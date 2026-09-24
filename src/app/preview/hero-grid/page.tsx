import type { Metadata } from "next";

import { MotionProvider } from "@/components/motion/MotionProvider";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { NewsletterSection } from "@/components/home/NewsletterSection";
import { HeroGrid } from "@/components/home/heroes/HeroGrid";

export const metadata: Metadata = {
  title: "Hero — Grid — SEVENPM",
  robots: { index: false },
};

/** Hero option: Grid. Review chrome; the live homepage is untouched. */
export default function HeroGridPreview() {
  return (
    <>
      <MotionProvider />
      <SiteHeader logoSize={100} />
      <main>
        <HeroGrid />
        <NewsletterSection />
      </main>
      <SiteFooter />
    </>
  );
}
