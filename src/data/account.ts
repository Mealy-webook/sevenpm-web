/**
 * Account area content, from Figma 2173:25780 (bookings, empty) and
 * 2173:25975 (bookings, one upcoming). Mock session data until the account
 * API lands — everything the components render comes from here.
 */

export const accountUser = {
  name: "Ahmed Mealy",
  email: "ahmed@gmail.com",
  avatar: "/assets/nav-avatar.jpg",
  walletBalance: "210 MAD",
};

export type AccountNavItem = {
  id: string;
  label: string;
  icon: string;
  href: string;
  /** Right-hand text (the wallet balance). */
  trailing?: string;
};

export const accountNav: AccountNavItem[] = [
  {
    id: "bookings",
    label: "Bookings",
    icon: "/assets/ic-acct-bookings.svg",
    href: "/account",
  },
  {
    id: "wallet",
    label: "Wallet",
    icon: "/assets/ic-acct-wallet.svg",
    href: "/account#wallet",
    trailing: accountUser.walletBalance,
  },
  {
    id: "loyalty",
    label: "Loyalty program",
    icon: "/assets/ic-acct-loyalty.svg",
    href: "/account#loyalty",
  },
  {
    id: "profile",
    label: "Profile",
    icon: "/assets/ic-acct-profile.svg",
    href: "/account#profile",
  },
  {
    id: "payments",
    label: "Payments",
    icon: "/assets/ic-acct-payments.svg",
    href: "/account#payments",
  },
];

export type Booking = {
  id: string;
  eventName: string;
  eventSlug: string;
  image: string;
  /** ISO datetimes; the card formats them. */
  startsAt: string;
  endsAt: string;
  venue: string;
  venueUrl?: string;
  tickets: number;
};

export const bookings: Booking[] = [
  {
    id: "bk-2026-0918",
    eventName: "Jazzablanca",
    eventSlug: "jazzablanca",
    image: "/assets/festival-poster-3.png",
    startsAt: "2026-09-18T19:00:00+01:00",
    endsAt: "2026-09-18T21:30:00+01:00",
    venue: "Palais des Institutions Italiennes",
    venueUrl:
      "https://www.google.com/maps/search/?api=1&query=Palais+des+Institutions+Italiennes+Casablanca",
    tickets: 2,
  },
];

export const bookingsCopy = {
  title: "Bookings",
  description:
    "Your tickets live here. Wristbands are issued at the gate on presentation of your booking reference.",
  filters: ["Upcoming", "Past"] as const,
  empty: "No bookings yet",
};
