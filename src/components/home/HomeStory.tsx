import Image from "next/image";

import { StickerPeel } from "@/components/ui/StickerPeel";
import { homeStory } from "@/data/home";

/**
 * The story block, from Figma 2227:5229 and 2465:6936: two photographs pinned
 * at opposing angles with a daisy and a guitar sticker over them, and the
 * founding paragraph centred underneath.
 *
 * The paragraph ends the section. A row of social buttons used to follow it;
 * the homepage comp (15:202) does not draw one, and the footer already lists
 * every account.
 *
 * The two stickers are peelable and draggable, like the ones on the event
 * page: they lift at the corner under the cursor and can be thrown around the
 * block. Nothing depends on where they end up.
 * */
export function HomeStory() {
  return (
    <section
      aria-label="About SEVENPM"
      className="relative py-16 [overflow-x:clip] xl:py-24"
    >
      <div className="shell flex flex-col items-center gap-12">
        {/* Photographs and stickers */}
        <div
          className="relative flex w-full max-w-[880px] justify-center"
          data-reveal="up"
        >
          <span className="relative block aspect-[424/478] w-[46%] max-w-[424px] -rotate-[4deg] overflow-hidden">
            <Image
              src={homeStory.photos[0]}
              alt=""
              fill
              sizes="(min-width: 1280px) 424px, 45vw"
              className="object-cover"
            />
          </span>
          <span className="relative -ml-[6%] block aspect-[441/491] w-[48%] max-w-[441px] translate-y-[6%] rotate-[5deg] overflow-hidden">
            <Image
              src={homeStory.photos[1]}
              alt=""
              fill
              sizes="(min-width: 1280px) 441px, 47vw"
              className="object-cover"
            />
          </span>

          {/* Peelable, and only from xl — below that the photographs already
              fill the width and a dragged sticker has nowhere to go. */}
          <div
            className="pointer-events-none absolute inset-0 hidden xl:block z-20"
            aria-hidden
          >
            <StickerPeel
              className="pointer-events-auto"
              imageSrc="/assets/sticker-daisy.png"
              width={150}
              height={150}
              rotate={-8}
              initialPosition={{ x: -30, y: -40 }}
              peelBackHoverPct={22}
              peelBackActivePct={34}
              shadowIntensity={0.6}
              lightingIntensity={0.12}
            />
            <StickerPeel
              className="pointer-events-auto"
              imageSrc="/assets/sticker-guitar.png"
              width={280}
              height={259}
              initialPosition={{ x: 640, y: 380 }}
              peelBackHoverPct={22}
              peelBackActivePct={34}
              shadowIntensity={0.6}
              lightingIntensity={0.12}
            />
          </div>
        </div>

        <p
          className="m-0 max-w-[838px] text-center font-[family-name:var(--font-display)] text-[17px] font-bold uppercase leading-7 tracking-[0.085px] text-white xl:text-[20px] xl:leading-[28px]"
          data-split="lines"
        >
          {homeStory.body}
        </p>

      </div>
    </section>
  );
}
