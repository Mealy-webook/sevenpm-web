import Link from "next/link";

import type { TicketTier } from "@/data/events";
import { percentOff } from "@/data/booking";

/**
 * One ticket, as 2542:14399 now draws it: a landscape stub with the name in
 * Daltown, the price under it, and the way in on the right.
 *
 * The perforations are the comp's `Subtract` exports, which are a column of
 * bites taken out of each end. They are drawn here instead — a repeating
 * radial gradient masked down the edge — so they scale with the stub and
 * cost no asset. The bite is the page's own background, which is what makes
 * it read as a hole rather than as a dark dot.
 *
 * The comp prints "50 MAD / 70 MAD / 20% off" on both stubs, which is
 * placeholder: 50 against 70 is 29% off, not 20. The saving is computed from
 * the two prices here, the way the rest of the site already does it, so the
 * number on the page is always the one the prices support.
 */
export function TicketRow({ tier, href }: { tier: TicketTier; href: string }) {
  /* `percentOff` takes numbers and returns the label; the data carries both
     prices as formatted strings, so they are parsed back out here. */
  const was = tier.wasPrice ? Number(tier.wasPrice.replace(/[^\d.]/g, "")) : 0;
  const now = Number(tier.priceFrom.replace(/[^\d.]/g, ""));
  const off = was > now ? percentOff(now, was) : null;

  return (
    <article className="ticket-row flex min-w-0 flex-1 items-stretch">
      <span aria-hidden className="ticket-row__edge" />

      <div className="flex min-w-0 flex-1 flex-col justify-center bg-bg-tertiary py-4">
        <div className="flex flex-col items-start gap-4 bg-bg-secondary p-6 sm:flex-row sm:items-center sm:gap-4">
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <h3 className="card-title text-content-primary">
              {tier.title}
            </h3>

            <div className="flex flex-col gap-2">
              <p className="m-0 flex flex-wrap items-baseline gap-x-1">
                <span className="font-[family-name:var(--font-display)] text-body-l text-content-primary">
                  From
                </span>
                <span className="font-[family-name:var(--font-display)] text-body-l font-semibold text-content-primary">
                  {tier.priceFrom} {tier.currency}
                </span>
                <span className="font-[family-name:var(--font-ui)] text-body text-content-primary">
                  / Person
                </span>
              </p>

              {tier.wasPrice && off ? (
                <p className="m-0 flex items-center gap-1">
                  <span className="font-[family-name:var(--font-ui)] text-caption text-content-primary line-through">
                    {tier.wasPrice} {tier.currency}
                  </span>
                  <span className="font-[family-name:var(--font-ui)] text-caption text-[#22c55e]">
                    {off}
                  </span>
                </p>
              ) : null}
            </div>
          </div>

          <Link
            href={href}
            className="sweep flex shrink-0 items-center justify-center bg-brand px-5 py-4 font-[family-name:var(--font-display)] text-body-l font-semibold text-[#0b0b0e]"
          >
            <span className="relative z-10">Get your ticket</span>
          </Link>
        </div>
      </div>

      <span aria-hidden className="ticket-row__edge ticket-row__edge--right" />
    </article>
  );
}
