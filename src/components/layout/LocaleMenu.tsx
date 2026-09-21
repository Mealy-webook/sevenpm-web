import Image from "next/image";

/**
 * Language + currency picker, from Figma 2091:45844. Opens under the globe
 * button in the header. Single-select groups rendered as radio rows.
 */

export const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "fr", label: "French" },
  { code: "ar", label: "Arabic" },
] as const;

export const CURRENCIES = [
  { code: "MAD", label: "Maroccan Dirham", flag: "/assets/flag-ma.png" },
  { code: "SAR", label: "Saudi Riyal", flag: "/assets/flag-sa.png" },
] as const;

export type LanguageCode = (typeof LANGUAGES)[number]["code"];
export type CurrencyCode = (typeof CURRENCIES)[number]["code"];

function SelectRow({
  label,
  description,
  flag,
  selected,
  onSelect,
}: {
  label: string;
  description?: string;
  flag?: string;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      className={`menu-row flex w-full cursor-pointer items-center gap-4 px-4 text-left transition-colors ${
        selected
          ? "border border-content-primary bg-white/10"
          : "border border-white/10 bg-white/5 hover:bg-white/10"
      }`}
    >
      {flag && (
        <span className="relative block size-6 shrink-0 overflow-hidden">
          <Image src={flag} alt="" fill sizes="24px" className="object-cover" />
        </span>
      )}
      <span className="flex min-w-0 flex-1 items-center gap-2 py-3">
        <span className="flex min-w-0 flex-1 flex-col">
          <span className="truncate font-[family-name:var(--font-display)] text-[15px] leading-[22px] tracking-[0.15px] text-content-primary">
            {label}
          </span>
          {description && (
            <span className="font-[family-name:var(--font-display)] text-[13px] leading-5 tracking-[0.13px] text-content-secondary">
              {description}
            </span>
          )}
        </span>
        <span
          aria-hidden
          className={`flex shrink-0 items-center p-1 transition-colors ${
            selected ? "bg-white" : "border border-white/30 bg-black/5"
          }`}
        >
          <Image
            src={
              selected ? "/assets/ic-check-square.svg" : "/assets/ic-check-off.svg"
            }
            alt=""
            width={16}
            height={16}
            className="size-4"
          />
        </span>
      </span>
    </button>
  );
}

export function LocaleMenu({
  id,
  labelledBy,
  language,
  currency,
  onLanguage,
  onCurrency,
}: {
  id: string;
  labelledBy: string;
  language: LanguageCode;
  currency: CurrencyCode;
  onLanguage: (code: LanguageCode) => void;
  onCurrency: (code: CurrencyCode) => void;
}) {
  return (
    <div
      id={id}
      role="dialog"
      aria-labelledby={labelledBy}
      className="popover flex w-[320px] flex-col gap-4 bg-[rgba(37,37,37,0.5)] p-4 backdrop-blur-2xl"
    >
      <div
        role="radiogroup"
        aria-label="Language"
        className="flex w-full flex-col gap-2"
      >
        <p className="m-0 font-[family-name:var(--font-display)] text-[15px] font-semibold leading-[22px] tracking-[0.19px] text-content-primary">
          Choose a language
        </p>
        {LANGUAGES.map((item) => (
          <SelectRow
            key={item.code}
            label={item.label}
            selected={language === item.code}
            onSelect={() => onLanguage(item.code)}
          />
        ))}
      </div>

      <div
        role="radiogroup"
        aria-label="Currency"
        className="flex w-full flex-col gap-2"
      >
        <p className="m-0 font-[family-name:var(--font-display)] text-[15px] font-semibold leading-[22px] tracking-[0.19px] text-content-primary">
          Choose a Currency
        </p>
        {CURRENCIES.map((item) => (
          <SelectRow
            key={item.code}
            label={item.label}
            description={item.code}
            flag={item.flag}
            selected={currency === item.code}
            onSelect={() => onCurrency(item.code)}
          />
        ))}
      </div>
    </div>
  );
}
