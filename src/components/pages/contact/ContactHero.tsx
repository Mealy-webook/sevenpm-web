import { contactCopy } from "@/data/pages";

/**
 * The top of `/contact`: the eyebrow, the title and the standfirst. (The
 * two taped polaroids that sat beside it were removed by request.)
 */
export function ContactHero() {
  const { eyebrow, title, intro } = contactCopy;
  return (
    <section className="relative overflow-hidden pb-8 pt-10 xl:pb-12 xl:pt-16">
      <div className="shell">
        <div className="flex flex-col gap-6">
          <p
            className="m-0 font-[family-name:var(--font-display)] text-[13px] font-semibold uppercase tracking-[0.16em] text-brand"
            data-reveal="up"
          >
            {eyebrow}
          </p>
          <h1 className="display-text text-white" data-reveal="clip">
            {title}
          </h1>
          <p
            className="m-0 max-w-[520px] font-[family-name:var(--font-display)] text-[17px] leading-[26px] text-content-secondary"
            data-reveal="up"
          >
            {intro}
          </p>
        </div>
      </div>
    </section>
  );
}
