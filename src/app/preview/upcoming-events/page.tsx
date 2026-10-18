import type { Metadata } from "next";

import { MotionProvider } from "@/components/motion/MotionProvider";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { FestivalsRow } from "@/components/home/FestivalsRow";
import { UpcomingBoard } from "@/components/home/upcoming/UpcomingBoard";
import { UpcomingFeature } from "@/components/home/upcoming/UpcomingFeature";
import { UpcomingTickets } from "@/components/home/upcoming/UpcomingTickets";
import { UpcomingWall } from "@/components/home/upcoming/UpcomingWall";
import { UpcomingYear } from "@/components/home/upcoming/UpcomingYear";
import { festivals } from "@/data/home";

export const metadata: Metadata = {
  title: "Upcoming events options — SEVENPM",
};

const OPTIONS = [
  {
    key: "a",
    label: "A · Double bill",
    note: "Live on the homepage. Two panels tinted by their posters; hover widens one and pulls its record out.",
    node: <FestivalsRow festivals={festivals} />,
  },
  {
    key: "b",
    label: "B · Board",
    note: "Ruled rows at display size, the date leading in brand yellow.",
    node: <UpcomingBoard />,
  },
  {
    key: "c",
    label: "C · Tickets",
    note: "Two paper admit-ones: poster on the stub, details as a ruled docket.",
    node: <UpcomingTickets />,
  },
  {
    key: "d",
    label: "D · Wall",
    note: "The posters pasted up at full size, taped, a few degrees off square.",
    node: <UpcomingWall />,
  },
  {
    key: "e",
    label: "E · Headliner",
    note: "Not equals: the next festival takes two thirds, the other is the support.",
    node: <UpcomingFeature />,
  },
  {
    key: "f",
    label: "F · Year",
    note: "The year as a ruler, each festival hung over its own dates.",
    node: <UpcomingYear />,
  },
];

/**
 * Upcoming events, six directions for two festivals, one under the other so
 * they can be compared in a single scroll. A is what the homepage runs now.
 * Preview furniture — goes when a direction is chosen.
 */
export default function Page() {
  return (
    <>
      <MotionProvider />
      <SiteHeader />
      <nav
        aria-label="Options"
        className="sticky top-0 z-40 border-b border-white/10 bg-bg-primary/90 backdrop-blur"
      >
        <ul className="shell m-0 flex list-none gap-2 overflow-x-auto py-3 [scrollbar-width:none]">
          {OPTIONS.map((o) => (
            <li key={o.key}>
              <a
                href={`#option-${o.key}`}
                className="btn-secondary block whitespace-nowrap px-4 py-2 font-[family-name:var(--font-display)] text-[13px] font-medium text-text-primary"
              >
                {o.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <main>
        {OPTIONS.map((o) => (
          <div key={o.key} id={`option-${o.key}`} className="scroll-mt-28">
            <div className="shell pt-16">
              <p className="m-0 border-t border-brand/60 pt-4 font-[family-name:var(--font-display)] text-[14px] leading-5 text-text-secondary">
                <span className="mr-3 font-semibold text-brand">{o.label}</span>
                {o.note}
              </p>
            </div>
            {o.node}
          </div>
        ))}
      </main>
      <SiteFooter />
    </>
  );
}
