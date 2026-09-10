import Image from "next/image";

import type { EventDetails } from "@/data/events";
import { DISPLAY_ART, DisplayHeading } from "@/components/ui/DisplayHeading";
import { TicketStub } from "./TicketStub";
import { StickerPeel } from "@/components/ui/StickerPeel";

export function TicketsSection({ event }: { event: EventDetails }) {
  return (
    <section id="tickets" className="relative py-16 xl:py-24">
      {/* Guitar sticker over the heading, pinned to the 1512 frame */}
      <div
        className="pointer-events-none absolute inset-0 mx-auto hidden max-w-[1512px] xl:block"
        aria-hidden
      >
        <StickerPeel
          className="pointer-events-auto"
          imageSrc="/assets/sticker-guitar.png"
          width={285}
          height={264}
          initialPosition={{ x: 853, y: 120 }}
          peelBackHoverPct={22}
          peelBackActivePct={34}
          shadowIntensity={0.6}
          lightingIntensity={0.12}
        />
      </div>

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

        {/* Ticket stubs — edge to edge, 393px each, wrapping below the
         *  column width and scaling down on phones */}
        <div
          className="flex w-full flex-wrap items-start justify-center"
          data-reveal="up"
          data-reveal-stagger
        >
          {event.ticketTiers.map((tier) => (
            <div key={tier.id} className="ticket-stub-box">
              <div className="ticket-stub-scale">
                <TicketStub tier={tier} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
