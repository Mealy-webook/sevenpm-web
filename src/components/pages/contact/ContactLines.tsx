"use client";

import Image from "next/image";
import { useState } from "react";

import { ContactForm } from "@/components/pages/ContactForm";
import { menuSocialLinks } from "@/data/events";
import { contactCopy } from "@/data/pages";

/**
 * The form, beside where we are, how fast we answer and the five social
 * links — which otherwise appear nowhere on the site since the footer
 * dropped them. The form opens on the six lines as topic chips, so the
 * message is addressed before it is written. (The "Pick your line" photo
 * tiles that used to sit above it were removed by request.)
 */
export function ContactLines() {
  const { channels, where, form } = contactCopy;
  const [topic, setTopic] = useState(channels[0].label);

  return (
    <>
      <section aria-labelledby="contact-form" className="relative py-16 xl:py-20">
        <div className="shell">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_380px]">
            <div className="flex flex-col gap-6 border border-white/10 bg-bg-secondary p-6 xl:p-10" data-reveal="up">
              <div className="flex flex-col gap-2">
                <h2 id="contact-form" className="card-title text-white">
                  {form.title}
                </h2>
                <p className="m-0 font-[family-name:var(--font-display)] text-[15px] leading-[22px] text-content-secondary">
                  {form.body}
                </p>
              </div>
              <ContactForm topic={topic} onTopic={setTopic} />
            </div>

            {/* Where, how fast, and the socials */}
            <aside className="flex flex-col gap-4" data-reveal="up">
              <div className="relative rotate-1 bg-brand p-6 text-[#0b0b0e]">
                <span aria-hidden className="pointer-events-none absolute left-1/2 top-0 block h-[22px] w-[104px] -translate-x-1/2 -translate-y-1/2 -rotate-3 bg-[rgba(217,217,217,0.45)]" />
                <p className="m-0 font-[family-name:var(--font-display)] text-[12px] font-semibold uppercase tracking-[0.14em] text-black/60">
                  {where.title}
                </p>
                <p className="m-0 mt-1 font-daltown text-[44px] uppercase leading-[0.9]">{where.city}</p>
                <p className="m-0 mt-4 border-t border-black/20 pt-4 font-[family-name:var(--font-display)] text-[14px] font-medium leading-5">
                  {form.body}
                </p>
              </div>

              <div className="flex flex-col gap-4 border border-white/10 bg-bg-secondary p-6">
                <p className="m-0 font-[family-name:var(--font-display)] text-[13px] font-semibold uppercase tracking-[0.12em] text-text-secondary">
                  {where.follow}
                </p>
                <ul className="m-0 flex list-none flex-wrap gap-3 p-0">
                  {menuSocialLinks.map((s) => (
                    <li key={s.label}>
                      <a
                        href={s.href}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={s.label}
                        className="flex size-12 items-center justify-center border border-white/10 bg-bg-tertiary transition-colors hover:border-white/40"
                      >
                        <Image src={s.icon} alt="" width={22} height={22} className="size-[22px]" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
