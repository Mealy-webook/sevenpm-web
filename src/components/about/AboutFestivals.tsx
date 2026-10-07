"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import type { AboutFestival } from "@/data/about";
import { DisplayHeading } from "@/components/ui/DisplayHeading";

/**
 * The four festivals as an index: hovering a row swaps the poster on the
 * right. Rows carry the city, edition count, description and the festival's
 * own site and Instagram.
 */
export function AboutFestivals({ festivals }: { festivals: AboutFestival[] }) {
  const [active, setActive] = useState(0);
  const current = festivals[active];

  return (
    <section id="festivals" className="relative py-16 xl:py-24">
      <div className="shell flex flex-col gap-12">
        <DisplayHeading align="left" reveal="clip">
          Our festivals
        </DisplayHeading>

        <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:gap-16">
          <ol
            className="m-0 flex min-w-0 flex-1 list-none flex-col p-0"
            data-reveal="up"
            data-reveal-stagger
          >
            {festivals.map((festival, i) => {
              const inner = (
                <>
                  <span className="flex items-baseline justify-between gap-6">
                    <span className="flex items-baseline gap-4">
                      <span className="font-daltown text-[22px] leading-none text-content-secondary">
                        0{i + 1}
                      </span>
                      <span className="font-[family-name:var(--font-display)] text-[32px] font-black uppercase leading-[0.95] tracking-[-0.02em] text-white transition-colors duration-300 group-hover:text-brand sm:text-[44px]">
                        {festival.name}
                      </span>
                    </span>
                    <span className="hidden whitespace-nowrap font-[family-name:var(--font-display)] text-[13px] font-semibold uppercase tracking-[1.56px] text-content-secondary sm:block">
                      {festival.city}
                    </span>
                  </span>
                  <span className="mt-4 block max-w-[560px] font-[family-name:var(--font-display)] text-[17px] leading-6 tracking-[0.085px] text-content-secondary">
                    {festival.body}
                  </span>
                  <span className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 font-[family-name:var(--font-display)] text-[13px] font-semibold uppercase tracking-[1.56px] text-text-primary">
                    {festival.since && (
                      <span className="text-brand">{festival.since}</span>
                    )}
                    {festival.href && (
                      <span className="link-sweep">Event page</span>
                    )}
                  </span>
                </>
              );

              return (
                <li
                  key={festival.name}
                  className="group border-b border-border-tertiary py-8 transition-colors duration-300 hover:border-white/25"
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                >
                  {festival.href ? (
                    <Link href={festival.href} className="block">
                      {inner}
                    </Link>
                  ) : (
                    <div>{inner}</div>
                  )}
                  <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 font-[family-name:var(--font-display)] text-[13px] font-semibold uppercase tracking-[1.56px]">
                    {festival.website && (
                      <a
                        href={festival.website}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="link-sweep text-content-secondary transition-colors hover:text-white"
                      >
                        Website
                      </a>
                    )}
                    {festival.instagram && (
                      <a
                        href={festival.instagram}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="link-sweep text-content-secondary transition-colors hover:text-white"
                      >
                        Instagram
                      </a>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>

          {/* Poster of the hovered festival */}
          <div
            className="relative hidden aspect-[3/4] w-[360px] shrink-0 lg:block lg:sticky lg:top-24"
            data-reveal="scale"
            aria-hidden
          >
            {festivals.map((festival, i) => (
              <Image
                key={festival.name}
                src={festival.poster}
                alt=""
                fill
                sizes="360px"
                className={`object-contain transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  i === active ? "opacity-100 scale-100" : "opacity-0 scale-95"
                }`}
              />
            ))}
            <span className="sr-only">{current?.name}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
