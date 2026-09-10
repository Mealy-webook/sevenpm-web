import Image from "next/image";

import type { TicketTier } from "@/data/events";

/**
 * A ticket stub, from Figma 2179:33880 (revision with centred content).
 *
 * The comp builds each stub as a 250 × 393 portrait column — notch strip,
 * card, notch strip — rotated 90° with the text counter-rotated. This lays the
 * same exported vectors out directly in their on-screen orientation,
 * 393 × 250.46, so nothing inside is rotated except the strip and body vectors.
 *
 * Perforations and corner notches are the Figma "Subtract" exports: the strips
 * are ticket paper (grey or brand yellow) with the dots cut out; the white body
 * has its corners scooped. Everything sits on the page background, so the cuts
 * read as holes.
 */

export const STUB_WIDTH = 393;
export const STUB_HEIGHT = 250.459;

const STRIP_LONG = 250.459; // the strip vector, before rotation
const STRIP_SHORT = 23;
const CARD_WIDTH = STUB_WIDTH - STRIP_SHORT * 2; // 347
const BODY_LONG = 347;
const BODY_SHORT = 218;
const CTA_WIDTH = 205;
const CTA_HEIGHT = 52;

export function TicketStub({ tier }: { tier: TicketTier }) {
  const paper = tier.featured ? "#fbeb1c" : "#d4d4d8";
  const notch = tier.featured
    ? "/assets/ticket-notch-yellow.svg"
    : "/assets/ticket-notch-grey.svg";
  const stripOffsetX = (STRIP_SHORT - STRIP_LONG) / 2;
  const stripOffsetY = (STRIP_LONG - STRIP_SHORT) / 2;

  const strip = (side: "left" | "right") => (
    <div
      className={`pointer-events-none absolute top-0 ${side === "left" ? "left-0" : "right-0"}`}
      style={{ width: STRIP_SHORT, height: STRIP_LONG }}
      aria-hidden
    >
      <Image
        src={notch}
        alt=""
        width={STRIP_LONG}
        height={STRIP_SHORT}
        className="absolute max-w-none"
        style={{
          left: stripOffsetX,
          top: stripOffsetY,
          width: STRIP_LONG,
          height: STRIP_SHORT,
          transform: `rotate(${side === "left" ? 90 : -90}deg)`,
        }}
      />
    </div>
  );

  return (
    <article
      className="lift relative"
      style={{ width: STUB_WIDTH, height: STUB_HEIGHT }}
      aria-label={`${tier.title}, ${tier.kicker.toLowerCase()}, from ${tier.priceFrom} dirhams`}
    >
      {strip("left")}
      {strip("right")}

      {/* Card */}
      <div
        className="absolute top-0"
        style={{
          left: STRIP_SHORT,
          width: CARD_WIDTH,
          height: STUB_HEIGHT,
          backgroundColor: paper,
        }}
      >
        {/* White body with scooped corners — the 218 × 347 vector, turned */}
        <Image
          src="/assets/ticket-body.svg"
          alt=""
          width={BODY_SHORT}
          height={BODY_LONG}
          aria-hidden
          className="pointer-events-none absolute max-w-none"
          style={{
            left: (CARD_WIDTH - BODY_SHORT) / 2,
            top: (STUB_HEIGHT - BODY_LONG) / 2,
            width: BODY_SHORT,
            height: BODY_LONG,
            transform: "rotate(90deg)",
          }}
        />

        {/* ★ ★ GENERAL ADMISSION ★ ★ */}
        <div
          className="absolute left-0 flex w-full items-center justify-center gap-1"
          style={{ top: 43.5 - 8, height: 16 }}
        >
          <Image src="/assets/ic-star-12.svg" alt="" width={12} height={12} className="size-3" />
          <Image src="/assets/ic-star-16.svg" alt="" width={16} height={16} className="size-4" />
          <span className="font-[family-name:var(--font-display)] text-[12px] font-bold uppercase leading-4 tracking-[0.12px] text-[#56565d]">
            {tier.kicker}
          </span>
          <Image src="/assets/ic-star-16.svg" alt="" width={16} height={16} className="size-4" />
          <Image src="/assets/ic-star-12.svg" alt="" width={12} height={12} className="size-3" />
        </div>

        {/* Title — Daltown 72px / 60 line box, centred */}
        <div
          className="absolute left-0 flex w-full items-center justify-center"
          style={{ top: 93.5 - 30, height: 60 }}
        >
          <Image
            src={tier.titleArt.src}
            alt={tier.title}
            width={tier.titleArt.width}
            height={tier.titleArt.height}
            unoptimized
            style={{ width: tier.titleArt.width, height: "auto" }}
          />
        </div>

        {/* From ⃀ price */}
        <div
          className="absolute left-0 flex w-full items-baseline justify-center gap-1"
          style={{ top: 145.5 - 12, height: 24 }}
        >
          <span className="font-[family-name:var(--font-display)] text-[17px] leading-6 tracking-[0.085px] text-[#18181b]">
            From
          </span>
          <span className="flex items-center gap-0.5">
            <Image
              src="/assets/ic-currency-mad.svg"
              alt="MAD"
              width={12}
              height={12}
              className="size-3"
            />
            <span className="font-[family-name:var(--font-display)] text-[17px] font-semibold leading-6 text-bg-primary">
              {tier.priceFrom}
            </span>
          </span>
        </div>

        {/* CTA */}
        <a
          href={tier.href ?? "#tickets"}
          data-magnetic="0.15"
          className="ticket-cta absolute flex items-center justify-center bg-brand font-[family-name:var(--font-display)] text-[17px] font-semibold leading-6 text-[#0b0b0e]"
          style={{
            left: (CARD_WIDTH - CTA_WIDTH) / 2,
            top: 164.5,
            width: CTA_WIDTH,
            height: CTA_HEIGHT,
          }}
        >
          <span className="relative z-10">{tier.cta}</span>
        </a>
      </div>
    </article>
  );
}
