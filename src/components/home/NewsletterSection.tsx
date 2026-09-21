import { homeCopy } from "@/data/home";

/**
 * "Be the first to know", from Figma 15:691. Roboto Black 48 in brand yellow,
 * Inter body, and the pill Subscribe button. The comp has no input field —
 * the button is the entry point, so it links to the signup anchor.
 */
export function NewsletterSection() {
  const { title, body, cta } = homeCopy.newsletter;

  return (
    <section id="newsletter" className="relative pt-16 xl:pt-24 xl:pb-[72px]">
      <div className="shell flex flex-col items-center gap-6" data-reveal="up">
        <div className="flex w-full flex-col items-center gap-1 text-center">
          <h2 className="m-0 font-[family-name:var(--font-display)] text-[32px] font-black uppercase leading-[1] text-brand sm:text-[48px] sm:leading-[46px]">
            {title}
          </h2>
          <p className="m-0 max-w-[636px] font-[family-name:var(--font-ui)] text-[16px] leading-[1.6] text-text-secondary">
            {body}
          </p>
        </div>
        <a
          href="#newsletter"
          data-magnetic="0.25"
          className="lift inline-flex items-center bg-brand px-7 py-4 font-[family-name:var(--font-ui)] text-[16px] font-semibold leading-none text-text-inverse transition-colors hover:bg-white"
        >
          {cta}
        </a>
      </div>
    </section>
  );
}
