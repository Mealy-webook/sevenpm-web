/**
 * Careers, from Figma 2227:6749 (index) and 2231:10129 (one role). The first
 * two roles carry the comp's own copy; the other two keep the contract types
 * the filter chips offer. Replace with the real openings before launch.
 */

export type JobRole = {
  id: string;
  title: string;
  team: string;
  location: string;
  /** Also the filter chip: the page groups roles by this. */
  type: string;
  /** One line, used for metadata and the dialog. */
  summary: string;
  postedIso: string;
  postedLabel: string;
  starts: string;
  responsibilities: string[];
  profile: string[];
};

export const careersCopy = {
  title: "Careers",
  intro:
    "Four festivals a year, one small team. If you live for live music and want to build the events people in Morocco talk about all summer, we want to hear from you.",
  heroImageAlt: "The SEVENPM crew after a festival at Anfa Park",
  openRolesTitle: "Open roles",
  applyCta: "Apply",
  empty: "No roles open in this category right now.",
  email: "hello@seven-pm.com",
  role: {
    responsibilities: "Responsibilities",
    profile: "Desired profile",
    summary: "At a glance",
    team: "Team",
    location: "Location",
    type: "Contract",
    starts: "Starts",
    posted: "Posted",
  },
};

export const jobRoles: JobRole[] = [
  {
    id: "senior-communication-project-manager",
    title: "Senior Communication Project Manager (M/F)",
    team: "Communications",
    location: "Casablanca, Morocco",
    type: "Full time Contract",
    summary:
      "Own the planning of every communication asset across the four festivals.",
    postedIso: "2026-05-28",
    postedLabel: "28 May, 2026",
    starts: "April 2026",
    responsibilities: [
      "Define, structure and manage the overall planning of communication assets.",
      "Ensure follow-up on deadlines and guarantee that deadlines are met by all stakeholders.",
      "Coordinate and manage relationships with agencies and service providers.",
      "Proactively follow up with stakeholders to ensure the progress of deliverables.",
      "Centralize, analyze and distribute briefs, ensuring their clarity and proper understanding.",
      "Supervise the tracking of proofs until final validation.",
      "Ensure the application and respect of communication guidelines.",
      "Manage the production and monitoring of materials with a focus on quality and brand consistency.",
      "Identify risks, anticipate roadblocks and propose solutions, with structured reporting to your Manager.",
      "Update and optimize management tools (monitoring dashboards, reporting, performance indicators).",
    ],
    profile: [
      "Project management and coordination skills.",
      "Master's degree (Bac +5) in Communication, Marketing, or equivalent.",
      "Minimum 7 years of proven experience in communication, including at least 3 years in project management.",
      "Excellent writing, interpersonal, and organizational skills.",
      "Strong adaptability, initiative, and a keen sense of creativity.",
      "Comfortable in a dynamic, demanding, and collaborative environment.",
    ],
  },
  {
    id: "graphic-designer",
    title: "Graphic Designer (M/F)",
    team: "Studio",
    location: "Casablanca, Morocco",
    type: "Full time Contract",
    summary:
      "Take the season's artwork from the poster to the stage signage and back.",
    postedIso: "2026-05-28",
    postedLabel: "28 May, 2026",
    starts: "April 2026",
    responsibilities: [
      "Adapt each festival's campaign artwork across social, print and on-site formats.",
      "Design the on-site system: signage, wristbands, passes, stage and bar graphics.",
      "Prepare and check files for print, and follow proofs through to final validation.",
      "Keep the asset library and the brand guidelines current for every festival.",
      "Work with the social media lead on templates the team can use without you.",
      "Bring ideas to the weekly studio review, not just execution.",
    ],
    profile: [
      "Degree in graphic design, or a portfolio that makes one unnecessary.",
      "Minimum 3 years designing for brands, culture or live events.",
      "Fluent in Figma and the Adobe suite; comfortable preparing print files.",
      "An eye for typography, and the discipline to hold a system together.",
      "Able to work to a festival calendar, with the peaks that come with it.",
      "Motion or 3D is a bonus, not a requirement.",
    ],
  },
  {
    id: "design-intern",
    title: "Design Intern (M/F)",
    team: "Studio",
    location: "Casablanca, Morocco",
    type: "Internship",
    summary: "Six months in the studio, on real festival work.",
    postedIso: "2026-05-28",
    postedLabel: "28 May, 2026",
    starts: "January 2026",
    responsibilities: [
      "Adapt campaign artwork across social, print and on-site formats.",
      "Prepare files for print and for the web.",
      "Help keep the asset library in order.",
      "Bring your own ideas to the weekly studio review.",
    ],
    profile: [
      "Studying design, or just finished.",
      "Comfortable in Figma and the Adobe suite.",
      "A portfolio, however small, that shows how you think.",
      "Based in Casablanca for the six months.",
    ],
  },
  {
    id: "stage-manager",
    title: "Stage Manager (M/F)",
    team: "Production",
    location: "Casablanca, Morocco",
    type: "Freelance",
    summary:
      "Run one of the Anfa Park stages across Jazzablanca and Casa Anfa Latina.",
    postedIso: "2026-05-28",
    postedLabel: "28 May, 2026",
    starts: "April 2026",
    responsibilities: [
      "Build and hold the day schedule for your stage, from load-in to curfew.",
      "Run changeovers with the backline and audio crews, and keep them inside the gap.",
      "Meet artists and tour managers on arrival and walk them through the site.",
      "Call the show, and make the decision when weather or a late arrival forces one.",
    ],
    profile: [
      "Three seasons or more managing a stage at a festival or a mid-size venue.",
      "Calm under a running clock, and clear on the radio.",
      "French and Arabic or English; most tour managers arrive with one of them.",
      "Available from April through September, on site for the full festival runs.",
    ],
  },
];

/** The filter chips, in the order the comp shows them. */
export const roleTypes = Array.from(new Set(jobRoles.map((role) => role.type)));

export function getRole(id: string) {
  return jobRoles.find((role) => role.id === id);
}

/* ------------------------------------------------------------------ *
 * Apply dialog (Figma 2231:10633)
 * ------------------------------------------------------------------ */

export const applyCopy = {
  title: "Apply",
  submit: "Send application",
  close: "Close",
  /** No endpoint yet — see ApplyDialog. */
  note: "Your mail app opens with everything filled in. Attach your CV and send.",
  sentTitle: "Nearly there",
  sentBody:
    "Your mail app should have opened with your answers already written out. Attach your CV, press send, and we'll come back to you within two weeks.",
  done: "Done",
  dialCode: "+212",
  fields: {
    firstName: "First name",
    lastName: "Last name",
    email: "Email",
    phone: "Phone number",
    city: "City",
    link: "Portfolio or CV link *",
    years: "Years in live events",
  },
  yearOptions: [
    "Less than a year",
    "1–3 years",
    "3–5 years",
    "More than 5 years",
  ],
  errors: {
    required: "This one's needed",
    email: "That doesn't look like an e-mail address",
  },
};
