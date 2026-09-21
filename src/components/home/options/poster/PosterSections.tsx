import Image from "next/image";
import Link from "next/link";

import styles from "./poster.module.css";
import {
  festivals,
  galleryRows,
  homeCopy,
  homeStats,
  homeStory,
  newsItems,
} from "@/data/home";

/**
 * Option C, everything under the hero. One printed language throughout: a
 * numbered slug line over every section, hairline rules instead of cards, and
 * the artwork treated as paper that has been pasted, pinned or cut out.
 *
 * Sections stay flat — no shadows except on the paper itself — so the page
 * reads as one printed surface rather than as a stack of components.
 */

/** The slug line a printer sets above a block: number, title, rule. */
function Slug({ number, children }: { number: string; children: React.ReactNode }) {
  return (
    <p className="m-0 flex items-center gap-4 font-[family-name:var(--font-display)] text-[12px] font-bold uppercase leading-4 tracking-[3px] text-content-secondary">
      <span className="text-brand">{number}</span>
      {children}
      <span aria-hidden className="h-px flex-1 bg-white/15" />
    </p>
  );
}

/** Figures set as a press sheet: four cells divided by hairlines. */
export function PosterStats() {
  return (
    <section className={`${styles.wall} border-y border-white/10`}>
      <div className="shell grid grid-cols-1 gap-px bg-white/10 sm:grid-cols-2 xl:grid-cols-4">
        {homeStats.map((stat) => (
          <div
            key={stat.label}
            className={`${styles.wall} flex flex-col gap-2 px-6 py-10`}
          >
            <span className="font-daltown text-[clamp(44px,5vw,64px)] uppercase leading-[0.9] text-white">
              {stat.prefix}
              {stat.year ? stat.value : stat.value.toLocaleString("en-US")}
              {stat.suffix}
            </span>
            <span className="font-[family-name:var(--font-display)] text-[13px] leading-5 tracking-[0.13px] text-content-secondary">
              {stat.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

/** The wall itself: every poster pinned, the name printed under it. */
export function PosterWall() {
  return (
    <section id="festivals" className={`${styles.wall} py-16 xl:py-24`}>
      <div className="shell flex flex-col gap-10">
        <Slug number="01">Festivals</Slug>

        {/* Five posters, one row of five on a wide screen. A fixed 3:4 well
            keeps the bottoms of the sheets on one line — the artwork is
            exported at five different heights. */}
        <ul className="m-0 grid list-none grid-cols-2 gap-x-6 gap-y-10 p-0 sm:grid-cols-3 xl:grid-cols-5">
          {festivals.map((festival, index) => {
            const tilt = [
              "-rotate-[3deg]",
              "rotate-2",
              "-rotate-1",
              "rotate-[3deg]",
              "-rotate-2",
            ];
            return (
              <li key={festival.id} className="flex flex-col gap-4">
                <Link
                  href={festival.href}
                  className={`${styles.pinned} relative block aspect-[3/4] w-full overflow-hidden ${tilt[index % tilt.length]}`}
                  data-cursor="Open"
                >
                  <Image
                    src={festival.poster.src}
                    alt={festival.name}
                    fill
                    sizes="(max-width: 640px) 45vw, (max-width: 1280px) 30vw, 18vw"
                    className="object-cover"
                  />
                </Link>
                <span className="font-daltown text-[clamp(20px,2vw,28px)] uppercase leading-[1] text-white">
                  {festival.name}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

/** The story as a broadsheet: a drop cap, two columns, two pasted prints. */
export function PosterStory() {
  /* A drop cap is one letter. Splitting on a space gave "SEVENPM," set at
     72px, which is a headline with a comma in it. */
  const cap = homeStory.body.slice(0, 1);
  const body = homeStory.body.slice(1);

  return (
    <section className={`${styles.wall} border-t border-white/10 py-16 xl:py-24`}>
      <div className="shell flex flex-col gap-10">
        <Slug number="02">The house</Slug>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
          <div className="flex flex-col gap-8">
            <p className="m-0 font-[family-name:var(--font-display)] text-[17px] leading-[1.7] text-content-primary [&>span:first-child]:float-left [&>span:first-child]:mr-3 [&>span:first-child]:font-daltown [&>span:first-child]:text-[72px] [&>span:first-child]:leading-[0.8] [&>span:first-child]:text-brand">
              <span>{cap}</span>
              {body}
            </p>

            <ul className="m-0 flex list-none flex-wrap gap-3 p-0">
              {homeStory.socials.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="flex items-center gap-2 border border-white/15 px-4 py-2 font-[family-name:var(--font-display)] text-[13px] font-semibold uppercase tracking-[1.3px] text-content-primary transition-colors hover:bg-white/5"
                  >
                    <Image
                      src={social.icon}
                      alt=""
                      width={16}
                      height={16}
                      className="size-4"
                    />
                    {social.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex gap-6">
            {homeStory.photos.map((photo, index) => (
              <div
                key={photo}
                className={`${styles.paper} ${styles.pinned} relative flex-1 p-2 ${
                  index === 0 ? "-rotate-2" : "mt-10 rotate-[2.5deg]"
                }`}
              >
                <div className="relative aspect-[3/4] w-full overflow-hidden">
                  <Image
                    src={photo}
                    alt=""
                    fill
                    sizes="(max-width: 1024px) 45vw, 22vw"
                    className="object-cover"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/** News as cuttings: the date stamped, the headline set, the rest torn off. */
export function PosterClippings() {
  return (
    <section className={`${styles.wall} border-t border-white/10 py-16 xl:py-24`}>
      <div className="shell flex flex-col gap-10">
        <Slug number="03">Latest</Slug>

        <ul className="m-0 grid list-none grid-cols-1 gap-6 p-0 lg:grid-cols-3">
          {newsItems.map((item, index) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`${styles.paper} ${styles.pinned} flex h-full flex-col gap-4 p-5 text-[#0b0b0e] ${
                  index === 1 ? "rotate-[1.5deg]" : "-rotate-1"
                }`}
              >
                <span className="font-[family-name:var(--font-display)] text-[12px] font-bold uppercase leading-4 tracking-[2px] text-[#0b0b0e]/55">
                  {item.date}
                </span>
                <span className="font-daltown text-[26px] uppercase leading-[0.95]">
                  {item.title}
                </span>
                <span className="font-[family-name:var(--font-display)] text-[14px] leading-[21px] text-[#0b0b0e]/70">
                  {item.excerpt}
                </span>
                <span className="mt-auto border-t border-[#0b0b0e]/25 pt-3 font-[family-name:var(--font-display)] text-[12px] font-bold uppercase tracking-[2px]">
                  Read it
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** The photographs as a contact strip, sprockets and all. */
export function PosterContact() {
  const frames = [...galleryRows[0], ...galleryRows[1]];

  return (
    <section className={`${styles.wall} border-t border-white/10 py-16 xl:py-24`}>
      <div className="shell flex flex-col gap-10">
        <Slug number="04">On the night</Slug>
      </div>

      <div className="mt-2 bg-[#0b0b0e] py-3">
        <div aria-hidden className={`${styles.sprockets} h-[10px] w-full opacity-70`} />
        <ul
          className="m-0 flex list-none gap-2 overflow-x-auto p-3"
          data-lenis-prevent
        >
          {frames.map((src, index) => (
            <li key={`${src}-${index}`} className="shrink-0">
              <div className="relative h-[180px] w-[260px] overflow-hidden xl:h-[220px] xl:w-[320px]">
                <Image
                  src={src}
                  alt=""
                  fill
                  sizes="320px"
                  className="object-cover grayscale transition-[filter] duration-500 hover:grayscale-0"
                />
              </div>
            </li>
          ))}
        </ul>
        <div aria-hidden className={`${styles.sprockets} h-[10px] w-full opacity-70`} />
      </div>
    </section>
  );
}

/** The newsletter as a mail-in coupon, cut line and all. */
export function PosterCoupon() {
  return (
    <section className={`${styles.wall} border-t border-white/10 py-16 xl:py-24`}>
      <div className="shell flex flex-col gap-10">
        <Slug number="05">Keep in touch</Slug>

        <div className={`${styles.inked} p-3`}>
          <div className={`${styles.cut} flex flex-col gap-6 p-8 text-[#0b0b0e] xl:p-12`}>
            <h2 className="m-0 font-daltown text-[clamp(36px,6vw,72px)] uppercase leading-[0.9]">
              {homeCopy.newsletter.title}
            </h2>
            <p className="m-0 max-w-[620px] font-[family-name:var(--font-display)] text-[15px] leading-[22px] text-[#0b0b0e]/80">
              {homeCopy.newsletter.body}
            </p>

            {/* No handler: this is a review page, and the live newsletter
                already has one. */}
            <div className="flex flex-col gap-3 sm:flex-row">
              <label className="sr-only" htmlFor="poster-newsletter">
                Email address
              </label>
              <input
                id="poster-newsletter"
                type="email"
                required
                placeholder="you@example.com"
                className="w-full border-2 border-[#0b0b0e]/30 bg-transparent px-4 py-4 font-[family-name:var(--font-display)] text-[15px] leading-[22px] text-[#0b0b0e] placeholder:text-[#0b0b0e]/45 focus:border-[#0b0b0e] focus:outline-none sm:max-w-[420px]"
              />
              <button
                type="submit"
                className="flex shrink-0 items-center justify-center bg-[#0b0b0e] px-8 py-4 font-[family-name:var(--font-display)] text-[15px] font-semibold uppercase leading-[22px] tracking-[1.5px] text-[#f4f1e8] transition-colors hover:bg-[#0b0b0e]/85"
              >
                {homeCopy.newsletter.cta}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
