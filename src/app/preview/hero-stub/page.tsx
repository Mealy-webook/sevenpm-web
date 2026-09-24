import type { Metadata } from "next";

import { MotionProvider } from "@/components/motion/MotionProvider";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { NewsletterSection } from "@/components/home/NewsletterSection";
import { HeroStub } from "@/components/home/heroes/HeroStub";

export const metadata: Metadata = {
  title: "Hero — Stub — SEVENPM",
  robots: { index: false },
};

/** Hero option: Stub. Review chrome; the live homepage is untouched. */
export default function HeroStubPreview() {
  return (
    <>
      <MotionProvider />
      <SiteHeader logoSize={100} />
      <main>
        <HeroStub />
        {/* What it releases into, so the join can be judged. */}
        <NewsletterSection />
      </main>
      <SiteFooter />
    </>
  );
}
