"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

/**
 * The 378px sheet the booking dialogs share — ticket info (2078:45259), item
 * details (2196:11760) and the order summary (2213:14113).
 *
 * It renders through a portal on `document.body`. That is not optional: the
 * journey sits inside elements MotionProvider transforms, and a transformed
 * ancestor becomes the containing block for `position: fixed`, which would
 * trap the sheet inside the column that opened it.
 */
export function Sheet({
  open,
  onClose,
  title,
  subtitle,
  titleId,
  labelledBy,
  onBack,
  backLabel,
  closeLabel,
  children,
  footer,
}: {
  open: boolean;
  onClose: () => void;
  /**
   * The heading in the sheet's own header. An empty string leaves the header
   * as just the close button, which is what a dialog whose heading sits in
   * its body wants (the skip-protection confirm, 2407:11381) — pass
   * `labelledBy` there so the sheet still has an accessible name.
   */
  title: string;
  /** Second line under the title, as the delivery and card dialogs carry. */
  subtitle?: string;
  titleId: string;
  /** Overrides what names the dialog. Defaults to the header's own title. */
  labelledBy?: string;
  /**
   * A step inside the sheet that can be backed out of. Given one, the header
   * grows a back arrow to the left of the title; the close button stays,
   * because leaving the sheet and stepping back through it are different
   * intentions and a flow should not make you undo to escape.
   */
  onBack?: () => void;
  backLabel?: string;
  closeLabel: string;
  children: React.ReactNode;
  /** Sticky dock under the scrollable body. */
  footer?: React.ReactNode;
}) {
  const sheet = useRef<HTMLDivElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    closeButton.current?.focus();
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div
      /* Above the film grain (z-80) so the overlay really covers the page;
         the custom cursor (z-90) still draws on top of it. */
      className="fixed inset-0 z-[85] flex justify-center overflow-y-auto overscroll-contain bg-black/80 p-3 backdrop-blur-md"
      data-lenis-prevent
      onMouseDown={(event) => {
        if (!sheet.current?.contains(event.target as Node)) onClose();
      }}
    >
      <div
        ref={sheet}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy ?? titleId}
        className="my-auto flex h-fit w-full max-w-[378px] flex-col bg-bg-secondary shadow-[0px_4px_12px_rgba(0,0,0,0.25)]"
      >
        <div className="flex items-start gap-2 px-5 pt-5">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              aria-label={backLabel}
              className="btn-secondary flex shrink-0 cursor-pointer items-center justify-center p-[10px]"
            >
              <Image
                src="/assets/ic-arrow-left-20.svg"
                alt=""
                width={20}
                height={20}
                className="size-5"
              />
            </button>
          )}
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            {title && (
              <h2
                id={titleId}
                className="m-0 font-[family-name:var(--font-display)] text-[22px] font-bold uppercase leading-7 tracking-[-0.11px] text-content-primary"
              >
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="m-0 font-[family-name:var(--font-display)] text-[12px] leading-4 tracking-[0.12px] text-content-secondary">
                {subtitle}
              </p>
            )}
          </div>
          <button
            ref={closeButton}
            type="button"
            onClick={onClose}
            aria-label={closeLabel}
            className="btn-secondary flex shrink-0 cursor-pointer items-center justify-center p-[10px]"
          >
            <Image
              src="/assets/ic-dialog-close.svg"
              alt=""
              width={20}
              height={20}
              className="size-5"
            />
          </button>
        </div>

        {children}

        {footer}
      </div>
    </div>,
    document.body,
  );
}

/** Price block the dialog docks share: amount, was-price and discount. */
export function SheetPrice({
  price,
  wasPrice,
  discount,
  suffix,
  format,
}: {
  price: number;
  wasPrice?: number;
  discount?: string;
  suffix?: string;
  format: (amount: number) => string;
}) {
  return (
    <div className="flex flex-col gap-[2px]">
      <p className="m-0 flex items-baseline gap-1 font-[family-name:var(--font-display)]">
        <span className="text-[17px] font-semibold leading-6 text-content-primary">
          {format(price)}
        </span>
        {suffix && (
          <span className="text-[13px] leading-5 tracking-[0.13px] text-content-secondary">
            {suffix}
          </span>
        )}
      </p>
      {(wasPrice !== undefined || discount) && (
        <p className="m-0 flex items-center gap-2 font-[family-name:var(--font-display)] text-[10px] leading-[14px] tracking-[0.1px]">
          {wasPrice !== undefined && (
            <span className="text-content-secondary line-through">
              {wasPrice}
            </span>
          )}
          {discount && <span className="text-[#4ade80]">{discount}</span>}
        </p>
      )}
    </div>
  );
}

/**
 * The dialogs' text field: the label sits inside the box, small above the
 * value once there is one, and doubles as the placeholder when empty.
 */
export function SheetField({
  id,
  label,
  value,
  onChange,
  error,
  inputMode,
  autoComplete,
  maxLength,
  placeholder,
  leading,
  trailing,
  type = "text",
  disabled = false,
  autoFocus = false,
  className = "",
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  inputMode?: "text" | "numeric";
  autoComplete?: string;
  maxLength?: number;
  placeholder?: string;
  /** Fixed content before the input, such as a dial code. */
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  type?: string;
  /** Read-only rows, like the address carried into sign-up. */
  disabled?: boolean;
  autoFocus?: boolean;
  className?: string;
}) {
  const filled = value.length > 0;
  return (
    <div className={`flex min-w-0 flex-col gap-1 ${className}`}>
      <div
        className={`flex min-w-0 items-center gap-2 border bg-white/5 px-4 py-2 transition-colors focus-within:border-content-primary ${
          error ? "border-[#ff6c6c]" : "border-white/10"
        } ${disabled ? "opacity-60" : ""}`}
      >
        {leading}
        <span className="flex h-9 min-w-0 flex-1 flex-col justify-center">
          {filled && (
            <span
              className={`font-[family-name:var(--font-display)] text-[12px] leading-4 tracking-[0.12px] ${
                error ? "text-[#ff6c6c]" : "text-content-secondary"
              }`}
            >
              {label}
            </span>
          )}
          <input
            id={id}
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder={placeholder ?? label}
            aria-label={label}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? `${id}-error` : undefined}
            inputMode={inputMode}
            autoComplete={autoComplete}
            maxLength={maxLength}
            type={type}
            disabled={disabled}
            autoFocus={autoFocus}
            className={`w-full bg-transparent font-[family-name:var(--font-display)] text-content-primary caret-brand outline-none placeholder:text-content-secondary ${
              filled
                ? "text-[15px] font-semibold leading-[22px] tracking-[0.19px]"
                : "text-[15px] leading-[22px] tracking-[0.19px]"
            }`}
          />
        </span>
        {trailing}
      </div>
      {error && (
        <p
          id={`${id}-error`}
          role="alert"
          className="m-0 font-[family-name:var(--font-display)] text-[12px] leading-4 tracking-[0.12px] text-[#ff6c6c]"
        >
          {error}
        </p>
      )}
    </div>
  );
}

/** The white dock button the booking dialogs end with. */
export function SheetSubmit({
  children,
  onClick,
  disabled,
  type = "button",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit";
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="flex w-full cursor-pointer items-center justify-center bg-white px-5 py-4 font-[family-name:var(--font-display)] text-[17px] font-semibold leading-6 text-[#18181b] transition-colors hover:bg-white/90 disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-white/30"
    >
      {children}
    </button>
  );
}
