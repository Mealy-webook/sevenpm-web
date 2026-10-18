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
  /** Which edition, read off the artwork ("19e édition", "23e édition"). */
  edition?: string;
  /** `when` as dates, for anything that has to place it in the year. */
  dates?: { start: string; end: string };
};

export const festivals: Festival[] = [
  {
    id: "village-casa-anfa",
    city: "Casablanca",
    name: "Village Casa Anfa",
    href: "#",
    poster: { src: "/assets/festival-poster-1.webp", width: 374, height: 526 },
    card: "/assets/poster-village-casa-anfa.jpg",
  },
  {
    id: "tanjazz",
    city: "Tangier",
    name: "Tanjazz",
    href: "#",
    poster: {
      src: "/assets/festival-poster-2.webp",
      width: 362.003,
      height: 509.5,
    },
    card: "/assets/poster-tanjazz-26.jpg",
    when: "18 – 20 September 2026",
    edition: "23rd edition",
    dates: { start: "2026-09-18", end: "2026-09-20" },
  },
  {
    id: "jazzablanca",
    city: "Casablanca",
    name: "Jazzablanca",
    href: `/events/${jazzablanca.slug}`,
    poster: {
      src: "/assets/festival-poster-3.webp",
      width: 305.5,
      height: 495.5,
    },
    card: "/assets/poster-jazzablanca-26.jpg",
    when: "02 – 11 July 2026",
    edition: "19th edition",
    dates: { start: "2026-07-02", end: "2026-07-11" },
    audioSrc: jazzablanca.playlist[0]?.audioSrc,
  },
  {
    id: "casa-anfa-latina",
    city: "Casablanca",
    name: "Casa Anfa Latina",
    href: "#",
    poster: {
      src: "/assets/festival-poster-4.webp",
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
    poster: { src: "/assets/festival-poster-5.webp", width: 375, height: 526 },
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

/* Reads on its own. It used to run "Founded in 2018, was born from the
   desire…" — written to continue out of the heading above it, which leaves
   the sentence without a subject wherever the two are not read together. */
export const homeStoryStatement =
  "Founded in 2018, SEVENPM was born from the desire to propel cultural events in Morocco to new heights.";

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
 * text under Values; Values now carries its own line, supplied by Ahmed.
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
    body: "Encouraging diversity and promoting social inclusion in partnership with committed businesses and our communities to make culture accessible to all.",
  },
];

/**
 * The frame the hero opens onto as you scroll. `video` wins when it is set;
 * the still is its poster.
 */

/**
 * Upcoming events — the homepage row and `/events` both read this. Only
 * Jazzablanca and Tanjazz are on, by request: Village Casa Anfa and Casa
 * Anfa Latina are off the programme (their entries stay in `festivals`, so
 * putting one back is a line here). The `festivals` array itself is left
 * alone because `FestivalsStage`, which the two homepage preview routes
 * still use, features whichever sits in the middle of it.
 */
export const festivalsRowOrder = ["jazzablanca", "tanjazz"];

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
    /* The back card settles first and sits deeper: it drifts less with the
       cursor and against the scroll, so the pair separates instead of
       sliding as one sheet. */
    delay: 0.18,
    parallax: -0.06,
    depth: 0.6,
  },
  {
    image: "/assets/hero-polaroid-2.jpg",
    rotate: -5.71,
    x: 68.71,
    y: 57.86,
    delay: 0.3,
    parallax: 0.05,
    depth: 1,
  },
];

export const homeCopy = {
  /** The accessible name for the hero heading — see `HeroHeadline`. */
  heroTitle: "More music, more life",
  /** The old two lines (2482:25006). Still used by the `/preview/home-*`
   *  explorations, which are frozen against the comps they were drawn from. */
  heroLead: "More music",
  heroSecond: "More life",

  /**
   * The live hero (2482:25005): MORE over MUSIC, with the O of MORE knocked
   * out and a photograph set into the hole.
   *
   * The first line is stored as the letters either side of the hole rather
   * than as a word, because the hole is not a glyph — Figma draws a 455 x 173
   * pill where the O would be, two and a half times its width.
   */
  heroCut: {
    before: "M",
    after: "RE",
    second: "Music",
    pill: {
      src: "/assets/hero-pill.jpg",
      alt: "",
      /* Figma's geometry as ratios of the type size, so the hole and its
         air track the headline at every width instead of drifting out of the
         word as the type scales. */
      width: 455 / 260,
      height: 173 / 260,
      /**
       * The comp sets 4px between the pill and the letters, measured between
       * inked edges — its M and R are outlined vectors with no side bearings.
       * Live text has them, and they are invisible, so matching the comp's
       * number here would have left a visibly wider hole than the comp draws.
       * Measured against Daltown: the M carries ~0.0105em of trailing bearing
       * and the R ~0.002em of leading. Both are subtracted so the optical gap
       * is the comp's 4px.
       */
      gapBefore: 4 / 260 - 0.0105,
      gapAfter: 4 / 260 - 0.002,
      /**
       * The reel, restored from `6fdedff` and re-encoded for the hole it
       * plays in. It was cut at 1920x1080 for a full-bleed frame and was
       * 2.9MB; the window is 455 wide at the comp's own frame, so 960 is
       * already twice what it can show. 0.71MB at the same length.
       *
       * It is thirteen silent seconds cut from the site's own photographs —
       * four slow pushes with crossfades — because there is no festival
       * footage in the project. Swap in real footage here; the still stays
       * as the poster either way.
       */
      video: "/assets/hero-reel.mp4" as string | undefined,
      poster: "/assets/hero-pill.jpg",
    },
  },
  /** Empty: the hero heading is the name, with nothing cycling after it. */
  heroWords: [] as string[],
  intro:
    "SEVENPM creates cultural experiences that bring the world’s artists, Moroccan talent and communities together—transforming cities through music, culture and unforgettable moments.",
  listenHint: ["Press & Hold", "spacebar to listen"],
  /** The festival row's title (2482:25044). */
  festivalsTitle: "Upcoming events",
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
