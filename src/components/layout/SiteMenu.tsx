"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import gsap from "gsap";

import { socialLinks } from "@/data/events";

/**
 * Full-screen menu, from Figma 15:790 (1512 × 853). A yellow panel on the
 * left carries a luminosity-blended photo and the wordmark; the right column
 * is the primary navigation in Roboto Black 80, right-aligned, with the
 * social links and copyright underneath.
 */

export const MENU_LINKS = [
  { label: "Festivals", href: "/#festivals" },
  { label: "About us", href: "/#about" },
  { label: "News", href: "/#news" },
  { label: "Team", href: "/#team" },
  { label: "Careers", href: "/#careers" },
];

export function SiteMenu({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const root = useRef<HTMLDivElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const year = new Date().getFullYear();

  // Lock the page behind the menu and close on Escape.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    closeButton.current?.focus();
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  // Entrance: the sheet wipes down, the panel settles, the links rise in.
  useEffect(() => {
    const el = root.current;
    if (!open || !el) return;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduce) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
      tl.fromTo(
        el,
        { clipPath: "inset(0 0 100% 0)" },
        { clipPath: "inset(0 0 0% 0)", duration: 0.7 },
      )
        .fromTo(
          "[data-menu-panel]",
          { scale: 1.06, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.9 },
          0.15,
        )
        .fromTo(
          "[data-menu-link]",
          { y: 48, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, stagger: 0.06 },
          0.3,
        )
        .fromTo(
          "[data-menu-meta]",
          { y: 16, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, stagger: 0.05 },
          0.6,
        );
    }, el);
    return () => ctx.revert();
  }, [open]);

  if (!open) return null;

  return (
    <div
      ref={root}
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      className="fixed inset-0 z-50 overflow-y-auto bg-ink-900"
    >
      <div className="shell flex min-h-full flex-col gap-8 py-6 xl:gap-12 xl:py-24">
        <div className="flex w-full items-center justify-end">
          <button
            ref={closeButton}
            type="button"
            aria-label="Close menu"
            onClick={onClose}
            className="flex size-[60px] cursor-pointer items-center justify-center bg-[rgba(37,37,37,0.5)] transition-colors hover:bg-[rgba(37,37,37,0.9)]"
          >
            <Image
              src="/assets/ic-close.svg"
              alt=""
              width={20}
              height={20}
              className="size-5"
            />
          </button>
        </div>

        <div className="flex min-h-0 w-full flex-1 flex-col gap-8 lg:flex-row lg:items-stretch">
          {/* Left panel */}
          <div
            data-menu-panel
            className="relative flex min-h-[320px] w-full shrink-0 flex-col items-center justify-end overflow-hidden bg-brand p-10 lg:min-h-[553px] lg:w-[511px]"
          >
            <Image
              src="/assets/menu-panel.jpg"
              alt=""
              fill
              sizes="(min-width: 1024px) 511px, 100vw"
              priority
              className="object-cover mix-blend-luminosity"
            />
            <Image
              src="/assets/menu-logo.png"
              alt="SEVENPM"
              width={397}
              height={62}
              unoptimized
              className="relative h-auto w-[78%] max-w-[397px]"
            />
          </div>

          {/* Navigation */}
          <div className="flex min-w-0 flex-1 flex-col items-end justify-center gap-12">
            <nav aria-label="Primary" className="flex flex-col items-end gap-2">
              {MENU_LINKS.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  data-menu-link
                  onClick={onClose}
                  className="menu-link font-[family-name:var(--font-display)] text-[48px] font-black uppercase leading-[0.8] tracking-[-0.02em] text-brand transition-colors hover:text-white sm:text-[64px] xl:text-[80px]"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="flex w-full flex-col items-center gap-4">
              <nav
                aria-label="Social"
                data-menu-meta
                className="flex w-full flex-wrap items-center justify-end gap-6"
              >
                {socialLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="link-sweep whitespace-nowrap font-[family-name:var(--font-display)] text-[13px] font-semibold uppercase leading-[1.2] tracking-[1.56px] text-text-primary transition-colors hover:text-brand"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
              <p
                data-menu-meta
                className="m-0 w-full text-right font-[family-name:var(--font-ui)] text-sm leading-[1.5] text-text-secondary"
              >
                © {year} SEVENPM. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
