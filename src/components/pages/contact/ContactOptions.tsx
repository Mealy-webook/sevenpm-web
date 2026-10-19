"use client";

import Image from "next/image";
import { useState } from "react";

import { FaqSection } from "@/components/event/FaqSection";
import { ContactForm } from "@/components/pages/ContactForm";
import { homeCopy } from "@/data/home";
import { jazzablanca, menuSocialLinks } from "@/data/events";
import { contactCopy } from "@/data/pages";

/**
 * Three ways to put the Contact page together, each from one of the site's
 * existing pages so it reads as a sibling of them — the same idea as the
 * Become a sponsor options. All three keep the working form (topic chips,
 * name, email, message); what changes is how the six lines are shown and
 * what sits around the form. Picking a line anywhere addresses the form to
 * it and scrolls there.
 */

const { channels, form, where, eyebrow, title, intro } = contactCopy;

/** One icon per line, from the site's own set. */
const ICONS: Record<string, string> = {
  General: "/assets/ic-info-20.svg",
  "Tickets and bookings": "/assets/ic-acct-bookings.svg",
  Partnerships: "/assets/ic-hosp-included-48.svg",
  Hospitality: "/assets/ic-hosp-private-48.svg",
  Press: "/assets/ic-camera-20.svg",
  "Artists and bookings": "/assets/ic-acct-profile.svg",
};

const EYEBROW =
  "m-0 font-[family-name:var(--font-display)] text-body-s font-semibold uppercase tracking-[0.12em] text-brand";

function useTopic() {
  const [topic, setTopic] = useState(channels[0].label);
  const pick = (label: string) => {
    setTopic(label);
    document.getElementById("contact-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  return { topic, setTopic, pick };
}

function Address({ email }: { email?: string }) {
  return email ? (
    <a href={`mailto:${email}`} className="link-sweep font-[family-name:var(--font-display)] text-body font-semibold text-brand">
      {email}
    </a>
  ) : (
    <span className="font-[family-name:var(--font-display)] text-caption font-semibold uppercase tracking-[0.12em] text-white/40">
      Address to be confirmed
    </span>
  );
}

/** The form card beside the taped yellow note and the socials — the live
 *  page's own block, shared by all three. */
function FormBlock({ topic, setTopic }: { topic: string; setTopic: (t: string) => void }) {
  return (
    <section className="relative py-16 xl:py-20">
      <div id="contact-form" className="shell scroll-mt-28">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_380px]">
          <div className="flex flex-col gap-6 border border-white/10 bg-bg-secondary p-6 xl:p-10" data-reveal="up">
            <div className="flex flex-col gap-2">
              <h2 className="card-title text-white">{form.title}</h2>
              <p className="m-0 font-[family-name:var(--font-display)] text-body text-content-secondary">{form.body}</p>
            </div>
            <ContactForm topic={topic} onTopic={setTopic} />
          </div>
          <aside className="flex flex-col gap-4" data-reveal="up">
            <div className="relative rotate-1 bg-brand p-6 text-[#0b0b0e]">
              <span aria-hidden className="pointer-events-none absolute left-1/2 top-0 block h-[22px] w-[104px] -translate-x-1/2 -translate-y-1/2 -rotate-3 bg-[rgba(217,217,217,0.45)]" />
              <p className="m-0 font-[family-name:var(--font-display)] text-caption font-semibold uppercase tracking-[0.14em] text-black/60">{where.title}</p>
              <p className="display-xs m-0 mt-1 font-daltown uppercase">{where.city}</p>
              <p className="m-0 mt-4 border-t border-black/20 pt-4 font-[family-name:var(--font-display)] text-body font-medium">{form.body}</p>
            </div>
            <div className="flex flex-col gap-4 border border-white/10 bg-bg-secondary p-6">
              <p className="m-0 font-[family-name:var(--font-display)] text-body-s font-semibold uppercase tracking-[0.12em] text-text-secondary">{where.follow}</p>
              <ul className="m-0 flex list-none flex-wrap gap-3 p-0">
                {menuSocialLinks.map((s) => (
                  <li key={s.label}>
                    <a href={s.href} target="_blank" rel="noreferrer" aria-label={s.label} className="flex size-12 items-center justify-center border border-white/10 bg-bg-tertiary transition-colors hover:border-white/40">
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
  );
}

/* G · Festival page -------------------------------------------------- */

/** Laid out like the event page: centred hero with an info row, the lines
 *  as the house-rule tiles, the form, then the festival FAQ — so the
 *  common questions are answered before anyone writes. */
export function ContactFestivalPage() {
  const { topic, setTopic, pick } = useTopic();
  return (
    <>
      <section className="relative py-10">
        <div className="shell flex flex-col items-center gap-6 text-center">
          <p className={EYEBROW} data-reveal="up">{eyebrow}</p>
          <h1 className="display-text text-white" data-reveal="clip">{title}</h1>
          <p className="m-0 max-w-[620px] font-[family-name:var(--font-display)] text-body text-content-secondary">{intro}</p>
          <ul className="m-0 flex list-none flex-wrap items-center justify-center gap-x-8 gap-y-2 p-0">
            {[
              ["Where", where.city],
              ["Reply", "Within two working days"],
              ["Lines", `${channels.length} inboxes`],
            ].map(([k, v], i) => (
              <li key={k} className="flex items-center gap-8">
                {i > 0 ? <span aria-hidden className="hidden h-[52px] w-px bg-white/15 sm:block" /> : null}
                <span className="flex flex-col items-start px-2 py-3 text-left">
                  <span className="font-[family-name:var(--font-display)] text-body-s text-text-secondary">{k}</span>
                  <span className="font-[family-name:var(--font-display)] text-title-body font-semibold text-text-primary">{v}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="relative py-16 xl:py-20">
        <div className="shell flex flex-col items-center gap-12">
          <h2 className="section-title text-center text-white" data-reveal="clip">Pick your line</h2>
          <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3" data-reveal="up" data-reveal-stagger>
            {channels.map((ch) => {
              const on = ch.label === topic;
              return (
                <button
                  key={ch.label}
                  type="button"
                  onClick={() => pick(ch.label)}
                  className={`lift flex flex-col items-center justify-center gap-4 border p-6 text-center transition-colors ${on ? "border-brand bg-white/5" : "border-ink-600 hover:border-white/30"}`}
                >
                  <Image src={ICONS[ch.label]} alt="" width={32} height={32} className="size-8" />
                  <span className="font-[family-name:var(--font-display)] text-title-body font-bold uppercase text-text-primary">{ch.label}</span>
                  <span className="font-[family-name:var(--font-display)] text-body text-text-secondary">{ch.note}</span>
                  <span className="font-[family-name:var(--font-display)] text-body-s font-semibold text-brand">Write to us →</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <FormBlock topic={topic} setTopic={setTopic} />
      <FaqSection event={jazzablanca} />
    </>
  );
}

/* H · Hospitality ---------------------------------------------------- */

/** Laid out like the event page's hospitality block: the title beside the
 *  six lines as icon rows divided by hairlines, then the form. */
export function ContactHospitalityPage() {
  const { topic, setTopic, pick } = useTopic();
  return (
    <>
      <section className="relative py-16 xl:py-20">
        <div className="shell grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-8">
          <div className="flex flex-col justify-center gap-6 lg:sticky lg:top-28 lg:self-start">
            <p className={EYEBROW} data-reveal="up">{eyebrow}</p>
            <h1 className="section-title text-white" data-reveal="clip">{title}</h1>
            <p className="m-0 max-w-[420px] font-[family-name:var(--font-display)] text-body text-content-secondary">{intro}</p>
          </div>
          <ul className="m-0 flex list-none flex-col gap-6 p-0" data-reveal="up" data-reveal-stagger>
            {channels.map((ch, i) => (
              <li key={ch.label} className={`flex gap-6 sm:gap-8 ${i > 0 ? "border-t border-white/10 pt-6" : ""}`}>
                <Image src={ICONS[ch.label]} alt="" width={48} height={48} className="size-10 shrink-0 sm:size-12" />
                <div className="flex min-w-0 flex-1 flex-col gap-2">
                  <h2 className="display-xs m-0 font-daltown uppercase text-white">{ch.label}</h2>
                  <p className="m-0 font-[family-name:var(--font-display)] text-body text-content-secondary">{ch.note}</p>
                  <div className="flex flex-wrap items-center gap-4">
                    <Address email={ch.email} />
                    <button type="button" onClick={() => pick(ch.label)} className="font-[family-name:var(--font-display)] text-body-s font-semibold text-white underline underline-offset-4 hover:text-brand">
                      Write to us
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <FormBlock topic={topic} setTopic={setTopic} />
    </>
  );
}

/* I · Homepage ------------------------------------------------------- */

/** Laid out like the homepage: SAY HELLO with the hero's photo window cut
 *  into the O, the six lines as the news rows (number, line, what it is
 *  for, the square arrow), then the form. */
export function ContactHomePage() {
  const { topic, setTopic, pick } = useTopic();
  const { pill } = homeCopy.heroCut;
  return (
    <>
      <section className="relative flex flex-col items-center gap-8 py-16 xl:py-24">
        <h1 className="sr-only">{title}</h1>
        <div aria-hidden className="hero-headline flex flex-col items-center gap-[0.1077em] font-daltown uppercase text-white" data-reveal="clip">
          <span className="block">Say</span>
          <span className="flex items-center justify-center">
            <span className="block">Hell</span>
            <span
              className="relative block shrink-0 overflow-hidden rounded-full"
              style={{ width: `${pill.width}em`, height: `${pill.height}em`, marginInlineStart: `${pill.gapBefore}em` }}
            >
              <Image src="/assets/gallery-3.jpg" alt="" fill priority sizes="455px" className="object-cover" />
            </span>
          </span>
        </div>
        <p className="m-0 max-w-[560px] px-5 text-center font-[family-name:var(--font-display)] text-body-l text-content-primary">{intro}</p>
      </section>

      <section className="relative py-16 xl:py-20">
        <div className="shell flex flex-col items-center gap-12">
          <h2 className="section-title text-center text-white" data-reveal="clip">Pick your line</h2>
          <ol className="m-0 w-full list-none p-0">
            {channels.map((ch, i) => (
              <li key={ch.label} className="group grid grid-cols-[40px_1fr_auto] items-center gap-x-6 gap-y-2 border-b border-white/10 py-6 lg:grid-cols-[60px_340px_1fr_auto]">
                <span className="font-[family-name:var(--font-display)] text-body-s text-text-secondary">{String(i + 1).padStart(2, "0")}</span>
                <span className="font-[family-name:var(--font-display)] text-title-section font-bold uppercase text-white transition-colors group-hover:text-brand">{ch.label}</span>
                <button type="button" onClick={() => pick(ch.label)} aria-label={`Write to ${ch.label}`} className="row-span-2 flex size-12 items-center justify-center border border-white/25 transition-colors hover:border-white lg:order-last lg:row-span-1">
                  <Image src="/assets/ic-arrow-right-24.svg" alt="" width={24} height={24} className="size-6" />
                </button>
                <span className="col-start-2 flex flex-col gap-1 lg:col-start-auto">
                  <span className="font-[family-name:var(--font-display)] text-body text-content-secondary">{ch.note}</span>
                  <Address email={ch.email} />
                </span>
              </li>
            ))}
          </ol>
        </div>
      </section>
      <FormBlock topic={topic} setTopic={setTopic} />
    </>
  );
}
