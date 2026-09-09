import Image from "next/image";

import { socialLinks } from "@/data/events";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer>
      {/* Oversized SEVENPM wordmark */}
      <div className="pt-16 xl:pt-24">
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

      <div className="shell flex flex-col items-center justify-center gap-12 py-16 xl:py-24">
        <nav
          aria-label="Social"
          className="flex flex-wrap items-center justify-center gap-8"
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

        <p className="text-center font-[family-name:var(--font-ui)] text-sm leading-[1.5] text-text-secondary">
          © {year} SEVENPM. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
