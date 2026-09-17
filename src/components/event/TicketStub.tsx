import Image from "next/image";

import type { TicketTier } from "@/data/events";
import { CountUp } from "@/components/ui/CountUp";

/**
 * A ticket stub, from Figma 2179:33880 (grey paper) and 2179:35522 (dark
 * paper, the featured tier).
 *
 * The comp builds each stub as a portrait column — notch strip, card, notch
 * strip — rotated 90° with the text counter-rotated. This lays the same
 * exports out directly in screen orientation, so nothing inside is rotated
 * except the strip and body artwork. Mapping a portrait point (x, y) in the
 * comp to the screen is (cardLength − y, x); every content block lands on the
 * card's horizontal centre, so only the vertical offsets are kept below.
 *
 * The price rolls up the first time it is seen.
 *
 * Grey paper is a photographic texture (`stub-paper.jpg` at 80% over the page
 * background, plus a 10% black wash) with a textured body PNG; dark paper is a
 * 20% white card with a noise-filtered body SVG. Both use the "Subtract"
 * notch exports so the perforations read as holes onto the page.
 */

export const STUB_HEIGHT = 250;

const STRIP_LONG = 250;
const CTA_WIDTH = 205;
const CTA_HEIGHT = 52;
const BODY_SHORT = 218;
const BODY_LONG = 347;

// Vertical centres of each content row, in screen space.
const ROW_KICKER = 40;
const ROW_TITLE = 82;
const ROW_PRICE = 135;
const ROW_CTA = 192;

type Paper = {
  strip: number; // strip thickness
  cardLength: number; // card width on screen
  notch: string;
  body: string;
};

const GREY: Paper = {
  strip: 23,
  cardLength: 359,
  notch: "/assets/stub-notch-grey.png",
  body: "/assets/stub-body-grey.png",
};

const DARK: Paper = {
  strip: 24,
  cardLength: 347,
  notch: "/assets/stub-notch-dark.svg",
  body: "/assets/stub-body-dark.svg",
};

export function stubWidth(tier: TicketTier) {
  const paper = tier.featured ? DARK : GREY;
  return paper.strip * 2 + paper.cardLength - 2;
}

export function TicketStub({
  tier,
  href,
}: {
  tier: TicketTier;
  /** Where the CTA goes; the tickets section points it at the booking flow. */
  href?: string;
}) {
  const dark = Boolean(tier.featured);
  const paper = dark ? DARK : GREY;
  const width = stubWidth(tier);
  const stripOffsetX = (paper.strip - STRIP_LONG) / 2;
  const stripOffsetY = (STRIP_LONG - paper.strip) / 2;

  const strip = (side: "left" | "right") => (
    <div
      className={`pointer-events-none absolute top-0 ${side === "left" ? "left-0" : "right-0"}`}
      style={{ width: paper.strip, height: STRIP_LONG }}
      aria-hidden
    >
      <Image
        src={paper.notch}
        alt=""
        width={STRIP_LONG}
        height={paper.strip}
        unoptimized
        className="absolute max-w-none"
        style={{
          left: stripOffsetX,
          top: stripOffsetY,
          width: STRIP_LONG,
          height: paper.strip,
          transform: `rotate(${side === "left" ? 90 : -90}deg)`,
        }}
      />
    </div>
  );

  const ink = dark ? "text-white" : "text-[#0b0b0e]";

  return (
    <article
      className="lift relative"
      style={{ width, height: STUB_HEIGHT }}
      aria-label={`${tier.title}, ${tier.kicker.toLowerCase()}, from ${tier.priceFrom} ${tier.currency} per person`}
    >
      {strip("left")}
      {strip("right")}

      {/* Card */}
      <div
        className={`absolute top-0 ${dark ? "bg-white/20" : ""}`}
        style={{
          left: paper.strip - 1,
          width: paper.cardLength,
          height: STUB_HEIGHT,
        }}
      >
        {!dark && (
          <div className="pointer-events-none absolute inset-0" aria-hidden>
            <Image
              src="/assets/stub-paper.jpg"
              alt=""
              fill
              sizes="400px"
              className="object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-black/10" />
          </div>
        )}

        {/* Body with scooped corners — the 218 × 347 export, turned */}
        <Image
          src={paper.body}
          alt=""
          width={BODY_SHORT}
          height={BODY_LONG}
          unoptimized
          aria-hidden
          className="pointer-events-none absolute max-w-none"
          style={{
            left: (paper.cardLength - BODY_SHORT) / 2,
            top: (STUB_HEIGHT - BODY_LONG) / 2,
            width: BODY_SHORT,
            height: BODY_LONG,
            transform: "rotate(90deg)",
          }}
        />

        {/* ★ ★ GENERAL ADMISSION ★ ★ */}
        <div
          className={`absolute left-0 flex w-full items-center justify-center gap-1 ${
            dark ? "[&_img]:invert" : ""
          }`}
          style={{ top: ROW_KICKER - 8, height: 16 }}
        >
          <Image
            src="/assets/ic-star-12.svg"
            alt=""
            width={12}
            height={12}
            className="size-3"
          />
          <Image
            src="/assets/ic-star-16.svg"
            alt=""
            width={16}
            height={16}
            className="size-4"
          />
          <span
            className={`font-[family-name:var(--font-display)] text-[12px] font-bold uppercase leading-4 tracking-[0.12px] ${
              dark ? "text-white" : "text-[#56565d]"
            }`}
          >
            {tier.kicker}
          </span>
          <Image
            src="/assets/ic-star-16.svg"
            alt=""
            width={16}
            height={16}
            className="size-4"
          />
          <Image
            src="/assets/ic-star-12.svg"
            alt=""
            width={12}
            height={12}
            className="size-3"
          />
        </div>

        {/* Title — Daltown 72px / 60 line box */}
        <div
          className="absolute left-0 flex w-full items-center justify-center"
          style={{ top: ROW_TITLE - 30, height: 60 }}
        >
          <span
            className={`font-daltown whitespace-nowrap text-[72px] uppercase leading-[60px] tracking-[1.44px] ${ink}`}
          >
            {tier.title}
          </span>
        </div>

        {/* From 50 MAD / Person  +  discount row */}
        <div
          className="absolute left-0 flex w-full flex-col items-center gap-2"
          style={{ top: ROW_PRICE - 19, height: 38 }}
        >
          <div className="flex items-baseline gap-1 whitespace-nowrap">
            <span
              className={`font-[family-name:var(--font-display)] text-[17px] leading-6 tracking-[0.085px] ${
                dark ? "text-white" : "text-[#18181b]"
              }`}
            >
              From
            </span>
            <span
              className={`font-[family-name:var(--font-display)] text-[17px] font-semibold leading-6 ${ink}`}
            >
              <CountUp value={tier.priceFrom} /> {tier.currency}
            </span>
            <span className="font-[family-name:var(--font-display)] text-[15px] leading-[22px] tracking-[0.15px] text-content-secondary">
              {" / Person"}
            </span>
          </div>
          {(tier.wasPrice || tier.discount) && (
            <div className="flex h-2 items-center gap-1 whitespace-nowrap">
              {tier.wasPrice &&
                (dark ? (
                  <span className="font-[family-name:var(--font-display)] text-[12px] font-bold leading-4 tracking-[0.12px] text-content-secondary">
                    {tier.wasPrice} {tier.currency}
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <Image
                      src="/assets/ic-currency-8.svg"
                      alt={tier.currency}
                      width={8}
                      height={8}
                      className="size-2"
                    />
                    <s className="font-[family-name:var(--font-display)] text-[10px] leading-[14px] tracking-[0.1px] text-content-secondary">
                      {tier.wasPrice}
                    </s>
                  </span>
                ))}
              {tier.discount && (
                <span
                  className={`font-[family-name:var(--font-display)] text-[#22c55e] ${
                    dark
                      ? "text-[12px] font-bold leading-4 tracking-[0.12px]"
                      : "text-[10px] leading-[14px] tracking-[0.1px]"
                  }`}
                >
                  {tier.discount}
                </span>
              )}
            </div>
          )}
        </div>

        {/* CTA */}
        <a
          href={href ?? tier.href ?? "#tickets"}
          data-magnetic="0.15"
          className={`ticket-cta absolute flex items-center justify-center font-[family-name:var(--font-display)] text-[17px] font-semibold leading-6 ${
            dark
              ? "bg-brand text-[#0b0b0e]"
              : "border-[0.5px] border-white/10 bg-black/70 text-content-primary"
          }`}
          style={{
            left: (paper.cardLength - CTA_WIDTH) / 2,
            top: ROW_CTA - CTA_HEIGHT / 2,
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
