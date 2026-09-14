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

/** Logout confirmation, from Figma 2231:12668. */
export const logoutCopy = {
  label: "Logout",
  title: "Logout",
  body: "Are you sure you want to logout?",
  cancel: "Cancel",
  confirm: "Logout",
};

export const walletCopy = {
  title: "Wallet",
  balanceLabel: "Available balance",
  topUpCta: "Top up",
  transactionsTitle: "Transactions",
  empty: "No transactions yet",
  /** Top up, from Figma 2196:10582, 2196:11179 and 2196:12115. */
  topUp: {
    title: "Top up",
    balance: (amount: string) => `Current balance: ${amount}`,
    close: "Close",
    amount: "Enter amount",
    clear: "Clear the amount",
    /** Nothing below this reaches the provider, so the button stays off. */
    minimum: 10,
    minimumHint: (amount: string) => `Min amount is ${amount}`,
    quick: [50, 100, 200],
    quickLabel: (amount: string) => `+ ${amount}`,
    payWith: "Pay with",
    methods: [
      {
        id: "apple-pay",
        label: "Apple Pay",
        icon: "/assets/ic-applepay-24.svg",
      },
      { id: "card", label: "Card", icon: "/assets/ic-card-24.svg" },
    ],
    cardMarks: [
      "/assets/pay-cmi.svg",
      "/assets/pay-amex.svg",
      "/assets/pay-visa.svg",
      "/assets/pay-mastercard.svg",
    ],
    addCard: "Add new card",
    cardTitle: "Add payment method",
    cardSubmit: "Add card",
    submit: "Top up",
    doneTitle: "Wallet topped up",
    doneBody: (amount: string) =>
      `${amount} is showing on your balance. No payment provider is connected to this build, so nothing was actually charged.`,
    done: "Done",
  },
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
    href: "/account/loyalty",
  },
  {
    id: "profile",
    label: "Profile",
    icon: "/assets/ic-acct-profile.svg",
    href: "/account/profile",
  },
  {
    id: "payments",
    label: "Payments",
    icon: "/assets/ic-acct-payments.svg",
    href: "/account/payments",
  },
];

/* ------------------------------------------------------------------ *
 * Loyalty
 * ------------------------------------------------------------------ */

export type LoyaltyTier = {
  id: string;
  name: string;
  /** Beats needed to reach it. */
  threshold: number;
  perks: string[];
};

export type LoyaltyReward = {
  id: string;
  name: string;
  description: string;
  cost: number;
  icon: string;
};

export type LoyaltyEntry = {
  id: string;
  label: string;
  detail: string;
  /** Positive earns, negative redeems. */
  beats: number;
  dayOffset: number;
};

/**
 * The loyalty programme. No Figma comp — built from the account system's own
 * parts: the wallet's balance card, the payments page's rows and the event
 * page's chips.
 *
 * Points are "Beats": one per dirham spent, which keeps the maths legible on
 * screen and means every price on the site doubles as its own earn rate.
 */
export const loyaltyTiers: LoyaltyTier[] = [
  {
    id: "crowd",
    name: "Crowd",
    threshold: 0,
    perks: ["Presale access 24 hours early", "Birthday drink at any bar"],
  },
  {
    id: "front-row",
    name: "Front row",
    threshold: 1000,
    perks: [
      "Presale access 48 hours early",
      "10% off merchandise",
      "Dedicated gate at every festival",
    ],
  },
  {
    id: "backstage",
    name: "Backstage",
    threshold: 5000,
    perks: [
      "Presale access 72 hours early",
      "20% off merchandise",
      "One guest upgrade a year",
      "Free parking",
    ],
  },
  {
    id: "headliner",
    name: "Headliner",
    threshold: 12000,
    perks: [
      "First refusal on every announcement",
      "25% off merchandise",
      "Two guest upgrades a year",
      "Soundcheck invitations",
    ],
  },
];

/** Where Beats come from. */
export const loyaltyEarn = [
  {
    id: "tickets",
    label: "Book a ticket",
    detail: "1 Beat for every dirham, credited when the gate scans it",
    icon: "/assets/ic-ticket.svg",
  },
  {
    id: "wallet",
    label: "Top up your wallet",
    detail: "2 Beats for every dirham you load before the festival",
    icon: "/assets/ic-wallet.svg",
  },
  {
    id: "merch",
    label: "Buy merchandise",
    detail: "1 Beat for every dirham, in the shop or at the stand",
    icon: "/assets/ic-tshirt-16.svg",
  },
  {
    id: "refer",
    label: "Bring someone new",
    detail: "500 Beats each when their first booking is scanned",
    icon: "/assets/ic-user.svg",
  },
];

export const loyaltyRewards: LoyaltyReward[] = [
  {
    id: "drink",
    name: "Drink on us",
    description: "Any single drink at any SEVENPM bar",
    cost: 400,
    icon: "/assets/ic-food.svg",
  },
  {
    id: "parking",
    name: "VIP parking",
    description: "One festival day, the gate closest to the stage",
    cost: 900,
    icon: "/assets/ic-parking-16.svg",
  },
  {
    id: "tee",
    name: "Festival T-shirt",
    description: "Any shirt in the merchandise line-up, your size",
    cost: 1800,
    icon: "/assets/ic-tshirt-16.svg",
  },
  {
    id: "upgrade",
    name: "VIP box upgrade",
    description: "Move one booking into a VIP box, subject to space",
    cost: 4500,
    icon: "/assets/ic-star-16.svg",
  },
];

/** Recent movement, newest first. */
export const loyaltyActivity: LoyaltyEntry[] = [
  {
    id: "l1",
    label: "Jazzablanca — 2 tickets",
    detail: "Scanned at the main gate",
    beats: 100,
    dayOffset: 0,
  },
  {
    id: "l2",
    label: "Wallet top up",
    detail: "150 MAD loaded before the festival",
    beats: 300,
    dayOffset: 1,
  },
  {
    id: "l3",
    label: "Drink on us",
    detail: "Redeemed at the Anfa Park bar",
    beats: -400,
    dayOffset: 3,
  },
  {
    id: "l4",
    label: "Casablanca L'Arche T-shirt",
    detail: "Merchandise stand, main gate",
    beats: 50,
    dayOffset: 6,
  },
];

/** What the visitor has banked. */
export const loyaltyBalance = 2450;

export const loyaltyCopy = {
  title: "Loyalty program",
  unit: "Beats",
  balanceLabel: "Your Beats",
  memberSince: "Member since 2024",
  tierLabel: (name: string) => `${name} member`,
  toNext: (beats: number, tier: string) =>
    `${beats.toLocaleString("en-US")} Beats to ${tier}`,
  topTier: "You are at the top tier. Nothing left to climb.",
  tiersTitle: "Tiers",
  currentTier: "Where you are",
  earnTitle: "Ways to earn",
  rewardsTitle: "Spend your Beats",
  redeem: "Redeem",
  redeemed: "Redeemed",
  short: (beats: number) => `${beats.toLocaleString("en-US")} Beats short`,
  confirmTitle: "Redeem",
  confirmBody: (name: string, cost: number) =>
    `Spend ${cost.toLocaleString("en-US")} Beats on ${name}?`,
  cancel: "Cancel",
  activityTitle: "Beats activity",
  note: "Beats and rewards here are a prototype. Nothing is issued and no balance leaves this page.",
};

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
 * Profile (Figma 2173:26214)
 *
 * Three cards of rows. A field with no `value` renders as "Not provided"
 * and offers "Add" rather than "Edit" — that is how the comp shows the
 * fields the visitor has never filled in.
 * ------------------------------------------------------------------ */

export type ProfileField = {
  id: string;
  label: string;
  value?: string;
  /** Label of the inline action; omit for a read-only row. */
  action?: string;
};

export type ProfileSection = {
  id: string;
  title: string;
  fields: ProfileField[];
};

export const profileCopy = {
  title: "Profile",
  description: "View & Update Your Personal and Contact Information",
  emptyValue: "Not provided",
  deleteCta: "Delete account",
};

export const profileSections: ProfileSection[] = [
  {
    id: "contact",
    title: "Contact information",
    fields: [
      { id: "email", label: "Email", value: accountUser.email },
      {
        id: "phone",
        label: "Mobile number",
        value: accountUser.phone,
        action: "Edit",
      },
    ],
  },
  {
    id: "personal",
    title: "Personal information",
    fields: [
      { id: "name", label: "Name", value: accountUser.name, action: "Edit" },
      { id: "birthday", label: "Date of birth", action: "Add" },
      { id: "gender", label: "Gender", action: "Add" },
      { id: "nationality", label: "Nationality", action: "Add" },
    ],
  },
  {
    id: "security",
    title: "Security",
    fields: [
      {
        id: "password",
        label: "Password",
        value: "Last updated: 19 Mar, 2025",
        action: "Update",
      },
    ],
  },
];

/* ------------------------------------------------------------------ *
 * Payments — no comp; composed from the account vocabulary.
 * ------------------------------------------------------------------ */

export type PaymentCard = {
  id: string;
  brand: string;
  last4: string;
  /** MM/YY. */
  expiry: string;
  primary?: boolean;
};

export type Receipt = {
  id: string;
  label: string;
  date: string;
  method: string;
  amount: string;
};

export const paymentsCopy = {
  title: "Payments",
  description:
    "The cards you pay with and every receipt SEVENPM has issued you.",
  cards: {
    title: "Saved cards",
    addCard: "Add a card",
    expires: "Expires",
    primaryBadge: "Primary",
    makePrimary: "Make primary",
    remove: "Remove",
    empty: "No cards saved yet",
  },
  billing: {
    title: "Billing details",
    emptyValue: "Not provided",
  },
  receipts: {
    title: "Receipts",
    download: "Download",
  },
};

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

export const billingDetails = [
  { label: "Billing name", value: accountUser.name, action: "Edit" },
  { label: "Billing address", value: "Casablanca, Morocco", action: "Edit" },
  { label: "Company / VAT number", action: "Add" },
];

export const receipts: Receipt[] = [
  {
    id: "rc-2026-0902",
    label: "Jazzablanca — weekend pass",
    date: "2 Sept 2026",
    method: "Visa •••• 6411",
    amount: "200 MAD",
  },
  {
    id: "rc-2026-0901",
    label: "Wallet top up",
    date: "1 Sept 2026",
    method: "Visa •••• 6411",
    amount: "500 MAD",
  },
  {
    id: "rc-2026-0820",
    label: "Casa Anfa Latina — day pass",
    date: "20 Aug 2026",
    method: "Mastercard •••• 2044",
    amount: "150 MAD",
  },
];
