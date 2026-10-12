"use client";

import { useId, useState } from "react";

import { contactCopy } from "@/data/pages";

/**
 * The contact form.
 *
 * Nothing is sent. There is no backend behind this build, so the button
 * acknowledges in place and says as much — the same honesty the newsletter
 * block on the homepage keeps. Wire `onSubmit` to the real endpoint and
 * delete the notice when there is one.
 */
export function ContactForm() {
  const { form } = contactCopy;
  const nameId = useId();
  const mailId = useId();
  const bodyId = useId();
  const [sent, setSent] = useState(false);

  const field =
    "w-full border-[0.5px] border-white/25 bg-transparent px-4 py-3 font-[family-name:var(--font-display)] text-[16px] leading-6 text-white placeholder:text-white/35 focus:border-white/60 focus:outline-none focus:ring-2 focus:ring-brand";
  const label =
    "font-[family-name:var(--font-display)] text-[13px] font-semibold uppercase leading-4 tracking-[1.56px] text-white/60";

  return (
    <form
      className="flex w-full max-w-[560px] flex-col gap-5"
      onSubmit={(event) => {
        event.preventDefault();
        setSent(true);
      }}
    >
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

      <button
        type="submit"
        className="sweep flex items-center self-start bg-brand px-5 py-4 font-[family-name:var(--font-display)] text-[16px] font-semibold leading-6 text-[#0b0b0e]"
      >
        <span className="relative z-10">{sent ? "Noted" : form.label}</span>
      </button>

      <p
        role="status"
        className="m-0 min-h-5 font-[family-name:var(--font-display)] text-[13px] leading-5 text-white/55"
      >
        {sent ? form.sent : " "}
      </p>
    </form>
  );
}
