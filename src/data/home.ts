import { jazzablanca } from "./events";
import { newsArticles } from "./news";

/**
 * Homepage content, from Figma node 15:202 (1512 × 5838). Copy and imagery
 * only — layout lives in `src/components/home/`.
 */

export type Festival = {
  id: string;
  /** Display name. Only Jazzablanca is confirmed; the others are read off
   *  the poster artwork and should be checked by content. */
  name: string;
  href: string;
  /** Poster export from the comp — already drawn in perspective for its slot. */
  poster: { src: string; width: number; height: number };
  /**
   * The upright 2:3 artwork the homepage row uses (Figma 2482:25040),
   * cropped from that comp's own bitmaps. Only the four festivals the comp
   * draws have one, and the row shows only those.
   */
  card?: string;
  /**
   * The dates, read off the artwork, for the caption under the active card.
   * Two of the four posters cannot supply one — Village Casa Anfa's art is
   * the 2022 edition and Casa Anfa Latina's carries no date at all — so they
   * have none until content provides it.
   */
  when?: string;
  /** Preview played while the visitor holds the spacebar. */
  audioSrc?: string;
};

export const festivals: Festival[] = [
  {
    id: "village-casa-anfa",
    name: "Village Casa Anfa",
    href: "#",
    poster: { src: "/assets/festival-poster-1.png", width: 374, height: 526 },
    card: "/assets/poster-village-casa-anfa.jpg",
  },
  {
    id: "tanjazz",
    name: "Tanjazz",
    href: "#",
    poster: {
      src: "/assets/festival-poster-2.png",
      width: 362.003,
      height: 509.5,
    },
    card: "/assets/poster-tanjazz-26.jpg",
    when: "18 – 20 September 2026",
  },
  {
    id: "jazzablanca",
    name: "Jazzablanca",
    href: `/events/${jazzablanca.slug}`,
    poster: {
      src: "/assets/festival-poster-3.png",
      width: 305.5,
      height: 495.5,
    },
    card: "/assets/poster-jazzablanca-26.jpg",
    when: "02 – 11 July 2026",
    audioSrc: jazzablanca.playlist[0]?.audioSrc,
  },
  {
    id: "casa-anfa-latina",
    name: "Casa Anfa Latina",
    href: "#",
    poster: {
      src: "/assets/festival-poster-4.png",
      width: 364.064,
      height: 511,
    },
    card: "/assets/poster-casa-anfa-latina.jpg",
  },
  {
    id: "arma-taghazout",
    name: "Arma Taghazout",
    href: "#",
    poster: { src: "/assets/festival-poster-5.png", width: 375, height: 526 },
  },
];

export type NewsItem = {
  date: string;
  title: string;
  excerpt: string;
  image?: string;
  href: string;
};

/** The homepage shows the four most recent stories from `data/news.ts`. */
export const newsItems: NewsItem[] = newsArticles
  .slice(0, 4)
  .map((article) => ({
    date: article.dateLabel,
    title: article.title,
    excerpt: article.excerpt,
    image: article.image,
    href: `/news/${article.slug}`,
  }));

/**
 * The band under the hero — Figma 2227:5202. Split into parts so the figure
 * can count up on its own without a parser guessing where the "+" ends.
 */
export type HomeStat = {
  value: number;
  label: string;
  prefix?: string;
  suffix?: string;
  /** Years are not thousands: 2018, never 2,018. Nothing on the homepage
   *  uses it since the founding year came out, but the flag stays for the
   *  next figure that is a year. */
  year?: boolean;
};

export const homeStats: HomeStat[] = [
  /* The founding year used to lead this row. The comp dropped it — the
     founding is in the paragraph above — and three figures sit on the 1272
     column at 392 each. */
  { value: 4, label: "Festivals produced every year" },
  {
    value: 20,
    prefix: "+",
    suffix: "K",
    label: "Festival goers at Jazzablanca",
  },
  { value: 22, label: "Editions of Tanjazz and counting" },
];

/**
 * The founding statement, kept as its two sentences so a layout can set them
 * apart, and the phrases worth flooding with brand. Same words as
 * `homeStory.body` — nothing here is new copy.
 */
export const homeStoryLines = [
  "SEVENPM, founded in 2018, was born from the desire to propel cultural events in Morocco to new heights.",
  "Since then, SEVENPM has established itself as an essential player, orchestrating iconic festivals.",
];

export const homeStoryHighlights = [
  "2018",
  "Morocco",
  "essential player",
  "iconic festivals",
];

export const homeStoryFounded = "2018";

/**
 * The founding block as the homepage sets it (Figma 2467:24510): the name is
 * the heading, so the statement starts at "Founded in 2018" rather than
 * repeating it.
 */
export const homeStoryHeading = "Sevenpm";

export const homeStoryStatement =
  "Founded in 2018, was born from the desire to propel cultural events in Morocco to new heights.";

/** The story block — Figma 2227:5229. */
export const homeStory = {
  body: "SEVENPM, founded in 2018, was born from the desire to propel cultural events in Morocco to new heights. Since then, SEVENPM has established itself as an essential player, orchestrating iconic festivals.",
  photos: ["/assets/gallery-2.jpg", "/assets/gallery-5.jpg"],
  socials: [
    {
      label: "Facebook",
      href: "https://facebook.com",
      icon: "/assets/ic-social-facebook.svg",
    },
    { label: "X", href: "https://x.com", icon: "/assets/ic-social-x.svg" },
    {
      label: "TikTok",
      href: "https://tiktok.com",
      icon: "/assets/ic-social-tiktok.svg",
    },
    {
      label: "YouTube",
      href: "https://youtube.com",
      icon: "/assets/ic-social-youtube.svg",
    },
    {
      label: "Instagram",
      href: "https://instagram.com",
      icon: "/assets/ic-social-instagram.svg",
    },
  ],
};

/**
 * Mission / Vision / Values — Figma 2467:24548. The comp repeats the Vision
 * text under Values; left as drawn rather than invented.
 */
export const homePillars = [
  {
    title: "Mission",
    body: "To offer an exceptional experience to our festival-goers and our entire community by guaranteeing access to culture and events.",
  },
  {
    title: "Vision",
    body: "Create a cultural business model that allows the best artists in the world to be presented in Morocco and showcases young Moroccan talent.",
  },
  {
    title: "Values",
    body: "Create a cultural business model that allows the best artists in the world to be presented in Morocco and showcases young Moroccan talent.",
  },
];

/**
 * The frame the hero opens onto as you scroll. `video` wins when it is set —
 * drop an .mp4 in `public/assets` and name it here; the still is the poster
 * either way.
 */
export const heroReveal = {
  image: "/assets/gallery-2.jpg",
  video: null as string | null,
};

/**
 * The homepage row, in the comp's own left-to-right order (2482:25040). The
 * `festivals` array is left alone because `FestivalsStage`, which the two
 * homepage preview routes still use, features whichever sits in the middle
 * of it — and only that one has an audio preview.
 */
export const festivalsRowOrder = [
  "jazzablanca",
  "tanjazz",
  "village-casa-anfa",
  "casa-anfa-latina",
];

export const homeCopy = {
  /** The accessible name for the hero heading, which is shown a word at a
      time — see `HeroHeadline`. */
  heroTitle: "More music more life",
  heroLead: "More",
  heroWords: ["Music", "Life"],
  intro:
    "SEVENPM creates cultural experiences that bring the world’s artists, Moroccan talent and communities together—transforming cities through music, culture and unforgettable moments.",
  listenHint: ["Press & Hold", "spacebar to listen"],
  /**
   * The hero's CTA. The comp (2482:25049) draws the button as an unlabelled
   * 193 × 65 placeholder, so both the words and the destination are chosen
   * here: the page's job is tickets, and the featured event is the one thing
   * on it you can actually buy.
   */
  heroCta: { label: "Book tickets", href: `/events/${jazzablanca.slug}/book` },
  /** The festival row's title (2482:25044). */
  festivalsTitle: "Our iconic festivals",
  newsletter: {
    title: "Be the first to know",
    body: "Subscribe to our newsletter to be the first to know about concert announcements, and exclusive updates — and never miss the most exciting news.",
    cta: "Subscribe",
  },
};

/** The two gallery rows are the event photos, repeated to fill the marquee. */
export const galleryRows: string[][] = [
  [
    "/assets/gallery-1.jpg",
    "/assets/gallery-2.jpg",
    "/assets/gallery-3.jpg",
    "/assets/gallery-4.jpg",
    "/assets/gallery-5.jpg",
  ],
  [
    "/assets/gallery-6.jpg",
    "/assets/gallery-4.jpg",
    "/assets/gallery-1.jpg",
    "/assets/gallery-5.jpg",
    "/assets/gallery-2.jpg",
    "/assets/gallery-3.jpg",
  ],
];

/** The six photographs, once each, for the homepage's bento gallery. */
export const galleryImages: string[] = [
  "/assets/gallery-1.jpg",
  "/assets/gallery-2.jpg",
  "/assets/gallery-3.jpg",
  "/assets/gallery-4.jpg",
  "/assets/gallery-5.jpg",
  "/assets/gallery-6.jpg",
];

/** Concert photos that trail the cursor across the homepage hero. */
export const heroTrailImages = [
  { src: "/assets/gallery-1.jpg", alt: "" },
  { src: "/assets/gallery-2.jpg", alt: "" },
  { src: "/assets/gallery-3.jpg", alt: "" },
  { src: "/assets/gallery-4.jpg", alt: "" },
  { src: "/assets/gallery-5.jpg", alt: "" },
  { src: "/assets/gallery-6.jpg", alt: "" },
];
