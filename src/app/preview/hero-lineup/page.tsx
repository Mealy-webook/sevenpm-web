import type { Metadata } from "next";

import { MotionProvider } from "@/components/motion/MotionProvider";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { NewsletterSection } from "@/components/home/NewsletterSection";
import { HeroLineup } from "@/components/home/heroes/HeroLineup";

export const metadata: Metadata = {
  title: "Hero — Line-up — SEVENPM",
  robots: { index: false },
};

/** Hero option: Line-up. Review chrome; the live homepage is untouched. */
export default function HeroLineupPreview() {
  return (
    <>
      <MotionProvider />
      <SiteHeader logoSize={100} />
      <main>
        <HeroLineup />
        <NewsletterSection />
      </main>
      <SiteFooter />
    </>
  );
}
