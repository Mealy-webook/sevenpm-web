import type { Metadata } from "next";

import { SiteHeader } from "@/components/layout/SiteHeader";
import { BeatsLab } from "@/components/account/BeatsLab";

export const metadata: Metadata = {
  title: "Beats motion — SEVENPM",
  robots: { index: false },
};

/**
 * The four ways the earned Beats can arrive in the header chip, side by
 * side, each replayable on demand — the confirmation fires it once and is
 * hard to watch twice. Goes when one is chosen.
 */
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
