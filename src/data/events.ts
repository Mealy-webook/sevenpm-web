/**
 * Content model for the event details page.
 *
 * Every string rendered on `/events/[slug]` comes from here, so the rest of
 * the team can add an event without touching a component. Swap this file for
 * a CMS/API fetch later — the components only depend on the exported types.
 */

export type PlaylistTrack = {
  title: string;
  artist: string;
  album?: string;
  /**
   * Audio for the hero deck. Anything an <audio> element can load. Today these
   * are the free 30-second previews from Apple's iTunes Search API, which are
   * served CORS-open so the hero's Web Audio analyser can read them. Swap in
   * licensed full tracks from your own CDN whenever they're cleared.
   *
   * Leave it off and the deck still selects and animates, it just runs silent.
   */
  audioSrc?: string;
  /** Apple Music page for the track — used for preview attribution. */
  storeUrl?: string;
  /** Cover art, 100px. Not rendered by the current comp; kept for later. */
  artworkUrl?: string;
};

export type ScheduleTile = {
  icon: string;
  label: string;
  value: string;
};

export type TicketTier = {
  id: string;
  /** Small line above the title, e.g. "General admission". */
  kicker: string;
  /** Plain-text name, used as the accessible label ("1 Day pass"). */
  title: string;
  /** Daltown artwork of the title — see DisplayHeading for why it's an image. */
  titleArt: { src: string; width: number; height: number };
  /** Starting price, in dirhams, formatted ("1,000"). */
  priceFrom: string;
  cta: string;
  href?: string;
  /** Brand-yellow ticket paper instead of grey. */
  featured?: boolean;
};

export type InfoTile = {
  icon: string;
  title: string;
  value: string;
};

/** A single 406px circle, or a 2×2 block of 200px circles. */
export type ArtistGroup =
  | { type: "solo"; image: string; name: string }
  | { type: "quad"; items: ({ image: string; name: string } | null)[] };

export type ArtistDay = {
  id: string;
  label: string;
  groups: ArtistGroup[];
};

export type GalleryShot = {
  image: string;
  /** Centre of the polaroid inside the 1294.42 × 578.97 gallery stage. */
  x: number;
  y: number;
  rotate: number;
};

export type FaqItem = {
  question: string;
  answer?: string;
};

export type Sponsor = {
  name: string;
  logo: string;
};

export type SocialLink = {
  label: string;
  href: string;
};

export type EventDetails = {
  slug: string;
  name: string;
  /** Wordmark artwork — the Figma title is set in Daltown, a licensed
   *  display face, so it ships as artwork rather than live text. */
  wordmark: { src: string; width: number; height: number; alt: string };
  intro: string;
  /** ISO datetime the doors open. Not rendered by the current comp — the
   *  hero countdown was dropped in the 2026-09-09 revision — but kept as the
   *  event's canonical start time. */
  startsAt: string;
  playlist: PlaylistTrack[];
  schedule: ScheduleTile[];
  ticketTiers: TicketTier[];
  venue: {
    name: string;
    mapImage: string;
    directionsUrl: string;
    /** Pin position inside the 1272 × 349 map panel. */
    pin: { x: number; y: number };
  };
  infoTiles: InfoTile[];
  artistDays: ArtistDay[];
  gallery: GalleryShot[];
  faq: FaqItem[];
  officialSponsor: Sponsor;
  goldSponsors: Sponsor[];
};

const FAQ_HEADLINE =
  "Jazzablanca draws nearly 100,000 festival goers as 19th edition comes to a close";

export const jazzablanca: EventDetails = {
  slug: "jazzablanca",
  name: "Jazzablanca",
  wordmark: {
    src: "/assets/hero-jazzablanca.png",
    width: 661,
    height: 178,
    alt: "Jazzablanca",
  },
  intro:
    "A true urban boutique festival deeply embedded in the city of Casablanca, the festival embraces the urban landscape and brings the city to life. Beyond the concerts, it is a place for sharing, discovery, and culture, designed to awaken minds and transmit a passion for music.",
  startsAt: "2026-09-18T19:00:00+01:00",
  playlist: [
    {
      title: "Celebration",
      artist: "Kool & The Gang",
      album: "Celebrate!",
      audioSrc:
        "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/08/a2/0b/08a20b4a-ec07-2efc-f000-bd23db36672c/mzaf_3503892147503876458.plus.aac.p.m4a",
      storeUrl:
        "https://music.apple.com/us/album/celebration-single-version/1444107292?i=1444107530",
      artworkUrl:
        "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/ad/28/93/ad2893b3-364e-70d4-96df-e991092fc562/06UMGIM01158.rgb.jpg/100x100bb.jpg",
    },
    {
      title: "Kiss from a rose",
      artist: "Seal",
      album: "Seal II",
      audioSrc:
        "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/11/d1/d4/11d1d454-f2b7-984e-521a-a4b45fb2a158/mzaf_17567757318168898161.plus.aac.p.m4a",
      storeUrl:
        "https://music.apple.com/us/album/kiss-from-a-rose/302788213?i=302788219",
      artworkUrl:
        "https://is1-ssl.mzstatic.com/image/thumb/Features115/v4/34/b5/2f/34b52f15-c64a-6971-78d3-277d08d9779d/dj.bxnijqdz.jpg/100x100bb.jpg",
    },
    {
      // The comp credits this to "THE E.N.D", which is the album, not the act.
      title: "I Gotta Feeling",
      artist: "Black Eyed Peas",
      album: "THE E.N.D. (The Energy Never Dies)",
      audioSrc:
        "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/88/5e/6a/885e6adb-f307-d849-a3e0-47280088b5a4/mzaf_12588254824919596992.plus.aac.p.m4a",
      storeUrl:
        "https://music.apple.com/us/album/i-gotta-feeling/1440768902?i=1440769310",
      artworkUrl:
        "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/42/fc/47/42fc4794-3c69-8c00-e528-1c7e92b5ac93/09UMGIM13833.rgb.jpg/100x100bb.jpg",
    },
    {
      // The comp reads "The Smile of Rotta — Parcels". No such track exists;
      // it is "The Smile of Rita" by Ibrahim Maalouf, who actually plays this
      // circuit. Corrected here — revert both fields if the designer disagrees.
      title: "The Smile of Rita",
      artist: "Ibrahim Maalouf",
      album: "Trumpets of Michel-Ange",
      audioSrc:
        "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/8a/00/6c/8a006c5d-b83c-d539-69c0-67b293177b97/mzaf_2261378593397107215.plus.aac.p.m4a",
      storeUrl:
        "https://music.apple.com/us/album/the-smile-of-rita/1762816657?i=1762817311",
      artworkUrl:
        "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/6d/2f/e4/6d2fe4ed-9cd1-fddf-de6d-8ae420c93379/3663729329554_cover.jpg/100x100bb.jpg",
    },
  ],
  schedule: [
    { icon: "/assets/ic-gates.svg", label: "Gates open", value: "7:00 PM" },
    { icon: "/assets/ic-last-entry.svg", label: "Last entry", value: "8:00 PM" },
    { icon: "/assets/ic-showtime.svg", label: "Showtime", value: "9:30 PM" },
  ],
  ticketTiers: [
    {
      id: "day",
      kicker: "General admission",
      title: "1 Day pass",
      titleArt: { src: "/assets/ticket-1daypass.png", width: 162, height: 50 },
      priceFrom: "50",
      cta: "Get your ticket",
    },
    {
      id: "weekend",
      kicker: "General admission",
      title: "Weekend pass",
      titleArt: { src: "/assets/ticket-weekendpass.png", width: 222, height: 50 },
      // The comp reads "From 50" on all three; the earlier revision priced
      // these 50 / 300 / 1,000, kept here until content confirms.
      priceFrom: "300",
      cta: "Get your ticket",
      featured: true,
    },
    {
      id: "all-days",
      kicker: "General admission",
      title: "All days pass",
      titleArt: { src: "/assets/ticket-alldayspass.png", width: 217, height: 50 },
      priceFrom: "1,000",
      cta: "Get your ticket",
    },
  ],
  venue: {
    name: "Palais des Institutions Italiennes",
    mapImage: "/assets/loc-map.jpg",
    directionsUrl:
      "https://www.google.com/maps/search/?api=1&query=Palais+des+Institutions+Italiennes+Casablanca",
    pin: { x: 517, y: 96 },
  },
  infoTiles: [
    {
      icon: "/assets/ic-parking.svg",
      title: "Parking",
      value: "Free based in capacity",
    },
    {
      icon: "/assets/ic-age.svg",
      title: "Age restrictions",
      value: "Only above 18",
    },
    {
      icon: "/assets/ic-dress.svg",
      title: "Dress Code",
      value: "Not Specified",
    },
    {
      icon: "/assets/ic-animals.svg",
      title: "Animals",
      value: "Not Allowed",
    },
    {
      icon: "/assets/ic-food.svg",
      title: "Food & Drinks",
      value: "Not allowed from outside",
    },
  ],
  artistDays: [
    {
      id: "18-september",
      label: "18 September",
      groups: [
        { type: "solo", image: "/assets/artist-1.png", name: "Artist 1" },
        {
          type: "quad",
          items: [
            { image: "/assets/artist-2.png", name: "Artist 2" },
            { image: "/assets/artist-3.png", name: "Artist 3" },
            { image: "/assets/artist-4.png", name: "Artist 4" },
            { image: "/assets/artist-5.png", name: "Artist 5" },
          ],
        },
        { type: "solo", image: "/assets/artist-6.png", name: "Artist 6" },
        { type: "solo", image: "/assets/artist-7.png", name: "Artist 7" },
        {
          type: "quad",
          items: [
            { image: "/assets/artist-8.png", name: "Artist 8" },
            null,
            { image: "/assets/artist-9.png", name: "Artist 9" },
            null,
          ],
        },
      ],
    },
    {
      // Day two isn't specified in the Figma yet — same treatment, resequenced,
      // so the tab is wired up and ready for the real lineup.
      id: "19-september",
      label: "19 September",
      groups: [
        { type: "solo", image: "/assets/artist-7.png", name: "Artist 7" },
        {
          type: "quad",
          items: [
            { image: "/assets/artist-5.png", name: "Artist 5" },
            { image: "/assets/artist-2.png", name: "Artist 2" },
            { image: "/assets/artist-9.png", name: "Artist 9" },
            { image: "/assets/artist-3.png", name: "Artist 3" },
          ],
        },
        { type: "solo", image: "/assets/artist-1.png", name: "Artist 1" },
        { type: "solo", image: "/assets/artist-6.png", name: "Artist 6" },
        {
          type: "quad",
          items: [
            { image: "/assets/artist-4.png", name: "Artist 4" },
            null,
            { image: "/assets/artist-8.png", name: "Artist 8" },
            null,
          ],
        },
      ],
    },
  ],
  // Centres are measured off the 1294.42 × 578.97 Figma group so the fan
  // reproduces exactly; each polaroid is 355.57 × 401.61.
  gallery: [
    { image: "/assets/gallery-6.jpg", x: 1081.87, y: 279.57, rotate: 10.9 },
    { image: "/assets/gallery-5.jpg", x: 888.71, y: 301.42, rotate: 9.92 },
    { image: "/assets/gallery-3.jpg", x: 492.44, y: 309.27, rotate: 0.47 },
    { image: "/assets/gallery-4.jpg", x: 764.87, y: 361.49, rotate: -5.71 },
    { image: "/assets/gallery-2.jpg", x: 325.87, y: 254.62, rotate: -5.39 },
    { image: "/assets/gallery-1.jpg", x: 177.79, y: 200.8, rotate: 0 },
  ],
  faq: [
    {
      question: FAQ_HEADLINE,
      answer:
        "The 19th edition of Jazzablanca concluded after ten days of music and entertainment, attracting nearly 100,000 festivalgoers and reaffirming its position as one of Africa's leading cultural events.",
    },
    { question: FAQ_HEADLINE },
    { question: FAQ_HEADLINE },
    { question: FAQ_HEADLINE },
    { question: FAQ_HEADLINE },
  ],
  officialSponsor: { name: "Saham Bank", logo: "/assets/sponsor-saham.svg" },
  goldSponsors: [
    { name: "adidas", logo: "/assets/sponsor-adidas.svg" },
    { name: "Spotify", logo: "/assets/sponsor-spotify.svg" },
    { name: "Coca-Cola", logo: "/assets/sponsor-cocacola.svg" },
  ],
};

export const events: EventDetails[] = [jazzablanca];

export function getEvent(slug: string): EventDetails | undefined {
  return events.find((event) => event.slug === slug);
}

export const socialLinks: SocialLink[] = [
  { label: "Spotify", href: "https://open.spotify.com" },
  { label: "Instagram", href: "https://instagram.com" },
  { label: "Facebook", href: "https://facebook.com" },
  { label: "X", href: "https://x.com" },
  { label: "youtube", href: "https://youtube.com" },
  { label: "Soundcloud", href: "https://soundcloud.com" },
  { label: "Apple music", href: "https://music.apple.com" },
];
