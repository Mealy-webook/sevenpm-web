"use client";

import { useMemo, useState } from "react";

import type { ArtistDay, EventDetails } from "@/data/events";
import { DisplayHeading } from "@/components/ui/DisplayHeading";
import {
  HoverExpandGallery,
  type HoverExpandItem,
} from "@/components/ui/hover-expand-gallery";

/**
 * The line-up. The day's acts are a row of closed rails that open one at a
 * time under the cursor — the name runs up the rail and the set time appears
 * on the panel that is open.
 *
 * This replaces the drifting row of portraits the Figma comp draws. That row
 * showed every face at once and put the names behind a hover; this shows one
 * act at a time and puts every name on the page, which is the trade the
 * gallery makes and the reason for it.
 */

/** Flatten a day into one act per panel; the comp's 2×2 blocks carry gaps. */
function actsOf(day: ArtistDay): HoverExpandItem[] {
  return day.groups.flatMap((group) =>
    group.type === "solo"
      ? [group]
      : group.items.filter((item): item is NonNullable<typeof item> =>
          Boolean(item),
        ),
  ).map((artist) => ({
    title: artist.name,
    meta: artist.time,
    src: artist.image,
    alt: artist.name,
  }));
}

export function ArtistsSection({ event }: { event: EventDetails }) {
  const [activeDay, setActiveDay] = useState(event.artistDays[0].id);
  const day =
    event.artistDays.find((entry) => entry.id === activeDay) ??
    event.artistDays[0];
  const acts = useMemo(() => actsOf(day), [day]);

  return (
    /* Tighter vertical padding than its neighbours: the display heading is
       208px of line box on its own, and at the usual py-24 there is not a
       screen's worth of room left for a row of portraits. */
    <section id="artists" className="section-screen relative overflow-hidden py-12">
      <div className="shell flex flex-col items-center gap-12">
        <DisplayHeading reveal="clip">Line-up</DisplayHeading>

        <div
          className="flex flex-wrap items-start justify-center gap-6"
          data-reveal="up"
        >
          {event.artistDays.map((entry) => {
            const active = entry.id === day.id;
            return (
              <button
                key={entry.id}
                type="button"
                onClick={() => setActiveDay(entry.id)}
                aria-pressed={active}
                className={`flex items-center overflow-hidden border px-7 py-4 font-[family-name:var(--font-display)] text-base font-semibold leading-none text-white transition-colors ${
                  active
                    ? "border-white"
                    : "border-white/10 hover:border-white/40"
                }`}
              >
                {entry.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="shell mt-12 w-full" data-reveal="up" data-reveal-delay="0.08">
        <HoverExpandGallery
          /* Re-keyed per day: the panels are different acts, and the open one
             should be the first of the new day rather than whichever index
             happened to be open on the last. */
          key={day.id}
          items={acts}
          label={`${day.label} line-up`}
          /* A definite height, not a percentage: everything inside the
             gallery is percentage-based and `100%` collapses it to nothing
             unless every ancestor up to <html> has a real height too. The
             402 is what the heading, the chips and the padding take, so the
             row gets the rest of the screen and the section fits one. */
          height="clamp(300px, calc(100svh - var(--header-h, 0px) - 402px), 560px)"
          /* Nine acts: eight rails at 64 plus a 520 panel is 1032, inside the
             1272 column with room to spare. */
          railWidth={64}
          maxOpenWidth={520}
          mobileImageHeight={360}
        />
      </div>
    </section>
  );
}
