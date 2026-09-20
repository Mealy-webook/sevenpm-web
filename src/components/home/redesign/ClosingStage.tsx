import Image from "next/image";

import { DisplayHeading } from "@/components/ui/DisplayHeading";
import { homeCopy, homeStory } from "@/data/home";

/**
 * The last screen: the newsletter as the page's closing statement, in the
 * display face, with the accounts under it. Where `NewsletterSection` is a
 * block before the footer, this is a destination.
 */
export function ClosingStage() {
  const { title, body, cta } = homeCopy.newsletter;
  return (
    <section
      id="newsletter"
      className="section-screen relative py-16 xl:py-24"
    >
      <div className="shell flex flex-col items-center gap-10 text-center">
        <DisplayHeading reveal="clip" size="faq">
          {title}
        </DisplayHeading>
        <p
          className="m-0 max-w-[640px] font-[family-name:var(--font-display)] text-[17px] leading-[1.6] text-content-secondary"
          data-split="lines"
        >
          {body}
        </p>
        <div
          className="flex flex-wrap items-center justify-center gap-4"
          data-reveal="up"
        >
          <a
            href="#newsletter"
            data-magnetic="0.25"
            className="lift inline-flex items-center bg-brand px-8 py-5 font-[family-name:var(--font-display)] text-[17px] font-semibold leading-none text-[#18181b] transition-colors hover:bg-white"
          >
            {cta}
          </a>
          <nav
            aria-label="SEVENPM social accounts"
            className="flex flex-wrap justify-center gap-3"
          >
            {homeStory.socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={social.label}
                className="btn-secondary flex size-[58px] items-center justify-center"
              >
                <Image
                  src={social.icon}
                  alt=""
                  width={24}
                  height={24}
                  className="size-6"
                />
              </a>
            ))}
          </nav>
        </div>
      </div>
    </section>
  );
}
