import Image from "next/image";

import { lineupPortraits } from "@/data/events";

/**
 * The lineup, from Figma 2550:20117.
 *
 * A single band of circular portraits running the full width: 406 circles
 * alternating with 2×2 blocks of 200s, each overlapping its neighbour by
 * 20px so the row reads as one crowd rather than as a gallery. The heading
 * sits above it at Daltown 120/100, ranged left.
 *
 * The band bleeds past both edges in the comp — the first and last circles
 * are cut by the frame — so it is full-bleed here and scrolls rather than
 * shrinking, which is the only way ten circles of this size survive a phone.
 *
 * What this is not: the comp's lineup carries no name, stage, set time or
 * link. It is a wall of faces, and it replaces the hover-rail that at least
 * put a name and a time on each act. A lineup that has to answer "who is on,
 * where, and when" needs its own section — see the note on
 * `lineupPortraits`.
 */
export function LineupBand() {
  /* The comp's rhythm: big, 2×2, big, big, 2×2. Derived from the data rather
     than hard-coded so a tenth portrait lands somewhere sensible. */
  const groups: { big?: boolean; items: typeof lineupPortraits }[] = [];
  for (const portrait of lineupPortraits) {
    const last = groups[groups.length - 1];
    if (portrait.big) {
      groups.push({ big: true, items: [portrait] });
    } else if (last && !last.big && last.items.length < 4) {
      last.items.push(portrait);
    } else {
      groups.push({ items: [portrait] });
    }
  }

  return (
    <section
      id="artists"
      className="relative overflow-hidden py-16 xl:py-20"
      aria-labelledby="lineup-title"
    >
      <div className="shell">
        <h2
          id="lineup-title"
          className="m-0 font-daltown text-[clamp(44px,8vw,108px)] uppercase leading-[0.84] tracking-[0.03em] text-white"
          data-reveal="clip"
        >
          Lineup
        </h2>
      </div>

      {/* The glow behind the middle of the band. */}
      <div className="relative mt-10 xl:mt-12">
        <span
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 block size-[256px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand/25 blur-[167px]"
        />

        {/* Scrolls rather than shrinks: the comp runs the band off both
            edges, and circles that shrink to fit a phone stop being faces. */}
        <div className="relative overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <ul className="m-0 flex w-max list-none items-center p-0" data-reveal="up">
            {groups.map((group, index) =>
              group.big ? (
                <li
                  key={index}
                  className="-mr-5 shrink-0"
                  style={{ width: "clamp(200px, 27vw, 406px)" }}
                >
                  <span className="relative block aspect-square w-full overflow-hidden rounded-full">
                    <Image
                      src={group.items[0].src}
                      alt=""
                      fill
                      sizes="(min-width: 1512px) 406px, 27vw"
                      className="object-cover"
                    />
                  </span>
                </li>
              ) : (
                <li
                  key={index}
                  className="-mr-5 flex shrink-0 flex-wrap"
                  style={{ width: "clamp(197px, 26.6vw, 400px)" }}
                >
                  {group.items.map((portrait) => (
                    <span
                      key={portrait.src}
                      className="relative block aspect-square w-1/2 overflow-hidden rounded-full"
                    >
                      <Image
                        src={portrait.src}
                        alt=""
                        fill
                        sizes="(min-width: 1512px) 200px, 13vw"
                        className="object-cover"
                      />
                    </span>
                  ))}
                </li>
              ),
            )}
          </ul>
        </div>
      </div>
    </section>
  );
}
