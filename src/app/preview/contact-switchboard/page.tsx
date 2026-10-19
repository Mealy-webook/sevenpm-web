import type { Metadata } from "next";

import { MotionProvider } from "@/components/motion/MotionProvider";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { ContactSwitchboard } from "@/components/pages/contact/ContactDirections";
import { ContactVariantBar } from "@/components/pages/contact/ContactVariantBar";

export const metadata: Metadata = {
  title: "Contact — switchboard — SEVENPM",
};

/** Contact, one of three new directions from the benchmark's brief. */
export default function Page() {
  return (
    <>
      <MotionProvider />
      <SiteHeader />
      <ContactVariantBar current="contact-switchboard" />
      <main>
        <ContactSwitchboard />
      </main>
      <SiteFooter />
    </>
  );
}
