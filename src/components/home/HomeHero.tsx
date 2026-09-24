import { StageMeter } from "@/components/motion/StageMeter";
import { HeroTerminal } from "@/components/home/HeroTerminal";
import { homeCopy } from "@/data/home";

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

      <h1
        className="hero-headline shell relative z-10 m-0 font-daltown uppercase text-white"
        data-no-split
      >
        {homeCopy.heroLead}
        <br />
        {homeCopy.heroSecond}
      </h1>
      <StageMeter className="absolute bottom-10 right-[var(--shell-gutter)] z-10 hidden items-end gap-0.5 xl:flex" />
    </section>
  );
}
