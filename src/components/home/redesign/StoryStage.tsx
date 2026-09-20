import Image from "next/image";

import { DisplayHeading } from "@/components/ui/DisplayHeading";
import { StickerPeel } from "@/components/ui/StickerPeel";
import { homeStory } from "@/data/home";

/**
 * The story, given a screen of its own: the two photographs at the size the
 * event page gives its pictures, the founding paragraph as the section's
 * statement, the stickers still peelable and throwable, the accounts under
 * it. Same content as `HomeStory`, laid out to fill the height.
 */
export function StoryStage() {
  return (
    <section
      id="story"
      aria-label="About SEVENPM"
      className="section-screen relative py-16 [overflow-x:clip] xl:py-24"
    >
      <div className="shell grid items-center gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
        {/* Photographs and stickers */}
        <div className="relative flex w-full justify-center" data-reveal="up">
          <span className="relative block aspect-[424/478] w-[50%] -rotate-[4deg] overflow-hidden">
            <Image
              src={homeStory.photos[0]}
              alt=""
              fill
              sizes="(min-width: 1024px) 34vw, 50vw"
              className="object-cover"
            />
          </span>
          <span className="relative -ml-[6%] block aspect-[441/491] w-[52%] translate-y-[8%] rotate-[5deg] overflow-hidden">
            <Image
              src={homeStory.photos[1]}
              alt=""
              fill
              sizes="(min-width: 1024px) 36vw, 52vw"
              className="object-cover"
            />
          </span>
          <div
            className="pointer-events-none absolute inset-0 z-20 hidden xl:block"
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
              width={260}
              height={240}
              initialPosition={{ x: 420, y: 380 }}
              peelBackHoverPct={22}
              peelBackActivePct={34}
              shadowIntensity={0.6}
              lightingIntensity={0.12}
            />
          </div>
        </div>

        <div className="flex flex-col gap-8">
          <DisplayHeading align="left" reveal="clip" size="faq">
            Since 2018
          </DisplayHeading>
          <p
            className="m-0 font-[family-name:var(--font-display)] text-[19px] font-bold uppercase leading-[1.45] tracking-[0.1px] text-white xl:text-[24px]"
            data-split="lines"
          >
            {homeStory.body}
          </p>
          <nav
            aria-label="SEVENPM social accounts"
            className="flex flex-wrap gap-3"
            data-reveal="up"
            data-reveal-stagger
          >
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
      </div>
    </section>
  );
}
