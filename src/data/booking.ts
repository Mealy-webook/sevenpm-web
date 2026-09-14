/**
 * Booking flow. No Figma comp — composed from the parts the comps set:
 * cards with an 18px title, list rows, chips and the account's "at a glance"
 * card as the order summary.
 *
 * Nothing here talks to a payment provider. The flow is UI only: see
 * `BookingFlow` for what happens when the visitor confirms.
 */

export const bookingFees = {
  /** Per ticket, in the event's currency. */
  perTicket: 15,
  label: "Booking fee",
  /** Nobody may buy more than this of one tier in one booking. */
  maxPerTier: 6,
};

export const bookingCopy = {
  title: "Book",
  backToEvent: "Back to the event",
  steps: [
    { id: "tickets", label: "Tickets" },
    { id: "details", label: "Your details" },
    { id: "payment", label: "Payment" },
  ],
  tickets: {
    title: "Choose your tickets",
    description:
      "Each ticket admits one person. Wristbands are issued at the gate on the booking reference.",
    perPerson: "/ Person",
    empty: "Add at least one ticket to continue.",
    max: "Six per tier, per booking.",
  },
  details: {
    title: "Your details",
    description:
      "The booking reference goes to this address. Bring it, or your account, to the gate.",
    firstName: "First name",
    lastName: "Last name",
    email: "Email",
    phone: "Phone",
    marketing: "Tell me about line-up announcements and presales",
  },
  payment: {
    title: "Payment",
    description: "Choose how to pay. Nothing is charged on this screen.",
    walletLabel: "SEVENPM wallet",
    walletCovers: (amount: string) => `Covers ${amount} of this booking`,
    walletShort: "Not enough for this booking on its own",
    newCard:
      "New cards are added on the payment provider's own page, so SEVENPM never sees the number.",
    terms:
      "I accept the ticket terms and understand that tickets are non-refundable.",
    termsError: "We need this before you can book",
  },
  summary: {
    title: "Your booking",
    subtotal: "Subtotal",
    fees: "Booking fee",
    wallet: "Wallet",
    total: "Total",
    ticket: "ticket",
    tickets: "tickets",
  },
  actions: {
    continue: "Continue",
    back: "Back",
    pay: "Confirm booking",
  },
  done: {
    title: "You're in",
    reference: "Booking reference",
    body: "We've held your tickets. In a live shop this is where the payment provider would take over and the confirmation e-mail would go out.",
    note: "This build has no payment provider connected, so nothing was charged and nothing was sent.",
    bookings: "See it in my bookings",
    event: "Back to the event",
  },
};

/** "1 200 MAD" — grouped, with the currency after it, as the stubs do. */
export function formatMoney(amount: number, currency = "MAD") {
  return `${amount.toLocaleString("en-US")} ${currency}`;
}
