import Image from "next/image";
import Link from "next/link";

import { ConcertLights } from "@/components/motion/ConcertLights";
import { StageMeter } from "@/components/motion/StageMeter";
import { HeroHeadline } from "@/components/home/HeroHeadline";
import {
  ContainerAnimated,
  ContainerInset,
  ContainerScroll,
  ContainerSticky,
  HeroScaled,
  HeroVideo,
} from "@/components/ui/animated-video-on-scroll";
import { heroReveal, homeCopy } from "@/data/home";

/**
 * Homepage hero, from Figma 2467:19559 (the 15:202 page).
 *
 * The comp centres "MORE MUSIC" on one line at Daltown 260/188 with the
 * second word in brand, and sets the standfirst at 18/1.6 under it; here
 * that second word cycles between MUSIC and LIFE instead of standing still
 * (`HeroHeadline`). The little yellow equaliser in the bottom-right corner
 * is the comp's four bars, reading the spectrum of whatever is playing. The
 * comp adds a 193 × 65 button under the standfirst and leaves it unlabelled,
 * so `homeCopy.heroCta` names it and points it at the one thing on this page
 * you can actually buy.
 *
 * The screen then holds while you scroll: the copy drifts up and a frame
 * opens beneath it from a rounded pill to the full bleed
 * (`animated-video-on-scroll`). The frame is flush to the bottom of the
 * screen, so the open state reads as the page itself arriving rather than as
 * a band floating in the middle of it. It gives back height on small screens:
 * the headline stacks into two lines there, and a sticky screen taller than
 * the viewport does not stick.
 *
 * The travel is 320vh. The component opens its frame over the first 80% of
 * that, so the remaining fifth is how long the full frame holds before the
 * screen releases — at 250vh that was 230px of scroll, which was gone before
 * you saw it. The offset starts at `start start` because this block is at
 * the very top of the page; the component's own default would load it a
 * quarter open.
 *
 * The cursor image-trail that used to live here is gone: a trail of
 * photographs dropped over a photograph that is itself opening is mush.
 *
 * Behind all of it, `ConcertLights` hangs a lighting truss at the top of the
 * page and brings its own scrim, so the copy stays readable over the beams.
 */
export function HomeHero() {
  return (
    <ContainerScroll
      className="relative isolate h-[320vh]"
      offset={["start start", "end end"]}
    >
      <ContainerSticky className="flex min-h-svh flex-col overflow-hidden">
        <ConcertLights />

        <ContainerAnimated
          className="shell relative flex w-full flex-1 flex-col items-center justify-center gap-4 pt-[var(--header-h,0px)]"
          inputRange={[0, 0.6]}
          outputRange={[0, -60]}
        >
          <HeroHeadline />
          <p
            className="max-w-[786px] text-center font-[family-name:var(--font-display)] text-[18px] leading-[1.6] text-content-secondary"
            data-split="lines"
            data-reveal-delay="0.12"
          >
            {homeCopy.intro}
          </p>

          <Link
            href={homeCopy.heroCta.href}
            data-magnetic="0.2"
            /* The comp draws the button as a light fill, which is the
               house primary — white ground, brand on hover. `.sweep` is no
               use here: its fill is `currentColor`, so a button whose label
               darkens on hover would fill with the dark too. */
            className="mt-2 flex h-[65px] min-w-[193px] items-center justify-center bg-white px-8 font-[family-name:var(--font-display)] text-[15px] font-semibold uppercase leading-[22px] tracking-[1.5px] text-[#18181b] transition-colors hover:bg-brand"
          >
            {homeCopy.heroCta.label}
          </Link>
        </ContainerAnimated>

        {/* The frame. It starts as a pill in the middle of the screen and
            ends as the full bleed. */}
        <ContainerInset className="relative h-[30svh] w-full shrink-0 sm:h-[38svh] xl:h-[46svh]">
          {heroReveal.video ? (
            <HeroVideo
              src={heroReveal.video}
              poster={heroReveal.image}
              className="size-full object-cover"
            />
          ) : (
            <HeroScaled>
              <Image
                src={heroReveal.image}
                alt=""
                fill
                sizes="100vw"
                priority
                className="object-cover"
              />
            </HeroScaled>
          )}
        </ContainerInset>

        <StageMeter className="absolute bottom-10 right-[var(--shell-gutter)] hidden items-end gap-0.5 xl:flex" />
      </ContainerSticky>
    </ContainerScroll>
  );
}
