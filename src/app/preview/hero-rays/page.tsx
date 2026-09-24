import type { Metadata } from "next";

import { MotionProvider } from "@/components/motion/MotionProvider";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { NewsletterSection } from "@/components/home/NewsletterSection";
import { HeroRays } from "@/components/home/heroes/HeroRays";

export const metadata: Metadata = {
  title: "Hero — Rays — SEVENPM",
  robots: { index: false },
};

/** Hero option: Rays. Review chrome; the live homepage is untouched. */
export default function HeroRaysPreview() {
  return (
    <>
      <MotionProvider />
      <SiteHeader logoSize={100} />
      <main>
        <HeroRays />
        <NewsletterSection />
      </main>
      <SiteFooter />
    </>
  );
}
