"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import gsap from "gsap";

import { socialLinks } from "@/data/events";

/**
 * Full-screen menu, from Figma 2227:5808 (1512 × 853). The left panel is a
 * yellow fill with a photo, blended in luminosity against the dark page so it
 * reads as greyscale (as in the comp), with the wordmark on top; the right column
 * is the primary navigation in Roboto Black 72, white, right-aligned, with
 * 5% hairlines between entries. "Festivals" lists the four festivals under
 * it in Roboto Regular 28. Social links and copyright sit below the row.
 */

type MenuLink = { label: string; href: string };
type MenuEntry = MenuLink & { children?: MenuLink[] };

export const MENU_LINKS: MenuEntry[] = [
  {
    label: "Festivals",
    href: "/#festivals",
    children: [
      { label: "Jazzablanca", href: "/events/jazzablanca" },
      { label: "Tanjazz", href: "/about#festivals" },
      { label: "Casa Anfa Latina", href: "/about#festivals" },
      { label: "Village Casa Anfa", href: "/about#festivals" },
    ],
  },
  { label: "News", href: "/news" },
  { label: "Team", href: "/team" },
  { label: "Careers", href: "/careers" },
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

  // Entrance: the sheet wipes down, the panel settles, the links rise in and
  // the hairlines draw from the right.
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
        "[data-menu-sheet]",
        { yPercent: -100 },
        { yPercent: 0, duration: 0.7 },
      )
        .fromTo(
          "[data-menu-panel]",
          { scale: 1.06, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.9 },
          0.15,
        )
        // The reveal is a CSS mask: `.menu-mask` is overflow:hidden and the
        // link slides inside it. 101 rather than 100 — at exactly 100 a
        // sub-pixel rounding seam shows at the edge on some zoom levels.
        .fromTo(
          "[data-menu-link]",
          { xPercent: 101 },
          { xPercent: 0, duration: 0.8, stagger: 0.05 },
          0.3,
        )
        .fromTo(
          "[data-menu-rule]",
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 0.9,
            stagger: 0.06,
            transformOrigin: "right center",
          },
          0.45,
        )
        .fromTo(
          "[data-menu-meta]",
          { y: 16, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, stagger: 0.05 },
          0.7,
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
      data-lenis-prevent
      className="fixed inset-0 z-50 overflow-y-auto overscroll-contain bg-ink-900"
    >
      <div
        data-menu-sheet
        className="shell flex min-h-full flex-col gap-8 py-6 xl:py-14"
      >
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

        <div className="flex w-full flex-col gap-8 lg:flex-row lg:items-stretch lg:justify-end">
          {/* Left panel */}
          <div
            data-menu-panel
            className="relative flex min-h-[320px] w-full shrink-0 flex-col items-center justify-end overflow-hidden bg-brand p-10 mix-blend-luminosity lg:min-h-0 lg:w-[511px]"
          >
            <Image
              src="/assets/menu-panel.jpg"
              alt=""
              fill
              sizes="(min-width: 1024px) 511px, 100vw"
              priority
              className="object-cover"
            />
            <Image
              src="/assets/menu-logo.png"
              alt="SEVENPM"
              width={397}
              height={62}
              unoptimized
              className="relative h-auto w-[80%] max-w-[409px]"
            />
          </div>

          {/* Navigation */}
          <nav
            aria-label="Primary"
            className="flex min-w-0 flex-1 flex-col items-end justify-center gap-6"
          >
            {MENU_LINKS.map((entry) => (
              <div key={entry.label} className="contents">
                <span className="menu-mask">
                  <Link
                    href={entry.href}
                    data-menu-link
                    onClick={onClose}
                    className="menu-link block font-[family-name:var(--font-display)] text-[44px] font-black uppercase leading-[0.8] text-white transition-colors hover:text-brand sm:text-[56px] xl:text-[72px]"
                  >
                    {entry.label}
                  </Link>
                </span>
                {entry.children && (
                  <ul className="m-0 flex list-none flex-col items-end gap-4 p-0">
                    {entry.children.map((child) => (
                      <li key={child.label} className="menu-mask">
                        <Link
                          href={child.href}
                          data-menu-link
                          onClick={onClose}
                          className="block font-[family-name:var(--font-display)] text-[20px] uppercase leading-[0.8] tracking-[-0.02em] text-content-secondary transition-colors hover:text-white sm:text-[28px]"
                        >
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
                <span
                  data-menu-rule
                  className="block h-px w-full bg-white/5"
                  aria-hidden
                />
              </div>
            ))}
          </nav>
        </div>

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
  );
}
