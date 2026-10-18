"use client";

import { useId, useState } from "react";

import { contactCopy } from "@/data/pages";

/**
 * The contact form.
 *
 * It opens on the question the six lines answer — what is it about? — as a
 * row of chips, one per line. Picking a tile above sets the same chip, so
 * the visitor chooses once and the form is already addressed.
 *
 * Nothing is sent. There is no backend behind this build, so the button
 * acknowledges in place and says as much — the same honesty the newsletter
 * block on the homepage keeps. Wire `onSubmit` to the real endpoint and
 * delete the notice when there is one.
 */
export function ContactForm({
  topic,
  onTopic,
}: {
  topic: string;
  onTopic: (label: string) => void;
}) {
  const { form, channels } = contactCopy;
  const nameId = useId();
  const mailId = useId();
  const bodyId = useId();
  const topicId = useId();
  const [sent, setSent] = useState(false);

  const field =
    "w-full border-[0.5px] border-white/25 bg-transparent px-4 py-3 font-[family-name:var(--font-display)] text-[16px] leading-6 text-white placeholder:text-white/35 focus:border-white/60 focus:outline-none focus:ring-2 focus:ring-brand";
  const label =
    "font-[family-name:var(--font-display)] text-[13px] font-semibold uppercase leading-4 tracking-[1.56px] text-white/60";

  return (
    <form
      className="flex w-full flex-col gap-5"
      onSubmit={(event) => {
        event.preventDefault();
        setSent(true);
      }}
    >
      <fieldset className="m-0 flex flex-col gap-3 border-0 p-0">
        <legend id={topicId} className={`${label} mb-3`}>
          {form.topic}
        </legend>
        <div role="radiogroup" aria-labelledby={topicId} className="flex flex-wrap gap-2">
          {channels.map((c) => {
            const on = c.label === topic;
            return (
              <button
                key={c.label}
                type="button"
                role="radio"
                aria-checked={on}
                onClick={() => {
                  onTopic(c.label);
                  setSent(false);
                }}
                className={`border px-3 py-2 font-[family-name:var(--font-display)] text-[14px] font-semibold leading-5 transition-colors duration-200 ${on ? "border-brand bg-brand text-[#0b0b0e]" : "border-white/15 bg-white/5 text-content-primary hover:border-white/40"}`}
              >
                {c.label}
              </button>
            );
          })}
        </div>
      </fieldset>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label className={label} htmlFor={nameId}>
            Your name
          </label>
          <input
            id={nameId}
            name="name"
            required
            className={field}
            onChange={() => setSent(false)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className={label} htmlFor={mailId}>
            Email
          </label>
          <input
            id={mailId}
            name="email"
            type="email"
            required
            placeholder="you@example.com"
            className={field}
            onChange={() => setSent(false)}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className={label} htmlFor={bodyId}>
          Message
        </label>
        <textarea
          id={bodyId}
          name="message"
          required
          rows={5}
          className={`${field} resize-y`}
          onChange={() => setSent(false)}
        />
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          className="sweep flex items-center bg-brand px-5 py-4 font-[family-name:var(--font-display)] text-[16px] font-semibold leading-6 text-[#0b0b0e]"
        >
          <span className="relative z-10">
            {sent ? "Noted" : `${form.label} · ${topic}`}
          </span>
        </button>
        <p
          role="status"
          className={
            sent
              ? "m-0 font-[family-name:var(--font-display)] text-[13px] leading-5 text-white/55"
              : "sr-only"
          }
        >
          {sent ? form.sent : ""}
        </p>
      </div>
    </form>
  );
}
