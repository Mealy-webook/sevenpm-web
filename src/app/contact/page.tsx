import type { Metadata } from "next";

import { MotionProvider } from "@/components/motion/MotionProvider";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { ContactHero } from "@/components/pages/contact/ContactHero";
import { ContactLines } from "@/components/pages/contact/ContactLines";
import { contactCopy } from "@/data/pages";

export const metadata: Metadata = {
  title: "Contact — SEVENPM",
  description: contactCopy.intro,
};

/**
 * `/contact`. No comp — the menu asked for it, and the redesign asked for
 * more than text. It opens on the title beside two taped polaroids, then
 * the form (addressed to one of the six lines by its topic chips) beside
 * where we are, how fast we answer and the social links.
 * Copy is in `data/pages.ts`.
 */
export default function ContactPage() {
  return (
    <>
      <MotionProvider />
      <SiteHeader />
      <main>
        <ContactHero />
        <ContactLines />
      </main>
      <SiteFooter />
    </>
  );
}
