import Image from "next/image";

import type { EventDetails } from "@/data/events";
import { DisplayHeading } from "@/components/ui/DisplayHeading";

/**
 * House rules, from Figma 2612:5569: "You need to know" over the five rule
 * tiles.
 *
 * The map panel that used to sit above these is gone — the comp moved getting
 * there into the hero, where the venue name is now the underlined directions
 * link. Nothing was lost; it just stopped being a section of its own.
 *
 * Each tile is 228 wide and sized by its content: a 32 icon, 16 above the
 * rule's name and its value, all set from the left edge.
 */
export function LocationSection({ event }: { event: EventDetails }) {
  const { infoTiles } = event;

  return (
    <section id="location" className="relative py-16 xl:py-20">
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
                className="lift info-tile flex w-[228px] shrink-0 snap-center flex-col items-start justify-center gap-4 overflow-hidden border border-ink-600 p-6 text-left"
              >
                <Image
                  src={tile.icon}
                  alt=""
                  width={32}
                  height={32}
                  className="size-8 shrink-0"
                />
                <div className="flex w-full flex-col">
                  <p className="font-[family-name:var(--font-display)] text-title-body font-bold uppercase tracking-[-0.09px] text-text-primary">
                    {tile.title}
                  </p>
                  <p className="font-[family-name:var(--font-display)] text-body text-text-secondary">
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
