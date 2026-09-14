import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { MotionProvider } from "@/components/motion/MotionProvider";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { DisplayHeading } from "@/components/ui/DisplayHeading";
import { careersCopy, jobRoles, perks } from "@/data/careers";

export const metadata: Metadata = {
  title: "Careers — SEVENPM",
  description: careersCopy.intro,
};

/**
 * `/careers`. No Figma comp — the site's own parts: the display heading, the
 * info tiles from the event page for "what it's like", and the About page's
 * festival index turned into a list of open roles.
 */
export default function CareersPage() {
  return (
    <>
      <MotionProvider />
      <SiteHeader />
      <main>
        {/* Hero */}
        <section className="relative">
          <div className="shell flex flex-col gap-10 pb-12 pt-6 xl:gap-12 xl:pt-16">
            <p
              className="m-0 font-[family-name:var(--font-display)] text-[13px] font-semibold uppercase tracking-[1.56px] text-brand"
              data-reveal="up"
            >
              {careersCopy.eyebrow}
            </p>
            <DisplayHeading as="h1" align="left" reveal="clip">
              {careersCopy.title}
            </DisplayHeading>
            <div className="grid gap-8 lg:grid-cols-12">
              <p
                className="m-0 font-[family-name:var(--font-display)] text-[22px] font-bold uppercase leading-7 tracking-[-0.11px] text-white lg:col-span-7 lg:text-[28px] lg:leading-9"
                data-split="lines"
                data-reveal-delay="0.1"
              >
                {careersCopy.intro}
              </p>
              <div
                className="relative h-[220px] overflow-hidden lg:col-span-5 lg:h-auto lg:min-h-[260px]"
                data-reveal="scale"
                data-reveal-delay="0.2"
              >
                <Image
                  src="/assets/gallery-5.jpg"
                  alt="The SEVENPM crew on site"
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

        {/* What it's like */}
        <section className="relative py-16 xl:py-24">
          <div className="shell flex flex-col gap-10">
            <h2
              className="m-0 font-[family-name:var(--font-display)] text-[32px] font-black uppercase leading-[0.95] tracking-[-0.02em] text-white sm:text-[44px]"
              data-reveal="up"
            >
              {careersCopy.perksTitle}
            </h2>
            <ul
              className="m-0 grid list-none gap-8 p-0 md:grid-cols-3"
              data-reveal="up"
              data-reveal-stagger
            >
              {perks.map((perk, i) => (
                <li
                  key={perk.title}
                  className="lift info-tile flex flex-col gap-6 border border-ink-600 p-8"
                >
                  <span className="font-daltown text-[64px] leading-none text-brand">
                    0{i + 1}
                  </span>
                  <div className="flex flex-col gap-3">
                    <h3 className="m-0 font-[family-name:var(--font-display)] text-[22px] font-bold uppercase leading-7 tracking-[-0.11px] text-white">
                      {perk.title}
                    </h3>
                    <p className="m-0 font-[family-name:var(--font-display)] text-[17px] leading-6 tracking-[0.085px] text-content-secondary">
                      {perk.body}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Open roles */}
        <section id="roles" className="relative bg-ink-900 py-16 xl:py-24">
          <div className="shell flex flex-col gap-10">
            <div className="flex flex-wrap items-baseline justify-between gap-4">
              <h2
                className="m-0 font-[family-name:var(--font-display)] text-[32px] font-black uppercase leading-[0.95] tracking-[-0.02em] text-white sm:text-[44px]"
                data-reveal="up"
              >
                {careersCopy.openRolesTitle}
              </h2>
              <span className="font-[family-name:var(--font-display)] text-[13px] font-semibold uppercase tracking-[1.56px] text-content-secondary">
                {jobRoles.length} open
              </span>
            </div>

            {jobRoles.length === 0 ? (
              <p className="m-0 max-w-[560px] font-[family-name:var(--font-display)] text-[17px] leading-6 tracking-[0.085px] text-content-secondary">
                {careersCopy.empty}
              </p>
            ) : (
              <ol
                className="m-0 flex list-none flex-col p-0"
                data-reveal="up"
                data-reveal-stagger
              >
                {jobRoles.map((role) => (
                  <li
                    key={role.id}
                    className="group border-b border-border-tertiary transition-colors hover:border-white/25"
                  >
                    <Link
                      href={`/careers/${role.id}`}
                      data-cursor="Open"
                      className="flex flex-col gap-4 py-8 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <span className="flex min-w-0 flex-col gap-2">
                        <span className="font-[family-name:var(--font-display)] text-[26px] font-black uppercase leading-[0.95] tracking-[-0.02em] text-white transition-colors group-hover:text-brand sm:text-[32px]">
                          {role.title}
                        </span>
                        <span className="flex flex-wrap items-center gap-x-6 gap-y-1 font-[family-name:var(--font-display)] text-[13px] font-semibold uppercase leading-5 tracking-[1.56px] text-content-secondary">
                          <span>{role.team}</span>
                          <span>{role.location}</span>
                          <span className="text-brand">{role.type}</span>
                        </span>
                      </span>
                      <span className="btn-secondary flex shrink-0 items-center justify-center self-start px-5 py-4 font-[family-name:var(--font-display)] text-[17px] font-semibold leading-6 text-content-primary sm:self-auto">
                        <span className="flex h-5 items-center">
                          {careersCopy.viewRole}
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </section>

        {/* Speculative */}
        <section className="relative py-16 xl:py-24">
          <div className="shell grid gap-10 lg:grid-cols-12">
            <div className="flex flex-col gap-6 lg:col-span-7" data-reveal="up">
              <h2 className="m-0 font-[family-name:var(--font-display)] text-[32px] font-black uppercase leading-[0.95] tracking-[-0.02em] text-brand sm:text-[48px]">
                {careersCopy.speculativeTitle}
              </h2>
              <p className="m-0 max-w-[560px] font-[family-name:var(--font-display)] text-[17px] leading-6 tracking-[0.085px] text-content-secondary">
                {careersCopy.speculativeBody}
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href={`mailto:${careersCopy.email}`}
                  data-magnetic="0.2"
                  className="sweep flex items-center bg-brand px-5 py-4 font-[family-name:var(--font-display)] text-[17px] font-semibold leading-6 text-[#0b0b0e]"
                >
                  <span className="relative z-10">
                    {careersCopy.speculativeCta}
                  </span>
                </a>
                <Link
                  href="/team"
                  className="btn-secondary flex items-center px-5 py-4 font-[family-name:var(--font-display)] text-[17px] font-semibold leading-6 text-content-primary"
                >
                  Meet the team
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
