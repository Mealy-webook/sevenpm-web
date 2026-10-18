"use client";

import Image from "next/image";
import { useRef, useState } from "react";

import { ContactForm } from "@/components/pages/ContactForm";
import { menuSocialLinks } from "@/data/events";
import { contactCopy } from "@/data/pages";

/**
 * Pick your line, then write.
 *
 * The six channels are photo tiles rather than a list: each the line's
 * name in Daltown over a picture from the festivals, what it is for, and
 * its address (or "to be confirmed" until there is one, rather than a
 * mailto: that would bounce). "Write to us" on a tile addresses the form
 * below to that line and takes you there, so the visitor chooses once.
 *
 * Under the tiles the form sits beside a panel with where we are, how fast
 * we answer, and the five social links — which otherwise appear nowhere
 * on the site since the footer dropped them.
 */
export function ContactLines() {
  const { channels, lines, where, form } = contactCopy;
  const [topic, setTopic] = useState(channels[0].label);
  const formRef = useRef<HTMLDivElement>(null);

  const choose = (label: string) => {
    setTopic(label);
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <section aria-labelledby="contact-lines" className="relative py-16 xl:py-20">
        <div className="shell flex flex-col gap-8 xl:gap-12">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
            <h2 id="contact-lines" className="section-title text-white" data-reveal="clip">
              {lines.title}
            </h2>
            <p className="m-0 max-w-[440px] font-[family-name:var(--font-display)] text-[14px] leading-[21px] text-content-secondary">
              {lines.body}
            </p>
          </div>

          <ul className="m-0 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3" data-reveal="up" data-reveal-stagger>
            {channels.map((c, i) => {
              const on = c.label === topic;
              return (
                <li key={c.label}>
                  <article
                    className={`group relative flex h-[360px] flex-col justify-end overflow-hidden bg-ink-900 outline outline-2 -outline-offset-2 transition-[outline-color] duration-300 ${on ? "outline-brand" : "outline-transparent"}`}
                  >
                    <Image
                      src={c.image}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 420px, (min-width: 640px) 50vw, 100vw"
                      className="object-cover opacity-60 grayscale transition-[scale,opacity,filter] duration-700 ease-out group-hover:scale-105 group-hover:opacity-80 group-hover:grayscale-0"
                    />
                    <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/10" />

                    <span className="absolute left-5 top-5 font-daltown text-[40px] leading-none text-brand">
                      {String(i + 1).padStart(2, "0")}
                    </span>

                    <div className="relative flex flex-col gap-3 p-5 xl:p-6">
                      <h3 className="card-title text-white">{c.label}</h3>
                      <p className="m-0 font-[family-name:var(--font-display)] text-[14px] leading-[20px] text-content-primary/80">
                        {c.note}
                      </p>
                      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/15 pt-4">
                        {c.email ? (
                          <a href={`mailto:${c.email}`} className="link-sweep font-[family-name:var(--font-display)] text-[14px] font-semibold text-brand">
                            {c.email}
                          </a>
                        ) : (
                          <span className="font-[family-name:var(--font-display)] text-[12px] font-semibold uppercase tracking-[1.4px] text-white/40">
                            Address to be confirmed
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => choose(c.label)}
                          className={`sweep px-4 py-2.5 font-[family-name:var(--font-display)] text-[14px] font-semibold ${on ? "bg-brand text-[#0b0b0e]" : "bg-white text-[#0b0b0e]"}`}
                        >
                          <span className="relative z-10">{lines.write} →</span>
                        </button>
                      </div>
                    </div>
                  </article>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section aria-labelledby="contact-form" className="relative pb-16 xl:pb-20">
        <div ref={formRef} className="shell scroll-mt-28">
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
