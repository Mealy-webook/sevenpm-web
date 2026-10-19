"use client";

import Image from "next/image";
import Link from "next/link";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";

import { sponsorCopy } from "@/data/sponsor";
import { SponsorEnquiry } from "./SponsorForm";

/**
 * The partnership enquiry as a pop-up.
 *
 * The sponsor-page directions keep the form off the page: every call to
 * action opens it here instead, so the page can be all pitch and the form
 * is one press away from anywhere in it. It is a drawer from the right,
 * wide enough for the form's two-column rows, with the direct contact
 * along its top for anyone who would rather talk to a person.
 *
 * On `document.body` through a portal, for the same reason the menu and
 * `Sheet` are: a transformed or filtered ancestor would otherwise trap a
 * fixed layer inside itself. Escape and the scrim close it; the page
 * behind does not scroll while it is open.
 */

type Ctx = { open: () => void };
const SponsorDialogContext = createContext<Ctx>({ open: () => {} });

export function useSponsorDialog() {
  return useContext(SponsorDialogContext);
}

export function SponsorDialogProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setOpen] = useState(false);
  return (
    <SponsorDialogContext.Provider value={{ open: () => setOpen(true) }}>
      {children}
      {isOpen ? <SponsorDialog onClose={() => setOpen(false)} /> : null}
    </SponsorDialogContext.Provider>
  );
}

/** Any call to action on the page. Opens the dialog; styled by the caller. */
export function SponsorCtaButton({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const { open } = useSponsorDialog();
  return (
    <button type="button" onClick={open} className={className}>
      {children}
    </button>
  );
}

function SponsorDialog({ onClose }: { onClose: () => void }) {
  const { form } = sponsorCopy;
  const root = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const leaving = useRef(false);

  const close = () => {
    const el = root.current;
    if (!el || leaving.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      onClose();
      return;
    }
    leaving.current = true;
    gsap
      .timeline({ onComplete: onClose })
      .to(el.querySelector("[data-scrim]"), { autoAlpha: 0, duration: 0.3 })
      .to(el.querySelector("[data-panel]"), { xPercent: 100, duration: 0.45, ease: "power3.in" }, 0);
  };

  useEffect(() => {
    const el = root.current;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeBtn.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    /* fromTo with both ends pinned, inside a context that is reverted on
       cleanup: React's dev double-mount runs this twice, and a plain
       `from` the second time takes the half-run tween's position as its
       end — which left the panel parked off-screen. */
    const ctx = gsap.context(() => {
      if (el && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.fromTo(el.querySelector("[data-scrim]"), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 });
        gsap.fromTo(
          el.querySelector("[data-panel]"),
          { xPercent: 100 },
          { xPercent: 0, duration: 0.6, ease: "expo.out" },
        );
      }
    }, el ?? undefined);
    return () => {
      ctx.revert();
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKey);
    };
    // `close` reads refs and props only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return createPortal(
    <div
      ref={root}
      role="dialog"
      aria-modal="true"
      aria-labelledby="sponsor-dialog-title"
      data-lenis-prevent
      className="fixed inset-0 z-[85]"
    >
      <button
        type="button"
        tabIndex={-1}
        aria-hidden
        data-scrim
        onClick={close}
        className="absolute inset-0 cursor-default bg-black/75 backdrop-blur-sm"
      />
      <div
        data-panel
        className="absolute inset-y-0 right-0 flex w-full max-w-[880px] flex-col border-l border-white/10 bg-bg-primary"
      >
        <div className="flex items-start justify-between gap-6 border-b border-white/10 p-6 xl:px-10 xl:py-8">
          <div className="flex flex-col gap-2">
            <p className="m-0 font-[family-name:var(--font-display)] text-body-s font-semibold uppercase tracking-[1.56px] text-brand">
              {form.eyebrow}
            </p>
            <h2 id="sponsor-dialog-title" className="card-title text-white">
              {form.title}
            </h2>
            <p className="m-0 font-[family-name:var(--font-display)] text-body text-content-secondary">
              {form.body}
            </p>
          </div>
          <button
            ref={closeBtn}
            type="button"
            onClick={close}
            aria-label="Close"
            className="flex size-12 shrink-0 items-center justify-center border border-white/10 bg-white/5 transition-colors hover:border-white/30"
          >
            <Image src="/assets/ic-dialog-close.svg" alt="" width={20} height={20} className="size-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto overscroll-contain p-6 xl:px-10 xl:py-8">
          <SponsorEnquiry bare />
        </div>

        {/* The way round the form. */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/10 bg-bg-secondary px-6 py-4 xl:px-10">
          <p className="m-0 font-[family-name:var(--font-display)] text-body-s text-content-secondary">
            {form.direct.title} ·{" "}
            <span className="font-semibold text-brand">{form.direct.email}</span> ·{" "}
            <span className="text-white/45">{form.direct.phone}</span>
          </p>
          <Link
            href="/contact"
            className="font-[family-name:var(--font-display)] text-body-s font-semibold text-white underline underline-offset-4"
          >
            {form.direct.label}
          </Link>
        </div>
      </div>
    </div>,
    document.body,
  );
}
