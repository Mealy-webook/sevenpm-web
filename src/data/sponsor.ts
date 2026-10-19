/**
 * "Become a sponsor", from the supplied mockup
 * (`Become Sponsor_website mockups.pdf`, three pages).
 *
 * The structure is the mockup's, section for section. The look is the site's:
 * Daltown display headings, the 4px radius, brand yellow, and square controls
 * rather than the mockup's pills.
 *
 * The mockup writes its unknowns as `[XX,000]`, `[XX%]` and so on. They are
 * kept exactly as written rather than filled with plausible numbers — the
 * site already carries two conflicting attendance figures for Jazzablanca,
 * and a sponsorship page is the last place to guess at one. Everything in
 * square brackets is waiting on content.
 */

export type SponsorStat = {
  value: string;
  note: string;
  /** Brand yellow, as the mockup picks out two of the four. */
  accent?: boolean;
};

export type AudienceCard = {
  label: string;
  value: string;
  note: string;
};

export type CaseStudy = {
  brand: string;
  /** The dark pill on the card — the kind of partnership it was. */
  kind: string;
  festival: string;
  photo: string;
  /** The festival photograph standing in for the case's own, until the
      partner shoot lands. `photo` keeps the brief. */
  image: string;
  /** Lead sentence, bolded as "The experience:" on the card. */
  experience: string;
  /** The brief still to be written, shown in the mockup's yellow. */
  todo?: string;
  metrics: { value: string; note: string }[];
};

export type SponsorFormat = {
  title: string;
  body: string;
  /** The picture the format list shows while this format is chosen. */
  image: string;
  link?: { label: string; href: string };
};

export type SponsorStep = {
  title: string;
  body: string;
};

export const sponsorCopy = {
  eyebrow: "Partnerships · Jazzablanca & Tanjazz · 2027 season",
  title: "Put your brand on stage.",
  intro:
    "Every year, [XX,000] festivalgoers experience our festivals in Casablanca and Tangier. Together, we design brand spaces and experiences people live, not just logos they see.",
  heroPhoto: "Photo: crowd in front of the main stage, Anfa Park",
  /* The Casa Anfa stage over a full crowd — a brand's name on a stage, which
     is the pitch in one picture. From the festival library. */
  heroImage: "/assets/gallery-2.jpg",
  primary: { label: "Get the partnership deck", href: "#partnership-form" },
  secondary: { label: "See case studies", href: "#case-studies" },

  stats: [
    {
      value: "10 days",
      note: "50 concerts, 3 stages at Jazzablanca",
    },
    { value: "[XX,000]", note: "festivalgoers per edition", accent: true },
    { value: "30+", note: "partner brands in 2026" },
    { value: "No. 1", note: "Voted best event in Morocco in 2025", accent: true },
  ] satisfies SponsorStat[],

  /* TODO(content): replace with official logos approved by each brand, each
     linking to the partner's own site. Names only until then — a wordmark we
     drew ourselves would be a trademark we do not hold. */
  trustedBy: {
    title: "They trust us",
    /* The logo row on the page (Figma 2641:9034): six square cells, in the
       comp's order. Official marks only, so the four we hold, with adidas
       standing in for the cells the comp also fills with it. */
    logos: [
      { name: "adidas", logo: "/assets/sponsor-adidas.svg" },
      { name: "Spotify", logo: "/assets/sponsor-spotify.svg" },
      { name: "Coca-Cola", logo: "/assets/sponsor-cocacola.svg" },
      { name: "Saham Bank", logo: "/assets/sponsor-saham.svg" },
      { name: "adidas", logo: "/assets/sponsor-adidas.svg" },
      { name: "adidas", logo: "/assets/sponsor-adidas.svg" },
    ],
    note: "[Replace with official logos, approved by each brand. Each logo links to the partner's website.]",
    brands: [
      "Saham Bank",
      "Casa Anfa",
      "BYD",
      "Orange",
      "TotalEnergies",
      "DHL",
      "Air France",
      "Samsung",
      "Nescafé",
      "Oulmes",
      "Spotify",
      "Marriott",
    ],
  },

  audience: {
    eyebrow: "Our audience",
    title: "Who you will reach",
    image: "/assets/gallery-3.jpg",
    /* The comp's figures (Figma 2641:9583), in its order. */
    cards: [
      { label: "Age", value: "20 - 30 years", note: "Main age group" },
      {
        label: "Community",
        value: "10k",
        note: "Newsletter and social followers",
      },
      { label: "Profile", value: "10%", note: "CSP+ / executives" },
      { label: "Cities", value: "15%", note: "From outside Casablanca" },
    ] satisfies AudienceCard[],
  },

  caseStudies: {
    eyebrow: "Case studies",
    title: "What our partners experienced with us",
    intro:
      "Three formats, three different goals. Each case: the brand's challenge, the experience we built, the measured results.",
    items: [
      {
        brand: "Casa Anfa",
        kind: "Stage naming",
        festival: "Jazzablanca",
        photo: "Photo: Casa Anfa stage during a concert",
        image: "/assets/gallery-4.jpg",
        experience:
          "the brand gives its name to one of the festival stages, the Casa Anfa stage.",
        todo: "[Describe the programme and the stage branding]",
        metrics: [
          { value: "[XX]", note: "concerts on the stage" },
          { value: "[XXk]", note: "spectators" },
        ],
      },
      {
        brand: "BYD",
        kind: "Official partner",
        festival: "Jazzablanca",
        photo: "Photo: BYD vehicles on the festival site",
        image: "/assets/hosp-garden-party-vip.jpg",
        experience: "official car of the festival.",
        todo: "[Describe the activation: artist shuttles, display, test drives…]",
        metrics: [
          { value: "[XX]", note: "qualified leads" },
          { value: "[XX]", note: "test drives or rides" },
        ],
      },
      {
        brand: "Orange",
        kind: "Telecom sponsor",
        festival: "Jazzablanca",
        photo: "Photo: Orange activation in the Village",
        image: "/assets/gallery-6.jpg",
        experience: "official telecom sponsor.",
        todo: "[Describe the activation: customer offer, SMS, charging, connected area…]",
        metrics: [
          { value: "[XX]", note: "customers reached" },
          { value: "[XX]", note: "tickets sold through the offer" },
        ],
      },
    ] satisfies CaseStudy[],
    quote: {
      text: "[Quote from a partner's marketing director, with their approval]",
      attribution: "[First and last name], [Title, Brand]",
    },
  },

  formats: {
    eyebrow: "Formats",
    title: "From logo to experience",
    intro:
      "Five ways to be part of the festival. Each partnership combines one or more formats, built with your team.",
    items: [
      {
        title: "Stage naming",
        image: "/assets/gallery-1.jpg",
        body: "Your name on a stage, in the programme, on ticketing and in every artist announcement.",
      },
      {
        title: "Brand zone",
        image: "/assets/hosp-terrasses-danfa.jpg",
        body: "A dedicated space in the Village, a chill zone or the Terrasses d’Anfa: tasting, games, photo, charging.",
      },
      {
        title: "VIP hospitality",
        image: "/assets/hosp-vip-box.jpg",
        body: "VIP boxes and Garden Party to host your clients and teams.",
        link: { label: "See hospitality packages", href: "/hospitality" },
      },
      {
        title: "Digital activation",
        image: "/assets/gallery-3.jpg",
        body: "Offers for our festivalgoers: newsletter, social media, ticketing and loyalty programme.",
      },
      {
        title: "Official partner",
        image: "/assets/hosp-corporate-pass.jpg",
        body: "Category exclusivity: banking, automotive, telecom, drinks, transport, hotels.",
      },
    ] satisfies SponsorFormat[],
    tailored: {
      title: "A tailor-made format?",
      body: "Tell us your goal, we design the experience.",
      label: "Let’s talk",
    },
  },

  how: {
    eyebrow: "How it works",
    title: "Four steps, one contact",
    steps: [
      { title: "Your brief", body: "Through the form below or a call." },
      {
        title: "A proposal",
        body: "Formats, zone and budget within [X] working days.",
      },
      {
        title: "Co-creation",
        body: "We design and produce the experience with your teams.",
      },
      {
        title: "Results report",
        body: "Attendance, leads, media coverage: a report after the festival.",
      },
    ] satisfies SponsorStep[],
  },

  form: {
    eyebrow: "Become a sponsor",
    title: "Let's talk about your next activation",
    body: "Get our 2027 partnership deck and a first proposal tailored to your goals.",
    direct: {
      title: "Contact us directly",
      team: "SEVENPM partnerships team",
      /* TODO(content): confirm before launch. Shown in the mockup's bracket
         form so nobody mistakes it for a live address. */
      email: "[partnerships@seven-pm.com]",
      phone: "[+212 X XX XX XX XX]",
      label: "Book a call",
    },
    festivals: ["Jazzablanca", "Tanjazz", "Both"],
    goals: [
      "Awareness",
      "Brand image",
      "Sales and leads",
      "Product sampling",
      "B2B client relations",
      "CSR engagement",
    ],
    audiences: ["18–25", "25–35", "35–50", "50+", "Families", "Business clients"],
    formats: [
      "Stage naming",
      "Brand zone",
      "VIP hospitality",
      "Digital activation",
      "Official partner",
    ],
    industries: [
      "Banking and insurance",
      "Automotive",
      "Telecom",
      "Food and drink",
      "Transport",
      "Hotels and tourism",
      "Retail",
      "Other",
    ],
    budgets: [
      "To discuss",
      "Under 100,000 MAD",
      "100,000 – 300,000 MAD",
      "300,000 – 700,000 MAD",
      "Over 700,000 MAD",
    ],
    timelines: [
      "As soon as possible",
      "Within a month",
      "This quarter",
      "Next season",
    ],
    consent:
      "I agree that SEVENPM may use this information to contact me about a partnership. In line with Moroccan law 09-08, you have the right to access, correct and object to your data.",
    submit: "Get the partnership deck",
    reply: "Reply within 48 working hours.",
    sent: "Thanks — nothing is sent from this prototype.",
  },
};
