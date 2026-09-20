import type { Metadata } from "next";

import { SiteHeader } from "@/components/layout/SiteHeader";
import { BeatsLab } from "@/components/account/BeatsLab";

export const metadata: Metadata = {
  title: "Beats motion — SEVENPM",
  robots: { index: false },
};

/** Replays the Beats announcement without walking a booking. Review only. */
export default function BeatsMotionPreview() {
  return (
    <>
      <SiteHeader logoSize={72} />
      <main className="shell flex min-h-[70svh] flex-col gap-10 pt-16">
        <BeatsLab />
      </main>
    </>
  );
}
