"use client";

import Link from "next/link";
import { useState } from "react";

import { AuthDialog } from "@/components/auth/AuthDialog";
import { useSignedIn } from "@/components/auth/session";
import { authCopy } from "@/data/auth";

/**
 * The account screens belong to whoever is signed in, so once the session is
 * gone they stop showing one. Logging out routes home, but the back button
 * and a bookmark both land here, and someone else's bookings are not what
 * should greet them.
 */
export function AccountGuard({ children }: { children: React.ReactNode }) {
  const signedIn = useSignedIn();
  const [authOpen, setAuthOpen] = useState(false);

  if (signedIn) return <>{children}</>;

  return (
    <>
      <div className="shell my-16 flex flex-col items-start gap-4 border border-white/5 p-8">
        <h2 className="m-0 font-[family-name:var(--font-display)] text-title-section font-bold uppercase tracking-[-0.13px] text-content-primary">
          You&rsquo;re signed out
        </h2>
        <p className="m-0 font-[family-name:var(--font-display)] text-body text-content-secondary">
          Sign in to see your bookings, your wallet and everything else on your
          account.
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setAuthOpen(true)}
            className="flex cursor-pointer items-center justify-center bg-brand px-5 py-4 font-[family-name:var(--font-display)] text-body-l font-semibold text-[#18181b] transition-colors hover:bg-[#fff35a]"
          >
            {authCopy.open}
          </button>
          <Link
            href="/"
            className="btn-secondary flex items-center justify-center px-5 py-4 font-[family-name:var(--font-display)] text-body-l font-semibold text-content-primary"
          >
            Back to the homepage
          </Link>
        </div>
      </div>

      {authOpen && <AuthDialog onClose={() => setAuthOpen(false)} />}
    </>
  );
}
