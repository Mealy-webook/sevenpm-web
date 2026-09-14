/**
 * Account area content. Bookings from Figma 2173:25780 / 2173:25975, wallet
 * from 2196:12516. Mock session data until the account API lands —
 * everything the account screens render comes from here.
 */

export const accountUser = {
  name: "Ahmed Mealy",
  email: "ahmed@gmail.com",
  avatar: "/assets/nav-avatar.jpg",
  phone: "+212 6 61 23 45 67",
  birthday: "14 March 1994",
  city: "Casablanca, Morocco",
  language: "English",
  currency: "Moroccan Dirham (MAD)",
};

/* ------------------------------------------------------------------ *
 * Wallet (Figma 2196:12516)
 *
 * The balance is *derived* from the transactions, so the card, the sidebar
 * and the account dropdown can never disagree. Days are stored as an offset
 * rather than a date: the comp groups by "Today" / "Yesterday", and an
 * offset keeps those headings true however long this mock data lives.
 * ------------------------------------------------------------------ */

export type WalletTransaction = {
  id: string;
  /** `topup` adds to the balance, `payment` takes from it. */
  kind: "topup" | "payment";
  label: string;
  /** Time of day, already formatted — mock data has no real timestamps. */
  time: string;
  /** Revealed when the row is expanded. */
  detail: string;
  /** Positive for a top-up, negative for a payment. */
  amount: number;
  /** 0 = today, 1 = yesterday, … */
  dayOffset: number;
};

export const walletCurrency = "MAD";

export const walletTransactions: WalletTransaction[] = [
  {
    id: "tx-006",
    kind: "payment",
    label: "Withdraw money",
    time: "10:37 PM",
    detail: "Merch store — Anfa Park",
    amount: -60,
    dayOffset: 0,
  },
  {
    id: "tx-005",
    kind: "payment",
    label: "Withdraw money",
    time: "9:12 PM",
    detail: "Bar — Anfa Park · 3 drinks",
    amount: -90,
    dayOffset: 0,
  },
  {
    id: "tx-004",
    kind: "topup",
    label: "Add money",
    time: "6:40 PM",
    detail: "Visa ending 6411",
    amount: 200,
    dayOffset: 0,
  },
  {
    id: "tx-003",
    kind: "payment",
    label: "Withdraw money",
    time: "8:05 PM",
    detail: "Jazzablanca — weekend pass · 2 tickets",
    amount: -200,
    dayOffset: 1,
  },
  {
    id: "tx-002",
    kind: "topup",
    label: "Add money",
    time: "7:20 PM",
    detail: "Visa ending 6411",
    amount: 500,
    dayOffset: 1,
  },
  {
    id: "tx-001",
    kind: "topup",
    label: "Welcome credit",
    time: "9:00 AM",
    detail: "SEVENPM loyalty program",
    amount: 100,
    dayOffset: 9,
  },
];

export const walletBalance = walletTransactions.reduce(
  (total, tx) => total + tx.amount,
  0,
);

/** "+300 MAD" for money in, "210 MAD" for money out, as in the comp. */
export function formatAmount(amount: number, currency = walletCurrency) {
  const value = `${Math.abs(amount).toLocaleString("en-US")} ${currency}`;
  return amount > 0 ? `+${value}` : value;
}

export const walletCopy = {
  title: "Wallet",
  balanceLabel: "Available balance",
  topUpCta: "Top up",
  transactionsTitle: "Transactions",
  empty: "No transactions yet",
};

/* ------------------------------------------------------------------ *
 * Sidebar
 * ------------------------------------------------------------------ */

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
    href: "/account/profile",
  },
  {
    id: "payments",
    label: "Payment details",
    icon: "/assets/ic-acct-payments.svg",
    href: "/account/profile#payment-details",
  },
];

/* ------------------------------------------------------------------ *
 * Bookings
 * ------------------------------------------------------------------ */

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

/* ------------------------------------------------------------------ *
 * Profile — no comp; composed from the same cards and rows as the wallet.
 * ------------------------------------------------------------------ */

export type ProfileField = {
  id: string;
  label: string;
  value: string;
  /** Label of the inline action; omit for a read-only row. */
  action?: string;
};

export type ProfileToggle = {
  id: string;
  label: string;
  detail: string;
  on: boolean;
};

export type PaymentCard = {
  id: string;
  brand: string;
  last4: string;
  expiry: string;
  primary?: boolean;
};

export const profileCopy = {
  title: "Profile",
  personal: {
    title: "Personal details",
    photoAction: "Change photo",
  },
  preferences: {
    title: "Preferences",
  },
  payment: {
    title: "Payment details",
    addCard: "Add a card",
    primaryBadge: "Primary",
  },
  security: {
    title: "Security",
  },
};

export const profileFields: ProfileField[] = [
  { id: "name", label: "Full name", value: accountUser.name, action: "Edit" },
  { id: "email", label: "Email", value: accountUser.email, action: "Edit" },
  { id: "phone", label: "Phone", value: accountUser.phone, action: "Edit" },
  { id: "birthday", label: "Date of birth", value: accountUser.birthday },
  { id: "city", label: "City", value: accountUser.city, action: "Edit" },
];

export const profilePreferences: ProfileField[] = [
  {
    id: "language",
    label: "Language",
    value: accountUser.language,
    action: "Change",
  },
  {
    id: "currency",
    label: "Currency",
    value: accountUser.currency,
    action: "Change",
  },
];

export const profileToggles: ProfileToggle[] = [
  {
    id: "newsletter",
    label: "Newsletter",
    detail: "Line-up announcements and presale codes",
    on: true,
  },
  {
    id: "reminders",
    label: "Ticket reminders",
    detail: "A nudge the day before each festival",
    on: true,
  },
  {
    id: "sms",
    label: "SMS alerts",
    detail: "Gate changes and weather warnings only",
    on: false,
  },
];

export const paymentCards: PaymentCard[] = [
  {
    id: "visa-6411",
    brand: "Visa",
    last4: "6411",
    expiry: "09/28",
    primary: true,
  },
  { id: "mc-2044", brand: "Mastercard", last4: "2044", expiry: "03/27" },
];

export const securityFields: ProfileField[] = [
  {
    id: "password",
    label: "Password",
    value: "Last changed 4 months ago",
    action: "Change",
  },
  {
    id: "2fa",
    label: "Two-factor authentication",
    value: "Off — protect your tickets with a code",
    action: "Turn on",
  },
];
