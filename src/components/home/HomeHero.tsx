import Image from "next/image";

import { StageMeter } from "@/components/motion/StageMeter";
import { HeroTerminal } from "@/components/home/HeroTerminal";
import {
  ContainerInset,
  ContainerScroll,
  ContainerSticky,
  HeroScaled,
  HeroVideo,
} from "@/components/ui/animated-video-on-scroll";
import { heroReveal } from "@/data/home";

/**
 * Homepage hero, from Figma 2467:19559 (the 15:202 page).
 *
 * The comp's headline and standfirst are gone: the screen is the ground,
 * the frame and the meter, and nothing is set over them. The little yellow
 * equaliser in the bottom-right corner is the comp's four bars, reading the
 * spectrum of whatever is playing.
 *
 * The screen holds while you scroll and a frame opens from a rounded pill
 * to the full bleed
 * (`animated-video-on-scroll`). The frame is flush to the bottom of the
 * screen, so the open state reads as the page itself arriving rather than as
 * a band floating in the middle of it. `mt-auto` keeps it there now that
 * there is no copy above it taking the slack, and it gives back height on
 * small screens, where a sticky screen taller than the viewport does not
 * stick.
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
 * The ground is React Bits' FaultyTerminal tinted brand (`HeroTerminal`),
 * in place of the lighting truss that used to hang here. The event page's
 * hero still has the truss.
 */
export function HomeHero() {
  return (
    <ContainerScroll
      className="relative isolate h-[320vh]"
      offset={["start start", "end end"]}
    >
      {/* No clip on the screen: the ground runs up behind the header, and
          the frame below already crops itself. */}
      <ContainerSticky className="flex min-h-svh flex-col">
        <HeroTerminal />

        {/* The frame. It starts as a pill in the middle of the screen and
            ends as the full bleed. */}
        <ContainerInset className="relative z-10 mt-auto h-[30svh] w-full shrink-0 sm:h-[38svh] xl:h-[46svh]">
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

        <StageMeter className="absolute bottom-10 right-[var(--shell-gutter)] z-10 hidden items-end gap-0.5 xl:flex" />
      </ContainerSticky>
    </ContainerScroll>
  );
}
