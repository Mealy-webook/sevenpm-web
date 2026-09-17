import Image from "next/image";

import { StickerPeel } from "@/components/ui/StickerPeel";
import { homeStory } from "@/data/home";

/**
 * The story block, from Figma 2227:5229: two photographs pinned at opposing
 * angles with a daisy and a guitar sticker over them, the founding paragraph
 * centred underneath, then the social accounts.
 *
 * The two stickers are peelable and draggable, like the ones on the event
 * page: they lift at the corner under the cursor and can be thrown around the
 * block. Nothing depends on where they end up.
 *
 * The comp draws the social buttons as circles. Everything else on this site
 * is square-edged, so they are squares here.
 */
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

        <nav aria-label="SEVENPM social accounts" className="flex flex-wrap justify-center gap-4">
          {homeStory.socials.map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noreferrer noopener"
              aria-label={social.label}
              className="btn-secondary flex size-[58px] items-center justify-center"
            >
              <Image
                src={social.icon}
                alt=""
                width={24}
                height={24}
                className="size-6"
              />
            </a>
          ))}
        </nav>
      </div>
    </section>
  );
}
