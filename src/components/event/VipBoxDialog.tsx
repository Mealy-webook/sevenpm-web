"use client";

import { useId, useState } from "react";

import { Sheet } from "@/components/ui/Sheet";
import type { EventDetails } from "@/data/events";
import { vipBoxCopy } from "@/data/events";

/**
 * Registering interest in a VIP box.
 *
 * A box is arranged, not bought: the visitor says what they need, the team
 * prices it, a quote comes back by email and a payment link follows if they
 * accept. Only the first of those happens here, so the confirmation spells
 * out the rest — otherwise this reads as a purchase that silently failed to
 * produce a ticket.
 *
 * The form asks for as little as will let someone write a quote: who they
 * are, how to reach them, how many are coming and which nights. Everything
 * else is one optional box, because a shopping list of fields is how an
 * enquiry form stops being filled in.
 *
 * Nothing is sent anywhere. There is no endpoint behind this; submitting
 * shows what would happen next and the note says no money moves until a
 * price has been agreed.
 */

type Fields = {
  name: string;
  email: string;
  phone: string;
  company: string;
  guests: string;
  days: string[];
  notes: string;
};

const EMPTY: Fields = {
  name: "",
  email: "",
  phone: "",
  company: "",
  guests: "",
  days: [],
  notes: "",
};

/**
 * A reference the visitor can quote back, derived from what they typed
 * rather than from the clock or a random number — those make the component
 * impure, and a reference that changes on re-render is worse than useless.
 */
function reference(fields: Fields) {
  const seed = `${fields.name}${fields.email}${fields.guests}`;
  let hash = 0x811c9dc5;
  for (let i = 0; i < seed.length; i += 1) {
    hash ^= seed.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return `VIP-${hash.toString(16).toUpperCase().padStart(8, "0").slice(0, 6)}`;
}

export function VipBoxDialog({
  event,
  onClose,
}: {
  event: EventDetails;
  onClose: () => void;
}) {
  const titleId = useId();
  const baseId = useId();
  const [fields, setFields] = useState<Fields>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof Fields, string>>>(
    {},
  );
  const [sent, setSent] = useState<string | null>(null);

  const set = <K extends keyof Fields>(key: K, value: Fields[K]) => {
    setFields((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  };

  const submit = () => {
    const found: Partial<Record<keyof Fields, string>> = {};
    if (!fields.name.trim()) found.name = vipBoxCopy.required;
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(fields.email.trim())) {
      found.email = fields.email.trim()
        ? vipBoxCopy.badEmail
        : vipBoxCopy.required;
    }
    if (!fields.phone.trim()) found.phone = vipBoxCopy.required;
    if (!Number(fields.guests)) found.guests = vipBoxCopy.badGuests;
    if (!fields.days.length) found.days = vipBoxCopy.noDay;

    if (Object.keys(found).length) {
      setErrors(found);
      return;
    }
    setSent(reference(fields));
  };

  return (
    <Sheet
      open
      onClose={onClose}
      title={sent ? vipBoxCopy.sentTitle : vipBoxCopy.title}
      titleId={titleId}
      closeLabel={vipBoxCopy.close}
      footer={
        <div className="px-5 pb-5 pt-2">
          <button
            type="button"
            onClick={sent ? onClose : submit}
            className="flex w-full cursor-pointer items-center justify-center bg-brand px-5 py-4 font-[family-name:var(--font-display)] text-[17px] font-semibold leading-6 text-[#18181b] transition-colors hover:bg-[#fff35a]"
          >
            {sent ? vipBoxCopy.done : vipBoxCopy.submit}
          </button>
        </div>
      }
    >
      {sent ? (
        <div className="flex flex-col gap-4 px-5 py-4">
          <p className="m-0 font-[family-name:var(--font-display)] text-[15px] leading-[22px] tracking-[0.19px] text-content-primary">
            {vipBoxCopy.sentBody(sent)}
          </p>
          {/* What happens after this page, in the order it happens. */}
          <ol className="m-0 flex list-none flex-col gap-3 p-0">
            {vipBoxCopy.steps.map((line, index) => (
              <li key={line} className="flex items-start gap-3">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-white/5 font-[family-name:var(--font-display)] text-[12px] font-semibold leading-4 text-content-primary">
                  {index + 1}
                </span>
                <span className="font-[family-name:var(--font-display)] text-[13px] leading-5 tracking-[0.13px] text-content-secondary">
                  {line}
                </span>
              </li>
            ))}
          </ol>
          <p className="m-0 font-[family-name:var(--font-display)] text-[12px] leading-4 tracking-[0.12px] text-content-secondary">
            {vipBoxCopy.sentNote}
          </p>
        </div>
      ) : (
        <div
          className="flex max-h-[52svh] flex-col gap-4 overflow-y-auto overscroll-contain px-5 py-4"
          data-lenis-prevent
        >
          <p className="m-0 font-[family-name:var(--font-display)] text-[13px] leading-5 tracking-[0.13px] text-content-secondary">
            {vipBoxCopy.intro}
          </p>

          <Field
            id={`${baseId}-name`}
            label={vipBoxCopy.name}
            value={fields.name}
            onChange={(value) => set("name", value)}
            error={errors.name}
            autoComplete="name"
          />
          <Field
            id={`${baseId}-email`}
            label={vipBoxCopy.email}
            type="email"
            value={fields.email}
            onChange={(value) => set("email", value)}
            error={errors.email}
            autoComplete="email"
          />
          <Field
            id={`${baseId}-phone`}
            label={vipBoxCopy.phone}
            type="tel"
            value={fields.phone}
            onChange={(value) => set("phone", value)}
            error={errors.phone}
            autoComplete="tel"
          />
          <Field
            id={`${baseId}-company`}
            label={vipBoxCopy.company}
            hint={vipBoxCopy.companyOptional}
            value={fields.company}
            onChange={(value) => set("company", value)}
            autoComplete="organization"
          />
          <Field
            id={`${baseId}-guests`}
            label={vipBoxCopy.guests}
            type="number"
            value={fields.guests}
            onChange={(value) => set("guests", value)}
            error={errors.guests}
            inputMode="numeric"
          />

          <fieldset className="m-0 flex flex-col gap-2 border-0 p-0">
            <legend className="mb-1 p-0 font-[family-name:var(--font-display)] text-[13px] font-semibold leading-5 tracking-[0.16px] text-content-primary">
              {vipBoxCopy.days}
            </legend>
            <div className="flex flex-wrap gap-2">
              {event.artistDays.map((day) => {
                const on = fields.days.includes(day.id);
                return (
                  <button
                    key={day.id}
                    type="button"
                    role="checkbox"
                    aria-checked={on}
                    onClick={() =>
                      set(
                        "days",
                        on
                          ? fields.days.filter((id) => id !== day.id)
                          : [...fields.days, day.id],
                      )
                    }
                    className={`flex h-10 cursor-pointer items-center border px-4 font-[family-name:var(--font-display)] text-[15px] font-semibold leading-[22px] tracking-[0.19px] transition-colors ${
                      on
                        ? "border-content-primary bg-white/10 text-content-primary"
                        : "border-white/10 bg-white/5 text-content-secondary hover:bg-white/10"
                    }`}
                  >
                    {day.label}
                  </button>
                );
              })}
            </div>
            {errors.days && <Error>{errors.days}</Error>}
          </fieldset>

          <div className="flex flex-col gap-2">
            <label
              htmlFor={`${baseId}-notes`}
              className="font-[family-name:var(--font-display)] text-[13px] font-semibold leading-5 tracking-[0.16px] text-content-primary"
            >
              {vipBoxCopy.notes}
            </label>
            <textarea
              id={`${baseId}-notes`}
              rows={3}
              value={fields.notes}
              onChange={(event_) => set("notes", event_.target.value)}
              placeholder={vipBoxCopy.notesHint}
              className="w-full resize-y border border-white/10 bg-white/5 px-4 py-3 font-[family-name:var(--font-display)] text-[15px] leading-[22px] tracking-[0.19px] text-content-primary outline-none transition-colors placeholder:text-white/30 focus:border-content-primary"
            />
          </div>
        </div>
      )}
    </Sheet>
  );
}

function Error({ children }: { children: React.ReactNode }) {
  return (
    <p
      role="alert"
      className="m-0 font-[family-name:var(--font-display)] text-[12px] leading-4 tracking-[0.12px] text-[#ff6c6c]"
    >
      {children}
    </p>
  );
}

function Field({
  id,
  label,
  hint,
  value,
  onChange,
  error,
  type = "text",
  autoComplete,
  inputMode,
}: {
  id: string;
  label: string;
  hint?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  type?: string;
  autoComplete?: string;
  inputMode?: "numeric";
}) {
  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={id}
        className="flex items-baseline gap-2 font-[family-name:var(--font-display)] text-[13px] font-semibold leading-5 tracking-[0.16px] text-content-primary"
      >
        {label}
        {hint && (
          <span className="font-normal text-content-secondary">{hint}</span>
        )}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        inputMode={inputMode}
        autoComplete={autoComplete}
        aria-invalid={Boolean(error)}
        onChange={(event_) => onChange(event_.target.value)}
        className={`h-12 w-full border bg-white/5 px-4 font-[family-name:var(--font-display)] text-[15px] leading-[22px] tracking-[0.19px] text-content-primary outline-none transition-colors placeholder:text-white/30 ${
          error
            ? "border-[#ff6c6c]"
            : "border-white/10 focus:border-content-primary"
        }`}
      />
      {error && <Error>{error}</Error>}
    </div>
  );
}
