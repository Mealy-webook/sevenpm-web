/**
 * Copy for the five menu destinations that had no page: upcoming events,
 * concerts, sponsorship, hospitality and contact.
 *
 * No Figma comp covers any of these — the menu asked for them before the
 * design did. The structure here follows the pages that do have comps (a
 * display heading, a standfirst, then blocks) so they sit in the same site.
 *
 * Everything factual is drawn from what the site already says: the festival
 * names and cities in `data/home.ts`, the VIP box in `data/events.ts`, the
 * crew size in `data/about.ts`. Nothing here invents an attendance figure, a
 * price or a partner. The places that genuinely need a fact SEVENPM has not
 * supplied yet are marked `TODO(content)` and read as an honest blank on the
 * page rather than as a confident guess.
 */

export type PageBlock = {
  title: string;
  body: string;
};

export type ContactChannel = {
  label: string;
  /** What this channel is for, so a visitor picks the right one. */
  note: string;
  /** TODO(content): real addresses. Empty renders as "to be confirmed". */
  email?: string;
  /** How soon this line answers. Bracketed until the team commits to it. */
  reply: string;
};

/* ------------------------------------------------------------------ */
/* Upcoming events                                                      */
/* ------------------------------------------------------------------ */

export const eventsCopy = {
  eyebrow: "What's on",
  title: "Upcoming events",
  intro:
    "Every SEVENPM date, in one place — the festivals we produce across Morocco and the concerts that fall between them. Tickets open here first.",
  /** Shown when a strand has nothing announced, instead of an empty grid. */
  empty: "Nothing announced yet. The newsletter gets it first.",
};

/* ------------------------------------------------------------------ */
/* Concerts                                                             */
/* ------------------------------------------------------------------ */

export const concertsCopy = {
  eyebrow: "Beyond the festivals",
  title: "Concerts",
  intro:
    "One night, one room, one artist. Between the festivals we promote single shows in venues across Casablanca, Tangier and Rabat — the same booking, the same production, at the scale of a single evening.",
  blocks: [
    {
      title: "The rooms",
      body: "From a few hundred people in a theatre to several thousand in a park. The room is chosen for the artist rather than the other way round, which is why the programme moves between venues instead of settling in one.",
    },
    {
      title: "How to hear first",
      body: "Concerts are announced on short notice far more often than festivals are. The newsletter and the news page carry every announcement as it lands.",
    },
  ] satisfies PageBlock[],
  /* TODO(content): there is no concert data in the project yet. Until a
     programme is supplied this page is honest about being empty rather than
     filled with invented shows. */
  shows: [] as {
    name: string;
    when: string;
    venue: string;
    href: string;
  }[],
};

/* ------------------------------------------------------------------ */
/* Become a sponsor                                                     */
/* ------------------------------------------------------------------ */

export const sponsorCopy = {
  eyebrow: "Partnerships",
  title: "Become a sponsor",
  intro:
    "SEVENPM produces four festivals a year and a concert programme around them. Partners reach that audience in the place they have chosen to be — not in an ad break beside it.",
  blocks: [
    {
      title: "What a partnership is",
      body: "A season-long association with the festivals rather than a logo on a banner for a weekend. Partners are built into the programme — a stage, a space, a strand of the bill — and carried across the campaign that surrounds it.",
    },
    {
      title: "What it includes",
      body: "Naming and presence on site, visibility across the campaign and the channels behind it, hospitality for your guests, and content shot at the festival that is yours to use afterwards. The mix is put together per partner; nothing here is a fixed package.",
    },
    {
      title: "Who it suits",
      body: "Brands with something to do on site. The partnerships that work are the ones a festival-goer would notice even without the logo — a stage worth standing at, a space worth queueing for, a thing worth taking home.",
    },
  ] satisfies PageBlock[],
  /* TODO(content): audience and reach figures. The site currently carries two
     conflicting attendance numbers for Jazzablanca (20,000 and nearly
     100,000), so none is quoted here until that is settled. */
  cta: {
    title: "Tell us what you have in mind",
    body: "Send the brand, the festival you have your eye on and roughly what you want to do. The partnerships team answers every approach.",
    label: "Start a conversation",
  },
};

/* ------------------------------------------------------------------ */
/* Hospitality                                                          */
/* ------------------------------------------------------------------ */

export const hospitalityCopy = {
  eyebrow: "Guests and groups",
  title: "Hospitality",
  intro:
    "The festival, with a seat, a table and somebody looking after you. For companies bringing guests, and for anyone who would rather watch the headliner from a box than from the barrier.",
  blocks: [
    {
      title: "The VIP box",
      body: "A private box over the main stage with its own entrance, seating for your party and service through the night. Sold as a box rather than per head, so the room is yours for the evening.",
    },
    {
      title: "Corporate guests",
      body: "Larger groups are handled end to end: arrival, catering, a host on the night and a single invoice. Tell us the number of guests and the date and we will come back with what is possible.",
    },
    {
      title: "On the night",
      body: "A dedicated entrance away from the main gate, a cloakroom, and someone on the box who stays with your party. The music is the same music; everything around it is quieter.",
    },
  ] satisfies PageBlock[],
  cta: {
    title: "Enquire about a box",
    body: "Boxes are limited and go early, particularly for the closing nights.",
    label: "Make an enquiry",
  },
};

/* ------------------------------------------------------------------ */
/* Contact                                                              */
/* ------------------------------------------------------------------ */

export const contactCopy = {
  eyebrow: "Get in touch",
  title: "Contact",
  intro:
    "A small team in Casablanca. Pick the right line below and you will reach the person who can actually answer.",
  /* TODO(content): real addresses. Rendered as "to be confirmed" while empty,
     rather than as a mailto: that bounces. */
  channels: <ContactChannel[]>[
    {
      label: "General",
      reply: "[Within 2 working days]",
      note: "Anything that does not fit the lines below.",
    },
    {
      label: "Tickets and bookings",
      reply: "[Within 1 working day]",
      note: "Orders, refunds, name changes and anything to do with a booking you have already made.",
    },
    {
      label: "Partnerships",
      reply: "[Within 48 working hours]",
      note: "Sponsorship, brand activations and media partnerships.",
    },
    {
      label: "Hospitality",
      reply: "[Within 1 working day]",
      note: "VIP boxes, corporate guests and groups.",
    },
    {
      label: "Press",
      reply: "[Same working day]",
      note: "Accreditation, interviews and image requests.",
    },
    {
      label: "Artists and bookings",
      reply: "[Within 2 weeks]",
      note: "Submissions and agent enquiries for the festivals and the concert programme.",
    },
  ],
  where: {
    title: "Where we are",
    city: "Casablanca, Morocco",
    follow: "Follow along",
    /* From the Contact comp (2637:6332). */
    address: "69 Rue Erraihane Beauséjour, Casablanca - Morocco",
    email: "hello@seven-pm.com",
    phone: "[+212 X XX XX XX XX]",
  },
  /** Who the message is for, asked before the topic (benchmark: Primavera). */
  festivals: ["Jazzablanca", "Tanjazz", "SEVENPM"],
  /** Ticket questions carry an order number (benchmark: Glastonbury). */
  orderLabel: "Order number",
  orderHint: "It is on your confirmation email and in your bookings.",
  form: {
    title: "Send a message",
    topic: "What is it about?",
    body: "We answer everything, usually within two working days.",
    label: "Send message",
    /* The site has no backend. The form says so rather than pretending. */
    sent: "Thanks — nothing is sent from this prototype.",
  },
};
