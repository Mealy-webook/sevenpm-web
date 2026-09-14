"use client";

import Image from "next/image";
import { useState } from "react";

import type { PaymentCard, ProfileField, ProfileToggle } from "@/data/account";
import { accountUser, profileCopy } from "@/data/account";

/**
 * Profile. No Figma comp — composed from the wallet's vocabulary: cards
 * with an 18px section title and rows of label + description with an inline
 * action on the right. Four cards: personal details, preferences, payment
 * details and security.
 */

function Card({
  title,
  id,
  action,
  children,
}: {
  title: string;
  id?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className="flex scroll-mt-28 flex-col gap-4 border border-white/5 p-6"
      data-reveal="up"
    >
      <div className="flex items-center justify-between gap-4">
        <h3 className="m-0 font-[family-name:var(--font-display)] text-[18px] font-bold uppercase leading-6 tracking-[-0.09px] text-content-primary">
          {title}
        </h3>
        {action}
      </div>
      {children}
    </section>
  );
}

const actionButton =
  "btn-secondary shrink-0 cursor-pointer px-3 py-2 font-[family-name:var(--font-display)] text-[13px] font-semibold leading-5 text-content-primary";

/** Label over description, with an optional inline action — the comp's row. */
function Row({
  label,
  description,
  action,
  destructive = false,
  children,
}: {
  label: string;
  description?: string;
  action?: string;
  destructive?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-4 border-b-[0.5px] border-white/10 py-3 last:border-b-0">
      <span className="flex min-w-0 flex-1 flex-col">
        <span
          className={`truncate font-[family-name:var(--font-display)] text-[15px] leading-[22px] tracking-[0.15px] ${
            destructive ? "text-[#f87171]" : "text-content-primary"
          }`}
        >
          {label}
        </span>
        {description && (
          <span className="truncate font-[family-name:var(--font-display)] text-[13px] leading-5 tracking-[0.13px] text-content-secondary">
            {description}
          </span>
        )}
      </span>
      {children}
      {action && (
        <button type="button" className={actionButton}>
          {action}
        </button>
      )}
    </div>
  );
}

function Switch({
  on,
  onChange,
  label,
}: {
  on: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={onChange}
      className={`flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full p-0.5 transition-colors ${
        on ? "bg-brand" : "bg-white/10"
      }`}
    >
      <span
        className={`block size-5 rounded-full transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          on
            ? "translate-x-5 bg-[#0b0b0e]"
            : "translate-x-0 bg-content-secondary"
        }`}
      />
    </button>
  );
}

export function ProfilePanel({
  fields,
  preferences,
  toggles,
  cards,
  security,
}: {
  fields: ProfileField[];
  preferences: ProfileField[];
  toggles: ProfileToggle[];
  cards: PaymentCard[];
  security: ProfileField[];
}) {
  const [switches, setSwitches] = useState(() =>
    Object.fromEntries(toggles.map((t) => [t.id, t.on])),
  );

  return (
    <div
      className="flex min-w-0 flex-1 flex-col gap-6"
      aria-labelledby="profile-title"
    >
      <h2
        id="profile-title"
        className="m-0 font-[family-name:var(--font-display)] text-[26px] font-bold uppercase leading-8 tracking-[-0.13px] text-content-primary"
      >
        {profileCopy.title}
      </h2>

      <Card title={profileCopy.personal.title}>
        <div className="flex items-center gap-4 border-b-[0.5px] border-white/10 pb-4">
          <span className="relative size-16 shrink-0 overflow-hidden rounded-full">
            <Image
              src={accountUser.avatar}
              alt=""
              fill
              sizes="64px"
              className="object-cover"
            />
          </span>
          <span className="flex min-w-0 flex-1 flex-col">
            <span className="truncate font-[family-name:var(--font-display)] text-[15px] leading-[22px] tracking-[0.15px] text-content-primary">
              {accountUser.name}
            </span>
            <span className="truncate font-[family-name:var(--font-display)] text-[13px] leading-5 tracking-[0.13px] text-content-secondary">
              {accountUser.email}
            </span>
          </span>
          <button type="button" className={actionButton}>
            {profileCopy.personal.photoAction}
          </button>
        </div>
        {fields.map((field) => (
          <Row
            key={field.id}
            label={field.label}
            description={field.value}
            action={field.action}
          />
        ))}
      </Card>

      <Card title={profileCopy.preferences.title}>
        {preferences.map((field) => (
          <Row
            key={field.id}
            label={field.label}
            description={field.value}
            action={field.action}
          />
        ))}
        {toggles.map((toggle) => (
          <Row key={toggle.id} label={toggle.label} description={toggle.detail}>
            <Switch
              label={toggle.label}
              on={switches[toggle.id]}
              onChange={() =>
                setSwitches((current) => ({
                  ...current,
                  [toggle.id]: !current[toggle.id],
                }))
              }
            />
          </Row>
        ))}
      </Card>

      <Card
        title={profileCopy.payment.title}
        id="payment-details"
        action={
          <button type="button" className={actionButton}>
            {profileCopy.payment.addCard}
          </button>
        }
      >
        {cards.map((card) => (
          <Row
            key={card.id}
            label={`${card.brand} •••• ${card.last4}`}
            description={`Expires ${card.expiry}`}
            action="Remove"
          >
            {card.primary && (
              <span className="shrink-0 bg-brand px-2 py-1 font-[family-name:var(--font-display)] text-[12px] font-bold uppercase leading-4 tracking-[0.12px] text-[#0b0b0e]">
                {profileCopy.payment.primaryBadge}
              </span>
            )}
          </Row>
        ))}
      </Card>

      <Card title={profileCopy.security.title}>
        {security.map((field) => (
          <Row
            key={field.id}
            label={field.label}
            description={field.value}
            action={field.action}
          />
        ))}
        <Row
          label="Delete account"
          description="Removes your bookings, wallet balance and loyalty points for good"
          action="Delete"
          destructive
        />
      </Card>
    </div>
  );
}
