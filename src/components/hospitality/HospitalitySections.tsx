import Link from "next/link";

import { PhotoSlot } from "@/components/pages/PhotoSlot";
import { DisplayHeading } from "@/components/ui/DisplayHeading";
import { hospitalityCopy } from "@/data/hospitality";

/** Hero: wide photograph, then the title and the two ways in. */
export function HospitalityHero() {
  const { eyebrow, title, intro, heroPhoto, primary, secondary } =
    hospitalityCopy;

  return (
    <section className="relative">
      <PhotoSlot
        caption={heroPhoto}
        src={hospitalityCopy.heroImage}
        rounded={false}
        priority
        sizes="100vw"
        className="min-h-[220px] w-full xl:min-h-[320px]"
      />
      <div className="shell flex flex-col gap-7 py-10 xl:py-14">
        <p
          className="m-0 font-[family-name:var(--font-display)] text-[13px] font-semibold uppercase leading-4 tracking-[1.56px] text-brand"
          data-reveal="up"
        >
          {eyebrow}
        </p>
        <DisplayHeading as="h1" align="left" reveal="clip">
          {title}
        </DisplayHeading>
        <p
          className="m-0 max-w-[620px] font-[family-name:var(--font-ui)] text-[16px] leading-[1.7] text-content-secondary"
          data-split="lines"
          data-reveal-delay="0.1"
        >
          {intro}
        </p>
        <div className="flex flex-wrap items-center gap-3" data-reveal="up">
          <Link
            href={primary.href}
            data-magnetic="0.2"
            className="sweep flex items-center bg-brand px-5 py-4 font-[family-name:var(--font-display)] text-[15px] font-semibold leading-6 text-[#0b0b0e]"
          >
            <span className="relative z-10">{primary.label}</span>
          </Link>
          <Link
            href={secondary.href}
            className="btn-secondary flex items-center border border-white/25 px-5 py-4 font-[family-name:var(--font-display)] text-[15px] font-semibold leading-6 text-white transition-colors hover:border-white/60"
          >
            {secondary.label}
          </Link>
        </div>
      </div>
    </section>
  );
}

/** The three promises, each under its own yellow rule. */
export function HospitalityHighlights() {
  return (
    <section className="relative pb-6 xl:pb-10">
      <div className="shell grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-3">
        {hospitalityCopy.highlights.map((item) => (
          <div
            key={item.title}
            data-reveal="up"
            className="flex flex-col gap-2 border-t-2 border-brand pt-4"
          >
            <h2 className="m-0 font-[family-name:var(--font-display)] text-[17px] font-bold leading-6 text-white">
              {item.title}
            </h2>
            <p className="m-0 font-[family-name:var(--font-ui)] text-[14px] leading-[1.6] text-content-secondary">
              {item.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

/** "From request to the show". */
export function HospitalityHow() {
  const { eyebrow, title, steps } = hospitalityCopy.how;
  return (
    <section className="relative border-t border-white/10 bg-ink-900 py-14 xl:py-20">
      <div className="shell flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <p
            className="m-0 font-[family-name:var(--font-display)] text-[13px] font-semibold uppercase leading-4 tracking-[1.56px] text-brand"
            data-reveal="up"
          >
            {eyebrow}
          </p>
          <DisplayHeading align="left" reveal="clip" size="faq">
            {title}
          </DisplayHeading>
        </div>
        <ol className="m-0 grid list-none grid-cols-1 gap-8 p-0 sm:grid-cols-2 xl:grid-cols-4">
          {steps.map((step, index) => (
            <li key={step.title} data-reveal="up" className="flex flex-col gap-2">
              <p className="m-0 font-[family-name:var(--font-display)] text-[13px] font-semibold leading-5 tabular-nums text-brand">
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

/**
 * "Good to know". A plain `<details>` list: these answers are one paragraph
 * each, where the event page's FAQ carries richer blocks and needs its own
 * component. The marker is a rotating triangle, as the mockup draws it.
 */
export function HospitalityFaq() {
  const { eyebrow, title, items } = hospitalityCopy.faq;
  return (
    <section className="relative py-14 xl:py-20">
      <div className="shell grid gap-10 lg:grid-cols-[minmax(0,320px)_1fr] lg:gap-16">
        <div className="flex flex-col gap-4">
          <p
            className="m-0 font-[family-name:var(--font-display)] text-[13px] font-semibold uppercase leading-4 tracking-[1.56px] text-brand"
            data-reveal="up"
          >
            {eyebrow}
          </p>
          <DisplayHeading align="left" reveal="clip" size="faq">
            {title}
          </DisplayHeading>
        </div>

        <ul className="m-0 flex list-none flex-col p-0">
          {items.map((item) => (
            <li key={item.q} data-reveal="up" className="border-b border-white/10">
              <details className="group">
                <summary className="flex cursor-pointer items-center gap-3 py-5 font-[family-name:var(--font-display)] text-[16px] font-bold leading-6 text-white [&::-webkit-details-marker]:hidden">
                  <span
                    aria-hidden
                    className="text-brand transition-transform group-open:rotate-90"
                  >
                    ▶
                  </span>
                  {item.q}
                </summary>
                <div className="pb-5 pl-7">
                  <p className="m-0 max-w-[620px] font-[family-name:var(--font-ui)] text-[14px] leading-[1.7] text-content-secondary">
                    {item.a}
                  </p>
                </div>
              </details>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** The yellow band at the foot. */
export function HospitalityCta() {
  const { title, email, phone, label } = hospitalityCopy.cta;
  return (
    <section className="relative pb-14 xl:pb-20">
      <div className="shell">
        <div
          data-reveal="up"
          className="flex flex-col items-start gap-6 bg-brand p-8 text-[#18181b] lg:flex-row lg:items-center lg:justify-between xl:p-12"
          style={{ borderRadius: "var(--radius)" }}
        >
          <div className="flex flex-col gap-2">
            <h2 className="m-0 font-daltown text-[clamp(25px,4.23vw,44px)] uppercase leading-[0.95]">
              {title}
            </h2>
            <p className="m-0 font-[family-name:var(--font-ui)] text-[14px] leading-6 text-[#18181b]/70">
              {email} · {phone}
            </p>
          </div>
          <Link
            href="#quote"
            className="flex shrink-0 items-center bg-[#0b0b0e] px-5 py-4 font-[family-name:var(--font-display)] text-[15px] font-semibold leading-6 text-white transition-colors hover:bg-[#0b0b0e]/85"
            style={{ borderRadius: "var(--radius)" }}
          >
            {label}
          </Link>
        </div>
      </div>
    </section>
  );
}
