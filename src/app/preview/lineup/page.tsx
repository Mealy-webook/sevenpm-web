import type { Metadata } from "next";

import { MotionProvider } from "@/components/motion/MotionProvider";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { LineupCards } from "@/components/event/lineup/LineupCards";
import { LineupFaces } from "@/components/event/lineup/LineupFaces";
import { LineupPoster } from "@/components/event/lineup/LineupPoster";
import { LineupRunningOrder } from "@/components/event/lineup/LineupRunningOrder";
import { LineupSpine } from "@/components/event/lineup/LineupSpine";
import { LineupTimeline } from "@/components/event/lineup/LineupTimeline";
import { LineupIndex } from "@/components/event/lineup/LineupIndex";
import { LineupRail } from "@/components/event/lineup/LineupRail";
import { LineupStubs } from "@/components/event/lineup/LineupStubs";
import { LineupLive } from "@/components/event/lineup/LineupLive";
import { LineupAccordion } from "@/components/event/lineup/LineupAccordion";
import { LineupTracklist } from "@/components/event/lineup/LineupTracklist";
import { LineupStages } from "@/components/event/lineup/LineupStages";
import { LineupBill } from "@/components/event/lineup/LineupBill";
import { LineupMosaic } from "@/components/event/lineup/LineupMosaic";
import { LineupPolaroids } from "@/components/event/lineup/LineupPolaroids";
import { LineupFestivalGrid } from "@/components/event/lineup/LineupFestivalGrid";
import { LineupStories } from "@/components/event/lineup/LineupStories";

export const metadata: Metadata = {
  title: "Lineup options — SEVENPM",
};

const OPTIONS = [
  {
    key: "a",
    label: "A · Running order",
    note: "Recommended. One row per act in the order they play — time, photo, name, stage, bio, links, all visible.",
    node: <LineupRunningOrder />,
  },
  {
    key: "b",
    label: "B · Timeline",
    note: "A lane per stage on the clock, so clashes show. Pick a set to open it below.",
    node: <LineupTimeline />,
  },
  {
    key: "c",
    label: "C · Cards",
    note: "The photo leads: a card per act, the headliner two wide.",
    node: <LineupCards />,
  },
  {
    key: "d",
    label: "D · Poster",
    note: "Every day at once, set like a festival poster; pick a name to open it.",
    node: <LineupPoster />,
  },
  {
    key: "e",
    label: "E · Faces",
    note: "The comp's band of round portraits; pick a face and the act steps into a spotlight.",
    node: <LineupFaces />,
  },
  {
    key: "f",
    label: "F · Spine",
    note: "The night top to bottom: a clock down the middle, one stage either side.",
    node: <LineupSpine />,
  },
  {
    key: "g",
    label: "G · Index",
    note: "Names at display size on the left; the act under the pointer opens large on the right.",
    node: <LineupIndex />,
  },
  {
    key: "h",
    label: "H · Rail",
    note: "Tall portrait cards to swipe; “About” slides the bio and links up over the photo.",
    node: <LineupRail />,
  },
  {
    key: "i",
    label: "I · Stubs",
    note: "Every set as a perforated ticket stub, the headliner's in yellow.",
    node: <LineupStubs />,
  },
  {
    key: "j",
    label: "J · Live",
    note: "On now and up next, per stage. The slider stands in for the visitor's clock.",
    node: <LineupLive />,
  },
  {
    key: "k",
    label: "K · Accordion",
    note: "One slim line per act; tap to drop out the photo, bio and links. The densest option.",
    node: <LineupAccordion />,
  },
  {
    key: "l",
    label: "L · Tracklist",
    note: "Each night as a record: sides A and B, sets numbered like tracks.",
    node: <LineupTracklist />,
  },
  {
    key: "m",
    label: "M · Stages",
    note: "A column per stage, acts stacked in playing order, like a printed programme.",
    node: <LineupStages />,
  },
  {
    key: "n",
    label: "N · Top of the bill",
    note: "The headliner as a full-width banner; the rest of the night as small cards below.",
    node: <LineupBill />,
  },
  {
    key: "o",
    label: "O · Mosaic",
    note: "A gapless photo wall, headliner 2×2; hover a tile for the bio and links.",
    node: <LineupMosaic />,
  },
  {
    key: "p",
    label: "P · Polaroids",
    note: "Each act a tilted print with the time in the foot; pick one to open it.",
    node: <LineupPolaroids />,
  },
  {
    key: "q",
    label: "Q · Whole festival",
    note: "Every night on one grid of faces — which night to come, before who is on.",
    node: <LineupFestivalGrid />,
  },
  {
    key: "r",
    label: "R · Stories",
    note: "One act at a time, story bars along the top; tap or step through the night.",
    node: <LineupStories />,
  },
];

/**
 * The lineup, eighteen directions for 4–6 acts a day, each act with a photo, a
 * short bio, a stage, a set time and Spotify and YouTube links. They read
 * the provisional bill in `data/lineup.ts` — numbered placeholder names,
 * placeholder bios — so the layouts can be judged before the real one is
 * announced. Preview furniture; goes when a direction is chosen.
 */
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ only?: string }>;
}) {
  /* `?only=mnr` shows just those options — for comparing a few at a time.
     Not in the Pages export: reading searchParams makes a page dynamic, and
     a static export has no server to render one, so there it shows all. */
  const only =
    process.env.STATIC_EXPORT === "true" ? undefined : (await searchParams).only;
  const shown = only ? OPTIONS.filter((o) => only.includes(o.key)) : OPTIONS;
  return (
    <>
      <MotionProvider />
      <SiteHeader />
      <nav
        aria-label="Options"
        className="sticky top-0 z-40 border-b border-white/10 bg-bg-primary/90 backdrop-blur"
      >
        <ul className="shell m-0 flex list-none gap-2 overflow-x-auto py-3 [scrollbar-width:none]">
          {shown.map((o) => (
            <li key={o.key}>
              <a
                href={`#option-${o.key}`}
                className="btn-secondary block whitespace-nowrap px-4 py-2 font-[family-name:var(--font-display)] text-body-s font-medium text-text-primary"
              >
                {o.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <main>
        <div className="shell pt-10">
          <p className="m-0 border border-white/15 bg-bg-secondary p-4 font-[family-name:var(--font-display)] text-body text-text-secondary">
            <span className="font-semibold text-brand">Provisional bill.</span>{" "}
            Names, bios, stages and times are placeholders shaped like a real
            programme — three days of 5, 6 and 4 acts on two stages, with
            overlapping sets. Photos are the lineup comp&rsquo;s nine portraits,
            so some repeat. Spotify and YouTube go nowhere yet.
          </p>
        </div>
        {shown.map((o) => (
          <div key={o.key} id={`option-${o.key}`} className="scroll-mt-28">
            <div className="shell pt-16">
              <p className="m-0 border-t border-brand/60 pt-4 font-[family-name:var(--font-display)] text-body text-text-secondary">
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
