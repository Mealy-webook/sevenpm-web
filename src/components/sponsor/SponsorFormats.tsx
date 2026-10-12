import Link from "next/link";

import { DisplayHeading } from "@/components/ui/DisplayHeading";
import { sponsorCopy } from "@/data/sponsor";
import { Eyebrow } from "./SponsorSections";

/** "From logo to experience" — five formats, then the tailor-made card. */
export function SponsorFormats() {
  const { eyebrow, title, intro, items, tailored } = sponsorCopy.formats;

  return (
    <section className="relative py-14 xl:py-20">
      <div className="shell flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <Eyebrow>{eyebrow}</Eyebrow>
          <DisplayHeading align="left" reveal="clip" size="faq">
            {title}
          </DisplayHeading>
          <p
            className="m-0 max-w-[620px] font-[family-name:var(--font-ui)] text-[15px] leading-[1.7] text-content-secondary"
            data-reveal="up"
          >
            {intro}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {items.map((item, index) => (
            <div
              key={item.title}
              data-reveal="up"
              className="flex flex-col gap-3 border border-white/10 bg-ink-900 p-7 xl:p-8"
              style={{ borderRadius: "var(--radius)" }}
            >
              <p className="m-0 font-[family-name:var(--font-display)] text-[19px] font-black leading-7 tabular-nums text-brand">
                {String(index + 1).padStart(2, "0")}
              </p>
              <h3 className="m-0 font-[family-name:var(--font-display)] text-[18px] font-bold leading-7 text-white">
                {item.title}
              </h3>
              <p className="m-0 font-[family-name:var(--font-ui)] text-[14px] leading-[1.7] text-content-secondary">
                {item.body}
                {item.link ? (
                  <>
                    {" "}
                    <Link
                      href={item.link.href}
                      className="text-brand underline underline-offset-2"
                    >
                      {item.link.label}
                    </Link>
                  </>
                ) : null}
              </p>
            </div>
          ))}

          {/* The sixth slot is the invitation, not a format. */}
          <div
            data-reveal="up"
            className="flex flex-col items-start gap-3 bg-brand p-7 text-[#18181b] xl:p-8"
            style={{ borderRadius: "var(--radius)" }}
          >
            <h3 className="m-0 font-[family-name:var(--font-display)] text-[18px] font-bold leading-7">
              {tailored.title}
            </h3>
            <p className="m-0 font-[family-name:var(--font-ui)] text-[14px] leading-[1.7] text-[#18181b]/75">
              {tailored.body}
            </p>
            <Link
              href="#partnership-form"
              className="mt-auto flex items-center bg-[#0b0b0e] px-5 py-3 font-[family-name:var(--font-display)] text-[14px] font-semibold leading-6 text-white transition-colors hover:bg-[#0b0b0e]/85"
              style={{ borderRadius: "var(--radius)" }}
            >
              {tailored.label}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/** "Four steps, one contact" — the mockup's yellow rule over each step. */
export function SponsorHow() {
  const { eyebrow, title, steps } = sponsorCopy.how;

  return (
    <section className="relative border-t border-white/10 bg-ink-900 py-14 xl:py-20">
      <div className="shell flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <Eyebrow>{eyebrow}</Eyebrow>
          <DisplayHeading align="left" reveal="clip" size="faq">
            {title}
          </DisplayHeading>
        </div>
        <ol className="m-0 grid list-none grid-cols-1 gap-8 p-0 sm:grid-cols-2 xl:grid-cols-4">
          {steps.map((step, index) => (
            <li
              key={step.title}
              data-reveal="up"
              className="flex flex-col gap-2 border-t-2 border-brand pt-4"
            >
              <p className="m-0 font-[family-name:var(--font-display)] text-[13px] font-semibold leading-5 tabular-nums text-white/45">
                {String(index + 1).padStart(2, "0")}
              </p>
              <h3 className="m-0 font-[family-name:var(--font-display)] text-[17px] font-bold leading-6 text-white">
                {step.title}
              </h3>
              <p className="m-0 font-[family-name:var(--font-ui)] text-[14px] leading-[1.6] text-content-secondary">
                {step.body}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
