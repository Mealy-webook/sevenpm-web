"use client";

import Image from "next/image";
import { useId, useMemo, useState } from "react";

import { jazzablanca, menuSocialLinks } from "@/data/events";
import { festivals as festivalList } from "@/data/home";
import { contactCopy } from "@/data/pages";

/**
 * Contact, three new directions from the benchmark's brief: answer the
 * common questions before anyone writes, route by festival and then by
 * topic (Primavera), send ticket problems to ticketing with an order number
 * (Glastonbury), and show a reply time for every line. The look is the
 * site's; the layouts are new.
 *
 * Nothing is sent — there is no backend — and every form says so.
 */
const { channels, form, where, festivals, orderLabel, orderHint } = contactCopy;

const FIELD =
  "w-full border border-white/20 bg-black/30 px-4 py-3 font-[family-name:var(--font-display)] text-body-l text-white placeholder:text-white/30 focus:border-white/60 focus:outline-none focus:ring-2 focus:ring-brand";
const LABEL = "font-[family-name:var(--font-display)] text-body-s font-semibold uppercase tracking-[0.12em] text-white/60";
const CTA =
  "sweep inline-flex items-center justify-center bg-brand px-5 py-4 font-[family-name:var(--font-display)] text-body-l font-semibold text-[#0b0b0e]";

const posterFor = (name: string) => festivalList.find((f) => f.name === name)?.card;

/** Name, email, an order number when it is about tickets, and the message. */
function Fields({ topic, onSent }: { topic: string; onSent: () => void }) {
  const ids = { name: useId(), email: useId(), order: useId(), msg: useId() };
  const tickets = topic === "Tickets and bookings";
  return (
    <form
      className="flex flex-col gap-5"
      onSubmit={(e) => {
        e.preventDefault();
        onSent();
      }}
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="flex flex-col gap-2" htmlFor={ids.name}>
          <span className={LABEL}>Your name</span>
          <input id={ids.name} required className={FIELD} />
        </label>
        <label className="flex flex-col gap-2" htmlFor={ids.email}>
          <span className={LABEL}>Email</span>
          <input id={ids.email} type="email" required placeholder="you@example.com" className={FIELD} />
        </label>
      </div>
      {tickets ? (
        <label className="flex flex-col gap-2" htmlFor={ids.order}>
          <span className={LABEL}>{orderLabel}</span>
          <input id={ids.order} required placeholder="e.g. SP-12345" className={FIELD} />
          <span className="font-[family-name:var(--font-display)] text-body-s text-text-secondary">{orderHint}</span>
        </label>
      ) : null}
      <label className="flex flex-col gap-2" htmlFor={ids.msg}>
        <span className={LABEL}>Message</span>
        <textarea id={ids.msg} required rows={5} className={`${FIELD} resize-y`} />
      </label>
      <button type="submit" className={`${CTA} w-fit`}>
        <span className="relative z-10">{form.label}</span>
      </button>
    </form>
  );
}

function Sent({ to, reply, onReset }: { to: string; reply: string; onReset: () => void }) {
  return (
    <div role="status" className="flex flex-col items-start gap-4">
      <span className="bg-brand px-3 py-1 font-[family-name:var(--font-display)] text-caption font-bold uppercase text-[#0b0b0e]">Noted</span>
      <p className="card-title m-0 text-white">Your message is with {to}.</p>
      <p className="m-0 font-[family-name:var(--font-display)] text-body text-content-secondary">
        Expect an answer {reply.replace(/^\[|\]$/g, "").toLowerCase()}. {form.sent}
      </p>
      <button type="button" onClick={onReset} className="font-[family-name:var(--font-display)] text-body font-semibold text-brand underline underline-offset-4">
        Write another message
      </button>
    </div>
  );
}

function OfficeAndSocials() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <span className={LABEL}>{where.title}</span>
        <span className="font-[family-name:var(--font-display)] text-body-l text-white">{where.address}</span>
        <span className="font-[family-name:var(--font-display)] text-body-l text-white">{where.phone}</span>
      </div>
      <ul className="m-0 flex list-none flex-wrap gap-3 p-0">
        {menuSocialLinks.map((s) => (
          <li key={s.label}>
            <a href={s.href} target="_blank" rel="noreferrer" aria-label={s.label} className="flex size-12 items-center justify-center border border-white/10 bg-bg-secondary transition-colors hover:border-white/40">
              <Image src={s.icon} alt="" width={22} height={22} className="size-[22px]" />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* M · Switchboard ---------------------------------------------------- */

/** Three questions, one screen each: who for, what about, then the message.
 *  The answers stay pinned on a running ticket, so you always see where
 *  your message is going. */
export function ContactSwitchboard() {
  const [festival, setFestival] = useState<string | null>(null);
  const [topic, setTopic] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const line = channels.find((c) => c.label === topic);
  const step = !festival ? 1 : !topic ? 2 : 3;

  return (
    <section className="relative py-16 xl:py-20">
      <div className="shell grid grid-cols-1 gap-10 lg:grid-cols-[1fr_360px]">
        <div className="flex min-w-0 flex-col gap-10">
          <div className="flex flex-col gap-4">
            <p className="m-0 font-[family-name:var(--font-display)] text-body-s font-semibold uppercase tracking-[0.12em] text-brand">{contactCopy.eyebrow}</p>
            <h1 className="display-text text-white" data-reveal="clip">Who do you need?</h1>
            <p className="m-0 max-w-[560px] font-[family-name:var(--font-display)] text-body-l text-content-secondary">Two taps and your message reaches the person who can answer it.</p>
          </div>

          {/* progress */}
          <ol className="m-0 flex list-none gap-2 p-0" aria-label="Steps">
            {["Who for", "What about", "Your message"].map((s, i) => (
              <li key={s} className={`flex-1 border-t-4 pt-2 font-[family-name:var(--font-display)] text-body-s font-semibold ${i + 1 <= step ? "border-brand text-white" : "border-white/15 text-text-secondary"}`}>
                {i + 1}. {s}
              </li>
            ))}
          </ol>

          {step === 1 ? (
            <div key="s1" className="deck-fade grid grid-cols-1 gap-4 sm:grid-cols-3">
              {festivals.map((f) => {
                const poster = posterFor(f);
                return (
                  <button key={f} type="button" onClick={() => setFestival(f)} className="group flex flex-col border border-white/10 bg-bg-secondary text-left transition-colors hover:border-brand">
                    <span className="relative block aspect-square w-full overflow-hidden bg-brand">
                      {poster ? (
                        <Image src={poster} alt="" fill sizes="300px" className="object-cover transition-[scale] duration-700 group-hover:scale-105" />
                      ) : (
                        <Image src="/assets/logo-mark.svg" alt="" fill sizes="300px" className="object-contain p-12" />
                      )}
                    </span>
                    <span className="flex items-center justify-between p-5">
                      <span className="display-xs font-daltown uppercase text-white">{f}</span>
                      <span aria-hidden className="text-brand">→</span>
                    </span>
                  </button>
                );
              })}
            </div>
          ) : null}

          {step === 2 ? (
            <ul key="s2" className="deck-fade m-0 flex list-none flex-col p-0">
              {channels.map((c) => (
                <li key={c.label} className="border-t border-white/10 last:border-b">
                  <button type="button" onClick={() => setTopic(c.label)} className="group grid w-full grid-cols-[1fr_auto] items-center gap-4 py-5 text-left">
                    <span className="flex flex-col gap-1">
                      <span className="font-[family-name:var(--font-display)] text-title-section font-bold uppercase text-white transition-colors group-hover:text-brand">{c.label}</span>
                      <span className="font-[family-name:var(--font-display)] text-body text-content-secondary">{c.note}</span>
                    </span>
                    <span className="font-[family-name:var(--font-display)] text-body-s text-text-secondary">{c.reply}</span>
                  </button>
                </li>
              ))}
            </ul>
          ) : null}

          {step === 3 && line ? (
            <div key="s3" className="deck-fade">
              {sent ? (
                <Sent to={`${festival} · ${line.label}`} reply={line.reply} onReset={() => { setSent(false); setTopic(null); setFestival(null); }} />
              ) : (
                <Fields topic={line.label} onSent={() => setSent(true)} />
              )}
            </div>
          ) : null}
        </div>

        {/* the running ticket */}
        <aside className="flex flex-col gap-6 lg:sticky lg:top-28 lg:self-start">
          <div className="relative bg-[#f4f1ea] p-6 text-[#0b0b0e] shadow-[0_24px_60px_rgba(0,0,0,0.5)]">
            <span aria-hidden className="absolute left-1/2 top-0 block h-[22px] w-[100px] -translate-x-1/2 -translate-y-1/2 -rotate-2 bg-[rgba(217,217,217,0.5)]" />
            <p className="m-0 font-[family-name:var(--font-display)] text-caption font-bold uppercase tracking-[0.16em] text-black/55">Your message is going to</p>
            <dl className="m-0 mt-4 flex flex-col">
              {[
                ["Who for", festival, () => { setFestival(null); setTopic(null); }],
                ["About", topic, () => setTopic(null)],
                ["Reply", line?.reply ?? null, null],
              ].map(([k, v, edit]) => (
                <div key={k as string} className="flex items-baseline justify-between gap-4 border-t border-black/15 py-3">
                  <dt className="font-[family-name:var(--font-display)] text-body-s text-black/55">{k as string}</dt>
                  <dd className="m-0 flex items-baseline gap-3 font-[family-name:var(--font-display)] text-body font-semibold">
                    {(v as string | null) ?? "—"}
                    {v && edit ? (
                      <button type="button" onClick={edit as () => void} className="text-body-s font-normal text-black/55 underline">Change</button>
                    ) : null}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
          <OfficeAndSocials />
        </aside>
      </div>
    </section>
  );
}

/* N · Help desk ------------------------------------------------------ */

/** Ask first: a search box over the festival's answers, the common
 *  questions open on the page, and only then "Still need us?" with the
 *  lines and their reply times leading to the form. */
export function ContactHelpDesk() {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState<number | null>(0);
  const [topic, setTopic] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const searchId = useId();
  const faq = jazzablanca.faq;
  const hits = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return faq.map((_, i) => i);
    return faq.map((f, i) => ({ f, i })).filter(({ f }) => `${f.question} ${f.answer ?? ""}`.toLowerCase().includes(t)).map(({ i }) => i);
  }, [q, faq]);
  const line = channels.find((c) => c.label === topic);

  return (
    <>
      <section className="relative bg-brand py-16 text-[#0b0b0e] xl:py-20">
        <div className="shell flex flex-col gap-6">
          <p className="m-0 font-[family-name:var(--font-display)] text-body-s font-bold uppercase tracking-[0.14em]">{contactCopy.eyebrow}</p>
          <h1 className="display-text max-w-[12ch] !text-[#0b0b0e]" data-reveal="clip">How can we help?</h1>
          <label htmlFor={searchId} className="sr-only">Search the answers</label>
          <input
            id={searchId}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search: refunds, parking, age, re-entry…"
            className="w-full max-w-[760px] border-2 border-[#0b0b0e] bg-transparent px-5 py-4 font-[family-name:var(--font-display)] text-title-section text-[#0b0b0e] placeholder:text-black/45 focus:outline-none focus:ring-4 focus:ring-black/20"
          />
        </div>
      </section>

      <section className="relative py-16 xl:py-20">
        <div className="shell grid grid-cols-1 gap-12 lg:grid-cols-[1fr_1.4fr]">
          <div className="flex flex-col gap-4">
            <h2 className="section-title text-white">Quick answers</h2>
            <p className="m-0 font-[family-name:var(--font-display)] text-body text-content-secondary">
              {hits.length} of {faq.length} answers{q ? ` for “${q}”` : ""}. Most questions are answered here in seconds.
            </p>
          </div>
          <ul className="m-0 flex list-none flex-col p-0">
            {hits.length === 0 ? (
              <li className="border-t border-white/10 py-6 font-[family-name:var(--font-display)] text-body text-content-secondary">No answer matches. Write to us below and a person will reply.</li>
            ) : null}
            {hits.map((i) => {
              const f = faq[i];
              const on = open === i;
              return (
                <li key={f.question} className="border-t border-white/10 last:border-b">
                  <button type="button" aria-expanded={on} onClick={() => setOpen(on ? null : i)} className="flex w-full items-center justify-between gap-6 py-5 text-left">
                    <span className="font-[family-name:var(--font-display)] text-title-body font-bold uppercase text-white">{f.question}</span>
                    <span aria-hidden className={`text-title-section text-brand transition-transform ${on ? "rotate-45" : ""}`}>+</span>
                  </button>
                  {on ? <p className="m-0 pb-6 font-[family-name:var(--font-display)] text-body-l text-content-secondary">{f.answer ?? "Details coming soon."}</p> : null}
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section className="relative bg-bg-secondary py-16 xl:py-20">
        <div className="shell flex flex-col gap-10">
          <h2 className="section-title text-white">Still need us?</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {channels.map((c) => {
              const on = c.label === topic;
              return (
                <button key={c.label} type="button" aria-pressed={on} onClick={() => { setTopic(c.label); setSent(false); }}
                  className={`flex flex-col gap-2 border p-6 text-left transition-colors ${on ? "border-brand bg-white/5" : "border-white/10 bg-bg-primary hover:border-white/30"}`}>
                  <span className="font-[family-name:var(--font-display)] text-title-body font-bold uppercase text-white">{c.label}</span>
                  <span className="font-[family-name:var(--font-display)] text-body text-content-secondary">{c.note}</span>
                  <span className="mt-auto pt-2 font-[family-name:var(--font-display)] text-body-s font-semibold text-brand">Reply: {c.reply}</span>
                </button>
              );
            })}
          </div>
          {line ? (
            <div className="grid grid-cols-1 gap-10 border-t border-white/10 pt-10 lg:grid-cols-[1fr_320px]">
              {sent ? (
                <Sent to={line.label} reply={line.reply} onReset={() => setSent(false)} />
              ) : (
                <div className="flex flex-col gap-4">
                  <p className="m-0 font-[family-name:var(--font-display)] text-body-l text-white">Writing to <b>{line.label}</b></p>
                  <Fields topic={line.label} onSent={() => setSent(true)} />
                </div>
              )}
              <OfficeAndSocials />
            </div>
          ) : (
            <p className="m-0 font-[family-name:var(--font-display)] text-body text-content-secondary">Pick a line and the form opens here.</p>
          )}
        </div>
      </section>
    </>
  );
}

/* O · Postcard ------------------------------------------------------- */

/** Write us a postcard: the message on the left half, the address on the
 *  right — who it is for and which line, chosen as chips — and a stamp
 *  that shows how soon that line answers. The office address is printed
 *  as the return address. */
export function ContactPostcard() {
  const [festival, setFestival] = useState(festivals[0]);
  const [topic, setTopic] = useState(channels[0].label);
  const [sent, setSent] = useState(false);
  const ids = { msg: useId(), name: useId(), email: useId(), order: useId() };
  const line = channels.find((c) => c.label === topic) ?? channels[0];
  const tickets = topic === "Tickets and bookings";
  const chip = (on: boolean) =>
    `border px-3 py-1.5 font-[family-name:var(--font-display)] text-body-s font-semibold transition-colors ${on ? "border-[#0b0b0e] bg-[#0b0b0e] text-white" : "border-black/25 text-[#0b0b0e] hover:border-black/60"}`;

  return (
    <>
      <section className="relative py-16 xl:py-20">
        <div className="shell flex flex-col gap-4">
          <p className="m-0 font-[family-name:var(--font-display)] text-body-s font-semibold uppercase tracking-[0.12em] text-brand">{contactCopy.eyebrow}</p>
          <h1 className="display-text max-w-[14ch] text-white" data-reveal="clip">Write to us.</h1>
          <p className="m-0 max-w-[560px] font-[family-name:var(--font-display)] text-body-l text-content-secondary">{contactCopy.intro}</p>
        </div>
      </section>

      <section className="relative pb-16 xl:pb-20">
        <div className="shell">
          <div className="relative rotate-[-0.6deg] bg-[#f4f1ea] text-[#0b0b0e] shadow-[0_40px_80px_rgba(0,0,0,0.55)]">
            <span aria-hidden className="absolute -top-3 left-10 block h-[24px] w-[120px] -rotate-6 bg-[rgba(217,217,217,0.55)]" />
            <span aria-hidden className="absolute -bottom-3 right-10 block h-[24px] w-[120px] -rotate-6 bg-[rgba(217,217,217,0.55)]" />
            {sent ? (
              <div className="p-8 sm:p-12">
                <span className="bg-[#0b0b0e] px-3 py-1 font-[family-name:var(--font-display)] text-caption font-bold uppercase text-brand">Posted</span>
                <p className="section-title mt-4">On its way to {festival} · {line.label}.</p>
                <p className="m-0 mt-3 font-[family-name:var(--font-display)] text-body-l text-black/65">Expect an answer {line.reply.replace(/^\[|\]$/g, "").toLowerCase()}. {form.sent}</p>
                <button type="button" onClick={() => setSent(false)} className="mt-6 font-[family-name:var(--font-display)] text-body font-semibold underline underline-offset-4">Write another</button>
              </div>
            ) : (
              <form
                className="grid grid-cols-1 lg:grid-cols-[1.3fr_1px_1fr]"
                onSubmit={(e) => {
                  e.preventDefault();
                  setSent(true);
                }}
              >
                {/* left: the message */}
                <div className="flex flex-col gap-4 p-6 sm:p-10">
                  <label htmlFor={ids.msg} className="font-[family-name:var(--font-display)] text-caption font-bold uppercase tracking-[0.16em] text-black/55">Your message</label>
                  <textarea
                    id={ids.msg}
                    required
                    rows={9}
                    placeholder={`Dear ${festival} team,`}
                    className="w-full resize-y bg-[repeating-linear-gradient(transparent,transparent_35px,rgba(0,0,0,0.15)_35px,rgba(0,0,0,0.15)_36px)] bg-transparent font-[family-name:var(--font-display)] text-body-l leading-9 text-[#0b0b0e] placeholder:text-black/40 focus:outline-none"
                  />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <input id={ids.name} required placeholder="Your name" aria-label="Your name" className="border-b border-black/30 bg-transparent py-2 font-[family-name:var(--font-display)] text-body-l placeholder:text-black/40 focus:border-black focus:outline-none" />
                    <input id={ids.email} type="email" required placeholder="Your email" aria-label="Your email" className="border-b border-black/30 bg-transparent py-2 font-[family-name:var(--font-display)] text-body-l placeholder:text-black/40 focus:border-black focus:outline-none" />
                  </div>
                  {tickets ? (
                    <input id={ids.order} required placeholder={`${orderLabel} — ${orderHint}`} aria-label={orderLabel} className="border-b border-black/30 bg-transparent py-2 font-[family-name:var(--font-display)] text-body-l placeholder:text-black/40 focus:border-black focus:outline-none" />
                  ) : null}
                </div>

                <span aria-hidden className="hidden bg-black/15 lg:block" />

                {/* right: stamp, address, return address */}
                <div className="flex flex-col gap-6 border-t border-black/15 p-6 sm:p-10 lg:border-t-0">
                  <div className="ml-auto flex size-28 flex-col items-center justify-center border-2 border-dashed border-[#0b0b0e] bg-brand p-2 text-center">
                    <span className="font-[family-name:var(--font-display)] text-caption font-bold uppercase">Reply</span>
                    <span className="font-[family-name:var(--font-display)] text-body-s font-semibold leading-tight">{line.reply.replace(/^\[|\]$/g, "")}</span>
                  </div>
                  <fieldset className="m-0 flex flex-col gap-2 border-0 border-b border-black/25 p-0 pb-4">
                    <legend className="mb-2 font-[family-name:var(--font-display)] text-caption font-bold uppercase tracking-[0.16em] text-black/55">To</legend>
                    <div className="flex flex-wrap gap-2">
                      {festivals.map((f) => (
                        <button key={f} type="button" aria-pressed={f === festival} onClick={() => setFestival(f)} className={chip(f === festival)}>{f}</button>
                      ))}
                    </div>
                  </fieldset>
                  <fieldset className="m-0 flex flex-col gap-2 border-0 border-b border-black/25 p-0 pb-4">
                    <legend className="mb-2 font-[family-name:var(--font-display)] text-caption font-bold uppercase tracking-[0.16em] text-black/55">Department</legend>
                    <div className="flex flex-wrap gap-2">
                      {channels.map((c) => (
                        <button key={c.label} type="button" aria-pressed={c.label === topic} onClick={() => setTopic(c.label)} className={chip(c.label === topic)}>{c.label}</button>
                      ))}
                    </div>
                  </fieldset>
                  <div className="flex flex-col gap-1 border-b border-black/25 pb-4">
                    <span className="font-[family-name:var(--font-display)] text-caption font-bold uppercase tracking-[0.16em] text-black/55">From the office</span>
                    <span className="font-[family-name:var(--font-display)] text-body">SEVENPM · {where.address}</span>
                    <span className="font-[family-name:var(--font-display)] text-body">{where.phone}</span>
                  </div>
                  <button type="submit" className="sweep w-fit bg-[#0b0b0e] px-5 py-4 font-[family-name:var(--font-display)] text-body-l font-semibold text-white">
                    <span className="relative z-10">Send postcard</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Before you write: the three most-asked */}
      <section className="relative border-t border-white/10 py-16 xl:py-20">
        <div className="shell grid grid-cols-1 gap-10 lg:grid-cols-[1fr_2fr]">
          <h2 className="section-title text-white">Before you write</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {jazzablanca.faq.slice(0, 3).map((f) => (
              <article key={f.question} className="flex flex-col gap-3 bg-bg-secondary p-6">
                <h3 className="m-0 font-[family-name:var(--font-display)] text-title-body font-bold uppercase text-white">{f.question}</h3>
                <p className="m-0 font-[family-name:var(--font-display)] text-body text-content-secondary">{f.answer ?? "Details coming soon."}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
