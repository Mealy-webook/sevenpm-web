"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useId, useRef, useState } from "react";

import { AccountMenu, type AccountUser } from "./AccountMenu";
import { LocaleMenu, type CurrencyCode, type LanguageCode } from "./LocaleMenu";
import { SiteMenu } from "./SiteMenu";

/**
 * Site header, from Figma 2091:56421 (event page) / 2078:44133 (homepage).
 * Buttons are the design system's Secondary style: 5% white fill, 0.5px 10%
 * white border. Signed in, the account button opens `AccountMenu`; signed
 * out it reads "Login / sign up". The globe opens `LocaleMenu`, the last
 * button the full-screen `SiteMenu`.
 */

type SiteHeaderProps = {
  /** Signed-in user. Pass `null` for the logged-out header. */
  user?: AccountUser | null;
  /** Logo size — the homepage comp uses 100, inner pages 72. */
  logoSize?: 72 | 100;
  /** The account pages drop the account button (Figma 2173:25780). */
  hideAccount?: boolean;
};

const DEFAULT_USER: AccountUser = {
  name: "Ahmed Mealy",
  email: "ahmed@gmail.com",
  avatar: "/assets/nav-avatar.jpg",
  walletBalance: "120 MAD",
};

type Popover = "account" | "locale" | null;

export function SiteHeader({
  user = DEFAULT_USER,
  logoSize = 72,
  hideAccount = false,
}: SiteHeaderProps) {
  const [popover, setPopover] = useState<Popover>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [language, setLanguage] = useState<LanguageCode>("en");
  const [currency, setCurrency] = useState<CurrencyCode>("MAD");
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const cluster = useRef<HTMLDivElement>(null);

  // Slide away on the way down, come back on the way up; frost once scrolled.
  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
      if (Math.abs(y - last) < 6) return;
      setHidden(y > last && y > 160 && !popover && !menuOpen);
      last = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [popover, menuOpen]);
  const baseId = useId();

  const accountId = `${baseId}-account`;
  const localeId = `${baseId}-locale`;

  // Click outside or Escape closes whichever popover is open.
  useEffect(() => {
    if (!popover) return;
    const onPointer = (e: PointerEvent) => {
      if (!cluster.current?.contains(e.target as Node)) setPopover(null);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPopover(null);
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [popover]);

  const toggle = (which: Exclude<Popover, null>) =>
    setPopover((current) => (current === which ? null : which));

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  const firstName = user?.name.split(" ")[0] ?? "";

  return (
    <header
      className="site-header sticky top-0 z-30"
      data-hidden={hidden}
      data-scrolled={scrolled}
    >
      <div className="shell flex items-start gap-[52px] pb-8 pt-6 xl:pb-12 xl:pt-8">
        <Link href="/" aria-label="SEVENPM home" className="shrink-0">
          <Image
            src="/assets/logo-mark.svg"
            alt="SEVENPM"
            width={100}
            height={100}
            priority
            className={
              logoSize === 100
                ? "size-[64px] xl:size-[100px]"
                : "size-[56px] xl:size-[72px]"
            }
          />
        </Link>

        <div
          ref={cluster}
          className="relative flex min-w-0 flex-1 items-center justify-end gap-1"
        >
          {hideAccount ? null : user ? (
            <button
              id={`${accountId}-button`}
              type="button"
              aria-haspopup="menu"
              aria-expanded={popover === "account"}
              aria-controls={accountId}
              onClick={() => toggle("account")}
              className={`btn-secondary flex h-[52px] cursor-pointer items-center gap-2 px-5 py-4 ${
                popover === "account" ? "is-active" : ""
              }`}
            >
              <Image
                src="/assets/ic-user.svg"
                alt=""
                width={20}
                height={20}
                className="size-5"
              />
              <span className="font-[family-name:var(--font-display)] text-[17px] font-semibold uppercase leading-6 text-content-primary">
                {firstName}
              </span>
            </button>
          ) : (
            <a
              href="#login"
              className="flex h-[52px] items-center px-5 py-4 font-[family-name:var(--font-display)] text-[17px] font-semibold leading-6 text-content-primary transition-colors hover:text-brand"
            >
              Login / sign up
            </a>
          )}

          <button
            id={`${localeId}-button`}
            type="button"
            aria-label="Language and currency"
            aria-haspopup="dialog"
            aria-expanded={popover === "locale"}
            aria-controls={localeId}
            onClick={() => toggle("locale")}
            className={`btn-secondary flex size-[52px] cursor-pointer items-center justify-center p-4 ${
              popover === "locale" ? "is-active" : ""
            }`}
          >
            <Image
              src="/assets/ic-globe.svg"
              alt=""
              width={20}
              height={20}
              className="size-5"
            />
          </button>

          <button
            type="button"
            aria-label="Open menu"
            aria-haspopup="dialog"
            aria-expanded={menuOpen}
            onClick={() => {
              setPopover(null);
              setMenuOpen(true);
            }}
            className="btn-secondary flex size-[52px] cursor-pointer items-center justify-center p-4"
          >
            <Image
              src="/assets/ic-menu.svg"
              alt=""
              width={20}
              height={20}
              className="size-5"
            />
          </button>

          {/* Popovers hang off the right edge of the button cluster */}
          {popover === "account" && user && (
            <div className="absolute right-0 top-[calc(100%+8px)]">
              <AccountMenu
                user={user}
                id={accountId}
                labelledBy={`${accountId}-button`}
              />
            </div>
          )}
          {popover === "locale" && (
            <div className="absolute right-0 top-[calc(100%+8px)]">
              <LocaleMenu
                id={localeId}
                labelledBy={`${localeId}-button`}
                language={language}
                currency={currency}
                onLanguage={setLanguage}
                onCurrency={setCurrency}
              />
            </div>
          )}
        </div>
      </div>

      <SiteMenu open={menuOpen} onClose={closeMenu} />
    </header>
  );
}
