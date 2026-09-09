import Image from "next/image";

import type { EventDetails } from "@/data/events";
import { DISPLAY_ART, DisplayHeading } from "@/components/ui/DisplayHeading";

export function TicketsSection({ event }: { event: EventDetails }) {
  return (
    <section id="tickets" className="relative py-16 xl:py-24">
      <div className="shell flex flex-col items-center justify-center gap-12">
        <DisplayHeading art={DISPLAY_ART.tickets} reveal="clip">
          Tickets
        </DisplayHeading>

        {/* Gates open / Last entry / Showtime */}
        <div
          className="flex flex-wrap items-center justify-center gap-8"
          data-reveal="up"
        >
          {event.schedule.map((tile, index) => (
            <div key={tile.label} className="flex items-center gap-8">
              {index > 0 && (
                <span
                  aria-hidden
                  className="hidden h-[81px] w-px bg-ink-600 sm:block"
                />
              )}
              <div className="flex items-center gap-4 rounded-3xl px-2 py-3">
                <Image
                  src={tile.icon}
                  alt=""
                  width={32}
                  height={32}
                  className="size-8 shrink-0"
                />
                <div className="flex flex-col items-start whitespace-nowrap">
                  <span className="font-[family-name:var(--font-ui)] text-sm leading-[1.5] text-text-secondary">
                    {tile.label}
                  </span>
                  <span className="font-[family-name:var(--font-display)] text-2xl font-semibold leading-[1.22] tracking-[-0.12px] text-text-primary">
                    {tile.value}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tiers */}
        <div
          className="flex w-full flex-col items-stretch justify-center gap-8 lg:flex-row lg:items-start"
          data-reveal="up"
          data-reveal-stagger
        >
          {event.ticketTiers.map((tier) => (
            <div
              key={tier.id}
              className={`lift tier-card flex flex-col items-start gap-4 overflow-hidden px-7 py-8 lg:h-[426px] ${
                tier.featured
                  ? "tier-card--featured border-2 border-brand lg:w-[386.667px] lg:shrink-0"
                  : "border border-ink-600 lg:min-w-0 lg:flex-1"
              }`}
            >
              {tier.badge ? (
                <span className="rounded-full bg-white px-3 py-1.5 font-[family-name:var(--font-ui)] text-sm leading-[1.5] text-black">
                  {tier.badge}
                </span>
              ) : (
                <span className="font-[family-name:var(--font-ui)] text-sm leading-[1.5] text-text-secondary">
                  {tier.kicker}
                </span>
              )}

              <p className="w-full font-[family-name:var(--font-display)] text-2xl font-semibold leading-[1.22] tracking-[-0.12px] text-text-primary">
                {tier.title}
              </p>
              <p className="w-full font-[family-name:var(--font-display)] text-5xl font-black uppercase leading-[46px] text-white">
                {tier.price}
              </p>

              <ul className="flex w-full flex-1 flex-col gap-3 overflow-hidden">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex w-full items-start gap-3">
                    <Image
                      src="/assets/ic-dot.svg"
                      alt=""
                      width={8}
                      height={16}
                      className="h-4 w-2 shrink-0"
                    />
                    <span className="min-w-0 flex-1 font-[family-name:var(--font-display)] text-lg leading-[1.6] text-white">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <button
                type="button"
                data-magnetic="0.18"
                className={`sweep flex w-full items-center justify-center overflow-hidden p-6 font-[family-name:var(--font-display)] text-base font-semibold uppercase leading-none transition-colors ${
                  tier.featured
                    ? "bg-brand text-text-inverse hover:bg-[#e8d915]"
                    : "sweep-invert border-[1.5px] border-text-secondary text-white hover:border-white"
                }`}
              >
                {tier.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
