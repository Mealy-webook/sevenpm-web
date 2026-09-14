"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { signOut } from "./session";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { logoutCopy } from "@/data/account";

/**
 * The Logout row, from Figma 2231:12668. It owns the confirmation so both
 * places that offer logout — the account sidebar and the header's account
 * menu — behave the same; each keeps its own row markup and passes it as
 * children.
 *
 * Confirming drops the session and goes home, which is where a signed-out
 * visitor belongs: the account pages have nothing to show them.
 */
export function LogoutButton({
  children,
  className,
  onBeforeConfirm,
}: {
  children: React.ReactNode;
  className?: string;
  /** Lets the header close its popover before the page changes. */
  onBeforeConfirm?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`cursor-pointer ${className ?? ""}`}
      >
        {children}
      </button>

      {open && (
        <ConfirmDialog
          destructive
          title={logoutCopy.title}
          body={logoutCopy.body}
          cancelLabel={logoutCopy.cancel}
          confirmLabel={logoutCopy.confirm}
          onCancel={() => setOpen(false)}
          onConfirm={() => {
            setOpen(false);
            onBeforeConfirm?.();
            signOut();
            router.push("/");
          }}
        />
      )}
    </>
  );
}
