"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { gsap } from "gsap";

import { AccountMenu, type AccountUser } from "./AccountMenu";
import { useLoyalty } from "@/components/account/loyaltyStore";
import { Odometer } from "@/components/ui/Odometer";
import { AuthDialog } from "@/components/auth/AuthDialog";
import { useSignedIn } from "@/components/auth/session";
import { authCopy } from "@/data/auth";
import { loyaltyCopy } from "@/data/account";
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
  /**
   * The account pages drop the signed-in account button (Figma 2173:25780).
   * Signed out, "Login / sign up" still shows — the profile slot has to say
   * what the session is, wherever you are.
   */
  hideAccount?: boolean;
  /**
   * `secondary` gives the bar the elevated fill, for pages whose first
   * section already sits on it — the account name band runs straight into
   * the header, and a transparent bar there shows a seam.
   */
  surface?: "default" | "secondary";
};

const DEFAULT_USER: AccountUser = {
  name: "Ahmed Mealy",
  email: "ahmed@gmail.com",
  avatar: "/assets/nav-avatar.jpg",
  walletBalance: "120 MAD",
};

type Popover = "account" | "locale" | null;

function BeatsChip() {
  const { balance } = useLoyalty();
  const chip = useRef<HTMLAnchorElement>(null);
  const banner = useRef<HTMLDivElement>(null);

  /**
   * Beats arriving in the chip: the banner from the comp (2213:16229) drops
   * in under it, a handful of beats scatter out of the banner and arc into
   * the chip, and the counter's wheels roll up to the new figure as they
   * land. Beats spent roll down with none of the fanfare.
   *
   * The number is set **once**, when the first beat lands, and the wheels
   * take it from there. Tweening it instead would restart each wheel's
   * transition sixty times a second, every frame fighting the last — an
   * odometer counts by being left alone.
   *
   * `shown` is what the wheels are showing; `display` is what React draws.
   */
  const shown = useRef(balance);
  const [display, setDisplay] = useState(balance);
  const [earned, setEarned] = useState<number | null>(null);

  useEffect(() => {
    const from = shown.current;
    if (from === balance) return;
    shown.current = balance;
    const el = chip.current;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    /* Spending, or motion turned down: the wheels just go there. */
    if (balance < from || reduced) {
      setDisplay(balance);
      if (balance > from) setEarned(balance - from);
      return;
    }

    const coins = 6;
    const tl = gsap.timeline();
    /* setState only ever inside a callback — never in the effect body, which
       this project's lint forbids and which would be a render on a render. */
    tl.call(() => {
      setEarned(balance - from);
      el?.setAttribute("data-earning", "true");
    });
    for (let i = 0; i < coins; i += 1) {
      tl.call(() => fly(i, coins), [], 0.2 + i * 0.07);
    }
    /* As the first one lands. */
    tl.call(() => setDisplay(balance), [], 0.72);
    tl.call(() => el?.removeAttribute("data-earning"), [], 1.6);

    /**
     * One beat on its way from the banner into the chip. Fixed to the
     * viewport and outside both, so neither one's overflow can clip it, and
     * spread across the banner's width so they do not leave as a column.
     */
    function fly(index: number, of: number) {
      const source = banner.current?.getBoundingClientRect();
      const target = el?.getBoundingClientRect();
      if (!source || !target) return;
      const spread = (index / (of - 1) - 0.5) * source.width * 0.62;

      const token = document.createElement("span");
      token.className = "beats-token";
      token.textContent = "♪";
      token.setAttribute("aria-hidden", "true");
      token.style.left = `${source.left + source.width / 2 + spread}px`;
      token.style.top = `${source.top + source.height / 2}px`;
      document.body.appendChild(token);

      gsap
        .timeline({ onComplete: () => token.remove() })
        .fromTo(
          token,
          { opacity: 0, scale: 0.5 },
          { opacity: 1, scale: 1, duration: 0.14, ease: "power2.out" },
        )
        .to(
          token,
          {
            x:
              target.left +
              target.width / 2 -
              (source.left + source.width / 2 + spread),
            y: target.top + target.height / 2 - (source.top + source.height / 2),
            rotate: 140,
            duration: 0.45,
            ease: "power2.inOut",
          },
          0.04,
        )
        .to(
          token,
          { scale: 0.3, opacity: 0, duration: 0.16, ease: "power2.in" },
          0.36,
        );
    }

    return () => {
      tl.kill();
      el?.removeAttribute("data-earning");
      document.querySelectorAll(".beats-token").forEach((n) => n.remove());
    };
  }, [balance]);

  return (
    <div className="relative shrink-0">
      <Link
        ref={chip}
        href="/account/loyalty"
        data-beats-chip
        aria-label={`${balance.toLocaleString("en-US")} ${loyaltyCopy.unit}`}
        /* Daltown runs small for its point size — it is a condensed display
           face — so this sits well above the 17px the buttons beside it use
           in order to read at the same weight. */
        className="beats-chip btn-secondary flex h-[52px] items-center gap-1.5 px-4 font-daltown text-[28px] uppercase leading-none"
      >
        <span className="relative text-white">
          <Odometer value={display} duration={0.62} />
          <span className="sr-only">{balance.toLocaleString("en-US")}</span>
        </span>
        <span className="relative text-brand">{loyaltyCopy.unit}</span>
      </Link>

      {/* Right-aligned to the chip so it never runs off the edge, with the
          comp's little tail pointing back up at it. It stays until it is
          dismissed — `role="status"` rather than an alert, because it is
          good news and not an interruption.

          Mounted whether or not there is anything to say. A live region has
          to exist before its text arrives or the announcement is missed, and
          the beats that fly into the chip take off from this box, which has
          to be measurable the moment they leave — mounting it with the news
          made it a frame too late and they never flew at all. */}
      <div
        ref={banner}
        role="status"
        data-open={earned !== null}
        className="beats-banner absolute right-0 top-[calc(100%+10px)] z-10 flex items-center gap-2 whitespace-nowrap bg-[#0f3e21] py-2 pl-3 pr-2 font-[family-name:var(--font-display)] text-[13px] font-semibold leading-5 tracking-[0.16px] text-content-primary"
      >
        {earned !== null && (
          <>
            {loyaltyCopy.earnedBanner(earned)}
            <button
              type="button"
              onClick={() => setEarned(null)}
              aria-label={loyaltyCopy.earnedDismiss}
              className="flex size-5 cursor-pointer items-center justify-center text-content-secondary transition-colors hover:text-white"
            >
              <svg viewBox="0 0 16 16" className="size-3" fill="none">
                <path
                  d="M3 3 13 13M13 3 3 13"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />
              </svg>
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export function SiteHeader({
  user = DEFAULT_USER,
  logoSize = 72,
  hideAccount = false,
  surface = "default",
}: SiteHeaderProps) {
  const signedIn = useSignedIn();
  /* Signing out is client-side only, so the prop stays the source of who the
     visitor is and the session decides whether they are still here. */
  const account = signedIn ? user : null;
  const [popover, setPopover] = useState<Popover>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
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

  const firstName = account?.name.split(" ")[0] ?? "";

  /* Publish the bar's height so a section can be exactly the screen minus the
     header. Updates are ignored while it is in its scrolled, shrunken state:
     the number is what a section has to give up at the top of the page, and
     letting it change mid-scroll would resize every section under the reader. */
  const bar = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = bar.current;
    if (!el) return;
    const publish = () => {
      if (el.dataset.scrolled === "true") return;
      document.documentElement.style.setProperty(
        "--header-h",
        `${Math.round(el.offsetHeight)}px`,
      );
    };
    publish();
    const ro = new ResizeObserver(publish);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <header
      ref={bar}
      className="site-header sticky top-0 z-30"
      data-hidden={hidden}
      data-scrolled={scrolled}
      data-surface={surface}
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
          {/* Beats balance, from Figma 2091:56422. Signed-in only — it is a
              balance, and there is nothing to state without an account. It
              reads the shared store, so redeeming on the rewards page moves
              the number up here in the same frame. */}
          {account && !hideAccount && <BeatsChip />}

          {account ? (
            hideAccount ? null : (
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
            )
          ) : (
            <button
              type="button"
              onClick={() => setAuthOpen(true)}
              className="flex h-[52px] cursor-pointer items-center px-5 py-4 font-[family-name:var(--font-display)] text-[17px] font-semibold leading-6 text-content-primary transition-colors hover:text-brand"
            >
              {authCopy.open}
            </button>
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
          {popover === "account" && account && (
            <div className="absolute right-0 top-[calc(100%+8px)]">
              <AccountMenu
                user={account}
                onLogout={() => setPopover(null)}
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
      {authOpen && <AuthDialog onClose={() => setAuthOpen(false)} />}
    </header>
  );
}
