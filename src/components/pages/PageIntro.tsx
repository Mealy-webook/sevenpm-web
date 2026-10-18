import { DisplayHeading } from "@/components/ui/DisplayHeading";

/**
 * The top of a standard inner page: a brand-yellow eyebrow, the display
 * heading, and a standfirst on the heading's own measure.
 *
 * Lifted out of `/team`, which drew this by hand, so that the five pages the
 * menu asked for open exactly the way the pages with comps do instead of each
 * inventing a header.
 */
export function PageIntro({
  eyebrow,
  title,
  intro,
}: {
  eyebrow: string;
  title: string;
  intro: string;
}) {
  return (
    <section className="relative">
      <div className="shell flex flex-col gap-8 pb-12 pt-6 xl:gap-10 xl:pt-16">
        <p
          className="m-0 font-[family-name:var(--font-display)] text-body-s font-semibold uppercase tracking-[1.56px] text-brand"
          data-reveal="up"
        >
          {eyebrow}
        </p>
        <DisplayHeading as="h1" align="left" reveal="clip">
          {title}
        </DisplayHeading>
        <p
          className="m-0 max-w-[720px] font-[family-name:var(--font-display)] text-title-body font-bold uppercase tracking-[-0.11px] text-white lg:text-title-section"
          data-split="lines"
          data-reveal-delay="0.1"
        >
          {intro}
        </p>
      </div>
    </section>
  );
}
