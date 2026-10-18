"use client";

import Link from "next/link";

import { PhotoSlot } from "@/components/pages/PhotoSlot";
import { DisplayHeading } from "@/components/ui/DisplayHeading";
import { hospitalityCopy, hospitalityPackages } from "@/data/hospitality";

/**
 * Direction I — the poster wall.
 *
 * Each package set as a gig poster and pasted up: portrait, the name filling
 * the sheet in Daltown, the picture behind it, the detail along the foot
 * like a bill. The site is already full of posters — the homepage row, the
 * About index, the festival artwork — so this is the one direction that
 * borrows the festival's own medium rather than a web pattern.
 *
 * The sheets overlap slightly and sit at small alternating angles, the way
 * posters actually go up, and lift square on hover. Nothing rotates on a
 * phone, where a tilted column just looks broken.
 */
export function PosterWall() {
  const { eyebrow, title, from } = hospitalityCopy.packages;

  return (
    <section id="packages" className="relative scroll-mt-24 py-14 xl:py-20">
      <div className="shell flex flex-col gap-10">
        <div className="flex flex-col gap-4">
          <p className="m-0 font-[family-name:var(--font-display)] text-body-s font-semibold uppercase tracking-[1.56px] text-brand">
            {eyebrow}
          </p>
          <DisplayHeading align="left" reveal="clip" size="faq">
            {title}
          </DisplayHeading>
        </div>

        <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 xl:grid-cols-3 xl:gap-8">
          {hospitalityPackages.map((entry, index) => {
            /* Posters go up by hand, so none of them is quite straight. The
               angle is derived from position rather than random, so it is
               the same on the server and the client. */
            const tilt = [-1.4, 0.9, -0.6, 1.3, -1.1][index % 5];

            return (
              <Link
                key={entry.slug}
                href={`/hospitality/${entry.slug}`}
                className="group relative block transition-transform duration-500 sm:[transform:rotate(var(--tilt))] sm:hover:[transform:rotate(0deg)_translateY(-6px)]"
                style={{ "--tilt": `${tilt}deg` } as React.CSSProperties}
              >
                <article
                  className="relative flex aspect-[2/3] flex-col overflow-hidden bg-ink-900 shadow-[0_18px_44px_rgba(0,0,0,0.45)]"
                  style={{ borderRadius: "var(--radius)" }}
                >
                  <PhotoSlot
                    caption={entry.photo}
                    src={entry.image}
                    rounded={false}
                    sizes="(min-width: 1280px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="absolute inset-0 size-full"
                  />

                  {/* The paste-up: dark enough for the bill to read, clear
                      enough that the picture is still the poster. */}
                  <span
                    aria-hidden
                    className="absolute inset-0 block bg-[linear-gradient(to_top,rgba(11,11,14,0.94),rgba(11,11,14,0.5)_38%,rgba(11,11,14,0.12)_70%)]"
                  />

                  <div className="relative mt-auto flex flex-col gap-3 p-5 xl:p-6">
                    <span className="font-[family-name:var(--font-display)] text-caption font-bold uppercase tracking-[3px] text-brand">
                      {entry.festival}
                    </span>

                    <h3 className="display-xs m-0 font-daltown uppercase text-white transition-colors group-hover:text-brand">
                      {entry.name}
                    </h3>

                    {/* The bill along the foot, ruled like a poster's. */}
                    <div className="flex flex-col gap-1 border-t border-white/25 pt-3">
                      <span className="font-[family-name:var(--font-display)] text-body-s font-semibold uppercase tracking-[1.2px] text-white/70">
                        {entry.capacity}
                      </span>
                      <span className="font-[family-name:var(--font-display)] text-body-l font-black text-brand">
                        {from} {entry.price}
                      </span>
                      <span className="font-[family-name:var(--font-ui)] text-caption text-white/50">
                        {entry.perUnit}
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            );
          })}
        </div>

        <p className="m-0 font-[family-name:var(--font-ui)] text-body-s text-white/45">
          {hospitalityCopy.priceNote}
        </p>
      </div>
    </section>
  );
}
