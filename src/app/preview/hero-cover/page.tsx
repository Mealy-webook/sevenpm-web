import type { Metadata } from "next";

import { MotionProvider } from "@/components/motion/MotionProvider";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { NewsletterSection } from "@/components/home/NewsletterSection";
import { HeroCover } from "@/components/home/heroes/HeroCover";

export const metadata: Metadata = {
  title: "Hero — Cover — SEVENPM",
  robots: { index: false },
};

/** Hero option: Cover. Review chrome; the live homepage is untouched. */
export default function HeroCoverPreview() {
  return (
    <>
      <MotionProvider />
      <SiteHeader logoSize={100} />
      <main>
        <HeroCover />
        <NewsletterSection />
      </main>
      <SiteFooter />
    </>
  );
}
