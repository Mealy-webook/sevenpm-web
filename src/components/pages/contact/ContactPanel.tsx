"use client";

import Image from "next/image";
import { useId, useState } from "react";

import { menuSocialLinks } from "@/data/events";
import { contactCopy } from "@/data/pages";

/**
 * `/contact`, from Figma 2633:16861 (hero 2637:6332).
 *
 * Two equal columns, 32 apart, on 80/120 padding. Left: CONTACT at display
 * size, then a hairline-bordered card with Address, Email and Follow us,
 * each a card-title over Body-Default, divided by hairlines; the socials are
 * the four square tiles the comp draws (no Instagram here). Right: the
 * secondary-ground "Send a message" card — first and last name side by
 * side, email, phone with its country code, a Topic picker, a 213-tall
 * message and a full-width 60px yellow button.
 *
 * Fields follow the design system's text field: the label sits inside as a
 * placeholder and floats to the top, small, once the field has focus or a
 * value. Nothing is sent from this prototype, and the button says so.
 */
const { channels, form, where } = contactCopy;

const BOX =
  "border-[0.5px] border-white/10 bg-white/5 transition-colors focus-within:border-white/40";

function Field({
  label,
  type = "text",
  required = false,
  multiline = false,
}: {
  label: string;
  type?: string;
  required?: boolean;
  multiline?: boolean;
}) {
  const id = useId();
  const input =
    "peer block w-full bg-transparent pt-4 font-[family-name:var(--font-display)] text-body font-semibold text-content-primary placeholder:text-transparent focus:outline-none";
  return (
    <label htmlFor={id} className={`relative block px-4 pb-3 pt-3 ${BOX} ${multiline ? "h-[213px]" : ""}`}>
      {multiline ? (
        <textarea id={id} required={required} placeholder={label} className={`${input} h-full resize-none`} />
      ) : (
        <input id={id} type={type} required={required} placeholder={label} className={input} />
      )}
      {/* The label: full size as a placeholder, small at the top once the
          field is focused or filled. */}
      <span className="pointer-events-none absolute left-4 top-1.5 font-[family-name:var(--font-display)] text-caption text-content-primary transition-all peer-placeholder-shown:top-[22px] peer-placeholder-shown:text-body-l peer-focus:top-1.5 peer-focus:text-caption">
        {label}
      </span>
    </label>
  );
}

export function ContactPanel() {
  const phoneId = useId();
  const topicId = useId();
  const [sent, setSent] = useState(false);
  const socials = menuSocialLinks.filter((s) => s.label !== "Instagram");

  return (
    <section className="relative py-16 xl:py-20">
      <div className="shell grid grid-cols-1 items-start gap-8 lg:grid-cols-2">
        {/* Left: the title and the details */}
        <div className="flex min-w-0 flex-col gap-8">
          <h1 className="display-text text-white" data-reveal="clip">
            {contactCopy.title}
          </h1>

          <div className="flex flex-col gap-8 border border-white/10 p-8" data-reveal="up">
            <div className="flex flex-col gap-4">
              <h2 className="card-title text-white">Address</h2>
              <p className="m-0 font-[family-name:var(--font-display)] text-body text-content-primary">{where.address}</p>
            </div>
            <span aria-hidden className="block h-px w-full bg-white/10" />
            <div className="flex flex-col gap-4">
              <h2 className="card-title text-white">Email</h2>
              <a href={`mailto:${where.email}`} className="link-sweep w-fit font-[family-name:var(--font-display)] text-body text-content-primary">
                {where.email}
              </a>
            </div>
            <span aria-hidden className="block h-px w-full bg-white/10" />
            <div className="flex flex-col gap-4">
              <h2 className="card-title text-white">Follow us</h2>
              <ul className="m-0 flex list-none flex-wrap gap-4 p-0">
                {socials.map((s) => (
                  <li key={s.label}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`SEVENPM on ${s.label}`}
                      className="flex items-center border border-white/10 bg-bg-secondary p-3 transition-colors hover:border-white/40"
                    >
                      <Image src={s.icon} alt="" width={24} height={24} className="size-6" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Right: the form */}
        <div className="flex min-w-0 flex-col gap-8 bg-bg-secondary p-6 sm:p-8" data-reveal="up">
          <div className="flex flex-col gap-4">
            <h2 className="card-title text-white">{form.title}</h2>
            <p className="m-0 font-[family-name:var(--font-display)] text-body text-content-primary">{form.body}</p>
          </div>

          {sent ? (
            <div role="status" className="flex flex-col items-start gap-4">
              <p className="m-0 font-[family-name:var(--font-display)] text-title-section font-bold uppercase text-white">Noted.</p>
              <p className="m-0 font-[family-name:var(--font-display)] text-body text-content-secondary">{form.sent}</p>
              <button type="button" onClick={() => setSent(false)} className="font-[family-name:var(--font-display)] text-body font-semibold text-brand underline underline-offset-4">
                Write another message
              </button>
            </div>
          ) : (
            <form
              className="flex flex-col gap-4"
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
              }}
            >
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="First name" required />
                <Field label="Last name" required />
              </div>
              <Field label="Email" type="email" required />

              {/* Phone: the country code as its own small button-box, the
                  number beside it. Morocco by default — the design
                  system's component ships with +966. */}
              <div className={`flex items-center gap-3 p-2 ${BOX}`}>
                <label className="sr-only" htmlFor={`${phoneId}-cc`}>Country code</label>
                <select
                  id={`${phoneId}-cc`}
                  defaultValue="+212"
                  className="shrink-0 cursor-pointer border-[0.5px] border-white/10 bg-white/5 px-3 py-3 font-[family-name:var(--font-display)] text-body font-semibold text-content-primary focus:outline-none focus:ring-2 focus:ring-brand"
                >
                  {["+212", "+33", "+34", "+44", "+966", "+971", "+1"].map((c) => (
                    <option key={c} value={c} className="bg-bg-secondary">{c}</option>
                  ))}
                </select>
                <label className="sr-only" htmlFor={phoneId}>Phone number</label>
                <input
                  id={phoneId}
                  type="tel"
                  placeholder="Phone number"
                  className="min-w-0 flex-1 bg-transparent font-[family-name:var(--font-display)] text-body-l text-content-primary placeholder:text-content-primary focus:outline-none"
                />
              </div>

              {/* Topic: a picker, with the dropdown chevron. */}
              <div className={`relative ${BOX}`}>
                <label className="sr-only" htmlFor={topicId}>Topic</label>
                <select
                  id={topicId}
                  required
                  defaultValue=""
                  className="w-full cursor-pointer appearance-none bg-transparent px-4 py-[18px] font-[family-name:var(--font-display)] text-body-l text-content-primary focus:outline-none"
                >
                  <option value="" disabled className="bg-bg-secondary">Topic</option>
                  {channels.map((c) => (
                    <option key={c.label} value={c.label} className="bg-bg-secondary">{c.label}</option>
                  ))}
                </select>
                <Image src="/assets/ic-chevron-down-20.svg" alt="" width={20} height={20} className="pointer-events-none absolute right-3 top-1/2 size-5 -translate-y-1/2" />
              </div>

              <Field label="Message" multiline required />

              <button
                type="submit"
                className="sweep flex h-[60px] w-full items-center justify-center bg-brand px-5 font-[family-name:var(--font-display)] text-body-l font-semibold text-[#0b0b0e]"
              >
                <span className="relative z-10">{form.label}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
