import { ConcertLights } from "@/components/motion/ConcertLights";
import { StageMeter } from "@/components/motion/StageMeter";
import { HeroHeadline } from "@/components/home/HeroHeadline";
import { ImageTrail } from "@/components/ui/image-trail";
import { heroTrailImages, homeCopy } from "@/data/home";

/**
 * Homepage hero, from Figma 2078:44133. The comp's "MORE MUSIC MORE LIFE" is
 * Daltown 260/208 over two lines; here the second line cycles between the two
 * words instead of printing both (`HeroHeadline`). The
 * little yellow equaliser in the bottom-right corner is the comp's four bars,
 * reading the spectrum of whatever is playing. Moving the cursor across the hero leaves a trail of SEVENPM
 * concert photos behind the copy (`ImageTrail`); the native cursor and touch
 * scrolling are left alone.
 *
 * Behind all of it, `ConcertLights` hangs a lighting truss at the top of the
 * page and brings its own scrim, so the copy stays readable over the beams.
 */
export function HomeHero() {
  return (
    <section className="relative isolate">
      <ConcertLights />
      <ImageTrail
        images={heroTrailImages}
        hideCursor={false}
        spacing={72}
        duration={1100}
        imageSize={180}
        cornerRadius={0}
        fadeInDuration={0.35}
        fadeOutDuration={0.6}
        fadeInBlur={0}
        fadeOutBlur={8}
        maxTrailImages={14}
        className="w-full"
      >
        <div className="shell relative flex min-h-[min(72vh,620px)] flex-col items-start justify-center gap-6 pb-16 pt-6 xl:pb-24 xl:pt-[79px]">
          <HeroHeadline />
          <p
            className="max-w-[786px] font-[family-name:var(--font-display)] text-[18px] leading-[1.6] text-content-secondary"
            data-split="lines"
            data-reveal-delay="0.12"
          >
            {homeCopy.intro}
          </p>

          <StageMeter className="absolute bottom-16 right-[var(--shell-gutter)] hidden items-end gap-0.5 xl:flex" />
        </div>
      </ImageTrail>
    </section>
  );
}
