import type { Metadata } from "next";

import { MotionProvider } from "@/components/motion/MotionProvider";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { ContactPanel } from "@/components/pages/contact/ContactPanel";
import { contactCopy } from "@/data/pages";

export const metadata: Metadata = {
  title: "Contact — SEVENPM",
  description: contactCopy.intro,
};

/** `/contact`, from Figma 2633:16861. Copy is in `data/pages.ts`. */
export default function ContactPage() {
  return (
    <>
      <MotionProvider />
      <SiteHeader />
      <main>
        <ContactPanel />
      </main>
      <SiteFooter />
    </>
  );
}
