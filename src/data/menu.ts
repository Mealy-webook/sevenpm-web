/**
 * The site's navigation, in the order content gave it.
 *
 * Its own module rather than a const inside `SiteMenu` because the footer
 * repeats the same list, and `SiteMenu` is a client component carrying GSAP —
 * importing from it would have pulled all of that into the footer's graph for
 * the sake of an array of strings.
 */

export type MenuLink = { label: string; href: string };
export type MenuEntry = MenuLink & { children?: MenuLink[] };

/**
 * The menu, in the order content gave it.
 *
 * No "Home": the logo in the header is the way back, and an entry that
 * duplicates it only takes a line from the ones that do not. Festivals keeps
 * its two named festivals — Jazzablanca and Tanjazz — rather than all four:
 * the other two have no page of their own, and the full list is on
 * `/events`.
 *
 * The footer repeats this list, so anything added here appears there too.
 */
export const MENU_LINKS: MenuEntry[] = [
  { label: "Upcoming events", href: "/events" },
  {
    label: "Festivals",
    href: "/events",
    children: [
      { label: "Jazzablanca", href: "/events/jazzablanca" },
      { label: "Tanjazz", href: "/events" },
    ],
  },
  { label: "Concerts", href: "/concerts" },
  { label: "Become a sponsor", href: "/sponsor" },
  { label: "Hospitality", href: "/hospitality" },
  { label: "News", href: "/news" },
  { label: "Careers", href: "/careers" },
  { label: "Contact", href: "/contact" },
];

