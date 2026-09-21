import Image from "next/image";
import Link from "next/link";

import styles from "./broadcast.module.css";
import {
  festivals,
  galleryRows,
  homeCopy,
  homeStats,
  homeStory,
  newsItems,
} from "@/data/home";

/**
 * Option D: the page as a night's programme.
 *
 * The name is a time, so the page is read as a schedule. Every section is a
 * slot with a timecode against it, running down a rail on the left; the hero
 * is the top of the hour with the house line on air; and a strip of running
 * text sits between slots the way a channel runs its own listings.
 *
 * The timecodes are the design's own, not data — they say "this page is a
 * programme" and nothing more. They start at seven.
 */

/** One slot in the schedule: timecode and title on the rail, content beside. */
function Slot({
  time,
  title,
  children,
  id,
}: {
  time: string;
  title: string;
  children: React.ReactNode;
  id?: string;
}) {
  return (
    <section id={id} className="border-t border-white/10">
      <div className="shell grid grid-cols-1 gap-8 py-14 lg:grid-cols-[168px_1fr] lg:gap-12 xl:py-20">
        <div className="flex flex-row items-baseline gap-4 lg:flex-col lg:items-start lg:gap-3">
          <span className="font-daltown text-[32px] uppercase leading-[0.9] text-brand">
            {time}
          </span>
          <span className="font-[family-name:var(--font-display)] text-[12px] font-bold uppercase leading-4 tracking-[3px] text-content-secondary">
            {title}
          </span>
          <span
            aria-hidden
            className={`${styles.rail} hidden w-px flex-1 self-stretch lg:block`}
          />
        </div>
        <div className="min-w-0">{children}</div>
      </div>
    </section>
  );
}

/** The strip between slots. Doubled so the loop has no seam. */
function Ticker({ items }: { items: string[] }) {
  const run = [...items, ...items];
  return (
    <div className="overflow-hidden border-y border-white/10 bg-brand py-2">
      <div className={`${styles.ticker} flex w-max items-center gap-10`}>
        {run.map((item, index) => (
          <span
            key={`${item}-${index}`}
            className="flex items-center gap-10 whitespace-nowrap font-[family-name:var(--font-display)] text-[13px] font-bold uppercase leading-5 tracking-[2px] text-[#0b0b0e]"
          >
            {item}
            <span aria-hidden className="size-[6px] bg-[#0b0b0e]" />
          </span>
        ))}
      </div>
    </div>
  );
}

/** 19:00 — the top of the hour. */
export function BroadcastHero() {
  return (
    <section className="relative isolate border-b border-white/10 bg-bg-primary">
      <div className="shell flex min-h-[min(82svh,720px)] flex-col justify-center gap-10 py-16 xl:py-20">
        {/* Channel strip */}
        <div className="flex flex-wrap items-center gap-4 border-b border-white/10 pb-5">
          <span className="flex items-center gap-2 bg-[#ff3c3c]/10 px-3 py-1">
            <span aria-hidden className={`${styles.onair} size-2 bg-[#ff3c3c]`} />
            <span className="font-[family-name:var(--font-display)] text-[12px] font-bold uppercase leading-4 tracking-[2px] text-[#ff3c3c]">
              On air
            </span>
          </span>
          <span className="font-[family-name:var(--font-display)] text-[12px] font-bold uppercase leading-4 tracking-[3px] text-content-secondary">
            Casablanca · every night from seven
          </span>
          <span
            aria-hidden
            className={`${styles.level} ml-auto hidden h-5 items-end gap-[3px] xl:flex`}
          >
            {[0, 1, 2, 3, 4].map((bar) => (
              <span key={bar} className="block h-full w-[3px] bg-brand" />
            ))}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_340px] lg:items-end lg:gap-16">
          <div className="flex flex-col gap-6">
            <span className="font-daltown text-[clamp(64px,9vw,132px)] uppercase leading-[0.82] text-white">
              19:00
            </span>
            <h1 className="m-0 font-daltown text-[clamp(40px,6vw,92px)] uppercase leading-[0.86] text-white">
              {homeCopy.heroLead} {homeCopy.heroWords[0]}
              <br />
              <span className="text-brand">
                {homeCopy.heroLead} {homeCopy.heroWords[1]}
              </span>
            </h1>
            <p
              className="m-0 max-w-[620px] font-[family-name:var(--font-display)] text-[15px] leading-[24px] text-content-secondary"
              data-split="lines"
            >
              {homeCopy.intro}
            </p>
          </div>

          {/* Tonight's listing, printed like a channel guide. */}
          <div className="border border-white/10 bg-bg-secondary p-5">
            <p className="m-0 mb-4 font-[family-name:var(--font-display)] text-[12px] font-bold uppercase leading-4 tracking-[3px] text-content-secondary">
              Coming up
            </p>
            <ol className="m-0 flex list-none flex-col p-0">
              {festivals.slice(0, 4).map((festival, index) => (
                <li
                  key={festival.id}
                  className="flex items-baseline gap-4 border-t border-white/10 py-3 first:border-t-0"
                >
                  <span className="font-[family-name:var(--font-display)] text-[13px] font-semibold leading-5 tabular-nums text-brand">
                    {19 + index}:30
                  </span>
                  <Link
                    href={festival.href}
                    className="flex-1 font-[family-name:var(--font-display)] text-[15px] leading-[22px] text-content-primary transition-colors hover:text-brand"
                  >
                    {festival.name}
                  </Link>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}

/** The rest of the programme. */
export function BroadcastSchedule() {
  const frames = galleryRows[0];

  return (
    <>
      <Ticker
        items={[
          "More music more life",
          "Four festivals a year",
          "Casablanca · Tangier · Taghazout",
          "Tickets on sale now",
        ]}
      />

      {/* 19:15 — the figures, read out as a bulletin. */}
      <Slot time="19:15" title="The numbers">
        <dl className="m-0 grid grid-cols-1 gap-px bg-white/10 sm:grid-cols-2 xl:grid-cols-4">
          {homeStats.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col gap-2 bg-bg-primary px-5 py-6"
            >
              <dt className="order-2 font-[family-name:var(--font-display)] text-[13px] leading-5 text-content-secondary">
                {stat.label}
              </dt>
              <dd className="order-1 m-0 font-daltown text-[clamp(36px,4vw,52px)] uppercase leading-[0.9] text-white">
                {stat.prefix}
                {stat.year ? stat.value : stat.value.toLocaleString("en-US")}
                {stat.suffix}
              </dd>
            </div>
          ))}
        </dl>
      </Slot>

      {/* 19:30 — the line-up, as a channel guide with the artwork behind it. */}
      <Slot time="19:30" title="Line-up" id="festivals">
        <ul className="m-0 flex list-none flex-col p-0">
          {festivals.map((festival, index) => (
            <li key={festival.id} className="border-b border-white/10">
              <Link
                href={festival.href}
                className="group flex items-center gap-6 py-5 transition-colors hover:bg-white/[0.03]"
                data-cursor="Open"
              >
                <span className="w-[56px] shrink-0 font-[family-name:var(--font-display)] text-[13px] font-semibold leading-5 tabular-nums text-brand">
                  {19 + index}:30
                </span>
                <span className="flex-1 font-daltown text-[clamp(24px,3.2vw,44px)] uppercase leading-[1] text-white transition-colors group-hover:text-brand">
                  {festival.name}
                </span>
                <span
                  className={`${styles.monitor} relative hidden h-[84px] w-[120px] shrink-0 overflow-hidden xl:block`}
                >
                  <Image
                    src={festival.poster.src}
                    alt=""
                    fill
                    sizes="120px"
                    className="object-cover"
                  />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Slot>

      {/* 20:00 — the house, as an interview with timecodes down the side. */}
      <Slot time="20:00" title="The house">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_320px] lg:gap-12">
          <div className="flex flex-col gap-6">
            <p className="m-0 font-[family-name:var(--font-display)] text-[clamp(18px,2vw,24px)] leading-[1.6] text-content-primary">
              {homeStory.body}
            </p>
            <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
              {homeStory.socials.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="flex items-center gap-2 border border-white/10 bg-white/5 px-3 py-2 font-[family-name:var(--font-display)] text-[12px] font-bold uppercase tracking-[1.5px] text-content-primary transition-colors hover:bg-white/10"
                  >
                    <Image
                      src={social.icon}
                      alt=""
                      width={14}
                      height={14}
                      className="size-3.5"
                    />
                    {social.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex gap-4">
            {homeStory.photos.map((photo) => (
              <span
                key={photo}
                className={`${styles.monitor} relative aspect-[3/4] flex-1 overflow-hidden`}
              >
                <Image
                  src={photo}
                  alt=""
                  fill
                  sizes="(max-width: 1024px) 45vw, 160px"
                  className="object-cover"
                />
              </span>
            ))}
          </div>
        </div>
      </Slot>

      {/* 20:30 — the news, read as bulletins. */}
      <Slot time="20:30" title="Bulletin">
        <ul className="m-0 flex list-none flex-col p-0">
          {newsItems.map((item) => (
            <li key={item.href} className="border-b border-white/10">
              <Link
                href={item.href}
                className="group grid grid-cols-1 gap-3 py-6 sm:grid-cols-[132px_1fr] sm:gap-8"
              >
                <span className="font-[family-name:var(--font-display)] text-[12px] font-bold uppercase leading-5 tracking-[2px] text-content-secondary">
                  {item.date}
                </span>
                <span className="flex flex-col gap-2">
                  <span className="font-[family-name:var(--font-display)] text-[clamp(17px,2vw,22px)] font-bold uppercase leading-[1.25] tracking-[-0.1px] text-white transition-colors group-hover:text-brand">
                    {item.title}
                  </span>
                  <span className="font-[family-name:var(--font-display)] text-[14px] leading-[22px] text-content-secondary">
                    {item.excerpt}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Slot>

      {/* 21:00 — the monitor wall. */}
      <Slot time="21:00" title="Feeds">
        <ul className="m-0 grid list-none grid-cols-2 gap-3 p-0 lg:grid-cols-5">
          {frames.map((src, index) => (
            <li
              key={src}
              className={`${styles.monitor} relative aspect-[4/3] overflow-hidden`}
            >
              <Image
                src={src}
                alt=""
                fill
                sizes="(max-width: 1024px) 50vw, 20vw"
                className="object-cover"
              />
              <span className="absolute left-2 top-2 z-[1] bg-[#0b0b0e]/70 px-2 py-1 font-[family-name:var(--font-display)] text-[10px] font-bold uppercase leading-3 tracking-[1.5px] text-brand">
                Cam {index + 1}
              </span>
            </li>
          ))}
        </ul>
      </Slot>

      <Ticker
        items={[
          "Subscribe for the announcements",
          "New dates every season",
          "Sevenpm",
          "More music more life",
        ]}
      />

      {/* 22:00 — sign-off. */}
      <Slot time="22:00" title="Sign off">
        <div className="flex flex-col gap-6 border border-white/10 bg-bg-secondary p-6 xl:p-10">
          <h2 className="m-0 font-daltown text-[clamp(32px,5vw,64px)] uppercase leading-[0.9] text-white">
            {homeCopy.newsletter.title}
          </h2>
          <p className="m-0 max-w-[620px] font-[family-name:var(--font-display)] text-[15px] leading-[22px] text-content-secondary">
            {homeCopy.newsletter.body}
          </p>
          {/* No handler: this is a review page, and the live newsletter has
              one already. */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <label className="sr-only" htmlFor="broadcast-newsletter">
              Email address
            </label>
            <input
              id="broadcast-newsletter"
              type="email"
              placeholder="you@example.com"
              className="w-full border border-white/15 bg-white/5 px-4 py-4 font-[family-name:var(--font-display)] text-[15px] leading-[22px] text-content-primary placeholder:text-content-secondary focus:border-brand focus:outline-none sm:max-w-[420px]"
            />
            <button
              type="button"
              className="flex shrink-0 items-center justify-center bg-brand px-8 py-4 font-[family-name:var(--font-display)] text-[15px] font-semibold uppercase leading-[22px] tracking-[1.5px] text-[#18181b] transition-colors hover:bg-[#fff35a]"
            >
              {homeCopy.newsletter.cta}
            </button>
          </div>
        </div>
      </Slot>
    </>
  );
}
