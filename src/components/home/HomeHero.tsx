import { StageMeter } from "@/components/motion/StageMeter";
import { HeroTerminal } from "@/components/home/HeroTerminal";
import Image from "next/image";

import { festivals, festivalsRowOrder, homeCopy } from "@/data/home";

/**
 * Homepage hero, from Figma 2467:19559 (the 15:202 page).
 *
 * One screen: the headline, the ground, and the equaliser in the
 * bottom-right corner that is the comp's four bars reading the spectrum of
 * whatever is playing.
 *
 * The comp sets the headline as two lines — MORE MUSIC over MORE LIFE — at
 * Daltown 260/188, ranged left against the gutter. It sits centred in the
 * fold vertically while staying ranged left across it — centred in the
 * screen minus the header, which is the space actually visible. No standfirst and no button:
 * the comp has neither.
 *
 * The ground is React Bits' FaultyTerminal tinted brand (`HeroTerminal`),
 * in place of the lighting truss that used to hang here. The event page's
 * hero still has the truss. It reaches up behind the fixed header rather
 * than starting below it, so there is no bare strip across the top.
 */
export function HomeHero() {
  const covers = festivalsRowOrder
    .map((id) => festivals.find((f) => f.id === id))
    .filter((f): f is (typeof festivals)[number] => Boolean(f?.card))
    .slice(0, 2);

  return (
    /* Centred in the fold, not sitting at the top of it. The section is
       the screen minus the header rather than the whole screen: it already
       starts below the header's in-flow spacer, so sizing it to 100svh and
       padding the header's height on top counted the header twice and
       pushed the heading 121px low. */
    <section className="relative isolate flex h-[calc(100svh-var(--header-h,0px))] w-full flex-col justify-center">
      <HeroTerminal />

      <div className="shell relative z-10 grid w-full grid-cols-1 items-center gap-10 lg:grid-cols-[minmax(0,auto)_minmax(0,1fr)]">
        <div className="flex flex-col gap-6">
          <h1
            className="hero-headline m-0 font-daltown uppercase text-white"
            data-no-split
          >
            {homeCopy.heroLead}
            <br />
            {homeCopy.heroSecond}
          </h1>

          {/* Ranged left under the headline, on the headline's own measure
            rather than centred — the heading is not centred either. */}
          <p
            className="m-0 max-w-[620px] font-[family-name:var(--font-display)] text-[18px] leading-[1.6] text-content-secondary"
            data-split="lines"
            data-reveal-delay="0.12"
          >
            {homeCopy.intro}
          </p>
        </div>

        {/* Two covers to the right of the copy, the second dropped so the
            pair reads as a stack rather than a row. Only from `lg`: below
            that the heading already takes the width, and a pair of covers
            squeezed beside it would be thumbnails. */}
        <div className="hidden items-center justify-end gap-5 lg:flex">
          {covers.map((festival, index) => (
            <span
              key={festival.id}
              className={`relative block aspect-square w-[clamp(130px,13vw,215px)] shrink-0 overflow-hidden bg-[#27272a] ${
                index === 1 ? "translate-y-10" : "-translate-y-6"
              }`}
            >
              <Image
                src={festival.card as string}
                alt=""
                fill
                sizes="215px"
                priority
                className="object-cover"
              />
            </span>
          ))}
        </div>
      </div>
      <StageMeter className="absolute bottom-10 right-[var(--shell-gutter)] z-10 hidden items-end gap-0.5 xl:flex" />
    </section>
  );
}
