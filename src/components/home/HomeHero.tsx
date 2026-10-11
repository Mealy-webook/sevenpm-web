import { StageMeter } from "@/components/motion/StageMeter";
import { HeroTerminal } from "@/components/home/HeroTerminal";
import { HeroPill } from "@/components/home/HeroPill";

import { homeCopy } from "@/data/home";

/**
 * Homepage hero, from Figma 2482:25005.
 *
 * Two centred lines — MORE over MUSIC — with the O of MORE knocked out and a
 * photograph of the crowd set into the hole. The hole is not an O: the comp
 * draws a 455 x 173 pill at a 999px radius, two and a half times the width of
 * the glyph it stands in for, so the word reads as MORE with a window cut
 * through it rather than as a letter made of picture.
 *
 * The letters are live Daltown, not the comp's outlined vectors. Same font,
 * same glyphs, same widths — and it keeps the headline as text that scales
 * with `--display-scale`, can be selected, and costs no SVG payload.
 *
 * Everything about the pill is expressed as a multiple of the font size
 * (see `heroPill` in `data/home.ts`), so the hole and the 4px gaps either
 * side of it track the type at every width instead of drifting out of the
 * word as the headline scales.
 *
 * What this comp drops, against the 15:202 hero it replaces: the standfirst,
 * the two polaroids, and the equaliser in the corner. The ground stays — the
 * tinted FaultyTerminal was always an implementation choice rather than
 * something the comps draw.
 */
export function HomeHero() {
  const { heroCut, heroTitle } = homeCopy;

  return (
    /* Centred in the fold, not sitting at the top of it. The section is the
       screen minus the header rather than the whole screen: it already starts
       below the header's in-flow spacer, so sizing it to 100svh and padding
       the header's height on top counted the header twice. */
    <section className="relative isolate flex h-[calc(100svh-var(--header-h,0px))] w-full flex-col items-center justify-center">
      <HeroTerminal />

      <div className="shell relative z-10 flex w-full flex-col items-center">
        {/* The composition is decorative in the literal sense: read aloud it
            would be "M, image, RE, MUSIC". The heading carries the words, and
            the drawing of them is hidden from the accessibility tree. */}
        <h1 className="sr-only">{heroTitle}</h1>

        <div
          aria-hidden
          className="hero-headline flex flex-col items-center gap-[0.1077em] font-daltown uppercase text-white"
          data-no-split
          data-reveal="clip"
          data-reveal-stagger
        >
          {/* MORE, with the hole in it. */}
          <span className="flex items-center justify-center">
            <span className="block">{heroCut.before}</span>
            <HeroPill />
            <span className="block">{heroCut.after}</span>
          </span>

          {/* MUSIC. */}
          <span className="block">{heroCut.second}</span>
        </div>
      </div>

      <StageMeter className="absolute bottom-10 right-[var(--shell-gutter)] z-10 hidden items-end gap-0.5 xl:flex" />
    </section>
  );
}
