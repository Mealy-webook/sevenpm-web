/**
 * Account area content, from Figma 2173:25780 (bookings, empty) and
 * 2173:25975 (bookings, one upcoming). Mock session data until the account
 * API lands — everything the components render comes from here.
 */

export const accountUser = {
  name: "Ahmed Mealy",
  email: "ahmed@gmail.com",
  avatar: "/assets/nav-avatar.jpg",
};

/* ------------------------------------------------------------------ *
 * Wallet
 *
 * No Figma comp for this screen; the data shape is what the panel needs.
 * The balance is *derived* from the transactions so the two can never
 * disagree — when the API lands, replace the list and the balance follows.
 * ------------------------------------------------------------------ */

export type WalletTransaction = {
  id: string;
  /** `topup` adds to the balance, `payment` takes from it. */
  kind: "topup" | "payment";
  label: string;
  /** Secondary line: what it was for. */
  context: string;
  /** Positive for a top-up, negative for a payment. */
  amount: number;
  /** ISO date. */
  date: string;
};

export type WalletFilter = {
  label: string;
  kind?: WalletTransaction["kind"];
};

export const walletCurrency = "MAD";

export const walletTransactions: WalletTransaction[] = [
  {
    id: "tx-004",
    kind: "payment",
    label: "Bar — Anfa Park",
    context: "Jazzablanca · 3 drinks",
    amount: -90,
    date: "2026-09-12T21:40:00+01:00",
  },
  {
    id: "tx-003",
    kind: "payment",
    label: "Weekend pass",
    context: "Jazzablanca · 2 tickets",
    amount: -200,
    date: "2026-09-02T10:12:00+01:00",
  },
  {
    id: "tx-002",
    kind: "topup",
    label: "Top up",
    context: "Visa ending 6411",
    amount: 400,
    date: "2026-09-01T18:05:00+01:00",
  },
  {
    id: "tx-001",
    kind: "topup",
    label: "Welcome credit",
    context: "SEVENPM loyalty program",
    amount: 100,
    date: "2026-08-28T09:00:00+01:00",
  },
];

export const walletBalance = walletTransactions.reduce(
  (total, tx) => total + tx.amount,
  0,
);

/** "+400 MAD" / "−90 MAD" — a real minus sign, not a hyphen. */
export function formatAmount(amount: number, currency = walletCurrency) {
  const sign = amount > 0 ? "+" : "\u2212";
  return `${sign}${Math.abs(amount).toLocaleString("en-US")} ${currency}`;
}

export const walletCopy = {
  title: "Wallet",
  description:
    "Your SEVENPM balance. Top it up once, then pay at the gate, at the bar and in the merch store without queueing for a card reader.",
  balanceLabel: "Available balance",
  topUpLabel: "Add credit",
  topUpAmounts: [100, 200, 500],
  topUpCta: "Top up",
  /** `kind` omitted means "everything". */
  filters: [
    { label: "All" },
    { label: "Top-ups", kind: "topup" },
    { label: "Payments", kind: "payment" },
  ] as WalletFilter[],
  empty: "No transactions yet",
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
    href: "/account/wallet",
    trailing: `${walletBalance} ${walletCurrency}`,
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
