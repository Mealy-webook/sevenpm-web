"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { gsap } from "gsap";

import { AccountMenu, type AccountUser } from "./AccountMenu";
import { useLoyalty } from "@/components/account/loyaltyStore";
import {
  readBeatsMotion,
  useBeatsMotion,
} from "@/components/account/beatsMotion";
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
  const motion = useBeatsMotion();
  const chip = useRef<HTMLAnchorElement>(null);
  const banner = useRef<HTMLDivElement>(null);

  /* The number shown lags the balance on purpose. When Beats arrive — the
     booking confirmation pays out — the announcement plays here: the banner
     from the comp (2213:16229) under the chip, and the count climbing into
     it. Beats spent roll down with none of the fanfare.

     Four ways of doing it are built while Ahmed picks one; `beatsMotion`
     says which, and `/preview/beats` switches between them. Once one is
     chosen the rest go.

     `shown` is what the roll starts from; `display` is what React draws. */
  const shown = useRef(balance);
  const [display, setDisplay] = useState(balance);
  const [earned, setEarned] = useState<number | null>(null);

  useEffect(() => {
    const from = shown.current;
    if (from === balance) return;
    const earning = balance > from;
    const el = chip.current;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const how = readBeatsMotion();

    const state = { n: from };
    /* Every setState below happens inside a timeline callback rather than in
       the effect body, which this project's lint forbids — and which would
       be a render during render anyway. */
    const tl = gsap.timeline();

    const roll = (at: number, seconds: number) =>
      tl.to(
        state,
        {
          n: balance,
          duration: reduced ? 0 : seconds,
          ease: "power2.out",
          onUpdate: () => {
            shown.current = Math.round(state.n);
            setDisplay(shown.current);
          },
        },
        at,
      );

    if (!earning) {
      roll(0, 0);
    } else if (reduced) {
      tl.call(() => setEarned(balance - from));
      roll(0, 0);
    } else {
      tl.call(() => {
        setEarned(balance - from);
        el?.setAttribute("data-earning", "true");
      });

      if (how === "continuous") {
        /* One move: the token leaves the banner while it is still settling
           and the count starts mid-flight, so it lands on the new number as
           the token arrives. No gap anywhere. */
        tl.call(() => fly(1, 0.5), [], 0.25);
        roll(0.4, 0.42);
      } else if (how === "burst") {
        /* Six marks on a quick stagger; the count steps with each landing
           rather than rolling smoothly. */
        const coins = 6;
        for (let i = 0; i < coins; i += 1) {
          tl.call(() => fly(coins, 0.45, i), [], 0.25 + i * 0.07);
          tl.call(
            () => {
              shown.current = Math.round(from + ((balance - from) * (i + 1)) / coins);
              setDisplay(shown.current);
            },
            [],
            0.78 + i * 0.07,
          );
        }
      } else if (how === "fill") {
        /* The chip fills with brand from the left as the count climbs. */
        tl.call(() => el?.setAttribute("data-filling", "true"), [], 0.2);
        roll(0.2, 0.8);
        tl.call(() => el?.removeAttribute("data-filling"), [], 1.2);
      } else {
        /* Odometer: nothing flies, the wheels do the work. */
        roll(0.2, 0.7);
      }

      tl.call(() => el?.removeAttribute("data-earning"), [], "+=0.7");
    }

    /**
     * A mark leaving the banner for the chip. Fixed to the viewport and
     * outside both, so neither one's overflow can clip it. `of` > 1 spreads
     * the marks out and scatters them on the way.
     */
    function fly(of: number, seconds: number, index = 0) {
      const source = banner.current?.getBoundingClientRect();
      const target = el?.getBoundingClientRect();
      if (!source || !target) return;
      const single = of === 1;
      const spread = single ? 0 : (index / (of - 1) - 0.5) * source.width * 0.6;

      const token = document.createElement("span");
      token.className = single ? "beats-token" : "beats-token beats-token--coin";
      token.textContent = single
        ? `+${(balance - from).toLocaleString("en-US")}`
        : "♪";
      token.setAttribute("aria-hidden", "true");
      token.style.left = `${source.left + source.width / 2 + spread}px`;
      token.style.top = `${source.top + source.height / 2}px`;
      document.body.appendChild(token);

      gsap
        .timeline({ onComplete: () => token.remove() })
        .fromTo(
          token,
          { opacity: 0, scale: 0.6 },
          { opacity: 1, scale: 1, duration: 0.15, ease: "power2.out" },
        )
        .to(
          token,
          {
            x: target.left + target.width / 2 - (source.left + source.width / 2 + spread),
            y: target.top + target.height / 2 - (source.top + source.height / 2),
            duration: seconds,
            ease: "power2.inOut",
          },
          0.05,
        )
        /* Up before across: an arc, not a slide. */
        .to(token, { rotate: single ? 0 : 140, duration: seconds }, 0.05)
        .to(
          token,
          { scale: 0.35, opacity: 0, duration: 0.16, ease: "power2.in" },
          0.05 + seconds - 0.1,
        );
    }

    return () => {
      tl.kill();
      el?.removeAttribute("data-earning");
      el?.removeAttribute("data-filling");
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
          {motion === "odometer" || motion === "continuous" ? (
            <Odometer value={display} duration={0.6} />
          ) : (
            <span className="tabular-nums">
              {display.toLocaleString("en-US")}
            </span>
          )}
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
          the marks that fly into the chip take off from this box, which has
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
