import Image from "next/image";

import { jazzablanca } from "@/data/events";
import { Cta, SectionHead, bill } from "./shared";

/**
 * E · Headliner — top of the bill and the support.
 *
 * Not two equals. The first festival takes two thirds — poster, name, its
 * own standfirst and the way in — and the second sits beside it as the
 * smaller billing. It reads as a programme with an order to it, and it
 * gives the one festival that is on sale the room to sell.
 */
export function UpcomingFeature() {
  const [lead, ...rest] = bill;
  if (!lead) return null;
  /* Only Jazzablanca has a written standfirst; anything else goes without. */
  const intro = lead.id === jazzablanca.slug ? jazzablanca.intro : undefined;

  return (
    <section aria-labelledby="up-feature" className="relative py-16 xl:py-20">
      <div className="shell flex flex-col gap-8 xl:gap-12">
        <SectionHead id="up-feature" />

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[2fr_1fr]">
          {/* Top of the bill */}
          <article
            data-reveal="up"
            className="group flex flex-col gap-6 bg-bg-secondary p-6 sm:flex-row xl:gap-8 xl:p-8"
          >
            <span className="relative block aspect-square w-full shrink-0 self-start overflow-hidden sm:w-[46%]">
              <Image
                src={lead.card as string}
                alt={`${lead.name} poster`}
                fill
                sizes="(min-width: 1024px) 380px, (min-width: 640px) 46vw, 100vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
            </span>
            <div className="flex flex-1 flex-col justify-between gap-6">
              <div className="flex flex-col gap-4">
                <span className="w-fit bg-brand px-3 py-1.5 font-[family-name:var(--font-display)] text-caption font-semibold uppercase tracking-[0.1em] text-[#0b0b0e]">
                  Next up · {lead.edition}
                </span>
                <h3 className="card-title text-white">{lead.name}</h3>
                <p className="m-0 font-[family-name:var(--font-display)] text-body font-medium text-text-primary">
                  {[lead.when, lead.city].filter(Boolean).join(" · ")}
                </p>
                {intro ? (
                  <p className="m-0 line-clamp-4 font-[family-name:var(--font-ui)] text-body text-text-secondary">
                    {intro}
                  </p>
                ) : null}
              </div>
              <Cta festival={lead} className="w-full sm:w-fit" />
            </div>
          </article>

          {/* The support */}
          {rest.map((f) => (
            <article
              key={f.id}
              data-reveal="up"
              className="group flex flex-col gap-5 border border-white/10 p-6 xl:p-8"
            >
              <span className="font-[family-name:var(--font-display)] text-caption font-semibold uppercase tracking-[0.1em] text-text-secondary">
                Then · {f.edition}
              </span>
              <span className="relative block aspect-square w-full overflow-hidden">
                <Image
                  src={f.card as string}
                  alt={`${f.name} poster`}
                  fill
                  sizes="(min-width: 1024px) 340px, 100vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
              </span>
              <div className="flex flex-col gap-1">
                <h3 className="card-title text-white">{f.name}</h3>
                <span className="font-[family-name:var(--font-display)] text-body text-text-secondary">
                  {[f.when, f.city].filter(Boolean).join(" · ")}
                </span>
              </div>
              <Cta festival={f} className="mt-auto w-full" />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
