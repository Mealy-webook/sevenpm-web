"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";

import {
  CURRENCIES,
  CurrencyGroup,
  LanguageGroup,
  LANGUAGES,
  type CurrencyCode,
  type LanguageCode,
} from "./LocaleMenu";
import { MENU_LINKS } from "@/data/menu";
import { menuSocialLinks } from "@/data/events";

gsap.registerPlugin(CustomEase);

/**
 * Menu, from Figma 2231:12258 (collapsed) and 2231:12302 (Festivals open).
 *
 * A right-hand drawer 765 wide over the dimmed page: a 525 column inside a
 * 120 gutter, entries in Roboto Black 72 right-aligned with a hairline under
 * each, then language and currency, the socials and the copyright. Festivals
 * carries the four festivals and opens them on click rather than listing them
 * at rest.
 *
 * Language and currency live here rather than behind a globe in the header —
 * they are settings, and the menu is where the settings are. The comp puts
 * them top left as two compact buttons, EN and MAD, each opening its own
 * list; the close button keeps the opposite corner.
 *
 * Motion follows the kinetic-navigation reference: three backdrop layers wipe
 * across one after another and the links drop in rotated behind a CSS mask.
 * Closing plays in reverse and only then tells the header to unmount us —
 * which is why every dismissal goes through `requestClose`.
 *
 * Three things the reference is right about and this keeps:
 * - `xPercent: 101`, not 100: at exactly 100 a sub-pixel seam shows at the
 *   right edge on some zoom levels.
 * - 756 wide with 32 of padding all round, which is the comp's frame; the
 *   right side takes the shell's gutter instead, so the type keeps its
 *   distance from the edge of the screen at every width.
 * - The masks are CSS. Drop `overflow: hidden` from `.menu-mask` and the
 *   animations still run, they just look wrong.
 * - `ctx.revert()` is not optional. Without it the links keep the last run's
 *   inline transforms and the second open starts from the wrong place.
 */

const EASE = "menu-main";
if (!gsap.parseEase(EASE)) {
  CustomEase.create(EASE, "0.65, 0.01, 0.05, 0.99");
}

/* 2231:12302 sets the entries at Roboto Black 72 on a 0.8 line box. 64 is
   that with the site-wide display trim applied, which is where this lands on
   a wide drawer; the smaller steps are for narrow ones. The list carries
   eight entries where the comp drew five, so it no longer fits a laptop
   without scrolling — the drawer scrolls, which is the right answer: the
   alternative was shrinking content's own type to fit furniture. */
const ENTRY_TYPE =
  "block font-[family-name:var(--font-display)] text-[38px] font-black uppercase leading-[0.8] transition-colors sm:text-[52px] xl:text-[72px]";

/**
 * One of the two locale buttons: icon, code, chevron, and its list hanging
 * under it.
 *
 * Tertiary, as the comp now draws them (2383:11352): no fill and no border,
 * 16 of padding, the pair sitting flush against each other. Only the open one
 * takes a fill, so the sheet underneath has something to belong to.
 */
function LocaleButton({
  icon,
  label,
  title,
  open,
  onToggle,
  children,
}: {
  icon: string;
  label: string;
  title?: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      <button
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={title ? `${title} — change` : label}
        onClick={onToggle}
        className={`flex h-[52px] cursor-pointer items-center gap-2 p-4 transition-colors ${
          open ? "bg-white/10" : "hover:bg-white/5"
        }`}
      >
        <Image src={icon} alt="" width={20} height={20} className="size-5" />
        <span className="font-[family-name:var(--font-display)] text-[16px] font-semibold leading-6 text-content-primary">
          {label}
        </span>
        <Image
          src="/assets/ic-chevron-down-20.svg"
          alt=""
          width={20}
          height={20}
          className={`size-5 transition-[rotate] duration-300 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute left-0 top-[calc(100%+8px)] z-10 w-[280px] bg-[rgba(37,37,37,0.95)] p-3 backdrop-blur-2xl">
          {children}
        </div>
      )}
    </div>
  );
}

export function SiteMenu({
  open,
  onClose,
  language,
  currency,
  onLanguage,
  onCurrency,
}: {
  open: boolean;
  onClose: () => void;
  language: LanguageCode;
  currency: CurrencyCode;
  onLanguage: (code: LanguageCode) => void;
  onCurrency: (code: CurrencyCode) => void;
}) {
  const root = useRef<HTMLDivElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const submenu = useRef<HTMLDivElement>(null);
  const leaving = useRef(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [picker, setPicker] = useState<"language" | "currency" | null>(null);
  const submenuId = useId();
  const newsletterId = useId();
  const [subscribed, setSubscribed] = useState(false);
  const year = new Date().getFullYear();

  /**
   * Play the exit, then unmount. Every dismissal routes through here so the
   * drawer is never yanked off screen — except a link, which navigates anyway.
   */
  const requestClose = () => {
    const el = root.current;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
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
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

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

      {/* The sheet does not scroll; the column inside it does. It used to be
          the scroller, and the curtain behind it is `inset-0`, which an
          absolutely positioned child resolves against the visible box rather
          than the scrollable content — so on a short screen the background
          stopped at the fold and the rest of the menu scrolled over the dimmed
          page. */}
      <div
        data-menu-sheet
        className="absolute inset-y-0 right-0 flex w-full max-w-[900px] flex-col"
      >
        {/* The curtain: three layers, wiped in one after another */}
        <div aria-hidden className="absolute inset-0 overflow-hidden">
          <div data-menu-layer className="absolute inset-0 bg-brand" />
          <div data-menu-layer className="absolute inset-0 bg-bg-tertiary" />
          <div data-menu-layer className="absolute inset-0 bg-ink-900" />
        </div>

        {/* 32 on the left and the shell's gutter on the right, which is how
            2231:12258 sets the column: the type is right-aligned, so the room
            belongs on that side. */}
        <div /* 120 of gutter at the comp's 900 frame, falling back to the
             shell's own on anything narrower. */
          className="relative flex min-h-full flex-1 flex-col overflow-y-auto overscroll-contain px-[max(var(--shell-gutter),6vw)] py-8 xl:px-[120px]">
          {/* Language and currency on the left, close on the right. */}
          <div className="flex w-full items-center justify-between gap-4">
            {/* Flush, with no gap: the comp sets the two side by side. */}
            <div className="flex items-center">
              <LocaleButton
                icon="/assets/ic-globe.svg"
                label={language.toUpperCase()}
                open={picker === "language"}
                onToggle={() =>
                  setPicker((current) =>
                    current === "language" ? null : "language",
                  )
                }
                title={LANGUAGES.find((item) => item.code === language)?.label}
              >
                <LanguageGroup
                  language={language}
                  onLanguage={(code) => {
                    onLanguage(code);
                    setPicker(null);
                  }}
                />
              </LocaleButton>

              <LocaleButton
                icon={
                  CURRENCIES.find((item) => item.code === currency)?.flag ??
                  "/assets/flag-ma.png"
                }
                label={currency}
                open={picker === "currency"}
                onToggle={() =>
                  setPicker((current) =>
                    current === "currency" ? null : "currency",
                  )
                }
                title={CURRENCIES.find((item) => item.code === currency)?.label}
              >
                <CurrencyGroup
                  currency={currency}
                  onCurrency={(code) => {
                    onCurrency(code);
                    setPicker(null);
                  }}
                />
              </LocaleButton>
            </div>

            <button
              ref={closeButton}
              type="button"
              aria-label="Close menu"
              onClick={requestClose}
              /* The comp's secondary button: a 5% fill behind a 10% hairline,
                 rather than the heavier grey this carried before. */
              className="flex size-[52px] cursor-pointer items-center justify-center border-[0.5px] border-white/10 bg-white/5 transition-colors hover:border-white/25 hover:bg-white/10"
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
            className="mt-8 flex w-full flex-col items-start gap-6"
          >
            {MENU_LINKS.map((entry) => {
              const expanded = openGroup === entry.label;
              return (
                <div
                  key={entry.label}
                  className="flex w-full flex-col items-start gap-6"
                >
                  {/* The rule sits above each entry, the first one included
                      — 2231:12302 opens the list with one. It used to close
                      each row instead, which put a line under Contact and
                      none over Festivals. */}
                  <span
                    data-menu-rule
                    className="block h-px w-full bg-white/10"
                    aria-hidden
                  />

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
                        /* Brand yellow while open. An earlier note here said
                           the comp kept the expanded entry white — 2231:12302
                           is the Festivals-open state and sets it to
                           #fbeb1c, so the open group is the one coloured
                           thing in the list and the only cue that does not
                           depend on a cursor being present. */
                        className={`${ENTRY_TYPE} cursor-pointer ${
                          expanded
                            ? "text-brand"
                            : "text-white hover:text-brand"
                        }`}
                      >
                        {entry.label}
                      </button>
                    ) : (
                      <Link
                        href={entry.href}
                        data-menu-link
                        onClick={onClose}
                        className={`menu-link ${ENTRY_TYPE} text-white hover:text-brand`}
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
                      <ul className="m-0 flex list-none flex-col items-start gap-4 p-0">
                        {entry.children.map((child) => (
                          <li key={child.label} className="menu-mask">
                            <Link
                              href={child.href}
                              data-menu-sub-link
                              tabIndex={expanded ? undefined : -1}
                              onClick={onClose}
                              className="block font-[family-name:var(--font-display)] text-[22px] uppercase leading-[0.8] tracking-[-0.56px] text-content-secondary transition-colors hover:text-white sm:text-[28px]"
                            >
                              {child.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                </div>
              );
            })}
          </nav>

          {/* Become a sponsor. Not in 2231:12302 — added by request.
              
              It sits under the list rather than in it on purpose: the entries
              above are places to go, and this is something to do. Giving it
              the brand fill rather than a sixth 72px row keeps the comp's
              list intact and still makes it the loudest thing in the drawer.

              A rule above it, like the entries, so it belongs to the column
              rather than floating between the list and the newsletter. */}
          <div data-menu-meta className="mt-6 flex w-full flex-col gap-6">
            <span aria-hidden className="block h-px w-full bg-white/10" />
            <Link
              href="/sponsor"
              onClick={onClose}
              className="sweep flex items-center justify-center self-start bg-brand px-5 py-4 font-[family-name:var(--font-display)] text-[16px] font-semibold leading-6 text-[#0b0b0e]"
            >
              <span className="relative z-10">Become a sponsor</span>
            </Link>
          </div>

          {/* The newsletter, under Contact (2550:18293). The menu's last
              entry is how to reach us; this is the other half of it.

              A panel rather than the bare field this carried before: the comp
              gives it a secondary-background block with 32 of padding, a
              title at 30/34, a line of why, and the field beside a white
              Subscribe button. Left-aligned inside the panel, against the
              right-ranged list above it, which is what stops it reading as a
              ninth menu entry.

              Nothing is sent — there is no list behind this build. */}
          <form
            data-menu-meta
            className="mt-10 flex w-full flex-col gap-6 bg-bg-secondary p-6 sm:p-8"
            onSubmit={(event) => {
              event.preventDefault();
              setSubscribed(true);
            }}
          >
            <div className="flex flex-col gap-1">
              <h2 className="m-0 font-[family-name:var(--font-display)] text-[21px] font-bold uppercase leading-[1.13] tracking-[-0.15px] text-content-primary sm:text-[26px]">
                Be the first to know
              </h2>
              {/* #56565d, the inverse secondary this panel uses in the comp —
                  darker than the page's own secondary. */}
              <p className="m-0 font-[family-name:var(--font-ui)] text-[14px] leading-[20px] tracking-[0.15px] text-[#56565d]">
                Subscribe to our newsletter to be the first to know about
                concert announcements, and exclusive updates — and never miss
                the most exciting news.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch sm:gap-4">
              <label className="sr-only" htmlFor={newsletterId}>
                Your email
              </label>
              <input
                id={newsletterId}
                type="email"
                name="email"
                required
                placeholder="Your email"
                onChange={() => setSubscribed(false)}
                className="min-w-0 flex-1 border-[0.5px] border-white/10 bg-white/5 px-4 py-3 font-[family-name:var(--font-display)] text-[16px] leading-6 tracking-[0.085px] text-content-primary placeholder:text-content-primary/45 focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-brand"
              />
              {/* White, as the comp draws it — the one primary action in the
                  drawer, and the brand yellow is already spent on the open
                  group above. */}
              <button
                type="submit"
                className="shrink-0 bg-white px-5 py-4 font-[family-name:var(--font-display)] text-[16px] font-semibold leading-6 text-[#18181b] transition-colors hover:bg-brand"
              >
                {subscribed ? "Noted" : "Subscribe"}
              </button>
            </div>

            <p
              role="status"
              className="m-0 min-h-4 font-[family-name:var(--font-display)] text-[12px] leading-4 text-white/45"
            >
              {subscribed ? "Thanks — nothing is sent from this prototype." : " "}
            </p>
          </form>

          <div className="mt-auto flex w-full flex-col items-start gap-4 pt-12">
            <nav
              aria-label="Social"
              data-menu-meta
              className="flex w-full flex-wrap items-center gap-x-6 gap-y-3"
            >
              {menuSocialLinks.map((link) => (
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
            {/* The copyright and the WBK credit on one line, as the comp
                sets them (2550:18409). */}
            <div
              data-menu-meta
              className="flex flex-wrap items-center gap-x-4 gap-y-2"
            >
              <p className="m-0 font-[family-name:var(--font-ui)] text-[13px] leading-[1.5] text-text-secondary">
                © {year} SEVENPM. All rights reserved.
              </p>
              <p className="m-0 flex items-center gap-2 font-[family-name:var(--font-ui)] text-[13px] leading-[1.5] text-content-primary">
                Powered by
                <Image
                  src="/assets/wbk-logo.svg"
                  alt="WBK"
                  width={61}
                  height={18}
                  className="h-[18px] w-[61px]"
                />
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
