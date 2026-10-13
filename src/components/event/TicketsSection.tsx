import type { EventDetails } from "@/data/events";
import { DisplayHeading } from "@/components/ui/DisplayHeading";
import { TicketRow } from "./TicketRow";

/**
 * Explore tickets, from Figma 2556:21044 — the current event page.
 *
 * The frame is 478 tall and sized by its contents: 80px of padding, the
 * title, a 32px gap and one 186px row of stubs. It used to be a
 * `.section-screen`, which floored every section at a viewport height and
 * left 300px of air around two stubs that the comp sets tight.
 *
 * Gates open / last entry / showtime used to sit here. 2556:20996 moves them
 * into the hero, beside the name they qualify.
 */
export function TicketsSection({ event }: { event: EventDetails }) {
  return (
    <section id="tickets" className="relative py-16 xl:py-20">
      <div className="shell flex flex-col items-center justify-center gap-8">
        <DisplayHeading reveal="clip">Explore tickets</DisplayHeading>

        {/* The stubs, two across on the comp's 1272 column: 628 each with a
            16px gap. They stack below `lg`, where two landscape stubs would
            each be too narrow to hold a Daltown title and a button on one
            line. */}
        <div
          className="flex w-full flex-col gap-4 lg:flex-row"
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
    </section>
  );
}
