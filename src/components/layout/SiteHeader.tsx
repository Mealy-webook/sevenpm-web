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
import type { CurrencyCode, LanguageCode } from "./LocaleMenu";
import { SiteMenu } from "./SiteMenu";

/**
 * Site header, from Figma 2091:56421 (event page) / 2078:44133 (homepage).
 * Buttons are the design system's Secondary style: 5% white fill, 0.5px 10%
 * white border. Signed in, the account button opens `AccountMenu`; signed
 * out it reads "Login / sign up". Language and currency live in the site
 * menu now rather than behind a globe of their own; the last
 * button the full-screen `SiteMenu`.
 */

type SiteHeaderProps = {
  /** Signed-in user. Pass `null` for the logged-out header. */
  user?: AccountUser | null;
  /** Logo size — the homepage comp uses 100, inner pages 72. */
  logoSize?: 72 | 100;
  /**
   * The account pages drop the signed-in account button (Figma 2467:17823) —
   * you are already there. The Beats chip stays.
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

type Popover = "account" | null;

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
            y:
              target.top + target.height / 2 - (source.top + source.height / 2),
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
        className="beats-chip btn-secondary flex h-[52px] items-center gap-1 pl-3 pr-3.5 font-daltown text-[34px] uppercase leading-6"
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

  /**
   * Slide away on the way down, come back on the way up; frost once scrolled.
   *
   * Both states have hysteresis, because neither question has a single
   * threshold. Smooth scrolling delivers a stream of sub-pixel deltas whose
   * sign flips as the page decelerates, so a plain `y > last` test made the
   * bar flicker in and out mid-scroll; and a single frost threshold at 24
   * toggled the whole time anyone hovered around it.
   *
   * So: distance travelled in one direction decides the slide — 80 down to
   * hide, 40 back up to show — and the frost turns on past 64 and off under
   * 16. Near the top the bar is always shown, whatever the reader was doing.
   */
  useEffect(() => {
    let last = window.scrollY;
    let run = 0;
    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - last;
      last = y;

      setScrolled((current) => (current ? y > 16 : y > 64));

      if (Math.abs(delta) < 1) return;
      /* A change of direction starts the count again. */
      if (delta > 0 !== run > 0) run = 0;
      run += delta;

      if (y <= 160) setHidden(false);
      else if (run > 80 && !popover && !menuOpen) setHidden(true);
      else if (run < -40) setHidden(false);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [popover, menuOpen]);
  const baseId = useId();

  const accountId = `${baseId}-account`;

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

  /* The comp (2467:12221) puts the visitor's initials in a 52 square rather
     than an icon and a first name. Two letters at most: "Ahmed Mealy" is AM. */
  const initials =
    account?.name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("") ?? "";

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

  /* The bar is fixed, not sticky, and a spacer holds its place in the flow.
     Sticky keeps the element in normal flow, so the shrink at 24px of scroll
     took ~16px out of the page height mid-scroll; Chrome's scroll anchoring
     then pulled the scroll position down by the same amount, which dropped it
     back under the threshold, which grew the bar again. On a short page —
     any account tab — that never settled: the page jittered for as long as
     you sat near the top, and `--header-h` wobbled with it, resizing every
     section sized off it. Out of flow, the shrink costs the page nothing. */
  const logoClass =
    logoSize === 100
      ? "size-[64px] xl:size-[100px]"
      : "size-[56px] xl:size-[72px]";

  return (
    <>
      <header
        ref={bar}
        className="site-header fixed inset-x-0 top-0 z-30"
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
              className={logoClass}
            />
          </Link>

          <div
            ref={cluster}
            className="relative flex min-w-0 flex-1 items-center justify-end gap-1"
          >
            {/* Beats balance, from Figma 2091:56422. Signed-in only — it is a
              balance, and there is nothing to state without an account. It
              reads the shared store, so redeeming on the rewards page moves
              the number up here in the same frame.
              
              It shows on the account pages too (2467:17823): `hideAccount`
              drops the account button, because you are already in the
              account, not the balance. */}
            {account && <BeatsChip />}

            {account ? (
              hideAccount ? null : (
                <button
                  id={`${accountId}-button`}
                  type="button"
                  aria-haspopup="menu"
                  aria-expanded={popover === "account"}
                  aria-controls={accountId}
                  aria-label={`${account.name} — account`}
                  onClick={() => toggle("account")}
                  className={`flex size-[52px] shrink-0 cursor-pointer items-center justify-center border-[0.5px] border-white/10 font-daltown text-[34px] uppercase leading-6 text-white transition-colors ${
                    popover === "account"
                      ? "bg-brand/20"
                      : "bg-brand/10 hover:bg-brand/20"
                  }`}
                >
                  {initials}
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
              type="button"
              aria-label="Open menu"
              aria-haspopup="dialog"
              aria-expanded={menuOpen}
              onClick={() => {
                setPopover(null);
                setMenuOpen(true);
              }}
              className="btn-secondary flex size-[52px] cursor-pointer items-center justify-center p-[14px]"
            >
              <Image
                src="/assets/ic-menu.svg"
                alt=""
                width={24}
                height={24}
                className="size-6"
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
          </div>
        </div>

        <SiteMenu
          open={menuOpen}
          onClose={closeMenu}
          language={language}
          currency={currency}
          onLanguage={setLanguage}
          onCurrency={setCurrency}
        />
        {authOpen && <AuthDialog onClose={() => setAuthOpen(false)} />}
      </header>

      {/* Holds the bar's place. Its height is the bar's own unscrolled
          geometry — the same padding and the logo, which is the tallest thing
          in the row — so it is right on the first paint, before the measured
          `--header-h` lands. `min-height` takes over if the row ever grows
          past the logo. */}
      <div
        aria-hidden
        className="border-b border-transparent pb-8 pt-6 xl:pb-12 xl:pt-8"
        style={{ minHeight: "var(--header-h, 0px)" }}
      >
        <div className={logoClass} />
      </div>
    </>
  );
}
