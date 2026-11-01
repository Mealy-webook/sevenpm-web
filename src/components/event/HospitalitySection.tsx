import Image from "next/image";
import Link from "next/link";

import { hospitalityCopy, hospitalityPackages } from "@/data/hospitality";
import { ScrollRail } from "./ScrollRail";

/**
 * Hospitality packages on the event page, from Figma 2612:5506.
 *
 * Two columns with 48 between them, centred on each other:
 *
 * - on the left, the title (held to 403, so it breaks over two lines) and
 *   the standfirst 8 under it, then 32 below the three promises — a 36 icon
 *   24 from a Title Body heading and a line, divided by hairlines;
 * - on the right, this festival's package cards, 403 wide with 32 between,
 *   running off the right edge of the screen.
 *
 * On desktop the cards come past by scrolling: the section holds still once
 * it is wholly in view, so the first card is read before anything moves,
 * and the rail slides until the last card has arrived. On a phone the
 * columns stack and the rail is swiped.
 *
 * The comp's third promise reads "A dedicated contact One person from our
 * team…" — the title pasted into the body. The body here is the
 * hospitality page's own, without the repeat.
 */
export function HospitalitySection({ festival }: { festival: string }) {
  const { from } = hospitalityCopy.packages;
  /* This festival's packages only — the comp's four are Jazzablanca's, and
     Tanjazz VIP has no place on Jazzablanca's page. */
  const packages = hospitalityPackages.filter((entry) => entry.festival === festival);
  if (packages.length === 0) return null;

  return (
    <section
      id="hospitality"
      className="relative scroll-mt-24 overflow-hidden py-16 xl:py-20"
      aria-labelledby="hospitality-title"
    >
      <div className="shell flex flex-col gap-12 lg:flex-row lg:items-center">
        <div className="flex min-w-0 flex-1 flex-col gap-8">
          <div className="flex flex-col gap-2">
            <h2
              id="hospitality-title"
              /* 120/100 at the comp's frame, two lines on the 403 measure. */
              className="section-title max-w-[403px] text-white"
              data-reveal="clip"
            >
              Hospitality packages
            </h2>
            <p className="m-0 font-[family-name:var(--font-display)] text-body text-content-secondary">
              {hospitalityCopy.intro}
            </p>
          </div>

          {/* The three promises */}
          <ul className="m-0 flex list-none flex-col gap-6 p-0" data-reveal="up" data-reveal-stagger>
            {hospitalityCopy.highlights.map((item, index) => (
              <li
                key={item.title}
                className={`flex items-start gap-6 ${index > 0 ? "border-t border-white/10 pt-6" : ""}`}
              >
                <Image
                  /* The comp's 36 cut of the hospitality page's 48 icon. */
                  src={item.icon.replace("-48.svg", "-36.svg")}
                  alt=""
                  width={36}
                  height={36}
                  className="size-9 shrink-0"
                />
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <h3 className="m-0 font-[family-name:var(--font-display)] text-title-body font-bold uppercase tracking-[-0.09px] text-white">
                    {item.title}
                  </h3>
                  <p className="m-0 font-[family-name:var(--font-display)] text-body text-content-secondary">
                    {item.body}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* The rail. It runs to the screen edge rather than stopping at the
            shell, which is what the comp draws — so the gutter is padding
            inside the scroller and the overflow is negative margin. */}
        <ScrollRail
          pin
          className="-mr-[var(--shell-gutter)] min-w-0 flex-1 overflow-x-auto pb-2 pr-[var(--shell-gutter)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          <ul className="m-0 flex list-none gap-8 p-0">
            {packages.map((entry) => (
              <li
                key={entry.slug}
                className="w-[78vw] shrink-0 sm:w-[360px] xl:w-[403px]"
              >
                <article className="flex h-full flex-col border border-white/5 bg-bg-tertiary">
                  <div className="relative aspect-[401/268.667] w-full shrink-0 overflow-hidden bg-[#18181b]">
                    <Image
                      src={entry.image}
                      alt=""
                      fill
                      sizes="(min-width: 1280px) 403px, (min-width: 640px) 360px, 78vw"
                      className="object-cover"
                    />
                  </div>

                  <div className="flex flex-1 flex-col gap-6 p-6">
                    <div className="flex flex-col gap-2">
                      <h3 className="m-0 font-[family-name:var(--font-display)] text-title-section font-bold uppercase tracking-[-0.11px] text-content-primary">
                        {entry.name}
                      </h3>
                      <p className="m-0 font-[family-name:var(--font-display)] text-body text-content-secondary">
                        {entry.summary}
                      </p>
                    </div>

                    <span aria-hidden className="block h-px w-full bg-white/10" />

                    <div className="mt-auto flex flex-col gap-6">
                      <p className="m-0 flex flex-wrap items-baseline gap-x-1 gap-y-0.5">
                        <span className="font-[family-name:var(--font-display)] text-body-l text-content-primary">
                          {from}
                        </span>
                        <span className="font-[family-name:var(--font-display)] text-body-l font-semibold text-white">
                          {entry.price}
                        </span>
                        <span className="font-[family-name:var(--font-display)] text-body text-content-secondary">
                          / {entry.perUnit}
                        </span>
                      </p>

                      <Link
                        href={`/hospitality/${entry.slug}`}
                        className="sweep flex w-full items-center justify-center bg-brand px-5 py-4 font-[family-name:var(--font-display)] text-body-l font-semibold text-[#0b0b0e]"
                      >
                        <span className="relative z-10">Request a quote</span>
                      </Link>
                    </div>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </ScrollRail>
      </div>
    </section>
  );
}
