import Image from "next/image";
import Link from "next/link";

import styles from "./artefacts.module.css";
import {
  festivals,
  galleryRows,
  homeCopy,
  homeStats,
  homeStory,
  newsItems,
} from "@/data/home";

/**
 * Option E: the page as the things you leave a festival holding.
 *
 * A ticket with its stub, a wristband, a row of cassettes, a folded
 * programme, postcards, prints in a sleeve. Every section is an object with
 * the content printed on it, and every object lifts a little under the
 * cursor — the one piece of motion the option uses.
 *
 * It is the warmest of the three and the one that leans hardest on the dark
 * ground: the objects are lit against it rather than pasted onto it.
 */

/** The heading each object gets, stamped rather than set. */
function Stamp({ children }: { children: React.ReactNode }) {
  return (
    <p className="m-0 inline-flex items-center gap-2 border border-white/15 px-3 py-1 font-[family-name:var(--font-display)] text-[11px] font-bold uppercase leading-4 tracking-[2.5px] text-content-secondary">
      {children}
    </p>
  );
}

/** The hero: one admit-one ticket, tear-off stub and all. */
export function ArtefactsHero() {
  return (
    <section className="relative isolate overflow-hidden bg-bg-primary">
      <div className="shell flex min-h-[min(84svh,740px)] items-center py-16 xl:py-24">
        <div
          className={`${styles.stockInk} ${styles.lift} relative mx-auto flex w-full max-w-[1080px] -rotate-1 flex-col text-[#0b0b0e] lg:flex-row`}
        >
          {/* The ticket proper */}
          <div className="flex flex-1 flex-col gap-8 p-7 sm:p-12">
            <div className="flex items-center justify-between gap-4 border-b-2 border-[#0b0b0e]/25 pb-4">
              <span className="font-[family-name:var(--font-display)] text-[12px] font-bold uppercase leading-4 tracking-[3px]">
                Admit one
              </span>
              <span className="font-[family-name:var(--font-display)] text-[12px] font-bold uppercase leading-4 tracking-[3px]">
                Sevenpm · Casablanca
              </span>
            </div>

            <h1 className="m-0 font-daltown text-[clamp(52px,8.5vw,136px)] uppercase leading-[0.84]">
              {homeCopy.heroLead} {homeCopy.heroWords[0]}
              <br />
              <span className="text-[#0b0b0e]/35">
                {homeCopy.heroLead} {homeCopy.heroWords[1]}
              </span>
            </h1>

            <p className="m-0 max-w-[620px] font-[family-name:var(--font-display)] text-[15px] leading-[22px] text-[#0b0b0e]/80">
              {homeCopy.intro}
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="#festivals"
                className="flex items-center justify-center bg-[#0b0b0e] px-6 py-4 font-[family-name:var(--font-display)] text-[15px] font-semibold uppercase leading-[22px] tracking-[1.5px] text-[#f2efe6] transition-colors hover:bg-[#0b0b0e]/85"
              >
                See what is on
              </Link>
              <span
                aria-hidden
                className={`${styles.barcode} h-10 w-[180px] opacity-80`}
              />
            </div>
          </div>

          {/* The stub, torn off down the perforation. */}
          <div
            className={`${styles.perf} flex shrink-0 flex-row items-center justify-between gap-6 p-7 sm:p-10 lg:w-[232px] lg:flex-col lg:items-start`}
          >
            <div className="flex flex-col gap-1">
              <span className="font-[family-name:var(--font-display)] text-[11px] font-bold uppercase leading-4 tracking-[2px] text-[#0b0b0e]/55">
                Season
              </span>
              <span className="font-daltown text-[40px] uppercase leading-[0.9]">
                2026
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-[family-name:var(--font-display)] text-[11px] font-bold uppercase leading-4 tracking-[2px] text-[#0b0b0e]/55">
                Doors
              </span>
              <span className="font-daltown text-[40px] uppercase leading-[0.9]">
                7 PM
              </span>
            </div>
            <span
              aria-hidden
              className={`${styles.barcode} hidden h-[90px] w-full opacity-80 lg:block`}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

/** Everything under the ticket. */
export function ArtefactsSections() {
  const prints = galleryRows[0].slice(0, 4);

  return (
    <>
      {/* The wristband, printed with the figures. */}
      <section className="bg-bg-primary py-10">
        <div className="shell">
          <div
            className={`${styles.band} flex flex-wrap items-center justify-between gap-6 bg-brand px-6 py-4 text-[#0b0b0e]`}
          >
            {homeStats.map((stat) => (
              <span key={stat.label} className="flex items-baseline gap-2">
                <span className="font-daltown text-[28px] uppercase leading-[0.9]">
                  {stat.prefix}
                  {stat.year ? stat.value : stat.value.toLocaleString("en-US")}
                  {stat.suffix}
                </span>
                <span className="font-[family-name:var(--font-display)] text-[12px] font-bold uppercase leading-4 tracking-[1.5px] text-[#0b0b0e]/70">
                  {stat.label}
                </span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* The festivals as cassettes on a shelf. */}
      <section id="festivals" className="bg-bg-primary py-16 xl:py-24">
        <div className="shell flex flex-col gap-10">
          <Stamp>The season</Stamp>

          <ul className="m-0 grid list-none grid-cols-1 gap-6 p-0 sm:grid-cols-2 xl:grid-cols-3">
            {festivals.map((festival, index) => {
              const tilt = ["-rotate-1", "rotate-1", "-rotate-[0.5deg]"];
              return (
                <li key={festival.id}>
                  <Link
                    href={festival.href}
                    className={`${styles.stock} ${styles.lift} flex flex-col gap-4 p-4 text-[#0b0b0e] ${tilt[index % tilt.length]}`}
                    data-cursor="Play"
                  >
                    {/* The label: artwork in the window, spools under it. */}
                    <span className="relative block aspect-[16/10] w-full overflow-hidden bg-[#0b0b0e]">
                      <Image
                        src={festival.poster.src}
                        alt=""
                        fill
                        sizes="(max-width: 640px) 90vw, (max-width: 1280px) 45vw, 30vw"
                        className="object-cover opacity-90"
                      />
                    </span>
                    <span
                      aria-hidden
                      className={`${styles.spools} block h-[26px] w-full opacity-80`}
                    />
                    <span className="flex items-baseline justify-between gap-3 border-t-2 border-[#0b0b0e]/20 pt-3">
                      <span className="font-daltown text-[24px] uppercase leading-[1]">
                        {festival.name}
                      </span>
                      <span className="font-[family-name:var(--font-display)] text-[11px] font-bold uppercase tracking-[2px] text-[#0b0b0e]/55">
                        Side {String.fromCharCode(65 + index)}
                      </span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* The house, as a folded programme. */}
      <section className="bg-bg-primary py-16 xl:py-24">
        <div className="shell flex flex-col gap-10">
          <Stamp>The programme</Stamp>

          <div
            className={`${styles.stock} grid grid-cols-1 gap-0 text-[#0b0b0e] lg:grid-cols-2`}
          >
            <div className="flex flex-col gap-6 p-8 xl:p-12">
              <h2 className="m-0 font-daltown text-[clamp(32px,4vw,56px)] uppercase leading-[0.9]">
                Since 2018
              </h2>
              <p className="m-0 font-[family-name:var(--font-display)] text-[16px] leading-[1.7] text-[#0b0b0e]/80">
                {homeStory.body}
              </p>
              <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
                {homeStory.socials.map((social) => (
                  <li key={social.label}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="flex items-center gap-2 border border-[#0b0b0e]/25 px-3 py-2 font-[family-name:var(--font-display)] text-[12px] font-bold uppercase tracking-[1.5px] transition-colors hover:bg-[#0b0b0e]/10"
                    >
                      <Image
                        src={social.icon}
                        alt=""
                        width={14}
                        height={14}
                        className="size-3.5 invert"
                      />
                      {social.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* The fold: the other half of the sheet, printed dark. */}
            <div className="relative grid grid-cols-2 gap-px bg-[#0b0b0e]/15 p-px">
              {homeStory.photos.concat(prints.slice(0, 2)).map((photo, index) => (
                <span
                  key={`${photo}-${index}`}
                  className="relative aspect-[4/3] w-full overflow-hidden"
                >
                  <Image
                    src={photo}
                    alt=""
                    fill
                    sizes="(max-width: 1024px) 50vw, 25vw"
                    className="object-cover"
                  />
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* The news as postcards, written and stamped. */}
      <section className="bg-bg-primary py-16 xl:py-24">
        <div className="shell flex flex-col gap-10">
          <Stamp>From the road</Stamp>

          <ul className="m-0 grid list-none grid-cols-1 gap-6 p-0 lg:grid-cols-3">
            {newsItems.map((item, index) => {
              const tilt = ["rotate-1", "-rotate-1", "rotate-[0.5deg]"];
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`${styles.stock} ${styles.lift} flex h-full flex-col text-[#0b0b0e] ${tilt[index % tilt.length]}`}
                  >
                    {item.image && (
                      <span className="relative block aspect-[16/9] w-full overflow-hidden">
                        <Image
                          src={item.image}
                          alt=""
                          fill
                          sizes="(max-width: 1024px) 90vw, 30vw"
                          className="object-cover"
                        />
                      </span>
                    )}
                    <span className="flex flex-1 flex-col gap-3 p-5">
                      <span className="flex items-center justify-between gap-3">
                        <span className="font-[family-name:var(--font-display)] text-[11px] font-bold uppercase leading-4 tracking-[2px] text-[#0b0b0e]/55">
                          {item.date}
                        </span>
                        {/* The stamp in the corner of a postcard. */}
                        <span
                          aria-hidden
                          className="flex size-7 items-center justify-center border-2 border-[#0b0b0e]/25 font-daltown text-[12px] uppercase leading-none"
                        >
                          7PM
                        </span>
                      </span>
                      <span className="font-daltown text-[24px] uppercase leading-[0.95]">
                        {item.title}
                      </span>
                      <span className="font-[family-name:var(--font-display)] text-[14px] leading-[21px] text-[#0b0b0e]/70">
                        {item.excerpt}
                      </span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* The photographs as prints in a sleeve. */}
      <section className="bg-bg-primary py-16 xl:py-24">
        <div className="shell flex flex-col gap-10">
          <Stamp>Prints</Stamp>

          <ul className="m-0 flex list-none flex-wrap gap-6 p-0">
            {galleryRows[1].map((src, index) => {
              const tilt = [
                "-rotate-2",
                "rotate-1",
                "-rotate-1",
                "rotate-2",
                "-rotate-[0.5deg]",
                "rotate-[1.5deg]",
              ];
              return (
                <li
                  key={`${src}-${index}`}
                  className={`${styles.stock} ${styles.lift} w-[calc(50%-12px)] p-3 pb-10 lg:w-[calc(33.333%-16px)] ${tilt[index % tilt.length]}`}
                >
                  <span className="relative block aspect-square w-full overflow-hidden">
                    <Image
                      src={src}
                      alt=""
                      fill
                      sizes="(max-width: 1024px) 45vw, 30vw"
                      className="object-cover"
                    />
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* The newsletter as a reply card. */}
      <section className="bg-bg-primary py-16 xl:py-24">
        <div className="shell">
          <div
            className={`${styles.stock} flex flex-col gap-6 border-l-[10px] border-[#0b0b0e] p-8 text-[#0b0b0e] xl:p-12`}
          >
            <span className="font-[family-name:var(--font-display)] text-[11px] font-bold uppercase leading-4 tracking-[2.5px] text-[#0b0b0e]/55">
              Reply card
            </span>
            <h2 className="m-0 font-daltown text-[clamp(32px,5vw,64px)] uppercase leading-[0.9]">
              {homeCopy.newsletter.title}
            </h2>
            <p className="m-0 max-w-[620px] font-[family-name:var(--font-display)] text-[15px] leading-[22px] text-[#0b0b0e]/80">
              {homeCopy.newsletter.body}
            </p>
            {/* No handler: this is a review page, and the live newsletter has
                one already. */}
            <div className="flex flex-col gap-3 sm:flex-row">
              <label className="sr-only" htmlFor="artefacts-newsletter">
                Email address
              </label>
              <input
                id="artefacts-newsletter"
                type="email"
                placeholder="you@example.com"
                className="w-full border-b-2 border-[#0b0b0e]/35 bg-transparent px-1 py-3 font-[family-name:var(--font-display)] text-[17px] leading-6 text-[#0b0b0e] placeholder:text-[#0b0b0e]/40 focus:border-[#0b0b0e] focus:outline-none sm:max-w-[420px]"
              />
              <button
                type="button"
                className="flex shrink-0 items-center justify-center bg-[#0b0b0e] px-8 py-4 font-[family-name:var(--font-display)] text-[15px] font-semibold uppercase leading-[22px] tracking-[1.5px] text-[#f2efe6] transition-colors hover:bg-[#0b0b0e]/85"
              >
                {homeCopy.newsletter.cta}
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
