"use client";

import Link from "next/link";
import { useState } from "react";

import { PhotoSlot } from "@/components/pages/PhotoSlot";
import { DisplayHeading } from "@/components/ui/DisplayHeading";
import { hospitalityCopy, hospitalityPackages } from "@/data/hospitality";

/**
 * Direction U — form first.
 *
 * The page inverted. Nothing here is bought online: every path through every
 * other direction ends at the same short form, so this one opens with it and
 * puts the packages underneath as reference.
 *
 * The argument is that a visitor arriving from a sales email already knows
 * what they want and is looking for the way to ask. Making them scroll a
 * catalogue first is making them pass the thing they came for. The packages
 * are still all there, just below the ask rather than in front of it.
 *
 * The risk, stated plainly: it asks for commitment before it has made any
 * case, so it is the worst of the directions for a visitor who arrived
 * curious. It is the best for one who arrived decided.
 *
 * Nothing is sent — there is no backend behind this build.
 */
const FIELD =
  "w-full border border-white/20 bg-black/30 px-4 py-3 font-[family-name:var(--font-display)] text-body text-white placeholder:text-white/30 focus:border-white/60 focus:outline-none focus:ring-2 focus:ring-brand";

export function QuoteFirst() {
  const { quote, packages, priceNote } = hospitalityCopy;
  const [sent, setSent] = useState(false);

  return (
    <section id="packages" className="relative scroll-mt-24 py-14 xl:py-20">
      <div className="shell flex flex-col gap-14">
        {/* The ask. */}
        <div className="grid gap-8 lg:grid-cols-[1fr_minmax(0,500px)] lg:gap-14">
          <div className="flex flex-col gap-5">
            <p className="m-0 font-[family-name:var(--font-display)] text-body-s font-semibold uppercase tracking-[1.56px] text-brand">
              {quote.eyebrow}
            </p>
            <DisplayHeading align="left" reveal="clip" size="faq">
              Tell us the night
            </DisplayHeading>
            <p className="m-0 max-w-[480px] font-[family-name:var(--font-ui)] text-body text-content-secondary">
              {quote.body} If you already know which space you want, say so —
              if not, leave it and we will suggest one.
            </p>
            <p className="m-0 font-[family-name:var(--font-ui)] text-body-s text-white/45">
              {priceNote}
            </p>
          </div>

          <form
            onSubmit={(event) => {
              event.preventDefault();
              setSent(true);
            }}
            className="flex flex-col gap-4 border border-white/15 bg-ink-900 p-6 xl:p-8"
            style={{ borderRadius: "var(--radius)" }}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="flex flex-col gap-2">
                <span className="font-[family-name:var(--font-display)] text-body-s font-semibold text-white">
                  Festival
                </span>
                <select name="festival" className={FIELD}>
                  <option>Jazzablanca</option>
                  <option>Tanjazz</option>
                </select>
              </label>
              <label className="flex flex-col gap-2">
                <span className="font-[family-name:var(--font-display)] text-body-s font-semibold text-white">
                  Guests
                </span>
                <input name="guests" type="number" min={1} required className={FIELD} />
              </label>
              <label className="flex flex-col gap-2">
                <span className="font-[family-name:var(--font-display)] text-body-s font-semibold text-white">
                  Nights
                </span>
                <select name="nights" className={FIELD}>
                  {quote.nights.map((n) => (
                    <option key={n}>{n}</option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col gap-2">
                <span className="font-[family-name:var(--font-display)] text-body-s font-semibold text-white">
                  Space (optional)
                </span>
                <select name="package" className={FIELD} defaultValue="">
                  <option value="">Suggest one for me</option>
                  {hospitalityPackages.map((p) => (
                    <option key={p.slug}>{p.name}</option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col gap-2 sm:col-span-2">
                <span className="font-[family-name:var(--font-display)] text-body-s font-semibold text-white">
                  Work email
                </span>
                <input name="email" type="email" required className={FIELD} />
              </label>
            </div>

            <label className="flex cursor-pointer items-start gap-3 font-[family-name:var(--font-ui)] text-body-s text-content-secondary">
              <input
                type="checkbox"
                required
                className="mt-0.5 size-4 shrink-0 accent-brand"
              />
              <span>
                {quote.consent}{" "}
                <Link
                  href="/privacy"
                  className="text-brand underline underline-offset-2"
                >
                  Privacy policy
                </Link>
              </span>
            </label>

            <div className="flex flex-wrap items-center gap-4">
              <button
                type="submit"
                className="sweep flex items-center bg-brand px-5 py-3.5 font-[family-name:var(--font-display)] text-body font-semibold text-[#0b0b0e]"
              >
                <span className="relative z-10">
                  {sent ? "Noted" : quote.submit}
                </span>
              </button>
              <p
                role="status"
                className="m-0 font-[family-name:var(--font-ui)] text-body-s text-white/45"
              >
                {sent ? quote.sent : " "}
              </p>
            </div>
          </form>
        </div>

        {/* The reference, underneath. */}
        <div className="flex flex-col gap-5 border-t border-white/12 pt-10">
          <h3 className="m-0 font-[family-name:var(--font-display)] text-caption font-bold uppercase tracking-[3px] text-white/45">
            The spaces, for reference
          </h3>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-5">
            {hospitalityPackages.map((entry) => (
              <Link
                key={entry.slug}
                href={`/hospitality/${entry.slug}`}
                className="group flex flex-col gap-2.5"
              >
                <PhotoSlot
                  caption={entry.photo}
                  src={entry.image}
                  sizes="(min-width: 1280px) 20vw, (min-width: 640px) 50vw, 100vw"
                  className="aspect-[4/3] w-full"
                />
                <span className="font-[family-name:var(--font-display)] text-body font-bold text-white transition-colors group-hover:text-brand">
                  {entry.name}
                </span>
                <span className="font-[family-name:var(--font-ui)] text-body-s text-content-secondary">
                  {entry.capacity}
                </span>
                <span className="font-[family-name:var(--font-display)] text-body font-semibold text-brand">
                  {packages.from} {entry.price}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
