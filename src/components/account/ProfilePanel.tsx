import type { ProfileSection } from "@/data/account";
import { profileCopy } from "@/data/account";

/**
 * Profile, from Figma 2173:26214. Panel title with a description, then a
 * card per section — contact information, personal information, security —
 * each an 18px title over rows of label and value with a small inline
 * action. The destructive "Delete account" button sits outside the cards.
 *
 * A field with no value reads "Not provided" and offers "Add".
 */

/* The comp's small Secondary button: 6px of padding around a 16px content
   box, so the row's trailing control is 28px tall however tall the line is. */
const smallButton =
  "btn-secondary shrink-0 cursor-pointer p-1.5 font-[family-name:var(--font-display)] text-[13px] font-semibold leading-5 tracking-[0.16px] text-content-primary";

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
        <section
          key={section.id}
          id={section.id}
          aria-labelledby={`${section.id}-title`}
          className="flex scroll-mt-28 flex-col gap-2 border border-white/5 p-6"
          data-reveal="up"
        >
          <h3
            id={`${section.id}-title`}
            className="m-0 font-[family-name:var(--font-display)] text-[18px] font-bold uppercase leading-6 tracking-[-0.09px] text-content-primary"
          >
            {section.title}
          </h3>

          {section.fields.map((field, index) => (
            <div
              key={field.id}
              className={`flex min-w-0 items-center gap-2 py-3 ${
                index < section.fields.length - 1
                  ? "border-b-[0.5px] border-white/10"
                  : ""
              }`}
            >
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="truncate font-[family-name:var(--font-display)] text-[15px] leading-[22px] tracking-[0.15px] text-content-primary">
                  {field.label}
                </span>
                <span className="truncate font-[family-name:var(--font-display)] text-[13px] leading-5 tracking-[0.13px] text-content-secondary">
                  {field.value ?? profileCopy.emptyValue}
                </span>
              </span>
              {field.action && (
                <button
                  type="button"
                  className={smallButton}
                  aria-label={`${field.action} ${field.label.toLowerCase()}`}
                >
                  <span className="flex h-4 items-center justify-center px-1">
                    {field.action}
                  </span>
                </button>
              )}
            </div>
          ))}
        </section>
      ))}

      <button
        type="button"
        className="btn-secondary flex cursor-pointer items-center justify-center self-start px-5 py-4 font-[family-name:var(--font-display)] text-[17px] font-semibold leading-6 text-[#ff6c6c]"
        data-reveal="up"
      >
        <span className="flex h-5 items-center">{profileCopy.deleteCta}</span>
      </button>
    </div>
  );
}
