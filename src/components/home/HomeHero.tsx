import Image from "next/image";

import { homeCopy } from "@/data/home";

/**
 * Homepage hero, from Figma 2078:44133. "MORE MUSIC MORE LIFE" is Daltown
 * 260/208 over two lines (a 786 × 416 text box) and ships as artwork; the
 * little yellow equaliser in the bottom-right corner is the comp's four bars,
 * kept moving.
 */
export function HomeHero() {
  const art = homeCopy.heroTitleArt;

  return (
    <section className="relative">
      <div className="shell relative flex flex-col items-start gap-6 pb-16 pt-6 xl:pb-24 xl:pt-[79px]">
        <h1
          className="display-box w-full max-w-[786px] justify-start"
          data-reveal="clip"
          style={
            {
              "--display-line-box": `${art.lineBox}px`,
              "--display-art-width": `${art.width}px`,
            } as React.CSSProperties
          }
        >
          <Image
            src={art.src}
            alt={homeCopy.heroTitle}
            width={art.width}
            height={art.height}
            priority
            unoptimized
            style={{ height: "auto" }}
          />
        </h1>
        <p
          className="max-w-[786px] font-[family-name:var(--font-display)] text-[18px] leading-[1.6] text-content-secondary"
          data-reveal="up"
          data-reveal-delay="0.12"
        >
          {homeCopy.intro}
        </p>

        <div
          className="eq-bars absolute bottom-16 right-[var(--shell-gutter)] hidden items-end gap-0.5 xl:flex"
          aria-hidden
        >
          <span style={{ "--h": "6px", "--d": "0s" } as React.CSSProperties} />
          <span
            style={{ "--h": "16px", "--d": "-0.4s" } as React.CSSProperties}
          />
          <span
            style={{ "--h": "12px", "--d": "-0.8s" } as React.CSSProperties}
          />
          <span
            style={{ "--h": "2px", "--d": "-1.2s" } as React.CSSProperties}
          />
        </div>
      </div>
    </section>
  );
}
