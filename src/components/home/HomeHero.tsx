import { StageMeter } from "@/components/motion/StageMeter";
import { HeroTerminal } from "@/components/home/HeroTerminal";
import Image from "next/image";

import { heroPolaroids, homeCopy } from "@/data/home";

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
  return (
    /* Centred in the fold, not sitting at the top of it. The section is
       the screen minus the header rather than the whole screen: it already
       starts below the header's in-flow spacer, so sizing it to 100svh and
       padding the header's height on top counted the header twice and
       pushed the heading 121px low. */
    <section className="relative isolate flex h-[calc(100svh-var(--header-h,0px))] w-full flex-col justify-center">
      <HeroTerminal />

      <div className="shell relative z-10 flex w-full flex-col gap-4">
        <h1
          className="hero-headline m-0 flex flex-col gap-4 font-daltown uppercase text-white"
          data-no-split
        >
          <span className="block">{homeCopy.heroLead}</span>
          <span className="block">{homeCopy.heroSecond}</span>
        </h1>

        {/* 17/24 on the headline's own measure, ranged left under it. */}
        <p
          className="m-0 max-w-[634px] font-[family-name:var(--font-display)] text-[17px] leading-6 tracking-[0.085px] text-content-secondary"
          data-split="lines"
          data-reveal-delay="0.12"
        >
          {homeCopy.intro}
        </p>
      </div>

      {/* The two polaroids, centred on their share of the comp's frame and
          tilted the way it tilts them. Hidden below `lg`, where the heading
          takes the whole width and they would sit on top of it. */}
      {heroPolaroids.map((polaroid) => (
        <span
          key={polaroid.image}
          aria-hidden
          className="pointer-events-none absolute z-[5] hidden w-[clamp(180px,23.5vw,356px)] lg:block"
          style={{
            left: `${polaroid.x}%`,
            top: `${polaroid.y}%`,
            translate: "-50% -50%",
            rotate: `${polaroid.rotate}deg`,
          }}
        >
          {/* The card is its own element so the border percentages resolve
              against the card's width. On the positioned wrapper they would
              resolve against the section — a 1512px containing block, which
              made the border ten times too deep. */}
          <span className="block bg-white p-[3.91%] pb-[17.23%] shadow-[0_24px_60px_rgba(0,0,0,0.45)]">
            <span className="relative block aspect-[327.793/326.45] w-full overflow-hidden bg-[#27272a]">
              <Image
                src={polaroid.image}
                alt=""
                fill
                /* The print is near-square and the photograph is 3:2, so
                   `cover` scales it to the box's height: it needs ~480px of
                   width to land at the card's full size. */
                sizes="480px"
                priority
                className="object-cover"
              />
            </span>
          </span>
        </span>
      ))}

      <StageMeter className="absolute bottom-10 right-[var(--shell-gutter)] z-10 hidden items-end gap-0.5 xl:flex" />
    </section>
  );
}
