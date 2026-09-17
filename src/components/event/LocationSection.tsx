import Image from "next/image";

import type { EventDetails } from "@/data/events";
import { DisplayHeading } from "@/components/ui/DisplayHeading";

/**
 * House rules, from Figma 2236:13117: "You need to know" over the five rule
 * tiles.
 *
 * The map panel that used to sit above these is gone — the comp moved getting
 * there into the hero, where the venue name is now the underlined directions
 * link. Nothing was lost; it just stopped being a section of its own.
 *
 * The tiles are pinned to the comp's 228 × 178 rather than left to size
 * themselves. 178 is what the tallest of them comes to naturally — "Age
 * restrictions" is the one that wraps to two lines — so fixing it costs
 * nothing today and keeps the row square if a rule is ever reworded.
 */
export function LocationSection({ event }: { event: EventDetails }) {
  const { infoTiles } = event;

  return (
    <section id="location" className="relative py-16 xl:py-24">
      <div className="shell flex flex-col items-center justify-center gap-12">
        <DisplayHeading as="h2" align="left" reveal="clip">
          You need to know
        </DisplayHeading>

        <div className="flex w-full flex-col items-start">
          {/* Rules */}
          <div
            data-lenis-prevent
            className="tile-row flex w-full items-stretch gap-8 overflow-x-auto lg:flex-wrap lg:justify-center lg:overflow-visible"
            data-reveal="up"
            data-reveal-stagger
          >
            {infoTiles.map((tile) => (
              <div
                key={tile.title}
                className="lift info-tile flex h-[178px] w-[228px] shrink-0 snap-center flex-col items-center justify-center gap-4 overflow-hidden border border-ink-600 p-6 text-center"
              >
                <Image
                  src={tile.icon}
                  alt=""
                  width={32}
                  height={32}
                  className="size-8 shrink-0"
                />
                <div className="flex w-full flex-col gap-1">
                  <p className="font-[family-name:var(--font-display)] text-[22px] font-bold uppercase leading-7 tracking-[-0.11px] text-text-primary">
                    {tile.title}
                  </p>
                  <p className="font-[family-name:var(--font-display)] text-[15px] leading-[22px] tracking-[0.15px] text-text-secondary">
                    {tile.value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
