import Image from "next/image";

import type { EventDetails } from "@/data/events";
import { DISPLAY_ART, DisplayHeading } from "@/components/ui/DisplayHeading";
import { StickerPeel } from "@/components/ui/StickerPeel";

/** Figma group 2091:49295 — the fan of polaroids. */
const STAGE_WIDTH = 1294.4168;
const STAGE_HEIGHT = 578.9727;
const CARD_WIDTH = 355.571;
const CARD_HEIGHT = 401.608;
const PHOTO_WIDTH = 327.793;
const PHOTO_HEIGHT = 326.45;
const PHOTO_INSET_X = 13.54;
const PHOTO_INSET_Y = 15.69;

export function GallerySection({ event }: { event: EventDetails }) {
  return (
    <section
      id="gallery"
      className="relative overflow-hidden bg-ink-900 py-16 xl:py-24"
    >
      <div className="shell flex flex-col items-start gap-12">
        <DisplayHeading art={DISPLAY_ART.gallery} reveal="clip">
          Gallery
        </DisplayHeading>

        <div className="stage-gallery relative w-full">
          <div
            className="absolute left-1/2 top-0"
            style={{
              width: STAGE_WIDTH,
              height: STAGE_HEIGHT,
              marginLeft: -STAGE_WIDTH / 2,
              transform: "scale(var(--gallery-scale))",
              transformOrigin: "top center",
            }}
          >
            {/* Three layers on purpose: the outer box is positioned and owned
             *  by GSAP's reveal, the middle one owns the hover lift, and the
             *  inner one keeps the polaroid's Figma rotation. */}
            {event.gallery.map((shot, index) => (
              <div
                key={shot.image}
                className="absolute"
                data-reveal="up"
                data-reveal-delay={0.06 * index}
                style={{
                  left: shot.x - CARD_WIDTH / 2,
                  top: shot.y - CARD_HEIGHT / 2,
                  width: CARD_WIDTH,
                  height: CARD_HEIGHT,
                }}
              >
                <div className="gallery-card size-full">
                  <div
                    className="relative size-full"
                    style={{ transform: `rotate(${shot.rotate}deg)` }}
                  >
                    <div className="size-full bg-white shadow-[0_18px_40px_rgba(0,0,0,0.45)]">
                      <div
                        className="absolute overflow-hidden bg-bg-secondary"
                        style={{
                          left: PHOTO_INSET_X,
                          top: PHOTO_INSET_Y,
                          width: PHOTO_WIDTH,
                          height: PHOTO_HEIGHT,
                        }}
                      >
                        <Image
                          src={shot.image}
                          alt={`${event.name} — festival photo ${index + 1}`}
                          width={Math.round(PHOTO_WIDTH)}
                          height={Math.round(PHOTO_HEIGHT)}
                          sizes="328px"
                          className="size-full object-cover"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <StickerPeel
              imageSrc="/assets/sticker-smiley.png"
              width={159}
              height={159}
              initialPosition={{ x: 1197, y: 14 }}
              peelBackHoverPct={26}
              peelBackActivePct={38}
              shadowIntensity={0.55}
              lightingIntensity={0.14}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
