import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BookingJourney } from "@/components/booking/BookingJourney";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { accountUser } from "@/data/account";
import { bookingConfig } from "@/data/booking";
import { events, getEvent } from "@/data/events";

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ tier?: string }>;
};

export function generateStaticParams() {
  return events.map((event) => ({ slug: event.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const event = getEvent(slug);
  return {
    title: event ? `Book ${event.name} — SEVENPM` : "Book — SEVENPM",
    robots: { index: false },
  };
}

/**
 * The booking journey, from Figma 2138:3339 → 2033:18293. It carries its own
 * chrome — back, breadcrumb, hold timer, globe — so neither the site header
 * nor the footer is rendered here: the page has one job.
 */
export default async function BookPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { tier } = await searchParams;
  const event = getEvent(slug);
  if (!event) notFound();

  return (
    <>
      <MotionProvider />
      <main>
        <BookingJourney
          event={{
            slug: event.slug,
            name: event.name,
            time: bookingConfig.sessionTime,
            venue: event.venue.name,
            venueUrl: event.venue.directionsUrl,
            poster: bookingConfig.poster,
            playlist: event.playlist,
            startsAt: event.startsAt,
            email: accountUser.email,
          }}
          initialTier={tier}
        />
      </main>
    </>
  );
}
