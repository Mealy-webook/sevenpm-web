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
  /**
   * Where it happens. Read off the artwork and the newsroom, not invented:
   * Jazzablanca's poster says "Anfa Park, Casablanca", Tanjazz's says
   * "Festival des Jazz de Tanger" and the news headline has it returning to
   * Tangier, and both Casa Anfa festivals are Anfa Park.
   */
  city?: string;
  /** Preview played while the visitor holds the spacebar. */
  audioSrc?: string;
};

export const festivals: Festival[] = [
  {
    id: "village-casa-anfa",
    city: "Casablanca",
    name: "Village Casa Anfa",
    href: "#",
    poster: { src: "/assets/festival-poster-1.png", width: 374, height: 526 },
    card: "/assets/poster-village-casa-anfa.jpg",
  },
  {
    id: "tanjazz",
    city: "Tangier",
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
    city: "Casablanca",
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
    city: "Casablanca",
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
    city: "Taghazout",
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
 * The frame the hero opens onto as you scroll. `video` wins when it is set;
 * the still is its poster.
 */
export const heroReveal = {
  image: "/assets/gallery-2.jpg",
  /**
   * A 13s silent loop cut from the site's own photographs — four slow pushes
   * with crossfades, 1920 x 1080 so the frame has pixels at its 16:9 open
   * state. Replace with real festival footage when there is some; the still
   * above stays as its poster either way.
   */
  video: "/assets/hero-reel.mp4" as string | null,
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

/**
 * The two polaroids in the hero (Figma 2490:26516 and 2490:26519), the
 * comp's own photographs. Card 355.571 x 401.608 with the print inset
 * 327.793 x 326.45 — even on three sides and deep at the foot, which is
 * what makes it read as a polaroid rather than a framed picture.
 *
 * Positions are the centre of each card as a share of the 1512 x 853 hero,
 * so the pair keeps its arrangement at any width.
 */
export const heroPolaroids = [
  {
    image: "/assets/hero-polaroid-1.jpg",
    rotate: 10.9,
    x: 81.98,
    y: 38.08,
  },
  {
    image: "/assets/hero-polaroid-2.jpg",
    rotate: -5.71,
    x: 68.71,
    y: 57.86,
  },
];

export const homeCopy = {
  /** The accessible name for the hero heading — see `HeroHeadline`. */
  heroTitle: "More music, more life",
  /** The comp's two lines (2482:25006). */
  heroLead: "More music",
  heroSecond: "More life",
  /** Empty: the hero heading is the name, with nothing cycling after it. */
  heroWords: [] as string[],
  intro:
    "SEVENPM creates cultural experiences that bring the world’s artists, Moroccan talent and communities together—transforming cities through music, culture and unforgettable moments.",
  listenHint: ["Press & Hold", "spacebar to listen"],
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
