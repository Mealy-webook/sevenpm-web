import type { EventDetails } from "@/data/events";
import { DisplayHeading } from "@/components/ui/DisplayHeading";
import { StubTilt } from "./StubTilt";
import { TicketStub, stubWidth } from "./TicketStub";
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
        <DisplayHeading reveal="clip">Explore tickets</DisplayHeading>

        {/* Ticket stubs — edge to edge, 393px each, wrapping below the
         *  column width and scaling down on phones */}
        <div
          className="flex w-full flex-wrap items-start justify-center"
          data-reveal="up"
          data-reveal-stagger
        >
          {event.ticketTiers.map((tier) => (
            <div
              key={tier.id}
              className="ticket-stub-box"
              style={
                { "--stub-w": `${stubWidth(tier)}px` } as React.CSSProperties
              }
            >
              <StubTilt>
                <div className="ticket-stub-scale">
                  <TicketStub
                    tier={tier}
                    href={`/events/${event.slug}/book?tier=${tier.id}`}
                  />
                </div>
              </StubTilt>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
