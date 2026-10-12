"use client";

import { useState } from "react";

import type { EventDetails } from "@/data/events";
import { VipBoxDialog } from "./VipBoxDialog";
import { DisplayHeading } from "@/components/ui/DisplayHeading";
import { TicketRow } from "./TicketRow";

export function TicketsSection({ event }: { event: EventDetails }) {
  /* VIP boxes are not sold here — their stub opens an enquiry instead. */
  const [enquiring, setEnquiring] = useState(false);

  return (
    <section id="tickets" className="section-screen relative py-16 xl:py-24">
      {/* Guitar sticker over the heading, pinned to the 1512 frame */}
      <div
        className="pointer-events-none absolute inset-0 mx-auto hidden max-w-[1512px] xl:block z-20"
        aria-hidden
      >
      </div>

      <div className="shell flex flex-col items-center justify-center gap-12">
        <DisplayHeading reveal="clip">Explore tickets</DisplayHeading>

        {/* Gates open / Last entry / Showtime used to sit here. 2550:19560
            moves them into the hero, beside the name they qualify, and
            2542:14399 no longer carries them — which is most of why this
            section lost 260px of height between comps. */}

        {/* The stubs, two across as 2542:14399 draws them. Still mapped
            over the data rather than hard-coded, but the data now carries
            exactly the comp's two tiers. They
            stack below `lg`, where two landscape stubs would each be too
            narrow to hold a Daltown title and a button on one line. */}
        <div
          className="flex w-full flex-col gap-2 lg:flex-row"
          data-reveal="up"
          data-reveal-stagger
        >
          {event.ticketTiers.map((tier) => (
            <TicketRow
              key={tier.id}
              tier={tier}
              href={`/events/${event.slug}/book?tier=${tier.id}`}
            />
          ))}
        </div>
      </div>

      {enquiring && (
        <VipBoxDialog event={event} onClose={() => setEnquiring(false)} />
      )}
    </section>
  );
}
