/**
 * Login and sign-up, from Figma 2033:24046 → 2078:43849.
 *
 * There is no auth service behind this build. The rules below are what the
 * dialog checks locally so every state in the comps is reachable: an address
 * already on file goes to sign in, anything else to sign up, and the one-time
 * code is fixed. Replace `isKnownEmail`, `checkPassword` and `DEMO_CODE` with
 * real calls and nothing in the components changes.
 */

import { accountUser } from "./account";

/** Addresses that already have an account in this prototype. */
const KNOWN = [accountUser.email.toLowerCase()];

export function isKnownEmail(email: string) {
  return KNOWN.includes(email.trim().toLowerCase());
}

/** The name shown on "Welcome back, …". */
export function nameForEmail(email: string) {
  return isKnownEmail(email) ? accountUser.name.split(" ")[0] : "";
}

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Domains offered once an "@" is typed — Figma 2033:28342. */
export const EMAIL_DOMAINS = ["@gmail.com", "@yahoo.com", "@hotmail.com"];

/** Near-misses worth catching before the visitor waits for a mail. */
const TYPOS: Record<string, string> = {
  "gail.com": "gmail.com",
  "gmial.com": "gmail.com",
  "gmai.com": "gmail.com",
  "gmail.co": "gmail.com",
  "hotmial.com": "hotmail.com",
  "yaho.com": "yahoo.com",
  "outlok.com": "outlook.com",
};

/** "Did you mean …?" — Figma 2033:28560. Null when the domain looks fine. */
export function suggestEmail(email: string) {
  const [local, domain] = email.trim().toLowerCase().split("@");
  if (!local || !domain) return null;
  const fixed = TYPOS[domain];
  return fixed ? `${local}@${fixed}` : null;
}

/** Minimum length the comps' checklist asks for. */
export const PASSWORD_RULES = [
  {
    id: "length",
    label: "At least 8 characters (and no more than 32)",
    test: (value: string) => value.length >= 8 && value.length <= 32,
  },
  {
    id: "letter",
    label: "Contains at least one letter",
    test: (value: string) => /[a-z]/i.test(value),
  },
  {
    id: "number",
    label: "Contains at least one number",
    test: (value: string) => /\d/.test(value),
  },
];

export function passwordStrength(value: string) {
  const met = PASSWORD_RULES.filter((rule) => rule.test(value)).length;
  const long = value.length >= 12;
  const symbol = /[^A-Za-z0-9]/.test(value);
  const score = met + (long ? 1 : 0) + (symbol ? 1 : 0);
  if (value.length === 0) return { score: 0, label: "" };
  if (score <= 2) return { score: 1, label: "Weak" };
  if (score === 3) return { score: 2, label: "Fair" };
  if (score === 4) return { score: 3, label: "Good" };
  return { score: 4, label: "Strong" };
}

/**
 * Signing in. Any password that satisfies the same rules the sign-up form
 * asks for is accepted — there is nothing to check it against — so the
 * comps' "that password isn't correct" state is what a short one gets.
 */
export function checkPassword(value: string) {
  return PASSWORD_RULES.every((rule) => rule.test(value));
}

/** The one-time code this build accepts. Shown in the dialog, not guessed. */
export const DEMO_CODE = "1234";

export const authCopy = {
  open: "Login / sign up",
  close: "Close",
  /** Step 1 — Figma 2033:24046. */
  welcome: {
    title: "Welcome",
    body: "Enter your email to log in. If it's your first time we will help you to register.",
    email: "Email",
    clear: "Clear the address",
    submit: "Continue with email",
    or: "OR",
    apple: "Continue with Apple",
    google: "Continue with Google",
    invalid:
      "Hold up, that doesn't look like a valid email. Double check it and try again",
    suggestion: (email: string) => `Did you mean ${email}?`,
  },
  /** Step 2a — Figma 2078:38479. */
  signUp: {
    title: "Sign up",
    email: "Email",
    firstName: "First name",
    lastName: "Last Name",
    phone: "Phone number",
    /**
     * The comps read +966. The site's default currency is the dirham and the
     * careers form already uses +212, so the Moroccan code is what ships;
     * change both together if the default market moves.
     */
    dialCode: "+212",
    flag: "/assets/flag-ma.png",
    password: "Password",
    show: "Show",
    hide: "Hide",
    strength: "Password strength",
    marketing: "I agree to receive news marketing emails",
    partners:
      "I agree to share my data with trusted third-party partners to receive exclusive promotions & offers",
    terms: "By continue you agree to",
    termsLink: "Terms & Conditions",
    submit: "Create account",
    errors: {
      firstName: "We need your first name",
      lastName: "We need your last name",
      password: "Your password doesn't meet the rules above yet",
    },
  },
  /** Step 2b — Figma 2078:31891. */
  signIn: {
    title: (name: string) => `Welcome back, ${name}`,
    password: "Password",
    show: "Show",
    hide: "Hide",
    forgot: "Forgot password",
    submit: "Sign in",
    error: "That password isn't correct. Check it and try again.",
  },
  /** Step 3 — Figma 2078:40773. */
  reset: {
    title: "Reset password",
    body: "An OTP will be sent to your email address to reset your password.",
    email: "Email",
    submit: "Send code",
  },
  /** Step 4 — Figma 2078:40923. */
  code: {
    title: "Check your email",
    body: (email: string) =>
      `A verification code has been sent to ${email}. Please enter it to proceed.`,
    resend: "Send code",
    resent: "Code sent",
    submit: "Verify",
    invalid: "Invalid code. Enter a valid code and try again.",
    digit: (index: number) => `Digit ${index + 1} of 4`,
    /** No mail leaves this build, so the code is on screen rather than hidden. */
    demo: `No e-mail is sent in this build. The code is ${DEMO_CODE}.`,
  },
  /** Step 5 — Figma 2078:43849. */
  update: {
    title: "Update password",
    password: "New password",
    confirm: "Confirm password",
    show: "Show",
    hide: "Hide",
    strength: "Password strength",
    submit: "Confirm",
    errors: {
      password: "Your password doesn't meet the rules above yet",
      confirm: "Those two don't match",
    },
  },
  /** Said once, at the bottom, rather than implied by a working button. */
  note: "No identity provider is connected to this build, so signing in only changes what this tab shows.",
};
