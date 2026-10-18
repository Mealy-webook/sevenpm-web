import Image from "next/image";
import Link from "next/link";

import type { Festival } from "@/data/home";
import { festivalsRowOrder, homeCopy } from "@/data/home";

/**
 * Upcoming events — the double bill.
 *
 * The section used to be a row built for four or more: a pinned track that
 * scrubbed sideways past posters running off the page. With two festivals
 * on the programme there was nothing to scrub, and two square covers sat on
 * the left of a full-screen section with the right half empty.
 *
 * So it is now a bill with two names on it. The column splits into two
 * panels, one per festival, each taking its colour from its own poster —
 * blown up and blurred behind it — with the poster in front as a sleeve and
 * the record behind. Hovering (or focusing) one widens it, pulls its record
 * out and sets it turning, and drops the other to luminosity, the treatment
 * the festival posters have always used for the one you are not looking at.
 * The split is the design: it only works because there are exactly two.
 *
 * Only a festival with an event page links anywhere. Tanjazz has none yet,
 * so it says tickets are coming rather than linking to `#`.
 *
 * Below `lg` the panels stack and nothing widens — there is no hover on a
 * phone, and a panel that grows on tap would hide the other one.
 */
export function FestivalsRow({ festivals }: { festivals: Festival[] }) {
  const bill = festivalsRowOrder
    .map((id) => festivals.find((f) => f.id === id))
    .filter((f): f is Festival => Boolean(f?.card));

  const cities = [...new Set(bill.map((f) => f.city).filter(Boolean))];

  return (
    <section
      id="festivals"
      aria-labelledby="festivals-title"
      className="relative py-16 xl:py-20"
    >
      <div className="shell flex flex-col gap-8 xl:gap-12">
        <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
          <h2
            id="festivals-title"
            className="section-title text-white"
            data-reveal="clip"
          >
            {homeCopy.festivalsTitle}
          </h2>
          <p
            className="m-0 font-[family-name:var(--font-display)] text-[13px] uppercase leading-5 tracking-[0.12em] text-text-secondary"
            data-reveal="up"
          >
            {String(bill.length).padStart(2, "0")} festivals ·{" "}
            {cities.join(" · ")}
          </p>
        </div>

        <ul
          className="bill m-0 flex list-none flex-col gap-4 p-0 lg:h-[clamp(560px,46vw,700px)] lg:flex-row"
          data-reveal="up"
          data-reveal-stagger
        >
          {bill.map((festival, index) => (
            <BillPanel key={festival.id} festival={festival} index={index} />
          ))}
        </ul>
      </div>
    </section>
  );
}

function BillPanel({ festival, index }: { festival: Festival; index: number }) {
  const live = festival.href !== "#";
  const card = festival.card as string;
  /* The two lean apart, like bills pasted either side of a door. */
  const lean = index % 2 === 0 ? -2.5 : 2.5;

  return (
    <li
      className="bill-panel group relative isolate flex min-h-[600px] flex-1 overflow-hidden bg-ink-900 lg:min-h-0"
      style={{ "--lean": `${lean}deg` } as React.CSSProperties}
    >
      {/* The panel's colour: its own poster, blown up and blurred. */}
      <Image
        src={card}
        alt=""
        fill
        sizes="50vw"
        className="bill-tint -z-20 scale-125 object-cover opacity-60"
        aria-hidden
      />
      <span
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-t from-black/90 via-black/45 to-black/25"
      />

      {/* Above the panel-wide link below, but click-through, so the panel
          is one big target and only the button answers on its own. */}
      <div className="pointer-events-none relative z-10 flex w-full flex-col justify-between gap-6 p-6 xl:p-8">
        {/* The billing line. */}
        <div className="flex items-start justify-between gap-4">
          <span className="font-daltown text-[40px] leading-[32px] text-brand">
            {String(index + 1).padStart(2, "0")}
          </span>
          {festival.edition ? (
            <span className="border border-white/15 bg-black/30 px-3 py-1.5 font-[family-name:var(--font-display)] text-[12px] font-medium uppercase leading-4 tracking-[0.1em] text-text-primary">
              {festival.edition}
            </span>
          ) : null}
        </div>

        {/* Sleeve and record. The pair is pulled left of centre by as much
            as the record shows, so it reads as one centred object at rest
            and with the record out. */}
        <div className="flex flex-1 items-center justify-center">
          <div className="bill-stage relative size-[min(340px,72vw)] lg:size-[min(360px,24vw)]">
            <span aria-hidden className="bill-record absolute inset-[3%]">
              <span className="bill-record-disc absolute inset-0 rounded-full">
                <span className="absolute inset-[32%] overflow-hidden rounded-full">
                  <Image
                    src={card}
                    alt=""
                    fill
                    sizes="120px"
                    className="bill-art object-cover"
                  />
                </span>
                <span className="absolute inset-[48.5%] rounded-full bg-[#0b0b0e]" />
              </span>
            </span>
            <span className="bill-sleeve absolute inset-0 shadow-[0_24px_60px_rgba(0,0,0,0.55)]">
              <Image
                src={card}
                alt={`${festival.name} poster`}
                fill
                sizes="(min-width: 1024px) 360px, 72vw"
                className="bill-art object-cover"
              />
            </span>
          </div>
        </div>

        {/* Name, when, where, and the way in. */}
        <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-4">
          <div className="flex min-w-0 flex-col gap-2">
            <h3 className="card-title text-white">{festival.name}</h3>
            <p className="m-0 font-[family-name:var(--font-display)] text-[15px] leading-[22px] text-text-secondary">
              {[festival.when, festival.city].filter(Boolean).join(" · ")}
            </p>
          </div>
          {live ? (
            <Link
              href={festival.href}
              className="sweep pointer-events-auto shrink-0 bg-brand px-5 py-4 font-[family-name:var(--font-display)] text-[16px] font-semibold leading-6 text-[#0b0b0e] after:!bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              <span className="relative z-10">Get tickets</span>
            </Link>
          ) : (
            <span className="shrink-0 border border-white/15 bg-white/5 px-5 py-4 font-[family-name:var(--font-display)] text-[16px] font-semibold leading-6 text-text-secondary">
              Tickets soon
            </span>
          )}
        </div>
      </div>

      {live ? (
        /* The whole panel goes to the event, not just the button. Hidden
           from the keyboard and screen readers: the button is the link. */
        <Link
          href={festival.href}
          aria-hidden
          tabIndex={-1}
          className="absolute inset-0"
        />
      ) : null}
    </li>
  );
}
