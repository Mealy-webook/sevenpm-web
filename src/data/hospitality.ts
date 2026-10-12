/**
 * "Hospitality", from the supplied mockup
 * (`Hospitality_website mockups.pdf`, four pages: the index, then the VIP Box
 * package page that stands for all of them).
 *
 * Structure from the mockup, look from the site. As on the sponsor page, the
 * mockup's `[X,XXX]` placeholders are kept as written — these are prices, and
 * a guessed price on a page that exists to quote is worse than a visible gap.
 *
 * One deliberate departure: the mockup prints "excl. VAT" beside the prices
 * and in the note under the grid. VAT was taken off this site by an earlier
 * decision, so it is not reintroduced here. Say the word and it comes back in
 * one line (`priceNote` below, and `perUnit` on each package).
 */

export type HospitalityPackage = {
  slug: string;
  name: string;
  festival: "Jazzablanca" | "Tanjazz";
  /** The second pill on the card — capacity, or what the price buys. */
  capacity: string;
  summary: string;
  /** Longer copy for the package's own page. */
  body: string;
  price: string;
  perUnit: string;
  photo: string;
  /**
   * The photograph. Four of the five are the real hospitality shots supplied
   * with the event-page comp (2549:17634) — the VIP boxes, the garden party,
   * the Terrasses d'Anfa and the corporate crowd — so those are no longer
   * stand-ins. Tanjazz VIP has none of its own yet and borrows a Tanjazz
   * shot from the festival library, which is at least the right festival.
   * `photo` above keeps the brief either way.
   */
  image: string;
  /** The four spec tiles on the package page. */
  specs: { label: string; value: string }[];
  included: string[];
  /** Inclusions still to be written, shown in the mockup's yellow. */
  includedTodo?: string;
  /** The package page's photo grid. */
  gallery: string[];
  /** True for the one the mockup draws full width at the foot of the grid. */
  wide?: boolean;
  /**
   * Where this package sits relative to the stage, as a percentage of the
   * site plan, for the floorplan direction. Read off what each package says
   * about itself — the box faces the stage, the terraces look down on it,
   * the garden sits behind, the pass is the gate — not off a survey. A real
   * site plan should replace these.
   */
  plan?: { x: number; y: number };
};

export const hospitalityPackages: HospitalityPackage[] = [
  {
    slug: "vip-box",
    name: "VIP Box",
    festival: "Jazzablanca",
    capacity: "Up to 10 guests",
    summary:
      "A private box facing the stage, with catering and parking included.",
    body: "A private box facing the stage for you and your guests. Food, drinks and parking are taken care of, so you can focus on the music and your guests.",
    price: "[XX,XXX] MAD",
    perUnit: "per box, per night",
    photo: "Photo: VIP box with view of the stage",
    image: "/assets/hosp-vip-box.jpg",
    plan: { x: 50, y: 32 },
    specs: [
      { label: "Capacity", value: "Up to 10 guests" },
      { label: "Festival", value: "Jazzablanca" },
      { label: "Location", value: "Anfa Park, Casablanca" },
      { label: "Nights", value: "One night or more" },
    ],
    included: [
      "Private box for up to 10 guests",
      "Catering included",
      "Parking included",
    ],
    includedTodo:
      "[Add the other inclusions: drinks, host, entrance, view of the stage…]",
    gallery: [
      "Photo: inside the box",
      "Photo: catering",
      "Photo: view of the stage",
      "Photo: guests",
    ],
  },
  {
    slug: "garden-party-vip",
    name: "Garden Party VIP",
    festival: "Jazzablanca",
    capacity: "[Group size]",
    summary: "[What makes this space special, what is included]",
    body: "[What makes this space special, what is included]",
    price: "[X,XXX] MAD",
    perUnit: "per guest, per night",
    photo: "Photo: Garden Party VIP",
    image: "/assets/hosp-garden-party-vip.jpg",
    plan: { x: 24, y: 62 },
    specs: [
      { label: "Capacity", value: "[Group size]" },
      { label: "Festival", value: "Jazzablanca" },
      { label: "Location", value: "Anfa Park, Casablanca" },
      { label: "Nights", value: "One night or more" },
    ],
    included: [],
    includedTodo: "[List what the Garden Party VIP includes]",
    gallery: ["Photo: the garden", "Photo: catering", "Photo: guests"],
  },
  {
    slug: "terrasses-danfa",
    name: "Terrasses d’Anfa",
    festival: "Jazzablanca",
    capacity: "[Group size]",
    summary: "[What makes this space special, what is included]",
    body: "[What makes this space special, what is included]",
    price: "[X,XXX] MAD",
    perUnit: "per guest, per night",
    photo: "Photo: Terrasses d’Anfa",
    image: "/assets/hosp-terrasses-danfa.jpg",
    plan: { x: 76, y: 52 },
    specs: [
      { label: "Capacity", value: "[Group size]" },
      { label: "Festival", value: "Jazzablanca" },
      { label: "Location", value: "Anfa Park, Casablanca" },
      { label: "Nights", value: "One night or more" },
    ],
    included: [],
    includedTodo: "[List what the Terrasses d’Anfa package includes]",
    gallery: ["Photo: the terrace", "Photo: the view", "Photo: guests"],
  },
  {
    slug: "corporate-pass",
    name: "10-Day Corporate Pass",
    festival: "Jazzablanca",
    capacity: "From [X] passes",
    summary:
      "Passes for every night of the festival, for your clients and teams.",
    body: "Passes for every night of the festival, for your clients and teams. One booking covers the full ten days, with invoicing handled for companies.",
    price: "[X,XXX] MAD",
    perUnit: "per pass",
    photo: "Photo: guests at the festival entrance",
    image: "/assets/hosp-corporate-pass.jpg",
    plan: { x: 50, y: 86 },
    specs: [
      { label: "Capacity", value: "From [X] passes" },
      { label: "Festival", value: "Jazzablanca" },
      { label: "Location", value: "Anfa Park, Casablanca" },
      { label: "Nights", value: "All ten nights" },
    ],
    included: ["Entry on every night of the festival"],
    includedTodo: "[Add the other inclusions]",
    gallery: ["Photo: the entrance", "Photo: the crowd"],
  },
  {
    slug: "tanjazz-vip",
    name: "Tanjazz VIP",
    festival: "Tanjazz",
    capacity: "[Group size]",
    summary: "[Tanjazz hospitality offer to define]",
    body: "[Tanjazz hospitality offer to define]",
    price: "[X,XXX] MAD",
    perUnit: "per guest",
    photo: "Photo: Tanjazz VIP area",
    image: "/assets/gallery-3.jpg",
    plan: { x: 20, y: 30 },
    specs: [
      { label: "Capacity", value: "[Group size]" },
      { label: "Festival", value: "Tanjazz" },
      { label: "Location", value: "Tangier" },
      { label: "Nights", value: "One night or more" },
    ],
    included: [],
    includedTodo: "[Define the Tanjazz hospitality offer]",
    gallery: ["Photo: the Tanjazz VIP area"],
    wide: true,
  },
];

export function getPackage(slug: string) {
  return hospitalityPackages.find((entry) => entry.slug === slug);
}

/**
 * Add-ons for the builder direction, where the visitor assembles a night
 * rather than picking a package off a shelf.
 *
 * Every one of these is drawn from something the packages already name —
 * catering, parking, a host, a separate entrance — so nothing here invents a
 * service SEVENPM has not said it offers. The prices are placeholders in the
 * mockups' own bracket form, because they are prices and a guessed one on a
 * page that exists to quote is worse than a visible gap.
 */
export type Extra = {
  id: string;
  label: string;
  note: string;
  price: string;
};

export const hospitalityExtras: Extra[] = [
  {
    id: "catering",
    label: "Catering",
    note: "Food and drinks through the night, served in your space.",
    price: "[XXX] MAD",
  },
  {
    id: "parking",
    label: "On-site parking",
    note: "Spaces held inside the site, so nobody is hunting for a car at midnight.",
    price: "[XXX] MAD",
  },
  {
    id: "host",
    label: "A dedicated host",
    note: "One of our team stays with your party from arrival to last call.",
    price: "[XXX] MAD",
  },
  {
    id: "entrance",
    label: "Private entrance",
    note: "A separate gate away from the main entrance, with a cloakroom.",
    price: "[XXX] MAD",
  },
  {
    id: "transfers",
    label: "Guest transfers",
    note: "Cars between the hotel and the site, both ways.",
    price: "[XXX] MAD",
  },
];

/**
 * Copy for the redesigned page, which is one idea rather than a catalogue:
 * the page is the evening, told in order, from doors at seven to the last
 * call. Every section is an hour of it.
 *
 * SEVENPM is named for the hour the music starts, so the clock is the
 * brand's own device rather than a theme borrowed for a page.
 */
export const nightCopy = {
  hero: {
    stamp: "19:00 · Doors",
    /* Set with a window cut through the O — see `WordWindow`. */
    title: "Hospitality",
    windowAt: 1,
    standfirst:
      "Your clients, your partners, your team — at the festival, with a room of your own and somebody looking after all of it.",
    primary: { label: "See the spaces", href: "#spaces" },
    secondary: { label: "Ask for a quote", href: "#rsvp" },
  },

  manifesto: {
    stamp: "Why",
    /* The argument, in the fewest words that still make it. */
    lead: "A festival is a difficult place to host anyone.",
    body: "The sound is where the stage is, the bar is where the queue is, and the seat is wherever you got to first. Hospitality is the version of the night where none of that is your problem.",
    points: [
      {
        title: "A room of your own",
        body: "Boxes, terraces and garden spaces held for your party alone, with the stage in front of them.",
      },
      {
        title: "Nothing to arrange",
        body: "Tickets, catering and parking in one package. You turn up; the evening is already built.",
      },
      {
        title: "One person, all night",
        body: "A single contact from the first quote to the last call, who knows your party by name.",
      },
    ],
  },

  spaces: {
    stamp: "20:00 · The spaces",
    title: "Where your night happens",
    body: "Five rooms across two festivals. Each one is held for your party for the evening and quoted around what you need in it.",
  },

  night: {
    stamp: "The running order",
    title: "How the evening goes",
  },

  smallPrint: {
    stamp: "The small print",
    title: "Good to know",
  },

  rsvp: {
    stamp: "00:00 · Last call",
    title: "Tell us the night",
    body: "Give us the date, the number and anything the evening needs. One of our team comes back with a quote built around it.",
  },
};

/**
 * Copy for the paper design.
 *
 * The idea is an inversion. Every other page on this site is dark and loud,
 * because every other page is about the crowd. Hospitality is the room above
 * the crowd — the one place at a festival where you can hear the person
 * you brought — so the page is paper, set in black, and the only noise on it
 * is the photography.
 *
 * It is a quieter argument than the clock design makes, and a more expensive
 * looking one, which is the right register for the thing being sold.
 */
export const paperCopy = {
  hero: {
    rule: "SEVENPM · Hospitality",
    title: "Where it gets quiet",
    standfirst:
      "A festival is ten thousand people having the best night of the year. Hospitality is the room above it, held for your party, where you can hear each other.",
    meta: [
      { label: "Festivals", value: "Jazzablanca · Tanjazz" },
      { label: "Spaces", value: "Five" },
      { label: "Booking", value: "By quote" },
    ],
  },

  argument: {
    rule: "The case",
    /* Set as an editorial opening: the first paragraph carries a drop cap. */
    lead: "There is no good way to host someone at a festival. The sound is where the stage is, the bar is where the queue is, and the seat — if there is one — is wherever you got to first. You spend the evening apologising to the person you invited.",
    body: [
      "Hospitality is the version of that night where none of it is your problem. A space held for your party alone, with the stage in front of it and the queue somewhere else entirely. Food and drink brought to you. Parking inside the site. One person from our team who knows your guests by name and stays with them until the last call.",
      "It is not a better ticket. It is a different evening.",
    ],
  },

  spaces: {
    rule: "The spaces",
    title: "Five rooms",
    note: "Each one is held for your party for the evening and quoted around what you need in it.",
  },

  included: {
    rule: "The specification",
    title: "What comes with the room",
    /* Pooled across the packages — see the component. */
  },

  order: {
    rule: "The evening",
    title: "How the night runs",
  },

  enquiry: {
    rule: "Enquiries",
    title: "Tell us the night",
    body: "The date, the number of guests, anything the evening needs. We come back with a quote built around it.",
  },
};

export const hospitalityCopy = {
  eyebrow: "Jazzablanca · Tanjazz",
  title: "Hospitality",
  intro:
    "Business packages to host your clients, partners and teams at our festivals: private spaces, the best views of the stage, food and drinks taken care of.",
  heroPhoto: "Wide photo: guests in the VIP area facing the main stage at night",
  /* Illustrative, as above: a crowd shot from the festival library standing
     in for the VIP-area photograph the brief above describes. */
  heroImage: "/assets/gallery-2.jpg",
  primary: { label: "Explore packages", href: "#packages" },
  secondary: { label: "Request a quote", href: "#quote" },

  highlights: [
    {
      title: "Private spaces",
      body: "Boxes, terraces and garden areas reserved for your group.",
    },
    {
      title: "Everything included",
      body: "Tickets, catering and parking in one package, depending on the option.",
    },
    {
      title: "A dedicated contact",
      body: "One person from our team follows your booking, from the quote to the night.",
    },
  ],

  packages: {
    eyebrow: "Business packages",
    title: "Choose your experience",
    filters: ["All", "Jazzablanca", "Tanjazz"],
    discover: "Discover",
    from: "From",
  },

  /* The mockup reads "Prices are indicative and shown excluding VAT." VAT is
     off this site by an earlier decision, so the clause is dropped and the
     rest of the sentence kept. */
  priceNote:
    "Prices are indicative. No online payment: every package is confirmed with a personalised quote.",

  how: {
    eyebrow: "How it works",
    title: "From request to the show",
    steps: [
      {
        title: "Choose a package",
        body: "Compare the options and pick the one that fits your group.",
      },
      {
        title: "Send your request",
        body: "Guests, nights and needs, in one short form.",
      },
      {
        title: "Receive your quote",
        body: "Within [48 h], with invoice details for companies.",
      },
      {
        title: "Enjoy the night",
        body: "Your host welcomes your guests on site.",
      },
    ],
  },

  faq: {
    eyebrow: "FAQ",
    title: "Good to know",
    items: [
      {
        q: "Can a package be customised?",
        a: "Yes. Every package here is a starting point — tell us the number of guests, the nights and anything else the evening needs, and we build the quote around that.",
      },
      {
        q: "How do we pay?",
        a: "Nothing is paid online. Once the quote is agreed, our team sends the invoice and the payment details, by bank transfer for companies.",
      },
      {
        q: "Do you issue invoices for companies?",
        a: "Yes. Give us your company details and ICE number with the request and the invoice is issued in the company's name.",
      },
      {
        q: "Can we book for several nights?",
        a: "Yes. Boxes and spaces can be held for more than one night, and the 10-Day Corporate Pass covers every night of the festival.",
      },
    ],
  },

  cta: {
    title: "Talk to our hospitality team",
    /* TODO(content): confirm before launch. */
    email: "[hospitality@seven-pm.com]",
    phone: "[+212 X XX XX XX XX]",
    label: "Request a quote",
  },

  quote: {
    eyebrow: "Request a quote",
    title: "Tell us about your group",
    body: "No payment online. Our hospitality team sends you a personalised quote within [48 h].",
    nights: ["One night", "Two nights", "Three nights", "The full festival"],
    budgets: [
      "To discuss",
      "Under 20,000 MAD",
      "20,000 – 50,000 MAD",
      "50,000 – 100,000 MAD",
      "Over 100,000 MAD",
    ],
    consent:
      "I agree that SEVENPM may use this information to contact me about my request, in line with Moroccan law 09-08.",
    submit: "Request a quote",
    sent: "Thanks — nothing is sent from this prototype.",
    otherPackages: "Other packages",
  },
};
