"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

/**
 * The 378px sheet the booking dialogs share — ticket info (2078:45259), item
 * details (2196:11760) and the order summary (2213:14113).
 *
 * It renders through a portal on `document.body`. That is not optional: the
 * journey sits inside elements MotionProvider transforms, and a transformed
 * ancestor becomes the containing block for `position: fixed`, which would
 * trap the sheet inside the column that opened it.
 */
export function Sheet({
  open,
  onClose,
  title,
  titleId,
  closeLabel,
  children,
  footer,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  titleId: string;
  closeLabel: string;
  children: React.ReactNode;
  /** Sticky dock under the scrollable body. */
  footer?: React.ReactNode;
}) {
  const sheet = useRef<HTMLDivElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    closeButton.current?.focus();
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div
      /* Above the film grain (z-80) so the overlay really covers the page;
         the custom cursor (z-90) still draws on top of it. */
      className="fixed inset-0 z-[85] flex justify-center overflow-y-auto overscroll-contain bg-black/80 p-3 backdrop-blur-md"
      data-lenis-prevent
      onMouseDown={(event) => {
        if (!sheet.current?.contains(event.target as Node)) onClose();
      }}
    >
      <div
        ref={sheet}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="my-auto flex h-fit w-full max-w-[378px] flex-col bg-bg-secondary shadow-[0px_4px_12px_rgba(0,0,0,0.25)]"
      >
        <div className="flex items-start gap-2 px-5 pt-5">
          <h2
            id={titleId}
            className="m-0 flex-1 font-[family-name:var(--font-display)] text-[22px] font-bold uppercase leading-7 tracking-[-0.11px] text-content-primary"
          >
            {title}
          </h2>
          <button
            ref={closeButton}
            type="button"
            onClick={onClose}
            aria-label={closeLabel}
            className="btn-secondary flex shrink-0 cursor-pointer items-center justify-center p-[10px]"
          >
            <Image
              src="/assets/ic-dialog-close.svg"
              alt=""
              width={20}
              height={20}
              className="size-5"
            />
          </button>
        </div>

        {children}

        {footer}
      </div>
    </div>,
    document.body,
  );
}

/** Price block the dialog docks share: amount, was-price and discount. */
export function SheetPrice({
  price,
  wasPrice,
  discount,
  suffix,
  format,
}: {
  price: number;
  wasPrice?: number;
  discount?: string;
  suffix?: string;
  format: (amount: number) => string;
}) {
  return (
    <div className="flex flex-col gap-[2px]">
      <p className="m-0 flex items-baseline gap-1 font-[family-name:var(--font-display)]">
        <span className="text-[17px] font-semibold leading-6 text-content-primary">
          {format(price)}
        </span>
        {suffix && (
          <span className="text-[13px] leading-5 tracking-[0.13px] text-content-secondary">
            {suffix}
          </span>
        )}
      </p>
      {(wasPrice !== undefined || discount) && (
        <p className="m-0 flex items-center gap-2 font-[family-name:var(--font-display)] text-[10px] leading-[14px] tracking-[0.1px]">
          {wasPrice !== undefined && (
            <span className="text-content-secondary line-through">
              {wasPrice}
            </span>
          )}
          {discount && <span className="text-[#4ade80]">{discount}</span>}
        </p>
      )}
    </div>
  );
}
