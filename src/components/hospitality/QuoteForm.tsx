"use client";

import Link from "next/link";
import { useId, useState } from "react";

import { DisplayHeading } from "@/components/ui/DisplayHeading";
import { hospitalityCopy, hospitalityPackages } from "@/data/hospitality";

const FIELD =
  "w-full border border-white/20 bg-black/30 px-4 py-3 font-[family-name:var(--font-display)] text-[16px] leading-6 text-white placeholder:text-white/30 focus:border-white/60 focus:outline-none focus:ring-2 focus:ring-brand";
const LABEL =
  "font-[family-name:var(--font-display)] text-[14px] font-semibold leading-5 text-white";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <span className={LABEL}>{label}</span>
      {children}
    </div>
  );
}

/**
 * "Tell us about your group", from page three of the mockup.
 *
 * Shared by the hospitality index and every package page; `selected` presets
 * the package dropdown so arriving from a card does not ask the visitor to
 * choose the thing they just clicked.
 *
 * Nothing is sent — there is no backend behind this build.
 */
export function QuoteForm({
  selected,
  /**
   * Render the fields alone, without the section wrapper, the eyebrow and
   * the heading. The redesigned page puts the form inside its own closing
   * band, which already carries all three — without this it would have
   * announced itself twice and nested a section inside a section.
   */
  bare = false,
}: {
  selected?: string;
  bare?: boolean;
}) {
  const { quote } = hospitalityCopy;
  const [sent, setSent] = useState(false);
  const ids = {
    pkg: useId(),
    nights: useId(),
    guests: useId(),
    budget: useId(),
    name: useId(),
    company: useId(),
    email: useId(),
    phone: useId(),
    ice: useId(),
    notes: useId(),
    consent: useId(),
  };

  const form = (
        <form
          data-reveal="up"
          onSubmit={(event) => {
            event.preventDefault();
            setSent(true);
          }}
          className={
            bare
              ? "flex flex-col gap-6"
              : "flex flex-col gap-6 border border-white/10 bg-ink-900 p-6 xl:p-9"
          }
          style={bare ? undefined : { borderRadius: "var(--radius)" }}
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Package">
              <select
                id={ids.pkg}
                name="package"
                defaultValue={selected}
                className={FIELD}
              >
                {hospitalityPackages.map((entry) => (
                  <option key={entry.slug} value={entry.name}>
                    {entry.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Nights">
              <select id={ids.nights} name="nights" className={FIELD}>
                <option value="">Choose…</option>
                {quote.nights.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </Field>
            <Field label="Number of guests">
              <input
                id={ids.guests}
                name="guests"
                type="number"
                min={1}
                required
                className={FIELD}
              />
            </Field>
            <Field label="Indicative budget">
              <select id={ids.budget} name="budget" className={FIELD}>
                {quote.budgets.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </Field>
            <Field label="Full name">
              <input id={ids.name} name="name" required className={FIELD} />
            </Field>
            <Field label="Company">
              <input id={ids.company} name="company" className={FIELD} />
            </Field>
            <Field label="Work email">
              <input
                id={ids.email}
                name="email"
                type="email"
                required
                className={FIELD}
              />
            </Field>
            <Field label="Phone">
              <input id={ids.phone} name="phone" type="tel" className={FIELD} />
            </Field>
          </div>

          <Field label="ICE (for the invoice, optional)">
            <input id={ids.ice} name="ice" className={FIELD} />
          </Field>

          <Field label="Anything we should know?">
            <textarea
              id={ids.notes}
              name="notes"
              rows={4}
              placeholder="Occasion, dietary needs, accessibility…"
              className={`${FIELD} resize-y`}
            />
          </Field>

          <label
            className="flex cursor-pointer items-start gap-3 font-[family-name:var(--font-ui)] text-[14px] leading-[1.6] text-content-secondary"
            htmlFor={ids.consent}
          >
            <input
              id={ids.consent}
              name="consent"
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
              className="sweep flex items-center bg-brand px-5 py-4 font-[family-name:var(--font-display)] text-[16px] font-semibold leading-6 text-[#0b0b0e]"
            >
              <span className="relative z-10">
                {sent ? "Noted" : quote.submit}
              </span>
            </button>
            <p
              role="status"
              className="m-0 font-[family-name:var(--font-ui)] text-[14px] leading-5 text-white/45"
            >
              {sent ? quote.sent : " "}
            </p>
          </div>
        </form>
  );

  if (bare) return form;

  return (
    <section id="quote" className="relative scroll-mt-24 py-14 xl:py-20">
      <div className="shell grid gap-10 lg:grid-cols-[minmax(0,340px)_1fr] lg:gap-16">
        <div className="flex flex-col gap-5">
          <p
            className="m-0 font-[family-name:var(--font-display)] text-[13px] font-semibold uppercase leading-4 tracking-[1.56px] text-brand"
            data-reveal="up"
          >
            {quote.eyebrow}
          </p>
          <DisplayHeading align="left" reveal="clip" size="faq">
            {quote.title}
          </DisplayHeading>
          <p className="m-0 font-[family-name:var(--font-ui)] text-[16px] leading-[1.7] text-content-secondary">
            {quote.body}
          </p>
        </div>

        {form}
      </div>
    </section>
  );
}
