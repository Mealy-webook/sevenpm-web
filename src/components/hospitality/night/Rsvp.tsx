import Link from "next/link";

import { QuoteForm } from "@/components/hospitality/QuoteForm";
import { hospitalityCopy, nightCopy } from "@/data/hospitality";

/**
 * The last call.
 *
 * The page is an evening and this is the end of it, so the section carries
 * the clock like every other one and the form sits inside a brand-yellow
 * band rather than in a grey panel at the bottom of a page.
 *
 * The form itself is the one the package pages already use — a visitor who
 * walked in from a room keeps the same form, with that room already chosen.
 */
export function Rsvp() {
  const { stamp, title, body } = nightCopy.rsvp;
  const { email, phone } = hospitalityCopy.cta;

  return (
    <section id="rsvp" className="relative scroll-mt-24 pb-16 xl:pb-24">
      <div className="shell">
        <div
          className="flex flex-col gap-10 bg-brand p-7 text-[#18181b] sm:p-10 xl:p-14"
          style={{ borderRadius: "var(--radius)" }}
        >
          <div className="flex flex-col gap-5">
            <span className="font-[family-name:var(--font-display)] text-[12px] font-bold uppercase leading-4 tracking-[3px] text-[#18181b]/55">
              {stamp}
            </span>
            <h2
              className="m-0 max-w-[12ch] font-daltown text-[clamp(30px,5.55vw,82px)] uppercase leading-[0.88]"
              data-reveal="clip"
            >
              {title}
            </h2>
            <p className="m-0 max-w-[560px] font-[family-name:var(--font-ui)] text-[15px] leading-[1.75] text-[#18181b]/75">
              {body}
            </p>
            <p className="m-0 font-[family-name:var(--font-display)] text-[14px] font-semibold leading-6 text-[#18181b]">
              {email} · {phone}
            </p>
            <Link
              href="/contact"
              className="link-sweep self-start font-[family-name:var(--font-display)] text-[13px] font-semibold uppercase leading-6 tracking-[1.56px] text-[#18181b]"
            >
              Or talk to the team
            </Link>
          </div>

          {/* The form keeps the site's dark fields: inverted on the yellow it
              would read as a second page rather than as the thing to fill
              in. */}
          <div
            className="bg-[#0b0b0e] p-6 xl:p-9"
            style={{ borderRadius: "var(--radius)" }}
          >
            <QuoteForm bare />
          </div>
        </div>
      </div>
    </section>
  );
}
