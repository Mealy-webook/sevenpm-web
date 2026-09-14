"use client";

import { useId, useRef, useState } from "react";

import type { JobRole } from "@/data/careers";
import { applyCopy, careersCopy } from "@/data/careers";

/**
 * Job application form. There is no backend yet, so submitting composes a
 * pre-filled e-mail to the office rather than posting anywhere — nothing is
 * silently lost, and the form is ready to point at an endpoint the day one
 * exists (swap the `onSubmit` body for a fetch).
 *
 * Fields are grouped into the account cards, validated on submit, and each
 * error is announced next to its field.
 */

type Field =
  | "firstName"
  | "lastName"
  | "email"
  | "phone"
  | "city"
  | "link"
  | "experience"
  | "notes"
  | "years"
  | "source"
  | "consent";

type Values = Record<Exclude<Field, "consent">, string> & { consent: boolean };

const EMPTY: Values = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  city: "",
  link: "",
  experience: "",
  notes: "",
  years: "",
  source: "",
  consent: false,
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const fieldClass =
  "w-full border border-white/10 bg-white/5 px-4 py-3 font-[family-name:var(--font-display)] text-[15px] leading-[22px] tracking-[0.15px] text-content-primary transition-colors placeholder:text-content-secondary/60 focus:border-content-primary focus:outline-none";

export function ApplicationForm({ role }: { role: JobRole }) {
  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [sent, setSent] = useState(false);
  const baseId = useId();
  const summary = useRef<HTMLDivElement>(null);

  const set = (field: Exclude<Field, "consent">) => (value: string) =>
    setValues((current) => ({ ...current, [field]: value }));

  const validate = () => {
    const next: Partial<Record<Field, string>> = {};
    if (!values.firstName.trim()) next.firstName = applyCopy.errors.required;
    if (!values.lastName.trim()) next.lastName = applyCopy.errors.required;
    if (!values.email.trim()) next.email = applyCopy.errors.required;
    else if (!EMAIL.test(values.email.trim()))
      next.email = applyCopy.errors.email;
    if (!values.link.trim()) next.link = applyCopy.errors.required;
    if (!values.experience.trim()) next.experience = applyCopy.errors.required;
    if (!values.consent) next.consent = applyCopy.errors.consent;
    return next;
  };

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length > 0) {
      const first = document.getElementById(
        `${baseId}-${Object.keys(next)[0]}`,
      );
      first?.focus();
      return;
    }

    const body = [
      `Role: ${role.title} (${role.team}, ${role.type})`,
      "",
      `Name: ${values.firstName} ${values.lastName}`,
      `Email: ${values.email}`,
      values.phone && `Phone: ${values.phone}`,
      values.city && `City: ${values.city}`,
      `Portfolio / CV: ${values.link}`,
      values.years && `Experience: ${values.years}`,
      "",
      "Festivals and venues worked on:",
      values.experience,
      values.notes && `\nAnything else:\n${values.notes}`,
      values.source && `\nHeard about us via: ${values.source}`,
    ]
      .filter(Boolean)
      .join("\n");

    window.location.href = `mailto:${careersCopy.email}?subject=${encodeURIComponent(
      `${role.title} — application from ${values.firstName} ${values.lastName}`,
    )}&body=${encodeURIComponent(body)}`;

    setSent(true);
    requestAnimationFrame(() =>
      summary.current?.scrollIntoView({ behavior: "smooth", block: "center" }),
    );
  };

  if (sent) {
    return (
      <div
        ref={summary}
        className="flex flex-col gap-4 border border-white/5 bg-bg-secondary p-8"
        role="status"
      >
        <h2 className="m-0 font-[family-name:var(--font-display)] text-[26px] font-bold uppercase leading-8 tracking-[-0.13px] text-brand">
          {applyCopy.sentTitle}
        </h2>
        <p className="m-0 max-w-[560px] font-[family-name:var(--font-display)] text-[17px] leading-7 tracking-[0.085px] text-content-secondary">
          {applyCopy.sentBody}
        </p>
        <button
          type="button"
          onClick={() => {
            setValues(EMPTY);
            setSent(false);
          }}
          className="btn-secondary mt-2 flex cursor-pointer items-center justify-center self-start px-5 py-4 font-[family-name:var(--font-display)] text-[17px] font-semibold leading-6 text-content-primary"
        >
          <span className="flex h-5 items-center">{applyCopy.sentAgain}</span>
        </button>
      </div>
    );
  }

  const label = (field: Field, text: string, required = false) => (
    <label
      htmlFor={`${baseId}-${field}`}
      className="font-[family-name:var(--font-display)] text-[13px] font-semibold uppercase leading-5 tracking-[1.56px] text-content-secondary"
    >
      {text}
      {required && (
        <span aria-hidden className="text-brand">
          {" *"}
        </span>
      )}
    </label>
  );

  const error = (field: Field) =>
    errors[field] ? (
      <p
        id={`${baseId}-${field}-error`}
        role="alert"
        className="m-0 font-[family-name:var(--font-display)] text-[13px] leading-5 tracking-[0.13px] text-[#ff6c6c]"
      >
        {errors[field]}
      </p>
    ) : null;

  const describedBy = (field: Field) =>
    errors[field] ? `${baseId}-${field}-error` : undefined;

  const card = (title: string, children: React.ReactNode) => (
    <fieldset className="m-0 flex flex-col gap-5 border border-white/5 p-6">
      <legend className="float-left mb-2 w-full font-[family-name:var(--font-display)] text-[18px] font-bold uppercase leading-6 tracking-[-0.09px] text-content-primary">
        {title}
      </legend>
      {children}
    </fieldset>
  );

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-6">
      {card(
        applyCopy.about,
        <>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              {label("firstName", applyCopy.fields.firstName, true)}
              <input
                id={`${baseId}-firstName`}
                name="firstName"
                autoComplete="given-name"
                value={values.firstName}
                onChange={(e) => set("firstName")(e.target.value)}
                aria-invalid={Boolean(errors.firstName)}
                aria-describedby={describedBy("firstName")}
                className={fieldClass}
              />
              {error("firstName")}
            </div>
            <div className="flex flex-col gap-2">
              {label("lastName", applyCopy.fields.lastName, true)}
              <input
                id={`${baseId}-lastName`}
                name="lastName"
                autoComplete="family-name"
                value={values.lastName}
                onChange={(e) => set("lastName")(e.target.value)}
                aria-invalid={Boolean(errors.lastName)}
                aria-describedby={describedBy("lastName")}
                className={fieldClass}
              />
              {error("lastName")}
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              {label("email", applyCopy.fields.email, true)}
              <input
                id={`${baseId}-email`}
                name="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                value={values.email}
                onChange={(e) => set("email")(e.target.value)}
                aria-invalid={Boolean(errors.email)}
                aria-describedby={describedBy("email")}
                className={fieldClass}
              />
              {error("email")}
            </div>
            <div className="flex flex-col gap-2">
              {label("phone", applyCopy.fields.phone)}
              <input
                id={`${baseId}-phone`}
                name="phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                value={values.phone}
                onChange={(e) => set("phone")(e.target.value)}
                className={fieldClass}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            {label("city", applyCopy.fields.city)}
            <input
              id={`${baseId}-city`}
              name="city"
              autoComplete="address-level2"
              placeholder={applyCopy.placeholders.city}
              value={values.city}
              onChange={(e) => set("city")(e.target.value)}
              className={fieldClass}
            />
          </div>
        </>,
      )}

      {card(
        applyCopy.work,
        <>
          <div className="flex flex-col gap-2">
            {label("link", applyCopy.fields.link, true)}
            <input
              id={`${baseId}-link`}
              name="link"
              type="url"
              inputMode="url"
              placeholder={applyCopy.placeholders.link}
              value={values.link}
              onChange={(e) => set("link")(e.target.value)}
              aria-invalid={Boolean(errors.link)}
              aria-describedby={describedBy("link")}
              className={fieldClass}
            />
            {error("link")}
            <p className="m-0 font-[family-name:var(--font-display)] text-[13px] leading-5 tracking-[0.13px] text-content-secondary">
              {applyCopy.cvNote}
            </p>
          </div>

          <div className="flex flex-col gap-2">
            {label("years", applyCopy.fields.years)}
            <div className="select-field">
              <select
                id={`${baseId}-years`}
                name="years"
                value={values.years}
                onChange={(e) => set("years")(e.target.value)}
                className={`${fieldClass} appearance-none pr-10`}
              >
                <option value="">{applyCopy.placeholders.select}</option>
                {applyCopy.yearOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            {label("experience", applyCopy.fields.experience, true)}
            <textarea
              id={`${baseId}-experience`}
              name="experience"
              rows={5}
              placeholder={applyCopy.placeholders.experience}
              value={values.experience}
              onChange={(e) => set("experience")(e.target.value)}
              aria-invalid={Boolean(errors.experience)}
              aria-describedby={describedBy("experience")}
              className={`${fieldClass} resize-y`}
            />
            {error("experience")}
          </div>
        </>,
      )}

      {card(
        applyCopy.extra,
        <>
          <div className="flex flex-col gap-2">
            {label("notes", applyCopy.fields.notes)}
            <textarea
              id={`${baseId}-notes`}
              name="notes"
              rows={4}
              value={values.notes}
              onChange={(e) => set("notes")(e.target.value)}
              className={`${fieldClass} resize-y`}
            />
          </div>

          <div className="flex flex-col gap-2">
            {label("source", applyCopy.fields.source)}
            <div className="select-field">
              <select
                id={`${baseId}-source`}
                name="source"
                value={values.source}
                onChange={(e) => set("source")(e.target.value)}
                className={`${fieldClass} appearance-none pr-10`}
              >
                <option value="">{applyCopy.placeholders.select}</option>
                {applyCopy.sourceOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-start gap-3">
              <input
                id={`${baseId}-consent`}
                name="consent"
                type="checkbox"
                checked={values.consent}
                onChange={(e) =>
                  setValues((current) => ({
                    ...current,
                    consent: e.target.checked,
                  }))
                }
                aria-invalid={Boolean(errors.consent)}
                aria-describedby={describedBy("consent")}
                className="mt-1 size-5 shrink-0 cursor-pointer accent-[#fbeb1c]"
              />
              <label
                htmlFor={`${baseId}-consent`}
                className="cursor-pointer font-[family-name:var(--font-display)] text-[15px] leading-[22px] tracking-[0.15px] text-content-secondary"
              >
                {applyCopy.consent}
              </label>
            </div>
            {error("consent")}
          </div>
        </>,
      )}

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          data-magnetic="0.15"
          className="sweep flex cursor-pointer items-center justify-center bg-brand px-5 py-4 font-[family-name:var(--font-display)] text-[17px] font-semibold leading-6 text-[#0b0b0e]"
        >
          <span className="relative z-10">{applyCopy.submit}</span>
        </button>
        <p className="m-0 max-w-[380px] font-[family-name:var(--font-display)] text-[13px] leading-5 tracking-[0.13px] text-content-secondary">
          {applyCopy.submitNote}
        </p>
      </div>
    </form>
  );
}
