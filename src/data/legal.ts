/**
 * The legal pages the checkout points at.
 *
 * The booking journey asks people to agree to these before it takes money,
 * and until now the words "Terms and Conditions" and "Privacy Policy" were
 * plain text — an agreement to documents that did not exist.
 *
 * This is a prototype, so the wording below describes how the prototype
 * actually behaves rather than pretending to be counsel's draft: nothing is
 * charged, nothing is sent, and no personal data leaves the browser. Replace
 * each `body` with the real document when there is one; nothing else has to
 * change.
 */

export const legalCopy = { updated: "Last updated" };

export type LegalDoc = {
  title: string;
  /** Shown under the title. */
  standfirst: string;
  updated: string;
  sections: { heading: string; body: string[] }[];
};

const PROTOTYPE =
  "SEVENPM's website is a working prototype. No payment provider is connected, no money changes hands, and nothing you enter here is transmitted to or stored by SEVENPM.";

export const legal: Record<"terms" | "privacy", LegalDoc> = {
  terms: {
    title: "Terms and Conditions",
    standfirst:
      "The terms on which tickets are offered, and what happens to a ticket once it is bought.",
    updated: "28 September 2026",
    sections: [
      { heading: "This prototype", body: [PROTOTYPE] },
      {
        heading: "Tickets",
        body: [
          "A ticket admits one person to the session named on it. Prices are shown in Moroccan dirham, inclusive of any tax that applies.",
          "Where a booking is paid in instalments, the tickets are issued once the final instalment clears. Until then the booking is held but not fulfilled.",
        ],
      },
      {
        heading: "Resale",
        body: [
          "Tickets may not be resold on any platform. A ticket offered for resale is cancelled, the account that bought it is closed, and no refund of the ticket price or its value is due.",
        ],
      },
      {
        heading: "Changes and cancellation",
        body: [
          "If a session is cancelled or rescheduled by the organiser, the ticket price is refunded in full.",
          "Ticket protection, where it has been added to a booking, covers the ticket price if you are unable to attend. It is optional and is never added to a booking unless you choose it.",
        ],
      },
      {
        heading: "VIP boxes",
        body: [
          "A box is arranged rather than bought. An enquiry is reviewed and priced before any payment is asked for, and you are free to decline the quote.",
        ],
      },
    ],
  },
  privacy: {
    title: "Privacy Policy",
    standfirst: "What this site keeps, and what it does not.",
    updated: "28 September 2026",
    sections: [
      { heading: "This prototype", body: [PROTOTYPE] },
      {
        heading: "What the site stores",
        body: [
          "Your bookings, wallet balance, rewards and box requests live in the browser tab for as long as it is open. Reloading the page puts the demo data back. None of it is sent anywhere.",
          "The site sets no analytics or advertising cookies.",
        ],
      },
      {
        heading: "What you type",
        body: [
          "Card numbers, addresses and contact details entered in the booking journey are held in memory to draw the screens that follow and are discarded when the tab closes. They are never transmitted.",
        ],
      },
      {
        heading: "When this becomes real",
        body: [
          "Once a payment provider and an account service are connected, this page will say who processes what, where it is held, how long it is kept, and how to have it erased.",
        ],
      },
    ],
  },
};
