import Image from "next/image";

import type { TicketTier } from "@/data/events";

/**
 * A ticket stub, from Figma 2179:33880. The comp builds it as a 250 × 393
 * portrait column (notch strip, white card, notch strip) rotated 90°, with the
 * text counter-rotated; this lays the same pieces out directly in their
 * on-screen orientation — 393 × 250.46 — so nothing inside is rotated except
 * the two exported strip vectors.
 *
 * Perforations and corner notches are the Figma "Subtract" exports: the white
 * strips are ticket paper with the dots cut out, the grey body has its corners
 * scooped, both sitting on the page background.
 */

export const STUB_WIDTH = 393;
export const STUB_HEIGHT = 250.459;

const STRIP_LONG = 250.459; // the strip vector, before rotation
const STRIP_SHORT = 23;
const CARD_WIDTH = STUB_WIDTH - STRIP_SHORT * 2; // 347
const BODY_LONG = 347;
const BODY_SHORT = 218;

export function TicketStub({ tier }: { tier: TicketTier }) {
  const stripOffsetX = (STRIP_SHORT - STRIP_LONG) / 2;
  const stripOffsetY = (STRIP_LONG - STRIP_SHORT) / 2;

  return (
    <article
      className="lift relative"
      style={{ width: STUB_WIDTH, height: STUB_HEIGHT }}
      aria-label={`${tier.title} ticket, from ${tier.priceFrom} dirhams`}
    >
      {/* Left perforated end */}
      <div
        className="pointer-events-none absolute left-0 top-0 overflow-visible"
        style={{ width: STRIP_SHORT, height: STRIP_LONG }}
        aria-hidden
      >
        <Image
          src="/assets/ticket-notch.svg"
          alt=""
          width={STRIP_LONG}
          height={STRIP_SHORT}
          className="absolute max-w-none"
          style={{
            left: stripOffsetX,
            top: stripOffsetY,
            width: STRIP_LONG,
            height: STRIP_SHORT,
            transform: "rotate(90deg)",
          }}
        />
      </div>

      {/* Right perforated end */}
      <div
        className="pointer-events-none absolute right-0 top-0"
        style={{ width: STRIP_SHORT, height: STRIP_LONG }}
        aria-hidden
      >
        <Image
          src="/assets/ticket-notch.svg"
          alt=""
          width={STRIP_LONG}
          height={STRIP_SHORT}
          className="absolute max-w-none"
          style={{
            left: stripOffsetX,
            top: stripOffsetY,
            width: STRIP_LONG,
            height: STRIP_SHORT,
            transform: "rotate(-90deg)",
          }}
        />
      </div>

      {/* Card */}
      <div
        className="absolute top-0 bg-white"
        style={{ left: STRIP_SHORT, width: CARD_WIDTH, height: STUB_HEIGHT }}
      >
        {/* Grey body with scooped corners — the 218 × 347 vector, turned */}
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

        {/* Title — Daltown, 90px / 70 line box */}
        <div
          className="absolute flex items-center"
          style={{ left: 28, top: 53.5, height: 70 }}
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

        {/* Price */}
        <div
          className="absolute flex flex-col items-start gap-1"
          style={{ left: 27.5, top: 160 }}
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
          className="ticket-cta absolute flex items-center justify-center bg-white px-5 font-[family-name:var(--font-display)] text-[17px] font-semibold leading-6 text-[#18181b]"
          style={{ right: 25.5, bottom: 41.5, height: 52 }}
        >
          <span className="relative z-10">{tier.cta}</span>
        </a>
      </div>
    </article>
  );
}
