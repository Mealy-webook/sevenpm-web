"use client";

import Image from "next/image";
import { useId, useState } from "react";

import { Sheet, SheetField, SheetSubmit } from "@/components/ui/Sheet";
import { bookingCopy, findPromo } from "@/data/booking";

/**
 * Add promocode, from Figma 2146:7159 (empty), 2146:7509 (typed) and
 * 2146:7842 (invalid): one field, one Apply, and the error under the field
 * with Apply disabled until the code changes.
 */
export function PromoDialog({
  onClose,
  onApply,
}: {
  onClose: () => void;
  onApply: (code: string, off: number) => void;
}) {
  const copy = bookingCopy.promoDialog;
  const titleId = useId();
  const fieldId = useId();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  const apply = () => {
    const promo = findPromo(code);
    if (!promo) {
      setError(copy.invalid);
      return;
    }
    onApply(promo.code, promo.off);
  };

  return (
    <Sheet
      open
      onClose={onClose}
      title={copy.title}
      titleId={titleId}
      closeLabel={copy.close}
    >
      <div className="flex flex-col gap-4 px-5 pb-5 pt-4">
        <SheetField
          id={fieldId}
          label={copy.label}
          value={code}
          onChange={(next) => {
            setCode(next.toUpperCase());
            setError("");
          }}
          error={error || undefined}
          trailing={
            code ? (
              <button
                type="button"
                aria-label={copy.clear}
                onClick={() => {
                  setCode("");
                  setError("");
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
        <SheetSubmit onClick={apply} disabled={Boolean(error) || code.length === 0}>
          {copy.apply}
        </SheetSubmit>
      </div>
    </Sheet>
  );
}
