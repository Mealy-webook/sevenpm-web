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
 * the six lines as photo tiles (picking one addresses the form), then the
 * form beside where we are, how fast we answer and the social links.
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
