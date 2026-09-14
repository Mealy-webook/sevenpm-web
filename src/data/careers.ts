/**
 * Careers. Placeholder roles written around the team on seven-pm.com —
 * replace with the real openings (or a feed) before launch. `/careers` lists
 * these and `/careers/[id]` renders one.
 */

export type JobRole = {
  id: string;
  title: string;
  team: string;
  location: string;
  /** Full time, seasonal, internship… */
  type: string;
  /** One line under the title on the detail page. */
  summary: string;
  postedIso: string;
  postedLabel: string;
  reportsTo: string;
  starts: string;
  /** Opening paragraphs of the detail page. */
  about: string[];
  responsibilities: string[];
  requirements: string[];
  niceToHave: string[];
};

export const careersCopy = {
  eyebrow: "Casablanca · Tangier",
  title: "Careers",
  intro:
    "Four festivals a year, one small team. If you live for live music and want to build the events people in Morocco talk about all summer, we want to hear from you.",
  openRolesTitle: "Open roles",
  empty:
    "No roles are open right now. Send us a line anyway — we keep every application.",
  applyCta: "Apply",
  viewRole: "View role",
  speculativeTitle: "Nothing that fits?",
  speculativeBody:
    "Write to us with what you do and the festival you would want to work on. We read everything and keep good applications on file for the next season.",
  speculativeCta: "Write to us",
  email: "hello@seven-pm.com",
  perksTitle: "What it's like",
  role: {
    back: "All roles",
    about: "About the role",
    responsibilities: "What you'll do",
    requirements: "What you bring",
    niceToHave: "Nice to have",
    summary: "At a glance",
    team: "Team",
    location: "Location",
    type: "Contract",
    starts: "Starts",
    reportsTo: "Reports to",
    posted: "Posted",
    applyTitle: "Sound like you?",
    applyBody:
      "Send a CV and a short note about the festivals you've worked on. No cover letter needed.",
    other: "Other open roles",
  },
};

export const perks = [
  {
    title: "Season rhythm",
    body: "Quiet winters for planning, intense summers on site. Time off is taken after the last festival, not during it.",
  },
  {
    title: "Small team, wide brief",
    body: "Twelve people produce the whole season, so nobody stays in their lane. You will touch parts of the job that a bigger company would keep from you.",
  },
  {
    title: "Every festival, every year",
    body: "Staff go to all four festivals, with guest tickets for the people who put up with your summer.",
  },
];

export const jobRoles: JobRole[] = [
  {
    id: "stage-manager",
    title: "Stage manager",
    team: "Production",
    location: "Casablanca",
    type: "Seasonal",
    summary:
      "Run one of the Anfa Park stages across Jazzablanca and Casa Anfa Latina.",
    postedIso: "2026-05-28",
    postedLabel: "28 May, 2026",
    reportsTo: "Head of Production",
    starts: "April 2026",
    about: [
      "You own a stage for the length of a festival: the running order, the changeovers, and the mood of everyone standing behind the line.",
      "Our stages turn over fast — eight acts a night on the main stage during Jazzablanca — so the job is equal parts planning in the spring and calm on the night.",
    ],
    responsibilities: [
      "Build and hold the day schedule for your stage, from load-in to curfew",
      "Run changeovers with the backline and audio crews, and keep them inside the gap",
      "Meet artists and tour managers on arrival and walk them through the site",
      "Call the show, and make the decision when weather or a late arrival forces one",
    ],
    requirements: [
      "Three seasons or more managing a stage at a festival or a mid-size venue",
      "Calm under a running clock, and clear on the radio",
      "French and Arabic or English; most tour managers arrive with one of them",
      "Available from April through September, on site for the full festival runs",
    ],
    niceToHave: [
      "Experience with jazz and world-music backlines",
      "A licence to drive a van around a site",
    ],
  },
  {
    id: "production-coordinator",
    title: "Production coordinator",
    team: "Production",
    location: "Casablanca",
    type: "Full time",
    summary:
      "Hold the production paperwork for all four festivals, year round.",
    postedIso: "2026-05-28",
    postedLabel: "28 May, 2026",
    reportsTo: "Head of Production",
    starts: "As soon as you can",
    about: [
      "Every artist we book arrives with a rider, a flight, a hotel and a set of questions. You are the person who answers them, and the reason nothing lands on site as a surprise.",
      "The role runs across the whole season: advancing in the winter and spring, on site through the summer.",
    ],
    responsibilities: [
      "Advance riders with tour managers and turn them into site-ready documents",
      "Book travel, hotels and ground transport for artists and crew",
      "Keep the production schedule current and share it with everyone who needs it",
      "Handle accreditation, passes and the guest lists at each festival",
    ],
    requirements: [
      "Two years coordinating live events, or a season on a festival production team",
      "Fluent written French and English; Arabic an advantage",
      "Fast and accurate with spreadsheets — this job lives in them",
      "The instinct to chase an unanswered email before it becomes a problem",
    ],
    niceToHave: [
      "Experience with Moroccan customs paperwork for touring equipment",
      "A second season under a festival's belt",
    ],
  },
  {
    id: "partnerships-manager",
    title: "Partnerships manager",
    team: "Commercial",
    location: "Casablanca",
    type: "Full time",
    summary:
      "Build the sponsor side of the season, from first meeting to on-site activation.",
    postedIso: "2026-05-28",
    postedLabel: "28 May, 2026",
    reportsTo: "Sales Director",
    starts: "As soon as you can",
    about: [
      "Our partners pay for a good part of the season, and the good ones bring something to it — a stage, a bar, a workshop, a reason for people to stop walking.",
      "You find them, agree what they get, and then make sure what was promised actually happens on site.",
    ],
    responsibilities: [
      "Build and work a pipeline of brands across Morocco and the region",
      "Write proposals and negotiate contracts alongside the Sales Director",
      "Turn each deal into a delivery plan with production and communications",
      "Report back to partners after each festival with what they actually got",
    ],
    requirements: [
      "Three years in sponsorship, media sales or brand partnerships",
      "A network in Morocco you can pick up the phone to",
      "French and English; Arabic strongly preferred",
      "Comfortable being on site while your partners are there",
    ],
    niceToHave: [
      "Experience selling into culture and sport",
      "A portfolio of activations you can walk us through",
    ],
  },
  {
    id: "social-media-lead",
    title: "Social media lead",
    team: "Communications",
    location: "Casablanca",
    type: "Full time",
    summary:
      "Own the voice of four festivals across the channels people actually use.",
    postedIso: "2026-05-28",
    postedLabel: "28 May, 2026",
    reportsTo: "PR Manager",
    starts: "As soon as you can",
    about: [
      "Announcements, line-up drops, ticket reminders and ten days of live coverage a summer — you plan all of it and shoot most of it.",
      "The job is as much editing on a phone at midnight as it is a content calendar in March.",
    ],
    responsibilities: [
      "Plan and publish across Instagram, TikTok, X and YouTube for all four festivals",
      "Shoot and cut short-form video on site, often the same night",
      "Brief and work with photographers and videographers during the runs",
      "Watch the numbers and tell us plainly what worked",
    ],
    requirements: [
      "Two years running social for a brand, venue or festival",
      "You edit your own video, quickly",
      "Darija and French for the audience, English for the artists",
      "A feed or a portfolio that shows your taste",
    ],
    niceToHave: [
      "Photography that can stand on its own",
      "Paid social and community management experience",
    ],
  },
  {
    id: "ticketing-support",
    title: "Ticketing support agent",
    team: "Support",
    location: "Casablanca",
    type: "Seasonal",
    summary:
      "Answer the people buying tickets, before and during the festivals.",
    postedIso: "2026-05-28",
    postedLabel: "28 May, 2026",
    reportsTo: "Head of Support",
    starts: "May 2026",
    about: [
      "Every presale brings a wave of questions: a card that did not go through, a name to change, a wristband that will not scan at the gate.",
      "You answer them, in the language the person wrote in, and you flag what keeps coming up so we can fix the cause.",
    ],
    responsibilities: [
      "Answer email, chat and social messages about bookings and wallets",
      "Work the box office and the accreditation desk during the festivals",
      "Resolve payment and transfer problems with the ticketing platform",
      "Keep a list of what people ask most, and help us fix it",
    ],
    requirements: [
      "Written Darija, French and English",
      "Patience, and a clear way of writing a short answer",
      "Available evenings and weekends through the season",
      "Comfortable on your feet at the gate for a ten-day run",
    ],
    niceToHave: [
      "Experience with a ticketing back office",
      "A first season on a festival, in any role",
    ],
  },
  {
    id: "design-intern",
    title: "Design intern",
    team: "Studio",
    location: "Casablanca",
    type: "Internship",
    summary: "Six months in the studio, on real festival work.",
    postedIso: "2026-05-28",
    postedLabel: "28 May, 2026",
    reportsTo: "Graphic & Web Designer",
    starts: "January 2026",
    about: [
      "You sit with our designer and work on what the season actually needs: line-up posts, stage signage, ticket artwork, the odd page on this site.",
      "It is a real brief with real deadlines, and your work goes out under the festival's name.",
    ],
    responsibilities: [
      "Adapt campaign artwork across social, print and on-site formats",
      "Prepare files for print and for the web",
      "Help keep the asset library in order",
      "Bring your own ideas to the weekly studio review",
    ],
    requirements: [
      "Studying design, or just finished",
      "Comfortable in Figma and the Adobe suite",
      "A portfolio, however small, that shows how you think",
      "Based in Casablanca for the six months",
    ],
    niceToHave: ["Motion or 3D", "A love of music posters"],
  },
];

export const applyCopy = {
  title: "Apply",
  intro:
    "Tell us who you are and what you've worked on. It takes five minutes.",
  about: "About you",
  work: "Your work",
  extra: "Anything else",
  submit: "Send application",
  submitNote:
    "No account needed. Your mail app opens with everything filled in — attach your CV and send.",
  cvNote:
    "A link is enough. If your CV is a file, attach it to the e-mail that opens when you send this form.",
  consent:
    "I'm happy for SEVENPM to keep my application on file for this role and future openings.",
  sentTitle: "Nearly there",
  sentBody:
    "Your mail app should have opened with your answers already written out. Attach your CV, press send, and we'll come back to you within two weeks.",
  sentAgain: "Fill the form again",
  fields: {
    firstName: "First name",
    lastName: "Last name",
    email: "Email",
    phone: "Phone",
    city: "City",
    link: "Portfolio or CV link",
    years: "Years in live events",
    experience: "Which festivals or venues have you worked on?",
    notes: "Anything else we should know?",
    source: "How did you hear about us?",
  },
  placeholders: {
    city: "Casablanca",
    link: "https://",
    select: "Choose one",
    experience:
      "Tell us where, when, and what you were responsible for. Two or three lines is plenty.",
  },
  yearOptions: [
    "Less than a year",
    "1–3 years",
    "3–5 years",
    "More than 5 years",
  ],
  sourceOptions: [
    "At one of our festivals",
    "Instagram",
    "LinkedIn",
    "From someone on the team",
    "Somewhere else",
  ],
  errors: {
    required: "This one's needed",
    email: "That doesn't look like an e-mail address",
    consent: "We need your agreement to keep your application",
  },
};

export function getRole(id: string) {
  return jobRoles.find((role) => role.id === id);
}
