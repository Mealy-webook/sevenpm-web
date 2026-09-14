"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";

import type { JobRole } from "@/data/careers";
import { applyCopy, careersCopy } from "@/data/careers";

/**
 * Apply dialog, from Figma 2231:10633: a 402px sheet centred over the page,
 * rounded at the top, with the role in the header, the fields stacked in the
 * body and one full-width CTA in the dock.
 *
 * It renders through a portal on `document.body`. That is not optional: the
 * Apply buttons sit inside elements MotionProvider animates, and a
 * transformed ancestor becomes the containing block for `position: fixed`,
 * which trapped the sheet inside the sidebar card.
 *
 * There is no backend yet, so sending composes a pre-filled e-mail to the
 * office rather than posting anywhere — nothing is silently lost, and the day
 * an endpoint exists only `send()` changes.
 */

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Key =
  "firstName" | "lastName" | "email" | "phone" | "city" | "link" | "years";

const EMPTY: Record<Key, string> = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  city: "",
  link: "",
  years: "",
};

/** The comp's field: label as placeholder at rest, floated small once filled. */
function Field({
  id,
  label,
  value,
  onChange,
  type = "text",
  error,
  autoComplete,
  leading,
  trailing,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  error?: string;
  autoComplete?: string;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
}) {
  const filled = value.length > 0;
  return (
    <div className="flex w-full min-w-0 flex-1 flex-col gap-1">
      <div
        className={`flex w-full items-center gap-3 border-[0.5px] bg-white/5 py-3 pl-4 pr-2 transition-colors focus-within:border-content-primary ${
          error ? "border-[#ff6c6c]" : "border-white/10"
        }`}
      >
        {leading}
        <span className="flex h-9 min-w-0 flex-1 flex-col justify-center">
          {filled && (
            <span className="font-[family-name:var(--font-display)] text-[12px] leading-4 tracking-[0.12px] text-content-primary">
              {label}
            </span>
          )}
          <input
            id={id}
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={label}
            autoComplete={autoComplete}
            aria-label={label}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? `${id}-error` : undefined}
            className={`w-full bg-transparent font-[family-name:var(--font-display)] text-content-primary outline-none placeholder:text-content-primary ${
              filled
                ? "text-[15px] font-semibold leading-[22px] tracking-[0.19px]"
                : "text-[17px] leading-6 tracking-[0.085px]"
            }`}
          />
        </span>
        {trailing}
      </div>
      {error && (
        <p
          id={`${id}-error`}
          role="alert"
          className="m-0 font-[family-name:var(--font-display)] text-[13px] leading-5 tracking-[0.13px] text-[#ff6c6c]"
        >
          {error}
        </p>
      )}
    </div>
  );
}

export function ApplyDialog({
  role,
  open,
  onClose,
}: {
  role: JobRole;
  open: boolean;
  onClose: () => void;
}) {
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<Key, string>>>({});
  const [sent, setSent] = useState(false);
  const baseId = useId();
  const closeButton = useRef<HTMLButtonElement>(null);
  const sheet = useRef<HTMLDivElement>(null);

  // Lock the page behind the dialog (which also pauses Lenis) and close on Escape.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    closeButton.current?.focus();
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  const set = (key: Key) => (value: string) => {
    setValues((current) => ({ ...current, [key]: value }));
    // Clear the field's error as soon as it is touched; re-validated on send.
    setErrors((current) =>
      current[key] ? { ...current, [key]: undefined } : current,
    );
  };

  const send = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const next: Partial<Record<Key, string>> = {};
    if (!values.firstName.trim()) next.firstName = applyCopy.errors.required;
    if (!values.lastName.trim()) next.lastName = applyCopy.errors.required;
    if (!values.email.trim()) next.email = applyCopy.errors.required;
    else if (!EMAIL.test(values.email.trim()))
      next.email = applyCopy.errors.email;
    if (!values.link.trim()) next.link = applyCopy.errors.required;
    setErrors(next);
    if (Object.keys(next).length > 0) {
      document.getElementById(`${baseId}-${Object.keys(next)[0]}`)?.focus();
      return;
    }

    const body = [
      `Role: ${role.title} (${role.team}, ${role.type})`,
      "",
      `Name: ${values.firstName} ${values.lastName}`,
      `Email: ${values.email}`,
      values.phone && `Phone: ${applyCopy.dialCode} ${values.phone}`,
      values.city && `City: ${values.city}`,
      `Portfolio / CV: ${values.link}`,
      values.years && `Years in live events: ${values.years}`,
    ]
      .filter(Boolean)
      .join("\n");

    window.location.href = `mailto:${careersCopy.email}?subject=${encodeURIComponent(
      `${role.title} — application from ${values.firstName} ${values.lastName}`,
    )}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[60] flex justify-center overflow-y-auto overscroll-contain bg-black/60 p-3 backdrop-blur-sm"
      data-lenis-prevent
      onMouseDown={(e) => {
        if (!sheet.current?.contains(e.target as Node)) onClose();
      }}
    >
      <div
        ref={sheet}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${baseId}-title`}
        className="my-auto flex h-fit w-full max-w-[402px] flex-col rounded-t-[38px] bg-bg-secondary shadow-[0px_4px_12px_rgba(0,0,0,0.25)]"
      >
        {/* Header */}
        <div className="flex items-start gap-2 rounded-t-[38px] px-5 pt-5 backdrop-blur-[32px]">
          <h2
            id={`${baseId}-title`}
            className="m-0 flex-1 truncate font-[family-name:var(--font-display)] text-[22px] font-bold uppercase leading-7 tracking-[-0.11px] text-content-primary"
          >
            {applyCopy.title}: {role.title}
          </h2>
          <button
            ref={closeButton}
            type="button"
            onClick={onClose}
            aria-label={applyCopy.close}
            className="btn-secondary flex shrink-0 cursor-pointer items-center justify-center p-[10px]"
          >
            <Image
              src="/assets/ic-dialog-close.svg"
              alt=""
              width={20}
              height={20}
              className="size-5"
            />
          </button>
        </div>

        {sent ? (
          <div className="flex flex-col gap-4 px-5 py-6">
            <p className="m-0 font-[family-name:var(--font-display)] text-[22px] font-bold uppercase leading-7 tracking-[-0.11px] text-brand">
              {applyCopy.sentTitle}
            </p>
            <p className="m-0 font-[family-name:var(--font-display)] text-[15px] leading-[22px] tracking-[0.15px] text-content-secondary">
              {applyCopy.sentBody}
            </p>
            <button
              type="button"
              onClick={onClose}
              className="flex cursor-pointer items-center justify-center bg-brand px-5 py-4 font-[family-name:var(--font-display)] text-[17px] font-semibold leading-6 text-[#0b0b0e]"
            >
              {applyCopy.done}
            </button>
          </div>
        ) : (
          <form onSubmit={send} noValidate className="flex flex-col">
            <div className="flex flex-col gap-4 px-5 py-4">
              <div className="flex w-full items-start gap-4">
                <Field
                  id={`${baseId}-firstName`}
                  label={applyCopy.fields.firstName}
                  value={values.firstName}
                  onChange={set("firstName")}
                  autoComplete="given-name"
                  error={errors.firstName}
                />
                <Field
                  id={`${baseId}-lastName`}
                  label={applyCopy.fields.lastName}
                  value={values.lastName}
                  onChange={set("lastName")}
                  autoComplete="family-name"
                  error={errors.lastName}
                />
              </div>

              <Field
                id={`${baseId}-email`}
                label={applyCopy.fields.email}
                value={values.email}
                onChange={set("email")}
                type="email"
                autoComplete="email"
                error={errors.email}
              />

              <Field
                id={`${baseId}-phone`}
                label={applyCopy.fields.phone}
                value={values.phone}
                onChange={set("phone")}
                type="tel"
                autoComplete="tel"
                leading={
                  <span className="btn-secondary flex shrink-0 items-center gap-1 p-3 font-[family-name:var(--font-display)] text-[15px] font-semibold leading-[22px] tracking-[0.19px] text-content-primary">
                    <Image
                      src="/assets/ic-phone-16.svg"
                      alt=""
                      width={16}
                      height={16}
                      className="size-4"
                    />
                    {applyCopy.dialCode}
                  </span>
                }
              />

              <Field
                id={`${baseId}-city`}
                label={applyCopy.fields.city}
                value={values.city}
                onChange={set("city")}
                autoComplete="address-level2"
              />

              <Field
                id={`${baseId}-link`}
                label={applyCopy.fields.link}
                value={values.link}
                onChange={set("link")}
                type="url"
                error={errors.link}
              />

              {/* Years is a picker in the comp, so it stays a select */}
              <div className="select-field w-full">
                <label htmlFor={`${baseId}-years`} className="sr-only">
                  {applyCopy.fields.years}
                </label>
                <select
                  id={`${baseId}-years`}
                  value={values.years}
                  onChange={(e) => set("years")(e.target.value)}
                  className={`h-[60px] w-full appearance-none border-[0.5px] border-white/10 bg-white/5 py-3 pl-4 pr-10 font-[family-name:var(--font-display)] outline-none transition-colors focus:border-content-primary ${
                    values.years
                      ? "text-[15px] font-semibold leading-[22px] tracking-[0.19px] text-content-primary"
                      : "text-[17px] leading-6 tracking-[0.085px] text-content-primary"
                  }`}
                >
                  <option value="">{applyCopy.fields.years}</option>
                  {applyCopy.yearOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Dock */}
            <div className="flex flex-col items-center gap-2 px-5 pb-5 pt-2">
              <button
                type="submit"
                className="flex w-full cursor-pointer items-center justify-center bg-brand px-5 py-4 font-[family-name:var(--font-display)] text-[17px] font-semibold leading-6 text-[#0b0b0e] transition-colors hover:bg-[#fff35a]"
              >
                {applyCopy.submit}
              </button>
              <p className="m-0 text-center font-[family-name:var(--font-display)] text-[12px] leading-4 tracking-[0.12px] text-content-secondary">
                {applyCopy.note}
              </p>
            </div>
          </form>
        )}
      </div>
    </div>,
    document.body,
  );
}
