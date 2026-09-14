import type { Metadata } from "next";
import Image from "next/image";

import { MotionProvider } from "@/components/motion/MotionProvider";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SponsorsSection } from "@/components/event/SponsorsSection";
import { NewsletterSection } from "@/components/home/NewsletterSection";
import { AboutFestivals } from "@/components/about/AboutFestivals";
import { AboutStats } from "@/components/about/AboutStats";
import { AboutTeam } from "@/components/about/AboutTeam";
import { DisplayHeading } from "@/components/ui/DisplayHeading";
import { StickerPeel } from "@/components/ui/StickerPeel";
import { jazzablanca } from "@/data/events";
import { aboutCopy, aboutFestivals, stats, team } from "@/data/about";

export const metadata: Metadata = {
  title: "About us — SEVENPM",
  description: aboutCopy.manifesto,
};

/**
 * About page. No Figma comp for this one — it is composed from the system the
 * other pages established (shell grid, Daltown display type, Roboto body,
 * info tiles, stickers, GSAP reveals), with content from seven-pm.com.
 */
export default function AboutPage() {
  const { contact } = aboutCopy;

  return (
    <>
      <MotionProvider />
      <SiteHeader />
      <main>
        {/* Hero: title + manifesto */}
        <section className="relative overflow-hidden">
          <div
            className="pointer-events-none absolute inset-0 mx-auto hidden max-w-[1512px] xl:block"
            aria-hidden
          >
            <StickerPeel
              className="pointer-events-auto"
              imageSrc="/assets/sticker-smiley.png"
              width={150}
              height={150}
              initialPosition={{ x: 1180, y: 40 }}
              peelBackHoverPct={22}
              peelBackActivePct={34}
              shadowIntensity={0.6}
              lightingIntensity={0.12}
            />
          </div>
          <div className="shell flex flex-col gap-10 pb-16 pt-6 xl:gap-12 xl:pb-24 xl:pt-16">
            <p
              className="m-0 font-[family-name:var(--font-display)] text-[13px] font-semibold uppercase tracking-[1.56px] text-brand"
              data-reveal="up"
            >
              {aboutCopy.eyebrow}
            </p>
            <DisplayHeading as="h1" align="left" reveal="clip">
              {aboutCopy.title}
            </DisplayHeading>
            <div className="grid gap-8 lg:grid-cols-12">
              <p
                className="m-0 font-[family-name:var(--font-display)] text-[22px] font-bold uppercase leading-7 tracking-[-0.11px] text-white lg:col-span-7 lg:text-[28px] lg:leading-9"
                data-reveal="up"
                data-reveal-delay="0.1"
              >
                {aboutCopy.manifesto}
              </p>
              <div
                className="relative h-[220px] overflow-hidden lg:col-span-5 lg:h-auto lg:min-h-[260px]"
                data-reveal="scale"
                data-reveal-delay="0.2"
              >
                <Image
                  src="/assets/gallery-2.jpg"
                  alt="A SEVENPM crowd at night"
                  fill
                  sizes="(min-width: 1024px) 500px, 100vw"
                  priority
                  className="object-cover"
                  data-parallax="-0.08"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Numbers */}
        <section className="relative">
          <div className="shell">
            <AboutStats stats={stats} />
          </div>
        </section>

        {/* Story + pillars */}
        <section id="story" className="relative py-16 xl:py-24">
          <div className="shell flex flex-col gap-16">
            <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
              <div
                className="relative aspect-[4/3] overflow-hidden lg:col-span-6"
                data-reveal="scale"
              >
                <Image
                  src={aboutCopy.story.image}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 620px, 100vw"
                  className="object-cover"
                />
              </div>
              <div
                className="flex flex-col justify-center gap-6 lg:col-span-6"
                data-reveal="up"
              >
                <h2 className="m-0 font-[family-name:var(--font-display)] text-[32px] font-black uppercase leading-[0.95] tracking-[-0.02em] text-white sm:text-[44px]">
                  {aboutCopy.story.title}
                </h2>
                {aboutCopy.story.body.map((paragraph) => (
                  <p
                    key={paragraph}
                    className="m-0 font-[family-name:var(--font-display)] text-[17px] leading-6 tracking-[0.085px] text-content-secondary"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            <ul
              className="m-0 grid list-none gap-8 p-0 md:grid-cols-3"
              data-reveal="up"
              data-reveal-stagger
            >
              {aboutCopy.pillars.map((pillar, i) => (
                <li
                  key={pillar.label}
                  className="lift info-tile flex flex-col gap-6 border border-ink-600 p-8"
                >
                  <span className="font-daltown text-[64px] leading-none text-brand">
                    0{i + 1}
                  </span>
                  <div className="flex flex-col gap-3">
                    <h3 className="m-0 font-[family-name:var(--font-display)] text-[22px] font-bold uppercase leading-7 tracking-[-0.11px] text-white">
                      {pillar.label}
                    </h3>
                    <p className="m-0 font-[family-name:var(--font-display)] text-[17px] leading-6 tracking-[0.085px] text-content-secondary">
                      {pillar.body}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <AboutFestivals festivals={aboutFestivals} />
        <AboutTeam
          members={team}
          title={aboutCopy.team.title}
          body={aboutCopy.team.body}
        />
        <SponsorsSection event={jazzablanca} />

        {/* Careers + contact */}
        <section id="careers" className="relative py-16 xl:py-24">
          <div className="shell grid gap-12 lg:grid-cols-12">
            <div className="flex flex-col gap-6 lg:col-span-7" data-reveal="up">
              <h2 className="m-0 font-[family-name:var(--font-display)] text-[32px] font-black uppercase leading-[0.95] tracking-[-0.02em] text-brand sm:text-[48px]">
                Join the team
              </h2>
              <p className="m-0 max-w-[560px] font-[family-name:var(--font-display)] text-[17px] leading-6 tracking-[0.085px] text-content-secondary">
                We are a small, dedicated crew producing four festivals a year
                across Morocco. If you live for live music, we want to hear from
                you.
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href={contact.careersUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="sweep flex items-center bg-brand px-5 py-4 font-[family-name:var(--font-display)] text-[17px] font-semibold leading-6 text-[#0b0b0e]"
                  data-magnetic="0.2"
                >
                  <span className="relative z-10">See open roles</span>
                </a>
                <a
                  href={contact.playlistUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="btn-secondary flex items-center px-5 py-4 font-[family-name:var(--font-display)] text-[17px] font-semibold leading-6 text-content-primary"
                >
                  Our playlists
                </a>
              </div>
            </div>
            <address
              className="flex flex-col gap-6 not-italic lg:col-span-5"
              data-reveal="up"
              data-reveal-delay="0.1"
            >
              <div className="flex flex-col gap-2 border-t border-border-tertiary pt-6">
                <span className="font-[family-name:var(--font-display)] text-[13px] font-semibold uppercase tracking-[1.56px] text-content-secondary">
                  Address
                </span>
                {contact.address.map((line) => (
                  <span
                    key={line}
                    className="font-[family-name:var(--font-display)] text-[17px] leading-6 tracking-[0.085px] text-white"
                  >
                    {line}
                  </span>
                ))}
              </div>
              <div className="flex flex-col gap-2 border-t border-border-tertiary pt-6">
                <span className="font-[family-name:var(--font-display)] text-[13px] font-semibold uppercase tracking-[1.56px] text-content-secondary">
                  Contact
                </span>
                <a
                  href={`mailto:${contact.email}`}
                  className="link-sweep self-start font-[family-name:var(--font-display)] text-[17px] leading-6 tracking-[0.085px] text-white transition-colors hover:text-brand"
                >
                  {contact.email}
                </a>
              </div>
            </address>
          </div>
        </section>

        <NewsletterSection />
      </main>
      <SiteFooter />
    </>
  );
}
