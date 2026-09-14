"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";

import { socialLinks } from "@/data/events";

gsap.registerPlugin(CustomEase);

/**
 * Menu, from Figma 2231:12258 (collapsed) and 2231:12302 (Festivals open).
 *
 * A right-hand drawer 765 wide over the dimmed page: a 525 column inside a
 * 120 gutter, entries in Roboto Black 72 right-aligned with a hairline under
 * each, then the socials and the copyright. Festivals carries the four
 * festivals and opens them on click rather than listing them at rest.
 *
 * Motion follows the kinetic-navigation reference: three backdrop layers wipe
 * across one after another and the links drop in rotated behind a CSS mask.
 * Closing plays in reverse and only then tells the header to unmount us —
 * which is why every dismissal goes through `requestClose`.
 *
 * Three things the reference is right about and this keeps:
 * - `xPercent: 101`, not 100: at exactly 100 a sub-pixel seam shows at the
 *   right edge on some zoom levels.
 * - The masks are CSS. Drop `overflow: hidden` from `.menu-mask` and the
 *   animations still run, they just look wrong.
 * - `ctx.revert()` is not optional. Without it the links keep the last run's
 *   inline transforms and the second open starts from the wrong place.
 */

const EASE = "menu-main";
if (!gsap.parseEase(EASE)) {
  CustomEase.create(EASE, "0.65, 0.01, 0.05, 0.99");
}

type MenuLink = { label: string; href: string };
type MenuEntry = MenuLink & { children?: MenuLink[] };

export const MENU_LINKS: MenuEntry[] = [
  { label: "Home", href: "/" },
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

const ENTRY_TYPE =
  "block font-[family-name:var(--font-display)] text-[44px] font-black uppercase leading-[0.8] text-white transition-colors hover:text-brand sm:text-[56px] xl:text-[72px]";

export function SiteMenu({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const root = useRef<HTMLDivElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const submenu = useRef<HTMLDivElement>(null);
  const leaving = useRef(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const submenuId = useId();
  const year = new Date().getFullYear();

  /**
   * Play the exit, then unmount. Every dismissal routes through here so the
   * drawer is never yanked off screen — except a link, which navigates anyway.
   */
  const requestClose = () => {
    const el = root.current;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!el || leaving.current || reduce) {
      onClose();
      return;
    }
    leaving.current = true;
    gsap
      .timeline({ onComplete: onClose })
      .to(el.querySelector("[data-menu-overlay]"), {
        autoAlpha: 0,
        duration: 0.4,
        ease: EASE,
      })
      .to(
        el.querySelector("[data-menu-sheet]"),
        { xPercent: 110, duration: 0.6, ease: "power3.in" },
        0,
      );
  };

  // Lock the page behind the drawer and close on Escape.
  useEffect(() => {
    if (!open) return;
    leaving.current = false;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") requestClose();
    };
    document.addEventListener("keydown", onKey);
    closeButton.current?.focus();
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKey);
    };
    // `requestClose` only reads refs and props, so it needn't be a dependency.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, onClose]);

  // Entrance, and the hover washes behind the navigation.
  useEffect(() => {
    const el = root.current;
    if (!open || !el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: EASE, duration: 0.7 } })
        .fromTo("[data-menu-overlay]", { autoAlpha: 0 }, { autoAlpha: 1 })
        .fromTo(
          "[data-menu-sheet]",
          { xPercent: 110 },
          { xPercent: 0, duration: 0.75 },
          "<",
        )
        // The three layers wipe across one behind the other — yellow, grey,
        // then the ground the drawer actually sits on.
        .fromTo(
          "[data-menu-layer]",
          { xPercent: 101 },
          { xPercent: 0, stagger: 0.12, duration: 0.575 },
          "<+=0.1",
        )
        // Masked by `.menu-mask`, so the rotation reads as a card dropping in.
        .fromTo(
          "[data-menu-link]",
          { yPercent: 140, rotate: 10 },
          { yPercent: 0, rotate: 0, stagger: 0.05 },
          "<+=0.2",
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
          "<+=0.15",
        )
        .fromTo(
          "[data-menu-meta]",
          { y: 16, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, stagger: 0.05 },
          "<+=0.2",
        );

    }, el);

    return () => ctx.revert();
  }, [open]);

  /**
   * The submenu. Height is animated rather than toggled so the rules below it
   * slide rather than jump; the festivals themselves drop in like the entries
   * above them.
   */
  useEffect(() => {
    const el = submenu.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!openGroup) {
      if (reduce) gsap.set(el, { height: 0 });
      else gsap.to(el, { height: 0, duration: 0.4, ease: EASE });
      return;
    }

    const items = el.querySelectorAll("[data-menu-sub-link]");
    if (reduce) {
      gsap.set(el, { height: "auto" });
      return;
    }
    gsap.set(el, { height: "auto" });
    gsap.from(el, { height: 0, duration: 0.55, ease: EASE });
    gsap.fromTo(
      items,
      { yPercent: 140, rotate: 8 },
      { yPercent: 0, rotate: 0, duration: 0.6, stagger: 0.05, ease: EASE },
    );
  }, [openGroup]);

  if (!open) return null;

  return (
    <div
      ref={root}
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      data-lenis-prevent
      className="fixed inset-0 z-50"
    >
      <button
        type="button"
        tabIndex={-1}
        aria-hidden
        data-menu-overlay
        onClick={requestClose}
        className="absolute inset-0 cursor-default bg-black/70 backdrop-blur-sm"
      />

      <div
        data-menu-sheet
        className="absolute inset-y-0 right-0 flex w-full max-w-[765px] flex-col overflow-y-auto overscroll-contain"
      >
        {/* The curtain: three layers, wiped in one after another */}
        <div aria-hidden className="absolute inset-0 overflow-hidden">
          <div data-menu-layer className="absolute inset-0 bg-brand" />
          <div data-menu-layer className="absolute inset-0 bg-bg-tertiary" />
          <div data-menu-layer className="absolute inset-0 bg-ink-900" />
        </div>

        {/* 525 column inside a 120 gutter, as the comp sets it */}
        <div className="relative flex min-h-full flex-col px-6 py-8 sm:px-12 xl:px-[120px] xl:py-14">
          <div className="flex w-full justify-end">
            <button
              ref={closeButton}
              type="button"
              aria-label="Close menu"
              onClick={requestClose}
              className="flex size-[52px] cursor-pointer items-center justify-center bg-[rgba(37,37,37,0.5)] transition-colors hover:bg-[rgba(37,37,37,0.9)]"
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

          <nav
            aria-label="Primary"
            className="mt-8 flex w-full flex-col items-end gap-6"
          >
            {MENU_LINKS.map((entry) => {
              const expanded = openGroup === entry.label;
              return (
                <div
                  key={entry.label}
                  className="flex w-full flex-col items-end gap-6"
                >
                  <span className="menu-mask">
                    {entry.children ? (
                      <button
                        type="button"
                        data-menu-link
                        aria-expanded={expanded}
                        aria-controls={submenuId}
                        onClick={() =>
                          setOpenGroup(expanded ? null : entry.label)
                        }
                        /* The comp keeps the expanded entry white, so the
                           only colour cue is hover. */
                        className={`${ENTRY_TYPE} cursor-pointer`}
                      >
                        {entry.label}
                      </button>
                    ) : (
                      <Link
                        href={entry.href}
                        data-menu-link
                        onClick={onClose}
                        className={`menu-link ${ENTRY_TYPE}`}
                      >
                        {entry.label}
                      </Link>
                    )}
                  </span>

                  {entry.children && (
                    <div
                      /* One ref serves the single group in MENU_LINKS. Give
                         each group its own ref if a second one appears. */
                      ref={submenu}
                      id={submenuId}
                      className="h-0 w-full overflow-hidden"
                    >
                      <ul className="m-0 flex list-none flex-col items-end gap-4 p-0">
                        {entry.children.map((child) => (
                          <li key={child.label} className="menu-mask">
                            <Link
                              href={child.href}
                              data-menu-sub-link
                              tabIndex={expanded ? undefined : -1}
                              onClick={onClose}
                              className="block font-[family-name:var(--font-display)] text-[20px] uppercase leading-[0.8] tracking-[-0.56px] text-content-secondary transition-colors hover:text-white sm:text-[28px]"
                            >
                              {child.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <span
                    data-menu-rule
                    className="block h-px w-full bg-white/10"
                    aria-hidden
                  />
                </div>
              );
            })}
          </nav>

          <div className="mt-auto flex w-full flex-col items-end gap-6 pt-12">
            <nav
              aria-label="Social"
              data-menu-meta
              className="flex w-full flex-wrap items-center justify-end gap-x-6 gap-y-4"
            >
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="link-sweep whitespace-nowrap font-[family-name:var(--font-display)] text-[13px] font-semibold uppercase leading-4 tracking-[1.56px] text-text-primary transition-colors hover:text-brand"
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
  );
}
