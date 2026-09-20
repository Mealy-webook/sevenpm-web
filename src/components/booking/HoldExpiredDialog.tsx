"use client";

import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";

import { bookingCopy } from "@/data/booking";

/**
 * The seat hold running out, as a dialog over the journey rather than in
 * place of it.
 *
 * It has one way out and no dismiss: Escape does nothing, the backdrop takes
 * no clicks, and there is no ✕. Closing it would leave the visitor looking
 * at a basket they can no longer buy — the hold is gone either way, and the
 * only thing left to do is start again.
 *
 * The journey stays on the page behind it, greyed and inert, so the tickets
 * they had chosen are still visible while they decide.
 */
export function HoldExpiredDialog({ onRestart }: { onRestart: () => void }) {
  const titleId = useId();
  const bodyId = useId();
  const action = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    action.current?.focus();
    /* Tab is held inside: the one button is the only thing to reach. */
    const keep = (event: KeyboardEvent) => {
      if (event.key === "Tab") {
        event.preventDefault();
        action.current?.focus();
      }
    };
    document.addEventListener("keydown", keep);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", keep);
    };
  }, []);

  return createPortal(
    <div
      /* Above the film grain (z-80); the custom cursor (z-90) still draws
         over it. */
      className="fixed inset-0 z-[85] flex items-center justify-center overflow-y-auto overscroll-contain bg-black/80 p-3 backdrop-blur-md"
      data-lenis-prevent
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={bodyId}
        className="my-auto flex w-full max-w-[402px] flex-col gap-4 bg-bg-secondary p-6 shadow-[0px_4px_12px_rgba(0,0,0,0.25)]"
      >
        <h2
          id={titleId}
          className="m-0 font-[family-name:var(--font-display)] text-[22px] font-bold uppercase leading-7 tracking-[-0.11px] text-content-primary"
        >
          {bookingCopy.chrome.expired}
        </h2>
        <p
          id={bodyId}
          className="m-0 font-[family-name:var(--font-display)] text-[15px] leading-[22px] tracking-[0.19px] text-content-secondary"
        >
          {bookingCopy.chrome.expiredBody}
        </p>
        <button
          ref={action}
          type="button"
          onClick={onRestart}
          className="flex w-full cursor-pointer items-center justify-center bg-brand px-5 py-4 font-[family-name:var(--font-display)] text-[17px] font-semibold leading-6 text-[#18181b] transition-colors hover:bg-[#fff35a]"
        >
          {bookingCopy.chrome.restart}
        </button>
      </div>
    </div>,
    document.body,
  );
}
