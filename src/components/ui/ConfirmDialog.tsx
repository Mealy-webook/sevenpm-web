"use client";

import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";

/**
 * Confirmation sheet, from Figma 2231:12668: a title, one line of body copy
 * and two equal buttons. No close button — cancelling is one of the two
 * actions, so a third way out would only add noise.
 *
 * Square corners. The comp rounds the top 38px; every surface on this site
 * is square, so the dialogs are too.
 *
 * It renders through a portal on `document.body`, like the booking sheets: a
 * transformed ancestor becomes the containing block for `position: fixed`,
 * and the rows that open this sit inside elements MotionProvider animates.
 */
export function ConfirmDialog({
  title,
  body,
  cancelLabel,
  confirmLabel,
  onCancel,
  onConfirm,
  /** Red confirm label, for anything the visitor cannot undo. */
  destructive = false,
}: {
  title: string;
  body: string;
  cancelLabel: string;
  confirmLabel: string;
  onCancel: () => void;
  onConfirm: () => void;
  destructive?: boolean;
}) {
  const titleId = useId();
  const bodyId = useId();
  const sheet = useRef<HTMLDivElement>(null);
  const cancel = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCancel();
    };
    document.addEventListener("keydown", onKey);
    // Focus lands on Cancel, not on the destructive action.
    cancel.current?.focus();
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKey);
    };
  }, [onCancel]);

  return createPortal(
    <div
      /* Above the film grain (z-80); the custom cursor (z-90) still draws on
         top of it. */
      className="fixed inset-0 z-[85] flex items-center justify-center overflow-y-auto overscroll-contain bg-black/80 p-3 backdrop-blur-md"
      data-lenis-prevent
      onMouseDown={(event) => {
        if (!sheet.current?.contains(event.target as Node)) onCancel();
      }}
    >
      <div className="w-full max-w-[402px] p-3">
        <div
          ref={sheet}
          role="alertdialog"
          aria-modal="true"
          aria-labelledby={titleId}
          aria-describedby={bodyId}
          className="flex w-full flex-col bg-bg-secondary shadow-[0px_4px_12px_rgba(0,0,0,0.25)]"
        >
          <div className="flex flex-col gap-1 px-5 py-5 backdrop-blur-[32px]">
            <h2
              id={titleId}
              className="m-0 font-[family-name:var(--font-display)] text-[22px] font-bold uppercase leading-7 tracking-[-0.11px] text-content-primary"
            >
              {title}
            </h2>
            <p
              id={bodyId}
              className="m-0 font-[family-name:var(--font-display)] text-[13px] leading-5 tracking-[0.13px] text-content-secondary"
            >
              {body}
            </p>
          </div>

          <div className="flex items-center justify-center gap-4 px-5 pb-5 pt-2">
            <button
              ref={cancel}
              type="button"
              onClick={onCancel}
              className="btn-secondary flex flex-1 cursor-pointer items-center justify-center px-5 py-4"
            >
              <span className="flex h-5 items-center font-[family-name:var(--font-display)] text-[17px] font-semibold leading-6 text-content-primary">
                {cancelLabel}
              </span>
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className="btn-secondary flex flex-1 cursor-pointer items-center justify-center px-5 py-4"
            >
              <span
                className={`flex h-5 items-center font-[family-name:var(--font-display)] text-[17px] font-semibold leading-6 ${
                  destructive ? "text-[#ff6c6c]" : "text-content-primary"
                }`}
              >
                {confirmLabel}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
