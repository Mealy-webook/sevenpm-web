"use client";

import Link from "next/link";
import { useState } from "react";

import { PhotoSlot } from "@/components/pages/PhotoSlot";
import { DisplayHeading } from "@/components/ui/DisplayHeading";
import { hospitalityCopy, hospitalityPackages } from "@/data/hospitality";

/**
 * Direction S — the difference.
 *
 * Every other direction describes what hospitality is. This one shows what
 * it is instead of: the same evening in two columns, general admission on
 * the left and the package on the right, line for line.
 *
 * It is the only direction aimed at a reader who has not decided they want
 * hospitality at all, and it is the most persuasive and the most dangerous
 * for the same reason — it makes a claim about the standard ticket. The
 * left-hand column is therefore written about festivals in general rather
 * than about Jazzablanca's own general admission, which nothing in the
 * project describes. Replace it with the real comparison before this ships.
 */

/* Deliberately generic. See the note above: these are the ordinary
   conditions of a standing ticket anywhere, not claims about this
   festival's. */
const ROWS = [
  {
    label: "Where you stand",
    general: "Wherever the crowd lets you, from the time you arrive.",
    better: (capacity: string) => `A space held for your party — ${capacity.toLowerCase()}.`,
  },
  {
    label: "Getting in",
    general: "The main gate, with everyone else.",
    better: () => "A separate entrance, away from the queue.",
  },
  {
    label: "Food and drink",
    general: "Bar queues between sets.",
    better: () => "Served where you are, through the night.",
  },
  {
    label: "Afterwards",
    general: "Finding your car with the rest of the site.",
    better: () => "Parking on site, held for your party.",
  },
  {
    label: "Who looks after you",
    general: "Nobody in particular.",
    better: () => "One contact, from the quote to the last call.",
  },
];

export function TheDifference() {
  const { eyebrow, from, discover } = hospitalityCopy.packages;
  const [index, setIndex] = useState(0);
  const entry = hospitalityPackages[index];

  return (
    <section id="packages" className="relative scroll-mt-24 py-14 xl:py-20">
      <div className="shell flex flex-col gap-9">
        <div className="flex flex-col gap-4">
          <p className="m-0 font-[family-name:var(--font-display)] text-[13px] font-semibold uppercase leading-4 tracking-[1.56px] text-brand">
            {eyebrow}
          </p>
          <DisplayHeading align="left" reveal="clip" size="faq">
            The same night, twice
          </DisplayHeading>
          <p className="m-0 max-w-[620px] font-[family-name:var(--font-ui)] text-[16px] leading-[1.7] text-content-secondary">
            What a standing ticket gets you, and what the package does
            instead.
          </p>
        </div>

        <div
          role="group"
          aria-label="Choose a package to compare"
          className="flex flex-wrap gap-2"
        >
          {hospitalityPackages.map((item, i) => (
            <button
              key={item.slug}
              type="button"
              aria-pressed={i === index}
              onClick={() => setIndex(i)}
              className={`border px-4 py-2.5 font-[family-name:var(--font-display)] text-[15px] leading-5 transition-colors ${
                i === index
                  ? "border-brand bg-brand font-semibold text-[#18181b]"
                  : "border-white/20 text-white/80 hover:border-white/50"
              }`}
            >
              {item.name}
            </button>
          ))}
        </div>

        <div className="grid gap-5 lg:grid-cols-2 lg:gap-8">
          {/* General admission. */}
          <div className="flex flex-col">
            <div className="flex flex-col gap-1 border-b border-white/15 pb-4">
              <span className="font-[family-name:var(--font-display)] text-[12px] font-bold uppercase leading-4 tracking-[3px] text-white/40">
                Standing ticket
              </span>
              <h3 className="m-0 font-daltown text-[clamp(24px,3.4vw,40px)] uppercase leading-[0.95] text-white/55">
                General admission
              </h3>
            </div>
            <dl className="m-0 flex flex-col">
              {ROWS.map((row) => (
                <div
                  key={row.label}
                  className="flex flex-col gap-1 border-b border-white/10 py-4"
                >
                  <dt className="m-0 font-[family-name:var(--font-ui)] text-[13px] leading-5 text-white/35">
                    {row.label}
                  </dt>
                  <dd className="m-0 font-[family-name:var(--font-ui)] text-[15px] leading-[1.6] text-white/55">
                    {row.general}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* The package. */}
          <div
            className="flex flex-col border border-brand/50 p-5 xl:p-6"
            style={{ borderRadius: "var(--radius)" }}
          >
            <div className="flex flex-col gap-3 border-b border-white/15 pb-4">
              <PhotoSlot
                key={entry.slug}
                caption={entry.photo}
                src={entry.image}
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="aspect-[3/1] w-full"
              />
              <span className="font-[family-name:var(--font-display)] text-[12px] font-bold uppercase leading-4 tracking-[3px] text-brand">
                {entry.festival} · hospitality
              </span>
              <h3 className="m-0 font-daltown text-[clamp(24px,3.4vw,40px)] uppercase leading-[0.95] text-white">
                {entry.name}
              </h3>
            </div>

            <dl className="m-0 flex flex-col" aria-live="polite">
              {ROWS.map((row) => (
                <div
                  key={row.label}
                  className="flex flex-col gap-1 border-b border-white/10 py-4"
                >
                  <dt className="m-0 font-[family-name:var(--font-ui)] text-[13px] leading-5 text-white/45">
                    {row.label}
                  </dt>
                  <dd className="m-0 flex items-start gap-2.5 font-[family-name:var(--font-ui)] text-[15px] leading-[1.6] text-white">
                    <span aria-hidden className="mt-0.5 shrink-0 text-brand">
                      ✓
                    </span>
                    {row.better(entry.capacity)}
                  </dd>
                </div>
              ))}
            </dl>

            <div className="flex flex-wrap items-end gap-5 pt-5">
              <div className="flex flex-col gap-0.5">
                <span className="font-[family-name:var(--font-ui)] text-[13px] leading-5 text-white/45">
                  {from}
                </span>
                <span className="font-[family-name:var(--font-display)] text-[22px] font-black leading-7 text-brand">
                  {entry.price}
                </span>
                <span className="font-[family-name:var(--font-ui)] text-[13px] leading-5 text-white/45">
                  {entry.perUnit}
                </span>
              </div>
              <Link
                href={`/hospitality/${entry.slug}`}
                className="sweep flex items-center bg-brand px-5 py-3.5 font-[family-name:var(--font-display)] text-[15px] font-semibold leading-6 text-[#0b0b0e]"
              >
                <span className="relative z-10">{discover}</span>
              </Link>
            </div>
          </div>
        </div>

        <p className="m-0 font-[family-name:var(--font-ui)] text-[14px] leading-[1.6] text-white/45">
          {hospitalityCopy.priceNote}
        </p>
      </div>
    </section>
  );
}
