import type { Metadata } from "next";

import { MotionProvider } from "@/components/motion/MotionProvider";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { NewsletterSection } from "@/components/home/NewsletterSection";
import { HeroDeck } from "@/components/home/heroes/HeroDeck";

export const metadata: Metadata = {
  title: "Hero — Deck — SEVENPM",
  robots: { index: false },
};

/** Hero option: Deck. Review chrome; the live homepage is untouched. */
export default function HeroDeckPreview() {
  return (
    <>
      <MotionProvider />
      <SiteHeader logoSize={100} />
      <main>
        <HeroDeck />
        {/* What it releases into, so the join can be judged. */}
        <NewsletterSection />
      </main>
      <SiteFooter />
    </>
  );
}
