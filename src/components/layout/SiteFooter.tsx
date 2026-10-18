import Image from "next/image";
import Link from "next/link";

import { FOOTER_LINKS } from "@/data/menu";
import { footerCopy } from "@/data/events";

/**
 * Site footer, from Figma 2542:15137 (2467:23439).
 *
 * Three things, centred: the oversized wordmark, one row of the menu, and
 * the copyright beside the WBK credit.
 *
 * The row is the drawer's five entries (`FOOTER_LINKS` is derived from
 * `MENU_LINKS`), by request — it used to carry the comp's own eight.
 *
 * No nested festivals and no social links. Both were here and neither is in
 * the comp; a footer that re-states the drawer's hierarchy is repeating it
 * rather than summarising it, and the socials are now listed in the menu
 * alone.
 */
export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer>
      {/* The wordmark, full width of the column. */}
      <div className="pt-16 xl:pt-20">
        <div className="shell" data-reveal="clip">
          <Image
            src="/assets/wordmark.svg"
            alt="SEVENPM"
            width={1272}
            height={238}
            className="h-auto w-full"
            data-parallax="0.06"
          />
        </div>
      </div>

      <div className="shell flex flex-col items-center justify-center gap-10 py-10">
        {/* One flat row, 32 apart, centred. Wraps rather than scrolls:
            eight labels at this size fit two comfortable lines on a phone. */}
        <nav
          aria-label="Site"
          className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3"
        >
          {FOOTER_LINKS.map((entry) => (
            <Link
              key={entry.label}
              href={entry.href}
              className="link-sweep whitespace-nowrap font-[family-name:var(--font-display)] text-[12px] font-semibold uppercase leading-[1.2] tracking-[1.56px] text-text-primary transition-colors hover:text-brand"
            >
              {entry.label}
            </Link>
          ))}
        </nav>

        {/* The copyright and the credit on one line, 24 apart. */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          <p className="m-0 text-center font-[family-name:var(--font-ui)] text-[13px] leading-[1.5] text-text-secondary">
            © {year} SEVENPM. All rights reserved.
          </p>

          <p className="m-0 flex items-center gap-2 font-[family-name:var(--font-ui)] text-[13px] leading-[1.5] text-content-primary">
            {footerCopy.poweredBy}
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
    </footer>
  );
}
