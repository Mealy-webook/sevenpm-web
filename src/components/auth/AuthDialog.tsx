"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";

import { signIn } from "./session";
import { Sheet, SheetField } from "@/components/ui/Sheet";
import {
  authCopy,
  DEMO_CODE,
  EMAIL_DOMAINS,
  EMAIL_PATTERN,
  PASSWORD_RULES,
  checkPassword,
  isKnownEmail,
  nameForEmail,
  passwordStrength,
  suggestEmail,
} from "@/data/auth";

/**
 * Login and sign-up, from Figma 2033:24046 (welcome), 2033:28342 (domain
 * suggestions), 2033:28560 (typo hint), 2033:28746 (invalid), 2078:38479
 * (sign up), 2078:31891 (sign in), 2078:40773 (reset), 2078:40923 (code) and
 * 2078:43849 (update password).
 *
 * One sheet, six steps. The address decides the second step: one already on
 * file goes to sign in, anything else to sign up.
 *
 * Nothing authenticates. `@/data/auth` holds every rule the dialog checks so
 * the day there is a service, only that file changes.
 */

type Step = "email" | "signup" | "signin" | "reset" | "code" | "update";

/** The brand CTA, which collapses to a square while it is working. */
function Cta({
  children,
  onClick,
  busy,
  disabled,
  type = "button",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  busy?: boolean;
  disabled?: boolean;
  type?: "button" | "submit";
}) {
  if (busy) {
    return (
      <div className="flex w-full justify-center">
        <span className="flex size-9 items-center justify-center bg-brand">
          <span
            role="status"
            aria-label="Working"
            className="size-4 animate-spin rounded-full border-2 border-[#18181b] border-t-transparent"
          />
        </span>
      </div>
    );
  }
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="flex w-full cursor-pointer items-center justify-center bg-brand px-5 py-4 font-[family-name:var(--font-display)] text-[17px] font-semibold leading-6 text-[#18181b] transition-colors hover:bg-[#fff35a] disabled:cursor-not-allowed disabled:bg-white/5 disabled:text-white/30"
    >
      {children}
    </button>
  );
}

/** A white provider button: Apple, Google. */
function Provider({
  icon,
  label,
  onClick,
}: {
  icon: string;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full cursor-pointer items-center justify-center gap-2 bg-white px-5 py-4 font-[family-name:var(--font-display)] text-[17px] font-semibold leading-6 text-[#18181b] transition-colors hover:bg-white/90"
    >
      <Image src={icon} alt="" width={20} height={20} className="size-5" />
      {label}
    </button>
  );
}

/** Password field with the comp's "Show" toggle in the trailing slot. */
function PasswordField({
  id,
  label,
  value,
  onChange,
  error,
  autoComplete,
  autoFocus,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  autoComplete?: string;
  autoFocus?: boolean;
}) {
  const [shown, setShown] = useState(false);
  return (
    <SheetField
      id={id}
      label={label}
      value={value}
      onChange={onChange}
      error={error}
      type={shown ? "text" : "password"}
      autoComplete={autoComplete}
      autoFocus={autoFocus}
      trailing={
        <button
          type="button"
          onClick={() => setShown((current) => !current)}
          className="shrink-0 cursor-pointer font-[family-name:var(--font-display)] text-[15px] font-semibold leading-[22px] tracking-[0.19px] text-content-primary transition-colors hover:text-brand"
        >
          {shown ? authCopy.signUp.hide : authCopy.signUp.show}
        </button>
      }
    />
  );
}

/** Strength meter and the three rules, from Figma 2078:38569. */
function PasswordMeter({ value }: { value: string }) {
  const { score, label } = passwordStrength(value);
  return (
    <div className="flex flex-col gap-2">
      <p className="m-0 font-[family-name:var(--font-display)] text-[13px] font-semibold leading-5 tracking-[0.16px] text-content-primary">
        {authCopy.signUp.strength}
      </p>
      <div className="flex items-center gap-2">
        <span className="flex flex-1 gap-2">
          {[1, 2, 3, 4].map((step) => (
            <span
              key={step}
              className={`h-[3px] flex-1 transition-colors ${
                score >= step ? "bg-brand" : "bg-white/15"
              }`}
            />
          ))}
        </span>
        {label && (
          <span className="font-[family-name:var(--font-display)] text-[12px] font-semibold leading-4 tracking-[0.12px] text-brand">
            {label}
          </span>
        )}
      </div>
      <ul className="m-0 flex list-none flex-col gap-1 p-0">
        {PASSWORD_RULES.map((rule) => {
          const met = rule.test(value);
          return (
            <li
              key={rule.id}
              className={`flex items-center gap-2 font-[family-name:var(--font-display)] text-[12px] leading-4 tracking-[0.12px] ${
                met ? "text-[#4ade80]" : "text-[#ff6c6c]"
              }`}
            >
              <svg viewBox="0 0 16 16" className="size-3 shrink-0" fill="none">
                {met ? (
                  <path
                    d="M2 8.5 6 12.5 14 3.5"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                ) : (
                  <path
                    d="M3 3 13 13M13 3 3 13"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                )}
              </svg>
              {rule.label}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/** Four-box one-time code, from Figma 2078:40923. */
function CodeInput({
  value,
  onChange,
  invalid,
  baseId,
}: {
  value: string;
  onChange: (value: string) => void;
  invalid: boolean;
  baseId: string;
}) {
  const boxes = useRef<(HTMLInputElement | null)[]>([]);

  const setDigit = (index: number, digit: string) => {
    const clean = digit.replace(/\D/g, "").slice(-1);
    const next = value.padEnd(4, " ").split("");
    next[index] = clean || " ";
    onChange(next.join("").trimEnd());
    if (clean && index < 3) boxes.current[index + 1]?.focus();
  };

  return (
    <div className="flex justify-center gap-2">
      {[0, 1, 2, 3].map((index) => (
        <input
          key={index}
          ref={(node) => {
            boxes.current[index] = node;
          }}
          id={`${baseId}-code-${index}`}
          value={value[index]?.trim() ?? ""}
          onChange={(event) => setDigit(index, event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Backspace" && !value[index] && index > 0) {
              boxes.current[index - 1]?.focus();
            }
          }}
          inputMode="numeric"
          maxLength={1}
          aria-label={authCopy.code.digit(index)}
          aria-invalid={invalid}
          className={`size-11 border bg-white/5 text-center font-[family-name:var(--font-display)] text-[17px] font-semibold leading-6 text-content-primary caret-brand outline-none transition-colors focus:border-content-primary ${
            invalid ? "border-[#ff6c6c]" : "border-white/10"
          }`}
        />
      ))}
    </div>
  );
}

export function AuthDialog({ onClose }: { onClose: () => void }) {
  const titleId = useId();
  const baseId = useId();

  const [step, setStep] = useState<Step>("email");
  const [busy, setBusy] = useState(false);

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [firstName, setFirstName] = useState("");
  const [nameError, setNameError] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirm, setConfirm] = useState("");
  const [confirmError, setConfirmError] = useState("");
  const [marketing, setMarketing] = useState(false);
  const [partners, setPartners] = useState(false);
  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState("");
  const [resent, setResent] = useState(false);

  // Everything here is local, so the wait is simulated rather than real. It
  // exists because the comps have a loading state and a flow with no pause at
  // all reads as broken.
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  const after = (run: () => void) => {
    setBusy(true);
    timer.current = window.setTimeout(() => {
      setBusy(false);
      run();
    }, 700);
  };

  const finish = () => {
    signIn();
    onClose();
  };

  const suggestion = suggestEmail(email);
  const showDomains = email.includes("@") && !email.split("@")[1];

  const submitEmail = () => {
    if (!EMAIL_PATTERN.test(email.trim())) {
      setEmailError(authCopy.welcome.invalid);
      return;
    }
    setEmailError("");
    after(() => setStep(isKnownEmail(email) ? "signin" : "signup"));
  };

  const submitSignUp = () => {
    if (!firstName.trim()) {
      setNameError(authCopy.signUp.errors.firstName);
      return;
    }
    if (!checkPassword(password)) {
      setPasswordError(authCopy.signUp.errors.password);
      return;
    }
    setNameError("");
    setPasswordError("");
    after(finish);
  };

  const submitSignIn = () => {
    if (!checkPassword(password)) {
      setPasswordError(authCopy.signIn.error);
      return;
    }
    setPasswordError("");
    after(finish);
  };

  const submitCode = () => {
    if (code.trim() !== DEMO_CODE) {
      setCodeError(authCopy.code.invalid);
      return;
    }
    setCodeError("");
    after(() => {
      setPassword("");
      setStep("update");
    });
  };

  const submitUpdate = () => {
    if (!checkPassword(password)) {
      setPasswordError(authCopy.update.errors.password);
      return;
    }
    if (confirm !== password) {
      setConfirmError(authCopy.update.errors.confirm);
      return;
    }
    setPasswordError("");
    setConfirmError("");
    after(finish);
  };

  const header: Record<Step, { title: string; body?: string }> = {
    email: { title: authCopy.welcome.title, body: authCopy.welcome.body },
    signup: { title: authCopy.signUp.title },
    signin: { title: authCopy.signIn.title(nameForEmail(email)), body: email },
    reset: { title: authCopy.reset.title, body: authCopy.reset.body },
    code: { title: authCopy.code.title, body: authCopy.code.body(email) },
    update: { title: authCopy.update.title },
  };

  return (
    <Sheet
      open
      onClose={onClose}
      title={header[step].title}
      subtitle={header[step].body}
      titleId={titleId}
      closeLabel={authCopy.close}
    >
      <div className="flex flex-col gap-4 px-5 pb-5 pt-4">
        {step === "email" && (
          <>
            <div className="flex flex-col gap-2">
              <SheetField
                id={`${baseId}-email`}
                label={authCopy.welcome.email}
                value={email}
                onChange={(next) => {
                  setEmail(next);
                  setEmailError("");
                }}
                type="email"
                autoComplete="email"
                autoFocus
                error={emailError || undefined}
                trailing={
                  email ? (
                    <button
                      type="button"
                      aria-label={authCopy.welcome.clear}
                      onClick={() => {
                        setEmail("");
                        setEmailError("");
                      }}
                      className="flex size-5 shrink-0 cursor-pointer items-center justify-center"
                    >
                      <Image
                        src="/assets/ic-clear-20.svg"
                        alt=""
                        width={20}
                        height={20}
                        className="size-5"
                      />
                    </button>
                  ) : undefined
                }
              />

              {showDomains && (
                <div className="flex flex-wrap gap-2">
                  {EMAIL_DOMAINS.map((domain) => (
                    <button
                      key={domain}
                      type="button"
                      onClick={() => setEmail(`${email.split("@")[0]}${domain}`)}
                      className="btn-secondary flex cursor-pointer items-center px-3 py-2 font-[family-name:var(--font-display)] text-[13px] leading-5 tracking-[0.13px] text-content-primary"
                    >
                      {domain}
                    </button>
                  ))}
                </div>
              )}

              {!emailError && suggestion && (
                <button
                  type="button"
                  onClick={() => setEmail(suggestion)}
                  className="cursor-pointer text-left font-[family-name:var(--font-display)] text-[12px] leading-4 tracking-[0.12px] text-brand"
                >
                  {authCopy.welcome.suggestion(suggestion)}
                </button>
              )}
            </div>

            <Cta busy={busy} onClick={submitEmail} disabled={Boolean(emailError)}>
              {authCopy.welcome.submit}
            </Cta>

            <div className="flex items-center gap-4">
              <span className="h-px flex-1 bg-white/10" />
              <span className="font-[family-name:var(--font-display)] text-[12px] leading-4 tracking-[0.12px] text-content-secondary">
                {authCopy.welcome.or}
              </span>
              <span className="h-px flex-1 bg-white/10" />
            </div>

            <div className="flex flex-col gap-2">
              <Provider
                icon="/assets/ic-apple-20.svg"
                label={authCopy.welcome.apple}
                onClick={() => after(finish)}
              />
              <Provider
                icon="/assets/ic-google-20.svg"
                label={authCopy.welcome.google}
                onClick={() => after(finish)}
              />
            </div>
          </>
        )}

        {step === "signup" && (
          <>
            <SheetField
              id={`${baseId}-signup-email`}
              label={authCopy.signUp.email}
              value={email}
              onChange={() => {}}
              disabled
            />

            <div className="flex items-start gap-2">
              <SheetField
                id={`${baseId}-first`}
                label={authCopy.signUp.firstName}
                value={firstName}
                onChange={(next) => {
                  setFirstName(next);
                  setNameError("");
                }}
                autoComplete="given-name"
                error={nameError || undefined}
                className="flex-1"
              />
              <SheetField
                id={`${baseId}-last`}
                label={authCopy.signUp.lastName}
                value={lastName}
                onChange={setLastName}
                autoComplete="family-name"
                className="flex-1"
              />
            </div>

            <SheetField
              id={`${baseId}-phone`}
              label={authCopy.signUp.phone}
              value={phone}
              onChange={(next) => setPhone(next.replace(/[^\d\s]/g, ""))}
              inputMode="numeric"
              autoComplete="tel"
              leading={
                <span className="btn-secondary flex shrink-0 items-center gap-1 px-3 py-2 font-[family-name:var(--font-display)] text-[15px] font-semibold leading-[22px] tracking-[0.19px] text-content-primary">
                  <Image
                    src={authCopy.signUp.flag}
                    alt=""
                    width={20}
                    height={14}
                    className="h-[14px] w-5 object-cover"
                  />
                  {authCopy.signUp.dialCode}
                </span>
              }
            />

            <PasswordField
              id={`${baseId}-password`}
              label={authCopy.signUp.password}
              value={password}
              onChange={(next) => {
                setPassword(next);
                setPasswordError("");
              }}
              autoComplete="new-password"
              error={passwordError || undefined}
            />

            {password.length > 0 && <PasswordMeter value={password} />}

            <Consent
              id={`${baseId}-marketing`}
              checked={marketing}
              onChange={setMarketing}
              label={authCopy.signUp.marketing}
            />
            <Consent
              id={`${baseId}-partners`}
              checked={partners}
              onChange={setPartners}
              label={authCopy.signUp.partners}
            />

            <p className="m-0 text-center font-[family-name:var(--font-display)] text-[12px] leading-4 tracking-[0.12px] text-content-secondary">
              {/* The legal pages don't exist yet, so this stays plain text. */}
              {authCopy.signUp.terms}{" "}
              <span className="text-content-primary underline">
                {authCopy.signUp.termsLink}
              </span>
            </p>

            <Cta busy={busy} onClick={submitSignUp}>
              {authCopy.signUp.submit}
            </Cta>
          </>
        )}

        {step === "signin" && (
          <>
            <PasswordField
              id={`${baseId}-signin-password`}
              label={authCopy.signIn.password}
              value={password}
              onChange={(next) => {
                setPassword(next);
                setPasswordError("");
              }}
              autoComplete="current-password"
              autoFocus
              error={passwordError || undefined}
            />

            <button
              type="button"
              onClick={() => {
                setPassword("");
                setPasswordError("");
                setStep("reset");
              }}
              className="cursor-pointer self-start font-[family-name:var(--font-display)] text-[15px] font-semibold leading-[22px] tracking-[0.19px] text-content-primary transition-colors hover:text-brand"
            >
              {authCopy.signIn.forgot}
            </button>

            <Cta busy={busy} onClick={submitSignIn}>
              {authCopy.signIn.submit}
            </Cta>
          </>
        )}

        {step === "reset" && (
          <>
            <SheetField
              id={`${baseId}-reset-email`}
              label={authCopy.reset.email}
              value={email}
              onChange={() => {}}
              disabled
            />
            <Cta busy={busy} onClick={() => after(() => setStep("code"))}>
              {authCopy.reset.submit}
            </Cta>
          </>
        )}

        {step === "code" && (
          <>
            <CodeInput
              baseId={baseId}
              value={code}
              invalid={Boolean(codeError)}
              onChange={(next) => {
                setCode(next);
                setCodeError("");
              }}
            />
            {codeError && (
              <p
                role="alert"
                className="m-0 text-center font-[family-name:var(--font-display)] text-[12px] leading-4 tracking-[0.12px] text-[#ff6c6c]"
              >
                {codeError}
              </p>
            )}
            <p className="m-0 text-center font-[family-name:var(--font-display)] text-[12px] leading-4 tracking-[0.12px] text-content-secondary">
              {authCopy.code.demo}
            </p>
            <button
              type="button"
              onClick={() => {
                setResent(true);
                window.setTimeout(() => setResent(false), 2000);
              }}
              className="cursor-pointer font-[family-name:var(--font-display)] text-[15px] font-semibold leading-[22px] tracking-[0.19px] text-content-primary transition-colors hover:text-brand"
            >
              {resent ? authCopy.code.resent : authCopy.code.resend}
            </button>
            <Cta busy={busy} onClick={submitCode}>
              {authCopy.code.submit}
            </Cta>
          </>
        )}

        {step === "update" && (
          <>
            <PasswordField
              id={`${baseId}-new-password`}
              label={authCopy.update.password}
              value={password}
              onChange={(next) => {
                setPassword(next);
                setPasswordError("");
              }}
              autoComplete="new-password"
              autoFocus
              error={passwordError || undefined}
            />
            {password.length > 0 && <PasswordMeter value={password} />}
            <PasswordField
              id={`${baseId}-confirm-password`}
              label={authCopy.update.confirm}
              value={confirm}
              onChange={(next) => {
                setConfirm(next);
                setConfirmError("");
              }}
              autoComplete="new-password"
              error={confirmError || undefined}
            />
            <Cta busy={busy} onClick={submitUpdate}>
              {authCopy.update.submit}
            </Cta>
          </>
        )}

        <p className="m-0 text-center font-[family-name:var(--font-display)] text-[11px] leading-4 tracking-[0.11px] text-content-secondary">
          {authCopy.note}
        </p>
      </div>
    </Sheet>
  );
}

/** The two opt-in rows on sign-up. */
function Consent({
  id,
  checked,
  onChange,
  label,
}: {
  id: string;
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
}) {
  return (
    <label htmlFor={id} className="flex cursor-pointer items-start gap-3">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="peer sr-only"
      />
      <span
        aria-hidden
        className="mt-[2px] flex size-5 shrink-0 items-center justify-center border border-white/30 transition-colors peer-checked:border-brand peer-checked:bg-brand peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brand"
      >
        <svg
          viewBox="0 0 16 16"
          className={`size-3 ${checked ? "opacity-100" : "opacity-0"}`}
          fill="none"
        >
          <path d="M2 8.5 6 12.5 14 3.5" stroke="#18181b" strokeWidth="2.5" />
        </svg>
      </span>
      <span className="font-[family-name:var(--font-display)] text-[12px] leading-4 tracking-[0.12px] text-content-secondary">
        {label}
      </span>
    </label>
  );
}
