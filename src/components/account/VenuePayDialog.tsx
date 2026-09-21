"use client";

import { useId } from "react";

import { Sheet } from "@/components/ui/Sheet";
import { formatAmount, sevenpmCard, sevenpmCardCopy } from "@/data/account";

/**
 * The code you show at the bar.
 *
 * Drawn rather than a real QR: nothing has been issued and no till can read
 * it, and a scannable-looking square that silently fails at the front of a
 * queue is worse than one that says what it is. The matrix is generated from
 * the card number so it is stable between openings, the code is printed
 * underneath in full, and the note says plainly that nothing can be charged.
 *
 * The balance is on the sheet because that is the question at the till —
 * whether this will cover the round — and it is the wallet's, since the card
 * has no float of its own.
 */

const GRID = 21;

/** A stable pattern from a string. Not a QR; it only has to look like one. */
function matrix(seed: string) {
  let hash = 0x811c9dc5;
  const cells: boolean[] = [];
  for (let i = 0; i < GRID * GRID; i += 1) {
    hash ^= seed.charCodeAt(i % seed.length) + i;
    hash = Math.imul(hash, 0x01000193) >>> 0;
    cells.push((hash & 0x10000) !== 0);
  }
  return cells;
}

/** The three corner squares every code has, so it reads as one. */
function isFinder(x: number, y: number) {
  const inBox = (ox: number, oy: number) =>
    x >= ox && x < ox + 7 && y >= oy && y < oy + 7;
  return inBox(0, 0) || inBox(GRID - 7, 0) || inBox(0, GRID - 7);
}

function finderOn(x: number, y: number) {
  const ox = x >= GRID - 7 ? GRID - 7 : 0;
  const oy = y >= GRID - 7 ? GRID - 7 : 0;
  const cx = x - ox;
  const cy = y - oy;
  const edge = cx === 0 || cx === 6 || cy === 0 || cy === 6;
  const core = cx >= 2 && cx <= 4 && cy >= 2 && cy <= 4;
  return edge || core;
}

export function VenuePayDialog({
  balance,
  currency,
  onClose,
  onTopUp,
}: {
  balance: number;
  currency: string;
  onClose: () => void;
  /** Offered instead of a code when there is nothing to spend. */
  onTopUp: () => void;
}) {
  const titleId = useId();
  const copy = sevenpmCardCopy;
  const cells = matrix(sevenpmCard.masked);
  const empty = balance <= 0;

  return (
    <Sheet
      open
      onClose={onClose}
      title={empty ? copy.lowTitle : copy.detailsTitle}
      titleId={titleId}
      closeLabel={copy.close}
      footer={
        <div className="px-5 pb-5 pt-2">
          <button
            type="button"
            onClick={empty ? onTopUp : onClose}
            className={`flex w-full cursor-pointer items-center justify-center px-5 py-4 font-[family-name:var(--font-display)] text-[17px] font-semibold leading-6 transition-colors ${
              empty
                ? "bg-brand text-[#18181b] hover:bg-[#fff35a]"
                : "bg-white text-[#18181b] hover:bg-white/90"
            }`}
          >
            {empty ? copy.topUp : copy.done}
          </button>
        </div>
      }
    >
      <div className="flex flex-col items-center gap-4 px-5 py-4">
        {empty ? (
          <p className="m-0 text-center font-[family-name:var(--font-display)] text-[15px] leading-[22px] tracking-[0.19px] text-content-secondary">
            {copy.lowBody}
          </p>
        ) : (
          <>
            <p className="m-0 text-center font-[family-name:var(--font-display)] text-[13px] leading-5 tracking-[0.13px] text-content-secondary">
              {copy.payIntro}
            </p>

            <div className="bg-white p-4">
              <svg
                viewBox={`0 0 ${GRID} ${GRID}`}
                className="block size-[192px]"
                shapeRendering="crispEdges"
                role="img"
                aria-label={`${copy.codeLabel} ${sevenpmCard.masked}`}
              >
                {cells.map((on, index) => {
                  const x = index % GRID;
                  const y = Math.floor(index / GRID);
                  const lit = isFinder(x, y) ? finderOn(x, y) : on;
                  if (!lit) return null;
                  return (
                    <rect
                      key={index}
                      x={x}
                      y={y}
                      width={1}
                      height={1}
                      fill="#0b0b0e"
                    />
                  );
                })}
              </svg>
            </div>

            <div className="flex flex-col items-center gap-1">
              <span className="font-[family-name:var(--font-display)] text-[12px] uppercase leading-4 tracking-[1.2px] text-content-secondary">
                {copy.codeLabel}
              </span>
              <span className="font-daltown text-[28px] uppercase leading-none tabular-nums text-white">
                {sevenpmCard.masked}
              </span>
            </div>

            {/* The question at the till. */}
            <p className="m-0 font-[family-name:var(--font-display)] text-[15px] font-semibold leading-[22px] tracking-[0.19px] text-brand">
              {copy.available(formatAmount(balance, currency).replace("+", ""))}
            </p>
          </>
        )}

        <p className="m-0 text-center font-[family-name:var(--font-display)] text-[12px] leading-4 tracking-[0.12px] text-content-secondary">
          {copy.demoNote}
        </p>
      </div>
    </Sheet>
  );
}
