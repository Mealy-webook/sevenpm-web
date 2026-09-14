/**
 * About page content. Sourced from the current site, https://www.seven-pm.com
 * (French), translated into English. Figures are the ones the site states;
 * confirm with the team before launch.
 */

export const aboutCopy = {
  eyebrow: "Casablanca, since 2018",
  title: "About us",
  manifesto:
    "In the service of music and culture, SEVENPM helps re-enchant cities with recurring annual celebrations — creating social momentum, community life, direct and indirect jobs, and carrying the universal values music stands for: passion, openness and generosity.",
  story: {
    title: "Who we are",
    body: [
      "Founded in 2018, SEVENPM was born from the desire to take cultural events in Morocco to new heights.",
      "Since then, SEVENPM has established itself as an essential player, orchestrating with passion and dedication iconic festivals such as Jazzablanca, Tanjazz, Village Casa Anfa and Casa Anfa Latina.",
    ],
    image: "/assets/gallery-4.jpg",
  },
  pillars: [
    {
      label: "Mission",
      body: "Offer an exceptional experience to our festivalgoers and our whole community by guaranteeing access to culture and events.",
    },
    {
      label: "Vision",
      body: "Build a model of cultural enterprise that brings the world's best artists to Morocco and puts young Moroccan talent in the spotlight.",
    },
    {
      label: "Values",
      body: "Encourage diversity and foster social inclusion, in partnership with committed companies and with our communities, to make culture accessible to all.",
    },
  ],
  team: {
    title: "The team",
    body: "Our success rests on a dedicated, dynamic team that unites rigour and creativity. Each member brings their own expertise to bringing our events to life — embodying our passion for music and culture.",
  },
  contact: {
    address: ["69 Rue Erraihane Beauséjour", "Casablanca — Morocco"],
    email: "hello@seven-pm.com",
    careersUrl: "https://www.seven-pm.com/carrières",
    playlistUrl: "https://open.spotify.com/playlist/10JyRf8ULFYSvShuaQTdAN",
  },
};

export type Stat = {
  value: number;
  suffix?: string;
  prefix?: string;
  label: string;
};

export const stats: Stat[] = [
  { value: 2018, label: "Founded in Casablanca" },
  { value: 4, label: "Festivals produced every year" },
  {
    value: 20000,
    suffix: "+",
    label: "Festivalgoers at one Jazzablanca edition",
  },
  { value: 22, label: "Editions of Tanjazz and counting" },
];

export type AboutFestival = {
  name: string;
  city: string;
  since?: string;
  body: string;
  website?: string;
  instagram?: string;
  poster: string;
  href?: string;
};

export const aboutFestivals: AboutFestival[] = [
  {
    name: "Jazzablanca",
    city: "Anfa Park, Casablanca",
    since: "17 editions",
    body: "After a landmark edition that drew more than 20,000 festivalgoers, Jazzablanca returns to Anfa Park with open-air concerts, a food court, a makers' market and much more — an immersive experience full of surprises.",
    website: "https://www.jazzablanca.com/",
    instagram: "https://www.instagram.com/jazzablanca_fest/",
    poster: "/assets/festival-poster-3.png",
    href: "/events/jazzablanca",
  },
  {
    name: "Tanjazz",
    city: "Tangier",
    since: "22 editions",
    body: "Soak up the captivating atmosphere of Tangier. The city itself becomes the stage as Tanjazz explores musical diversity through a fusion of styles every September.",
    website: "https://tanjazz.org/",
    instagram: "https://www.instagram.com/tanjazzofficiel/",
    poster: "/assets/festival-poster-2.png",
  },
  {
    name: "Casa Anfa Latina",
    city: "Anfa Park, Casablanca",
    body: "Feel the Latin energy at the heart of Anfa Park, where the passion and warmth of Latin rhythms carry you away — a vibrant celebration of Latin culture.",
    website: "https://www.casaanfalatina.com/",
    instagram: "https://www.instagram.com/casa.anfa.latina/",
    poster: "/assets/festival-poster-4.png",
  },
  {
    name: "Village Casa Anfa",
    city: "Anfa Park, Casablanca",
    body: "A festival village for the whole family: music, games and food across Anfa Park.",
    poster: "/assets/festival-poster-1.png",
  },
];

export type TeamMember = {
  name: string;
  role: string;
  photo: string;
  /** Company address only — personal addresses on the current site are left out. */
  email?: string;
};

export const team: TeamMember[] = [
  {
    name: "Moulay Ahmed Alami",
    role: "Producer",
    photo: "/assets/team/moulay-ahmed-alami.jpg",
    email: "ma.alami@seven-pm.com",
  },
  {
    name: "Nabyl Decima",
    role: "Head of Production",
    photo: "/assets/team/nabyl-decima.jpg",
    email: "nabyl@seven-pm.com",
  },
  {
    name: "Cyril Foucault",
    role: "Artistic Director",
    photo: "/assets/team/cyril-foucault.jpg",
    email: "cyril@seven-pm.com",
  },
  {
    name: "Oumaima Slimani Alaoui",
    role: "Artistic Production Officer",
    photo: "/assets/team/oumaima-slimani-alaoui.jpg",
    email: "oumaima@seven-pm.com",
  },
  {
    name: "Nizar Elkourtbi",
    role: "Sales Director",
    photo: "/assets/team/nizar-elkourtbi.jpg",
    email: "nizar@seven-pm.com",
  },
  {
    name: "Yasmine Faqyr",
    role: "Partner Communications Manager",
    photo: "/assets/team/yasmine-faqyr.jpg",
    email: "yasmine@seven-pm.com",
  },
  {
    name: "Géraldine Junca-Verdou",
    role: "Head of Support",
    photo: "/assets/team/geraldine-junca-verdou.jpg",
    email: "geraldine@seven-pm.com",
  },
  {
    name: "Youssef Wahbi",
    role: "Graphic & Web Designer",
    photo: "/assets/team/youssef-wahbi.jpg",
    email: "youssef@seven-pm.com",
  },
  {
    name: "Intissar Nashnash",
    role: "PR Manager",
    photo: "/assets/team/intissar-nashnash.jpg",
  },
  {
    name: "Aziz Alami",
    role: "Social Media Manager",
    photo: "/assets/team/aziz-alami.jpg",
  },
  {
    name: "Zineb Zaghar",
    role: "Administrative Manager",
    photo: "/assets/team/zineb-zaghar.jpg",
    email: "zineb@seven-pm.com",
  },
  {
    name: "Hajar Jaafar",
    role: "HR & Admin Assistant",
    photo: "/assets/team/hajar-jaafar.jpg",
    email: "hajar@seven-pm.com",
  },
];
