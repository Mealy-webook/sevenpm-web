import Link from "next/link";

/**
 * "Put your brand on stage", from Figma 2549:17616.
 *
 * The frame is named Subscribe and is not one: it is the sponsor pitch, with
 * a dark button through to `/sponsor`. The newsletter that was here came out
 * with it.
 *
 * Same taped bill as the homepage newsletter — a degree off square with a
 * strip of tape over each opposite corner — because it is the same object,
 * carrying different words. Both the tilt and the tape live on the sheet, so
 * the tape is stuck to it rather than parked near it.
 */
export function SponsorCta() {
  return (
    <section className="relative py-16 xl:py-20" aria-labelledby="sponsor-cta">
      <div className="shell relative flex flex-col items-center">
        <div
          data-reveal="up"
          className="relative w-full max-w-[1054px] rotate-1 bg-brand px-6 py-10 text-[#18181b] sm:px-10 sm:py-10"
        >
          {/* 118 x 25 at −33.63°, on opposite corners so each one holds a
              corner down — the geometry the newsletter block measured. */}
          <span
            aria-hidden
            className="pointer-events-none absolute left-[3.01%] top-[-2.6%] z-[2] block h-[25px] w-[118px] -translate-x-1/2 -translate-y-1/2 -rotate-[33.63deg] bg-[rgba(217,217,217,0.3)]"
          />
          <span
            aria-hidden
            className="pointer-events-none absolute left-[96.99%] top-[102.6%] z-[2] block h-[25px] w-[118px] -translate-x-1/2 -translate-y-1/2 -rotate-[33.63deg] bg-[rgba(217,217,217,0.3)]"
          />

          <div className="flex flex-col items-center gap-4">
            <h2
              id="sponsor-cta"
              className="m-0 text-center font-daltown text-[clamp(38px,8vw,120px)] uppercase leading-[0.73]"
            >
              Put your brand on stage.
            </h2>
            <p className="m-0 max-w-[720px] text-center font-[family-name:var(--font-ui)] text-[16px] leading-[1.6] text-[#56565d]">
              Join Jazzablanca festivals and put your brand at the center of
              Morocco&rsquo;s live music scene.
            </p>
            <Link
              href="/sponsor"
              data-magnetic="0.2"
              className="mt-2 flex items-center bg-[#0b0b0e] px-5 py-4 font-[family-name:var(--font-display)] text-[17px] font-semibold leading-6 text-white transition-colors hover:bg-[#0b0b0e]/85"
            >
              Become a sponsor
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
