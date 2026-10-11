import type { Metadata } from "next";

import { MotionProvider } from "@/components/motion/MotionProvider";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { QuoteForm } from "@/components/hospitality/QuoteForm";
import { PaperRooms } from "@/components/hospitality/paper/PaperRooms";
import {
  PaperArgument,
  PaperEnquiry,
  PaperHero,
  PaperOrder,
  PaperSpecification,
} from "@/components/hospitality/paper/PaperSections";
import { hospitalityCopy } from "@/data/hospitality";

export const metadata: Metadata = {
  title: "Hospitality — SEVENPM",
  description: hospitalityCopy.intro,
};

/**
 * `/hospitality`, the paper design.
 *
 * An inversion. Every other page on this site is dark and loud because every
 * other page is about the crowd; hospitality is the room above the crowd, so
 * this one is paper, set in black, and the only noise on it is the
 * photography. The design is the argument — a quiet page for the quiet
 * option, which is also the expensive one.
 *
 * Nothing bleeds and nothing moves. The pictures are held to a column, the
 * sections are divided by printed rules rather than borders or panels, and
 * the specification is a table because a specification is a table. The one
 * dark moment is the enquiry at the foot, which closes the brochure and
 * takes the page back to the festival.
 *
 * The clock design this replaced is kept at
 * `/preview/hospitality-night-design`.
 */
export default function HospitalityPage() {
  return (
    <>
      <MotionProvider />
      <SiteHeader />
      {/* `.paper` scopes the inversion: `DisplayHeading` and the rules are
          told to use ink instead of white for the length of this page, and
          nothing leaks to the header or the footer. */}
      <main className="paper">
        <PaperHero />
        <PaperArgument />
        <PaperRooms />
        <PaperSpecification />
        <PaperOrder />
        <PaperEnquiry>
          <div>
            <QuoteForm bare />
          </div>
        </PaperEnquiry>
      </main>
      <SiteFooter />
    </>
  );
}
