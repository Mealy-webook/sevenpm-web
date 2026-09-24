import type { Metadata } from "next";

import { MotionProvider } from "@/components/motion/MotionProvider";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { NewsletterSection } from "@/components/home/NewsletterSection";
import { HeroSplit } from "@/components/home/heroes/HeroSplit";

export const metadata: Metadata = {
  title: "Hero — Editorial split — SEVENPM",
  robots: { index: false },
};

/** Hero option: Editorial split. Review chrome; the live homepage is untouched. */
export default function HeroSplitPreview() {
  return (
    <>
      <MotionProvider />
      <SiteHeader logoSize={100} />
      <main>
        <HeroSplit />
        <NewsletterSection />
      </main>
      <SiteFooter />
    </>
  );
}
