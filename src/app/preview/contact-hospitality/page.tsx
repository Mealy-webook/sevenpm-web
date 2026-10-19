import type { Metadata } from "next";

import { MotionProvider } from "@/components/motion/MotionProvider";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { ContactHospitalityPage } from "@/components/pages/contact/ContactOptions";
import { ContactVariantBar } from "@/components/pages/contact/ContactVariantBar";

export const metadata: Metadata = {
  title: "Contact — hospitality — SEVENPM",
};

/** Contact, one of three options built from the site's own sections. */
export default function Page() {
  return (
    <>
      <MotionProvider />
      <SiteHeader />
      <ContactVariantBar current="contact-hospitality" />
      <main>
        <ContactHospitalityPage />
      </main>
      <SiteFooter />
    </>
  );
}
