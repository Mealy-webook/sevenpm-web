import type { Metadata } from "next";

import { MotionProvider } from "@/components/motion/MotionProvider";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { ContactForm } from "@/components/pages/ContactForm";
import { PageIntro } from "@/components/pages/PageIntro";
import { contactCopy } from "@/data/pages";

export const metadata: Metadata = {
  title: "Contact — SEVENPM",
  description: contactCopy.intro,
};

/** `/contact`. No comp — the menu asked for it. See `data/pages.ts`. */
export default function ContactPage() {
  return (
    <>
      <MotionProvider />
      <SiteHeader />
      <main>
        <PageIntro
          eyebrow={contactCopy.eyebrow}
          title={contactCopy.title}
          intro={contactCopy.intro}
        />

        <section className="relative py-8 xl:py-12">
          <div className="shell grid gap-12 lg:grid-cols-2 lg:gap-16">
            {/* The lines. An address that does not exist yet says so rather
                than rendering a mailto: that would bounce. */}
            <div className="flex flex-col">
              {contactCopy.channels.map((channel) => (
                <div
                  key={channel.label}
                  data-reveal="up"
                  className="flex flex-col gap-1.5 border-t border-white/10 py-5"
                >
                  <h2 className="m-0 font-[family-name:var(--font-display)] text-[17px] font-bold uppercase leading-6 tracking-[0.085px] text-white">
                    {channel.label}
                  </h2>
                  <p className="m-0 font-[family-name:var(--font-ui)] text-[15px] leading-[1.6] text-content-secondary">
                    {channel.note}
                  </p>
                  {channel.email ? (
                    <a
                      href={`mailto:${channel.email}`}
                      className="link-sweep self-start font-[family-name:var(--font-display)] text-[15px] font-semibold leading-6 text-brand"
                    >
                      {channel.email}
                    </a>
                  ) : (
                    <p className="m-0 font-[family-name:var(--font-display)] text-[13px] font-semibold uppercase leading-5 tracking-[1.56px] text-white/35">
                      Address to be confirmed
                    </p>
                  )}
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-6" data-reveal="up">
              <div className="flex flex-col gap-2">
                <h2 className="m-0 font-[family-name:var(--font-display)] text-[24px] font-black uppercase leading-[1.05] tracking-[-0.01em] text-white sm:text-[30px]">
                  {contactCopy.form.title}
                </h2>
                <p className="m-0 max-w-[460px] font-[family-name:var(--font-ui)] text-[16px] leading-[1.7] text-content-secondary">
                  {contactCopy.form.body}
                </p>
              </div>
              <ContactForm />
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
