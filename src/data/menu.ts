/**
 * The site's navigation.
 *
 * Two lists, because the comps carry two: the drawer runs five entries with
 * Festivals opening onto its two festivals; the footer runs its own flat
 * row of five.
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
 * The footer, as the homepage comp's footer draws it (15:202 → 2467:23440):
 * one flat row — Festivals, News, Careers, Contact, Become a sponsor. It is
 * not the drawer's list: it drops Team and names the sponsor page, which
 * the drawer carries as a panel rather than an entry.
 */
export const FOOTER_LINKS: MenuLink[] = [
  { label: "Festivals", href: "/events" },
  { label: "News", href: "/news" },
  { label: "Careers", href: "/careers" },
  { label: "Contact", href: "/contact" },
  { label: "Become a sponsor", href: "/sponsor" },
];
