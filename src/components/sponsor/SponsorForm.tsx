"use client";

import Link from "next/link";
import { useId, useState } from "react";

import { DisplayHeading } from "@/components/ui/DisplayHeading";
import { sponsorCopy } from "@/data/sponsor";
import { ChipGroup } from "./ChipGroup";

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
 * The partnership enquiry, from page three of the mockup.
 *
 * Nothing is sent — there is no backend behind this build — so the button
 * acknowledges in place and says so, the same as every other form on the
 * site. Point `onSubmit` at the real endpoint and delete the notice.
 */
export function SponsorForm() {
  const { form } = sponsorCopy;
  const [sent, setSent] = useState(false);
  const ids = {
    name: useId(),
    job: useId(),
    company: useId(),
    industry: useId(),
    email: useId(),
    phone: useId(),
    product: useId(),
    budget: useId(),
    timeline: useId(),
    project: useId(),
    consent: useId(),
  };

  return (
    <section
      id="partnership-form"
      className="relative scroll-mt-24 py-14 xl:py-20"
    >
      <div className="shell grid gap-10 lg:grid-cols-[minmax(0,380px)_1fr] lg:gap-16">
        {/* The ask, and the way round the form for anyone who would rather
            just talk to a person. */}
        <div className="flex flex-col gap-6">
          <p
            className="m-0 font-[family-name:var(--font-display)] text-[13px] font-semibold uppercase leading-4 tracking-[1.56px] text-brand"
            data-reveal="up"
          >
            {form.eyebrow}
          </p>
          <DisplayHeading align="left" reveal="clip" size="faq">
            {form.title}
          </DisplayHeading>
          <p className="m-0 font-[family-name:var(--font-ui)] text-[16px] leading-[1.7] text-content-secondary">
            {form.body}
          </p>

          <div
            data-reveal="up"
            className="flex flex-col items-start gap-2 border border-white/10 bg-ink-900 p-6"
            style={{ borderRadius: "var(--radius)" }}
          >
            <h3 className="m-0 font-[family-name:var(--font-display)] text-[17px] font-bold leading-6 text-white">
              {form.direct.title}
            </h3>
            <p className="m-0 font-[family-name:var(--font-ui)] text-[14px] leading-5 text-content-secondary">
              {form.direct.team}
            </p>
            {/* Bracketed because it is not confirmed yet — so it is not a
                mailto: that would bounce. */}
            <p className="m-0 font-[family-name:var(--font-display)] text-[15px] font-semibold leading-6 text-brand">
              {form.direct.email}
            </p>
            <p className="m-0 font-[family-name:var(--font-ui)] text-[14px] leading-5 text-white/45">
              {form.direct.phone}
            </p>
            <Link
              href="/contact"
              className="btn-secondary mt-3 flex items-center border border-white/25 px-4 py-2.5 font-[family-name:var(--font-display)] text-[15px] font-semibold leading-6 text-white transition-colors hover:border-white/60"
            >
              {form.direct.label}
            </Link>
          </div>
        </div>

        <form
          data-reveal="up"
          onSubmit={(event) => {
            event.preventDefault();
            setSent(true);
          }}
          className="flex flex-col gap-6 border border-white/10 bg-ink-900 p-6 xl:p-9"
          style={{ borderRadius: "var(--radius)" }}
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Full name">
              <input id={ids.name} name="name" required className={FIELD} />
            </Field>
            <Field label="Job title">
              <input id={ids.job} name="job" className={FIELD} />
            </Field>
            <Field label="Company">
              <input
                id={ids.company}
                name="company"
                required
                className={FIELD}
              />
            </Field>
            <Field label="Industry">
              <select id={ids.industry} name="industry" className={FIELD}>
                <option value="">Choose…</option>
                {form.industries.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
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

          <ChipGroup
            name="festival"
            legend="Festival"
            options={form.festivals}
            defaultValue={form.festivals[0]}
          />
          <ChipGroup
            name="goals"
            legend="Your goals (choose several)"
            options={form.goals}
            multiple
          />
          <ChipGroup
            name="audience"
            legend="Target audience"
            options={form.audiences}
            multiple
          />

          <Field label="Product or service to showcase">
            <input
              id={ids.product}
              name="product"
              placeholder="e.g. a new car model, a banking app, a drink"
              className={FIELD}
            />
          </Field>

          <ChipGroup
            name="formats"
            legend="Formats you are interested in"
            options={form.formats}
            multiple
          />

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Indicative budget">
              <select id={ids.budget} name="budget" className={FIELD}>
                {form.budgets.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </Field>
            <Field label="Decision timeline">
              <select id={ids.timeline} name="timeline" className={FIELD}>
                <option value="">Choose…</option>
                {form.timelines.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </Field>
          </div>

          <Field label="Your project in a few words">
            <textarea
              id={ids.project}
              name="project"
              rows={4}
              placeholder="Idea of experience, constraints, key dates…"
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
              {form.consent}{" "}
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
                {sent ? "Noted" : form.submit}
              </span>
            </button>
            <p
              role="status"
              className="m-0 font-[family-name:var(--font-ui)] text-[14px] leading-5 text-white/45"
            >
              {sent ? form.sent : form.reply}
            </p>
          </div>
        </form>
      </div>
    </section>
  );
}
