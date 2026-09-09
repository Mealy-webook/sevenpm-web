import Image from "next/image";

import type { EventDetails } from "@/data/events";
import { DISPLAY_ART, DisplayHeading } from "@/components/ui/DisplayHeading";

export function LocationSection({ event }: { event: EventDetails }) {
  const { venue, infoTiles } = event;

  return (
    <section id="location" className="relative py-16 xl:py-24">
      <div className="shell flex flex-col items-center justify-center gap-12">
        <DisplayHeading art={DISPLAY_ART.location} reveal="clip">
          Location
        </DisplayHeading>

        <div className="flex w-full flex-col items-start gap-8">
          {/* Map panel */}
          <div
            className="relative flex h-[240px] w-full flex-col items-end justify-end overflow-hidden border border-ink-600 md:h-[349px]"
            data-reveal="up"
          >
            {/* Crop taken from Figma: the source map is scaled up and offset
             *  so the venue sits where the pin is. */}
            <Image
              src={venue.mapImage}
              alt={`Map showing ${venue.name}`}
              width={1426}
              height={960}
              sizes="(max-width: 1512px) 120vw, 1426px"
              className="absolute max-w-none object-cover"
              style={{
                height: "274.94%",
                width: "112.11%",
                left: "-6.05%",
                top: "-87.47%",
              }}
            />

            <Image
              src="/assets/ic-map-pin.svg"
              alt=""
              width={56}
              height={56}
              className="absolute size-14"
              style={{
                left: `${(venue.pin.x / 1272) * 100}%`,
                top: `${(venue.pin.y / 349) * 100}%`,
              }}
            />

            <div className="relative flex w-full flex-col gap-4 bg-gradient-to-b from-transparent to-black to-[65.385%] p-6 sm:flex-row sm:items-center sm:gap-8">
              <p className="min-w-0 flex-1 font-[family-name:var(--font-display)] text-[22px] font-bold leading-7 tracking-[-0.11px] text-white">
                {venue.name}
              </p>
              <a
                href={venue.directionsUrl}
                target="_blank"
                rel="noreferrer noopener"
                data-magnetic="0.2"
                className="flex shrink-0 items-center justify-center gap-2 overflow-hidden bg-white p-6 font-[family-name:var(--font-display)] text-base font-semibold uppercase leading-none text-black transition-colors hover:bg-white/85"
              >
                Get directions
                <Image
                  src="/assets/ic-send.svg"
                  alt=""
                  width={20}
                  height={20}
                  className="size-5"
                />
              </a>
            </div>
          </div>

          {/* Rules */}
          <div
            className="flex w-full flex-wrap items-center justify-center gap-8"
            data-reveal="up"
            data-reveal-stagger
          >
            {infoTiles.map((tile) => (
              <div
                key={tile.title}
                className="lift info-tile flex w-[228px] flex-col items-center justify-center gap-4 overflow-hidden border border-ink-600 p-6 text-center"
              >
                <Image
                  src={tile.icon}
                  alt=""
                  width={32}
                  height={32}
                  className="size-8 shrink-0"
                />
                <div className="flex w-full flex-col gap-1">
                  <p className="font-[family-name:var(--font-display)] text-[22px] font-bold leading-7 tracking-[-0.11px] text-text-primary">
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
