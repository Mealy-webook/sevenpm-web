/**
 * Careers. Placeholder roles written around the team on seven-pm.com —
 * replace with the real openings (or a feed) before launch.
 */

export type JobRole = {
  id: string;
  title: string;
  team: string;
  location: string;
  /** Full time, seasonal, internship… */
  type: string;
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
  speculativeTitle: "Nothing that fits?",
  speculativeBody:
    "Write to us with what you do and the festival you would want to work on. We read everything and keep good applications on file for the next season.",
  speculativeCta: "Write to us",
  email: "hello@seven-pm.com",
  perksTitle: "What it's like",
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
  },
  {
    id: "production-coordinator",
    title: "Production coordinator",
    team: "Production",
    location: "Casablanca",
    type: "Full time",
  },
  {
    id: "partnerships-manager",
    title: "Partnerships manager",
    team: "Commercial",
    location: "Casablanca",
    type: "Full time",
  },
  {
    id: "social-media-lead",
    title: "Social media lead",
    team: "Communications",
    location: "Casablanca",
    type: "Full time",
  },
  {
    id: "ticketing-support",
    title: "Ticketing support agent",
    team: "Support",
    location: "Casablanca",
    type: "Seasonal",
  },
  {
    id: "design-intern",
    title: "Design intern",
    team: "Studio",
    location: "Casablanca",
    type: "Internship",
  },
];
