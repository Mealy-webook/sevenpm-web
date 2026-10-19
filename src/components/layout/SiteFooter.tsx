import Image from "next/image";
import Link from "next/link";

import { FOOTER_LINKS } from "@/data/menu";
import { menuSocialLinks } from "@/data/events";
import { footerCopy } from "@/data/events";

/**
 * Site footer, from the homepage comp's footer (15:202 → 2467:23440).
 *
 * Centred, top to bottom: the oversized wordmark, one row of five links
 * (FOOTER_LINKS — not the drawer's list), the five social links as square
 * tiles, then the copyright beside the WBK credit.
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
              className="link-sweep whitespace-nowrap font-[family-name:var(--font-display)] text-caption font-semibold uppercase tracking-[1.56px] text-text-primary transition-colors hover:text-brand"
            >
              {entry.label}
            </Link>
          ))}
        </nav>

        {/* The five socials as square tiles, as the comp draws them. */}
        <ul className="m-0 flex list-none flex-wrap items-center justify-center gap-4 p-0">
          {menuSocialLinks.map((s) => (
            <li key={s.label}>
              <a
                href={s.href}
                target="_blank"
                rel="noreferrer"
                aria-label={`SEVENPM on ${s.label}`}
                className="flex size-14 items-center justify-center border border-white/10 bg-bg-secondary transition-colors hover:border-white/40"
              >
                <Image src={s.icon} alt="" width={24} height={24} className="size-6" />
              </a>
            </li>
          ))}
        </ul>

        {/* The copyright and the credit on one line, 24 apart. */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          <p className="m-0 text-center font-[family-name:var(--font-ui)] text-body-s text-text-secondary">
            © {year} SEVENPM. All rights reserved.
          </p>

          <p className="m-0 flex items-center gap-2 font-[family-name:var(--font-ui)] text-body-s text-content-primary">
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
