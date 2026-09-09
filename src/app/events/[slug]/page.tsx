import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { MotionProvider } from "@/components/motion/MotionProvider";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { ArtistsSection } from "@/components/event/ArtistsSection";
import { FaqSection } from "@/components/event/FaqSection";
import { GallerySection } from "@/components/event/GallerySection";
import { HeroSection } from "@/components/event/HeroSection";
import { LocationSection } from "@/components/event/LocationSection";
import { SponsorsSection } from "@/components/event/SponsorsSection";
import { TicketsMarquee } from "@/components/event/TicketsMarquee";
import { TicketsSection } from "@/components/event/TicketsSection";
import { events, getEvent } from "@/data/events";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return events.map((event) => ({ slug: event.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const event = getEvent(slug);
  if (!event) return { title: "SEVENPM" };

  return {
    title: `${event.name} — SEVENPM`,
    description: event.intro,
  };
}

export default async function EventDetailsPage({ params }: PageProps) {
  const { slug } = await params;
  const event = getEvent(slug);
  if (!event) notFound();

  return (
    <>
      <MotionProvider />
      <SiteHeader />
      <main>
        <HeroSection event={event} />
        <TicketsMarquee />
        <TicketsSection event={event} />
        <LocationSection event={event} />
        <ArtistsSection event={event} />
        <GallerySection event={event} />
        <FaqSection event={event} />
        <SponsorsSection event={event} />
      </main>
      <SiteFooter />
    </>
  );
}
