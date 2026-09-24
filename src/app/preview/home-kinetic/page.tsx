import type { Metadata } from "next";

import { MotionProvider } from "@/components/motion/MotionProvider";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { KineticIntro } from "@/components/home/options/KineticIntro";
import { NewsletterSection } from "@/components/home/NewsletterSection";

export const metadata: Metadata = {
  title: "Kinetic intro — SEVENPM",
  robots: { index: false },
};

/**
 * The Lagunitas IPA treatment as a SEVENPM intro: an oversized word behind a
 * record that stays pinned while the word travels out and the next arrives.
 *
 * Review chrome. The live homepage is untouched; the newsletter under it is
 * only there to show what the sequence releases into.
 */
export default function KineticIntroPreview() {
  return (
    <>
      <MotionProvider />
      <SiteHeader logoSize={100} />
      <main>
        <KineticIntro />
        <NewsletterSection />
      </main>
      <SiteFooter />
    </>
  );
}
