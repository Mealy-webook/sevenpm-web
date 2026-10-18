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
];

/**
 * The lineup, six directions for 4–6 acts a day, each act with a photo, a
 * short bio, a stage, a set time and Spotify and YouTube links. They read
 * the provisional bill in `data/lineup.ts` — numbered placeholder names,
 * placeholder bios — so the layouts can be judged before the real one is
 * announced. Preview furniture; goes when a direction is chosen.
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
        <div className="shell pt-10">
          <p className="m-0 border border-white/15 bg-bg-secondary p-4 font-[family-name:var(--font-display)] text-[14px] leading-5 text-text-secondary">
            <span className="font-semibold text-brand">Provisional bill.</span>{" "}
            Names, bios, stages and times are placeholders shaped like a real
            programme — three days of 5, 6 and 4 acts on two stages, with
            overlapping sets. Photos are the lineup comp&rsquo;s nine portraits,
            so some repeat. Spotify and YouTube go nowhere yet.
          </p>
        </div>
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
