import Image from "next/image";

/**
 * The card and row the account comps are built from (Figma 2173:26214,
 * 2196:12516): a bordered card with an 18px title, holding rows of label
 * over value with a small inline action on the right.
 *
 * Buttons size from an inner fixed-height box rather than the line height —
 * that is how the design system gets 28px small buttons and 52px large ones
 * whatever the label.
 */

export function ActionButton({
  children,
  label,
  onClick,
}: {
  children: React.ReactNode;
  /** Accessible name, when the visible label needs context. */
  label?: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="btn-secondary shrink-0 cursor-pointer p-1.5 font-[family-name:var(--font-display)] text-[13px] font-semibold leading-5 tracking-[0.16px] text-content-primary"
    >
      <span className="flex h-4 items-center justify-center px-1">
        {children}
      </span>
    </button>
  );
}

export function AccountCard({
  title,
  id,
  action,
  children,
}: {
  title: string;
  id?: string;
  /** Sits on the right of the card's title row. */
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  const titleId = id ? `${id}-title` : undefined;

  return (
    <section
      id={id}
      aria-labelledby={titleId}
      className="flex scroll-mt-28 flex-col gap-2 border border-white/5 p-6"
    >
      <div className="flex min-h-6 items-center justify-between gap-4">
        <h3
          id={titleId}
          className="m-0 font-[family-name:var(--font-display)] text-[18px] font-bold uppercase leading-6 tracking-[-0.09px] text-content-primary"
        >
          {title}
        </h3>
        {action}
      </div>
      {children}
    </section>
  );
}

export function AccountRow({
  label,
  value,
  icon,
  divider = true,
  children,
}: {
  label: string;
  value?: string;
  /** 24px icon, shown in the wallet's 40px tile. */
  icon?: string;
  divider?: boolean;
  /** Trailing controls. */
  children?: React.ReactNode;
}) {
  return (
    <div
      className={`flex min-w-0 items-center gap-4 py-3 ${
        divider ? "border-b-[0.5px] border-white/10" : ""
      }`}
    >
      {icon && (
        <span
          className="flex size-10 shrink-0 items-center justify-center bg-bg-tertiary p-2"
          aria-hidden
        >
          <Image src={icon} alt="" width={24} height={24} className="size-6" />
        </span>
      )}
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="truncate font-[family-name:var(--font-display)] text-[15px] leading-[22px] tracking-[0.15px] text-content-primary">
          {label}
        </span>
        {value && (
          <span className="truncate font-[family-name:var(--font-display)] text-[13px] leading-5 tracking-[0.13px] text-content-secondary">
            {value}
          </span>
        )}
      </span>
      {children}
    </div>
  );
}
