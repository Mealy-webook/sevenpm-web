/**
 * Booking journey, from Figma 2138:3339 (tickets), 2078:45259 (ticket info),
 * 2024:4434 (ticket selected), 2078:45505 / 2212:13243 (extras),
 * 2196:11760 (item details), 2213:14113 (order summary) and
 * 2033:18293 (checkout).
 *
 * Every string and price the journey renders comes from here so the flow
 * components stay presentational. Nothing here talks to a payment provider:
 * see `CheckoutStep` for what confirming actually does.
 */

export type LineupSlot = {
  name: string;
  /** "8:00 - 9:00", as the comp writes it. */
  time: string;
  image: string;
};

export type BookingTicket = {
  id: string;
  name: string;
  price: number;
  /** Struck-through price in the info dialog. */
  wasPrice?: number;
  discount?: string;
  lineup: LineupSlot[];
};

export type TicketGroup = {
  id: string;
  /** "General admission" — also the chip label. */
  label: string;
  tickets: BookingTicket[];
};

export type AddonCategory = "merchandise" | "parking";

export type BookingAddon = {
  id: string;
  category: AddonCategory;
  name: string;
  price: number;
  wasPrice?: number;
  discount?: string;
  /** Merchandise only: the product shot. */
  image?: string;
  /** Merchandise only. The first size is the default when added from the grid. */
  sizes?: string[];
  /** 16px mark used in the order summary rows. */
  icon: string;
};

/** The event's line-up rows are placeholders in the comp — kept as such. */
const lineup: LineupSlot[] = Array.from({ length: 6 }, (_, index) => ({
  name: "Artist name",
  time: "8:00 - 9:00",
  image: `/assets/artist-${index + 1}.png`,
}));

export const ticketGroups: TicketGroup[] = [
  {
    id: "general",
    label: "General admission",
    tickets: [
      {
        id: "fri-19",
        name: "Single day: Fri 19 Sept",
        price: 50,
        wasPrice: 252,
        discount: "20% off",
        lineup,
      },
      {
        id: "sat-20",
        name: "Single day: Sat 20 Sept",
        price: 50,
        wasPrice: 252,
        discount: "20% off",
        lineup,
      },
      {
        id: "mon-20",
        name: "Single day: Mon 20 Sept",
        price: 50,
        wasPrice: 252,
        discount: "20% off",
        lineup,
      },
    ],
  },
  {
    id: "vip",
    label: "VIP boxes",
    tickets: [
      {
        id: "vip-box-1",
        name: "VIP Box 1",
        price: 50,
        wasPrice: 252,
        discount: "20% off",
        lineup,
      },
    ],
  },
];

const SHIRT = "Casablanca L'Arche T-shirt in Organic Cotton";
const SIZES = ["XS", "S", "M", "L", "XL"];

export const addons: BookingAddon[] = [
  {
    id: "tee-casa-way",
    category: "merchandise",
    name: SHIRT,
    price: 50,
    wasPrice: 252,
    discount: "20% off",
    image: "/assets/merch-casa-way.jpg",
    sizes: SIZES,
    icon: "/assets/ic-tshirt-16.svg",
  },
  {
    id: "tee-arche",
    category: "merchandise",
    name: SHIRT,
    price: 50,
    wasPrice: 252,
    discount: "20% off",
    image: "/assets/merch-arche.jpg",
    sizes: SIZES,
    icon: "/assets/ic-tshirt-16.svg",
  },
  {
    id: "tee-casablanca",
    category: "merchandise",
    name: SHIRT,
    price: 50,
    wasPrice: 252,
    discount: "20% off",
    image: "/assets/merch-casablanca.jpg",
    sizes: SIZES,
    icon: "/assets/ic-tshirt-16.svg",
  },
  {
    id: "ga-parking",
    category: "parking",
    name: "GA Parking",
    price: 10,
    icon: "/assets/ic-parking-16.svg",
  },
  {
    id: "vip-parking",
    category: "parking",
    name: "VIP Parking",
    price: 50,
    icon: "/assets/ic-parking-16.svg",
  },
];

export const bookingConfig = {
  currency: "MAD",
  /** The comp's "9:59 to book" — the hold on the seats, in seconds. */
  holdSeconds: 599,
  /** Nobody may buy more than this of one line in one booking. */
  maxPerLine: 10,
  /** Credit on the visitor's SEVENPM wallet, applied before anything else. */
  walletCredit: 10,
  /**
   * VAT is included in the total rather than added to it, which is how the
   * comp reads it ("Total Incl. VAT" with "VAT 27.75 MAD" beneath).
   */
  vatRate: 0.15,
  poster: "/assets/poster-jazzablanca.jpg",
  /**
   * The running time under the event's name. It lives here rather than on the
   * event because `EventDetails` has no such field yet — move it there the day
   * a second event needs its own.
   */
  sessionTime: "07:00 PM - 12:00 AM",
};

export const bookingCopy = {
  steps: [
    { id: "tickets", label: "Tickets" },
    { id: "extras", label: "Extras" },
    { id: "checkout", label: "Checkout" },
  ],
  chrome: {
    back: "Back",
    locale: "Language and currency",
    timer: (clock: string) => `${clock} to book`,
    expired: "Your hold has expired",
    expiredBody:
      "We only hold tickets for ten minutes. Start again and they are yours for another ten.",
    restart: "Start again",
  },
  tickets: {
    all: "All",
    perPerson: "/ Person",
    add: "Add",
    info: (name: string) => `What's in ${name}`,
    remove: "Remove",
    more: "One more",
    fewer: "One fewer",
  },
  ticketInfo: {
    lineup: "lineup",
    close: "Close",
    addToCart: "Add to cart",
    perPerson: "/ Person",
  },
  extras: {
    title: "Upgrade your experience",
    categories: [
      { id: "merchandise", label: "Merchandise" },
      { id: "parking", label: "Parking" },
    ],
    details: "Item details",
    size: "Size",
    addToCart: "Add to cart",
    close: "Close",
    openDetails: (name: string) => `${name} — sizes and details`,
  },
  summaryBar: {
    tickets: (count: number) => `${count} ${count === 1 ? "Ticket" : "Tickets"}`,
    addons: (count: number) =>
      `${count} ${count === 1 ? "add-on" : "add-ons"}`,
    empty: "No tickets yet",
    total: "Total",
    open: "Open the order summary",
    nextExtras: "Next: Extras",
    nextCheckout: "Next: Checkout",
    pay: "Confirm & pay",
  },
  orderSummary: {
    title: "Order summary",
    close: "Close",
    tickets: (count: number) => `Tickets (${count})`,
    addons: (count: number) => `Add-ons (${count})`,
    size: (size: string) => `Size: ${size}`,
    subtotal: "Subtotal",
    wallet: "Wallet credit",
    total: "Total Incl. VAT",
    vat: (amount: string) => `VAT ${amount}`,
  },
  checkout: {
    title: "Checkout",
    delivery: "Delivery",
    deliveryMethod: "Delivery method",
    deliveryHint: "Choose how you would like to get your merchandise items",
    deliveryOptions: [
      {
        id: "pickup",
        label: "Collect at the festival",
        hint: "The merchandise stand by the main gate, from 4 PM on the day.",
      },
      {
        id: "courier",
        label: "Courier to my address",
        hint: "2 to 4 working days in Morocco. Adds 30 MAD.",
        fee: 30,
      },
    ],
    deliveryNone: "Nothing to deliver — you have no merchandise in this order.",
    add: "Add",
    change: "Change",
    payWith: "Pay with",
    wallet: "Use webook credit",
    payMethods: [
      { id: "installment", label: "Pay in installment", icon: "/assets/ic-installment-24.svg" },
      { id: "apple-pay", label: "Apple Pay", icon: "/assets/ic-applepay-24.svg" },
      { id: "card", label: "Card", icon: "/assets/ic-card-24.svg" },
    ],
    cardMarks: [
      "/assets/pay-cmi.svg",
      "/assets/pay-amex.svg",
      "/assets/pay-visa.svg",
      "/assets/pay-mastercard.svg",
    ],
    cardNote:
      "Card details are taken on the payment provider's own page, so SEVENPM never sees the number.",
    discount: "Discount",
    promo: "Promo code",
    promoPlaceholder: "Enter your code",
    promoApply: "Apply",
    promoUnknown: "We don't know that code",
    priceDetails: "Price details",
    agreement:
      "I agree that reselling a ticket on any platform is illegal and will result in account ban, ticket cancellation, and no eligibility for ticket or value refund.",
    agreementError: "We need this before you can pay",
    terms: "By purchasing you'll agree to our",
    termsLink: "Terms and Conditions",
    privacyLead: "Our",
    privacyLink: "Privacy Policy",
    privacyTail: "will apply.",
  },
  done: {
    title: "You're in",
    reference: "Booking reference",
    body: "Your tickets are held against this reference. In a live shop the payment provider would take over here and the confirmation e-mail would go out.",
    note: "This build has no payment provider connected, so nothing was charged and nothing was sent.",
    bookings: "See it in my bookings",
    event: "Back to the event",
  },
};

/** "1,200 MAD" — grouped, with the currency after it, as the stubs do. */
export function formatMoney(amount: number, currency = bookingConfig.currency) {
  const rounded = Math.round(amount * 100) / 100;
  return `${rounded.toLocaleString("en-US", {
    maximumFractionDigits: 2,
  })} ${currency}`;
}

export function getTicket(id: string) {
  for (const group of ticketGroups) {
    const found = group.tickets.find((ticket) => ticket.id === id);
    if (found) return found;
  }
  return undefined;
}

export function getAddon(id: string) {
  return addons.find((addon) => addon.id === id);
}
