"use client";

import Image from "next/image";
import { useId } from "react";

import { Sheet } from "@/components/ui/Sheet";
import type { PricedLine, Totals } from "./cart";
import { bookingCopy, formatMoney } from "@/data/booking";

/**
 * Order summary, from Figma 2213:14113: what is in the basket, then the
 * money. Read-only — quantities change on the step behind it.
 */

function Line({ line }: { line: PricedLine }) {
  return (
    <li className="flex items-center gap-2 py-[6px]">
      <span className="w-6 shrink-0 font-[family-name:var(--font-display)] text-body-s text-content-secondary">
        {line.qty}x
      </span>
      <Image
        src={line.icon}
        alt=""
        width={16}
        height={16}
        className="size-4 shrink-0"
      />
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="truncate font-[family-name:var(--font-display)] text-body-s font-semibold text-content-primary">
          {line.name}
        </span>
        {line.size && (
          <span className="font-[family-name:var(--font-display)] text-caption text-content-secondary">
            {bookingCopy.orderSummary.size(line.size)}
          </span>
        )}
      </span>
      <span className="shrink-0 font-[family-name:var(--font-display)] text-body-s font-semibold text-content-primary">
        {formatMoney(line.amount)}
      </span>
    </li>
  );
}

export function OrderSummaryDialog({
  totals,
  onClose,
}: {
  totals: Totals;
  onClose: () => void;
}) {
  const titleId = useId();

  return (
    <Sheet
      open
      onClose={onClose}
      title={bookingCopy.orderSummary.title}
      titleId={titleId}
      closeLabel={bookingCopy.orderSummary.close}
    >
      <div className="flex flex-col px-5 pb-5 pt-4">
        {totals.ticketLines.length > 0 && (
          <section className="flex flex-col gap-1">
            <p className="m-0 font-[family-name:var(--font-display)] text-body-s text-content-secondary">
              {bookingCopy.orderSummary.tickets(totals.ticketCount)}
            </p>
            <ul className="m-0 flex list-none flex-col p-0">
              {totals.ticketLines.map((line) => (
                <Line key={line.key} line={line} />
              ))}
            </ul>
          </section>
        )}

        {totals.addonLines.length > 0 && (
          <section className="mt-4 flex flex-col gap-1 border-t-[0.5px] border-dashed border-white/15 pt-4">
            <p className="m-0 font-[family-name:var(--font-display)] text-body-s text-content-secondary">
              {bookingCopy.orderSummary.addons(totals.addonCount)}
            </p>
            <ul className="m-0 flex list-none flex-col p-0">
              {totals.addonLines.map((line) => (
                <Line key={line.key} line={line} />
              ))}
            </ul>
          </section>
        )}

        <div className="mt-4 flex flex-col gap-2 border-t-[0.5px] border-dashed border-white/15 pt-4">
          <div className="flex items-center justify-between gap-4 font-[family-name:var(--font-display)] text-body-s">
            <span className="text-content-secondary">
              {bookingCopy.orderSummary.subtotal}
            </span>
            <span className="font-semibold text-content-primary">
              {formatMoney(totals.subtotal)}
            </span>
          </div>

          {totals.wallet > 0 && (
            <div className="flex items-center justify-between gap-4 font-[family-name:var(--font-display)] text-body-s text-[#4ade80]">
              <span>{bookingCopy.orderSummary.wallet}</span>
              <span className="font-semibold">
                −{formatMoney(totals.wallet)}
              </span>
            </div>
          )}

          <div className="flex items-start justify-between gap-4">
            <span className="font-[family-name:var(--font-display)] text-body font-semibold text-content-primary">
              {bookingCopy.orderSummary.total}
            </span>
            <span className="flex flex-col items-end">
              <span className="font-[family-name:var(--font-display)] text-body-l font-semibold text-content-primary">
                {formatMoney(totals.total)}
              </span>
            </span>
          </div>
        </div>
      </div>
    </Sheet>
  );
}
