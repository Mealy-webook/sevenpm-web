import Image from "next/image";
import Link from "next/link";

import { hospitalityCopy, hospitalityPackages } from "@/data/hospitality";

/**
 * Hospitality packages on the event page, from Figma 2549:17634.
 *
 * Redrawn since the first pass: it was a centred title over a full-width
 * row, and it is now two columns on a secondary ground — the title and the
 * standfirst held to 403 on the left, the cards running off the right edge.
 *
 * Four cards at 403 with 32 between them come to 1708 against the 821 the
 * comp gives them, and the comp cuts the third mid-card at the frame edge.
 * That is a rail: it scrolls, which is also the only way cards this deep
 * work on a narrow screen.
 *
 * The comp gives three cards the brand-yellow CTA and the fourth a white
 * primary. That reads as an unfinished state rather than intent — the
 * design system's own note on CTA says "use once per view maximum", so
 * three of them is already past that and the odd one out is not a
 * hierarchy. All four take the yellow here; say the word and the fourth
 * goes white.
 */
export function HospitalitySection() {
  const { from } = hospitalityCopy.packages;

  return (
    <section
      id="hospitality"
      className="relative scroll-mt-24 overflow-hidden bg-bg-secondary py-16 xl:py-20"
      aria-labelledby="hospitality-title"
    >
      <div className="shell flex flex-col gap-10 lg:flex-row lg:items-center lg:gap-12">
        {/* The title column, held to the comp's 403. */}
        <div className="flex shrink-0 flex-col gap-2 lg:w-[403px]">
          <h2
            id="hospitality-title"
            /* 120/100 at the comp's frame. It sets as two lines there and
               the measure keeps it that way without a hard break. */
            className="m-0 max-w-[9ch] font-daltown text-[clamp(37px,6.81vw,92px)] uppercase leading-[0.84] tracking-[0.03em] text-white"
            data-reveal="clip"
          >
            Hospitality packages
          </h2>
          <p className="m-0 font-[family-name:var(--font-ui)] text-[14px] leading-[19px] tracking-[0.15px] text-content-secondary">
            {hospitalityCopy.intro}
          </p>
        </div>

        {/* The rail. It runs to the screen edge rather than stopping at the
            shell, which is what the comp draws — so the gutter is padding
            inside the scroller and the overflow is negative margin. */}
        <div className="-mr-[var(--shell-gutter)] min-w-0 flex-1 overflow-x-auto pb-2 pr-[var(--shell-gutter)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <ul className="m-0 flex list-none gap-8 p-0">
            {hospitalityPackages.map((entry) => (
              <li
                key={entry.slug}
                className="w-[78vw] shrink-0 sm:w-[360px] xl:w-[403px]"
              >
                <article className="flex h-full flex-col border border-white/5 bg-bg-tertiary">
                  <div className="relative aspect-[403/268.667] w-full shrink-0 overflow-hidden bg-[#18181b]">
                    <Image
                      src={entry.image}
                      alt=""
                      fill
                      sizes="(min-width: 1280px) 403px, (min-width: 640px) 360px, 78vw"
                      className="object-cover"
                    />
                  </div>

                  <div className="flex flex-1 flex-col gap-6 p-8">
                    <div className="flex flex-col gap-2">
                      <h3 className="m-0 font-daltown text-[clamp(28px,3.39vw,61px)] uppercase leading-[0.84] tracking-[0.02em] text-white">
                        {entry.name}
                      </h3>
                      <p className="m-0 font-[family-name:var(--font-ui)] text-[12px] font-bold uppercase leading-4 tracking-[0.12px] text-content-secondary">
                        {entry.summary}
                      </p>
                    </div>

                    <span aria-hidden className="block h-px w-full bg-white/10" />

                    <div className="mt-auto flex flex-col gap-6">
                      <p className="m-0 flex flex-wrap items-baseline gap-x-1 gap-y-0.5">
                        <span className="font-[family-name:var(--font-display)] text-[16px] leading-6 tracking-[0.085px] text-content-primary">
                          {from}
                        </span>
                        <span className="font-[family-name:var(--font-display)] text-[16px] font-semibold leading-6 text-white">
                          {entry.price}
                        </span>
                        <span className="font-[family-name:var(--font-ui)] text-[14px] leading-[19px] tracking-[0.15px] text-content-secondary">
                          / {entry.perUnit}
                        </span>
                      </p>

                      <Link
                        href={`/hospitality/${entry.slug}`}
                        className="sweep flex w-full items-center justify-center bg-brand px-5 py-4 font-[family-name:var(--font-display)] text-[16px] font-semibold leading-6 text-[#0b0b0e]"
                      >
                        <span className="relative z-10">Request a quote</span>
                      </Link>
                    </div>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
