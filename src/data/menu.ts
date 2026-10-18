/**
 * The site's navigation.
 *
 * The drawer (2231:12302) runs five entries with Festivals opening onto its
 * two festivals; the footer repeats the same five in one flat row.
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
 * The footer follows the drawer, by request: the same five entries in the
 * same order, flat — Festivals without its two children, since the row has
 * nowhere to open them. Derived rather than copied so the two cannot drift.
 * (It used to run 2542:15137's own eight-entry list.)
 */
export const FOOTER_LINKS: MenuLink[] = MENU_LINKS.map(({ label, href }) => ({
  label,
  href,
}));
