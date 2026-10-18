import Image from "next/image";

import { contactCopy } from "@/data/pages";

/**
 * The top of `/contact`: the title and the standfirst beside two
 * polaroids from the festivals, taped a few degrees apart — the same
 * prints the event page's gallery fans out, so the page opens on the
 * people you would be writing to rather than on a block of text.
 */
const PRINTS = [
  { src: "/assets/gallery-1.jpg", rotate: -6, x: "left-0", y: "top-6", tape: -4 },
  { src: "/assets/gallery-3.jpg", rotate: 5, x: "right-0", y: "top-0 lg:top-16", tape: 6 },
];

export function ContactHero() {
  const { eyebrow, title, intro } = contactCopy;
  return (
    <section className="relative overflow-hidden pb-8 pt-10 xl:pb-12 xl:pt-16">
      <div className="shell grid grid-cols-1 items-center gap-12 lg:grid-cols-[1fr_520px]">
        <div className="flex flex-col gap-6">
          <p className="m-0 font-[family-name:var(--font-display)] text-[13px] font-semibold uppercase tracking-[0.16em] text-brand" data-reveal="up">
            {eyebrow}
          </p>
          <h1 className="display-text text-white" data-reveal="clip">
            {title}
          </h1>
          <p className="m-0 max-w-[520px] font-[family-name:var(--font-display)] text-[17px] leading-[26px] text-content-secondary" data-reveal="up">
            {intro}
          </p>
        </div>

        <div aria-hidden className="relative mx-auto h-[380px] w-full max-w-[520px] sm:h-[420px]" data-reveal="up">
          {PRINTS.map((p) => (
            <div
              key={p.src}
              className={`absolute ${p.x} ${p.y} w-[62%] bg-[#f4f1ea] p-3 pb-12 shadow-[0_24px_60px_rgba(0,0,0,0.5)] transition-transform duration-500 hover:z-10 hover:!rotate-0 hover:-translate-y-2`}
              style={{ rotate: `${p.rotate}deg` }}
            >
              <span
                className="pointer-events-none absolute left-1/2 top-0 block h-[22px] w-[96px] -translate-x-1/2 -translate-y-1/2 bg-[rgba(217,217,217,0.45)]"
                style={{ rotate: `${p.tape}deg` }}
              />
              <span className="relative block aspect-square w-full overflow-hidden">
                <Image src={p.src} alt="" fill sizes="320px" className="object-cover" />
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
