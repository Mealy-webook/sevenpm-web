import { StageMeter } from "@/components/motion/StageMeter";
import { HeroTerminal } from "@/components/home/HeroTerminal";

/**
 * Homepage hero, from Figma 2467:19559 (the 15:202 page).
 *
 * One screen: the ground, and the equaliser in the bottom-right corner that
 * is the comp's four bars reading the spectrum of whatever is playing. The
 * comp's headline and standfirst are gone, and so is the frame that used to
 * open as you scrolled — with nothing left to reveal there is nothing for a
 * 320vh sticky rig to hold, so the section is a plain screen again.
 *
 * The ground is React Bits' FaultyTerminal tinted brand (`HeroTerminal`),
 * in place of the lighting truss that used to hang here. The event page's
 * hero still has the truss. It reaches up behind the fixed header rather
 * than starting below it, so there is no bare strip across the top.
 */
export function HomeHero() {
  return (
    <section className="relative isolate flex h-svh w-full flex-col">
      <HeroTerminal />
      <StageMeter className="absolute bottom-10 right-[var(--shell-gutter)] z-10 hidden items-end gap-0.5 xl:flex" />
    </section>
  );
}
