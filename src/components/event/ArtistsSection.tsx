"use client";

import Image from "next/image";
import { useState } from "react";

import type { ArtistGroup, EventDetails } from "@/data/events";
import { DISPLAY_ART, DisplayHeading } from "@/components/ui/DisplayHeading";

/** The Figma row is 1938 wide (it deliberately bleeds past the 1512 frame). */
const ROW_WIDTH = 1938;
const ROW_HEIGHT = 406;

function Circle({
  image,
  name,
  size,
}: {
  image: string;
  name: string;
  size: number;
}) {
  return (
    <div
      className="artist-circle relative shrink-0 overflow-hidden rounded-full"
      style={{ width: size, height: size }}
    >
      <Image
        src={image}
        alt={name}
        width={size}
        height={size}
        sizes={`${size}px`}
        className="size-full object-cover"
      />
    </div>
  );
}

function Group({ group, last }: { group: ArtistGroup; last: boolean }) {
  const spacing = last ? undefined : { marginRight: -20 };

  if (group.type === "solo") {
    return (
      <div className="shrink-0" style={spacing}>
        <Circle image={group.image} name={group.name} size={406} />
      </div>
    );
  }

  return (
    <div className="flex w-[400px] shrink-0 flex-wrap items-start" style={spacing}>
      {group.items.map((item, index) =>
        item ? (
          <Circle
            key={`${item.image}-${index}`}
            image={item.image}
            name={item.name}
            size={200}
          />
        ) : (
          <div key={`empty-${index}`} className="size-[200px] shrink-0" />
        ),
      )}
    </div>
  );
}

export function ArtistsSection({ event }: { event: EventDetails }) {
  const [activeDay, setActiveDay] = useState(event.artistDays[0].id);
  const day =
    event.artistDays.find((entry) => entry.id === activeDay) ??
    event.artistDays[0];

  return (
    <section id="artists" className="relative overflow-hidden py-16 xl:py-24">
      <div className="shell flex flex-col items-center justify-center gap-12">
        <DisplayHeading art={DISPLAY_ART.artists} reveal="clip">
          Artists
        </DisplayHeading>

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
                className={`flex items-center overflow-hidden border px-7 py-4 font-[family-name:var(--font-ui)] text-base font-semibold leading-none text-white transition-colors ${
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

      <div className="stage-artists relative mt-12 w-full">
        <div
          className="artist-row absolute left-1/2 top-0 flex items-start"
          style={{
            width: ROW_WIDTH,
            height: ROW_HEIGHT,
            marginLeft: -ROW_WIDTH / 2,
            transform: "scale(var(--artists-scale))",
            transformOrigin: "top center",
          }}
        >
          {day.groups.map((group, index) => (
            <Group
              key={`${day.id}-${index}`}
              group={group}
              last={index === day.groups.length - 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
