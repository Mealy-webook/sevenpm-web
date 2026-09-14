import type { ProfileSection } from "@/data/account";
import { profileCopy } from "@/data/account";
import {
  AccountCard,
  AccountRow,
  ActionButton,
} from "@/components/account/AccountCard";

/**
 * Profile, from Figma 2173:26214. Panel title with a description, then a
 * card per section — contact information, personal information, security —
 * each an 18px title over rows of label and value with a small inline
 * action. The destructive "Delete account" button sits outside the cards.
 *
 * A field with no value reads "Not provided" and offers "Add".
 */

export function ProfilePanel({ sections }: { sections: ProfileSection[] }) {
  return (
    <div
      className="flex min-w-0 flex-1 flex-col gap-6"
      aria-labelledby="profile-title"
    >
      <div className="flex flex-col gap-1">
        <h2
          id="profile-title"
          className="m-0 font-[family-name:var(--font-display)] text-[26px] font-bold uppercase leading-8 tracking-[-0.13px] text-content-primary"
        >
          {profileCopy.title}
        </h2>
        <p className="m-0 font-[family-name:var(--font-display)] text-[13px] leading-5 tracking-[0.13px] text-content-secondary">
          {profileCopy.description}
        </p>
      </div>

      {sections.map((section) => (
        <AccountCard key={section.id} id={section.id} title={section.title}>
          {section.fields.map((field, index) => (
            <AccountRow
              key={field.id}
              label={field.label}
              value={field.value ?? profileCopy.emptyValue}
              divider={index < section.fields.length - 1}
            >
              {field.action && (
                <ActionButton
                  label={`${field.action} ${field.label.toLowerCase()}`}
                >
                  {field.action}
                </ActionButton>
              )}
            </AccountRow>
          ))}
        </AccountCard>
      ))}

      <button
        type="button"
        className="btn-secondary flex cursor-pointer items-center justify-center self-start px-5 py-4 font-[family-name:var(--font-display)] text-[17px] font-semibold leading-6 text-[#ff6c6c]"
      >
        <span className="flex h-5 items-center">{profileCopy.deleteCta}</span>
      </button>
    </div>
  );
}
