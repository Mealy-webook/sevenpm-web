/**
 * The site's navigation.
 *
 * Two lists, because the comps carry two. The drawer (2231:12302) runs five
 * entries with Festivals opening onto its two festivals; the footer
 * (2542:15137) runs eight in one flat row. They are not a long and short
 * version of each other — the footer names the commercial pages the drawer
 * leaves out, and the drawer names Team, which the footer does not.
 *
 * Its own module rather than a const inside `SiteMenu`, because that is a
 * client component carrying GSAP and the footer would have pulled all of it
 * in for the sake of an array of strings.
 */

export type MenuLink = { label: string; href: string };
export type MenuEntry = MenuLink & { children?: MenuLink[] };

/**
 * The drawer, exactly as 2231:12302 lists it. Festivals is the only entry
 * with children, and it opens onto the two festivals that have somewhere to
 * go — the other two have no page yet and the full set is on `/events`.
 */
export const MENU_LINKS: MenuEntry[] = [
  {
    label: "Festivals",
    href: "/events",
    children: [
      { label: "Jazzablanca", href: "/events/jazzablanca" },
      { label: "Tanjazz", href: "/events" },
    ],
  },
  { label: "News", href: "/news" },
  { label: "Team", href: "/team" },
  { label: "Careers", href: "/careers" },
  { label: "Contact", href: "/contact" },
];

/**
 * The footer, exactly as 2542:15137 lists it — one flat row, no children.
 * It carries the pages that sell: upcoming events, concerts, sponsorship
 * and hospitality, none of which the drawer names.
 */
export const FOOTER_LINKS: MenuLink[] = [
  { label: "Upcoming events", href: "/events" },
  { label: "Festivals", href: "/events" },
  { label: "Concerts", href: "/concerts" },
  { label: "Become a sponsor", href: "/sponsor" },
  { label: "Hospitality", href: "/hospitality" },
  { label: "News", href: "/news" },
  { label: "Careers", href: "/careers" },
  { label: "Contact", href: "/contact" },
];
