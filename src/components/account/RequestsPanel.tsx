"use client";

import Link from "next/link";

import { formatMoney } from "@/data/booking";
import { requestsCopy } from "@/data/account";
import {
  setRequestStatus,
  useRequests,
  type BoxRequest,
} from "./requestsStore";

/**
 * Where a VIP box enquiry lives after the form closes: the third tab of the
 * Bookings screen. A box enquiry is a booking that has not been priced yet,
 * so it belongs beside the tickets rather than on a screen of its own.
 *
 * Each request says which of the four stages it is at and, plainly, who it
 * is waiting on — the team or you. That is the whole point of the screen:
 * a box takes days to price, and without somewhere to look, the only thing
 * the visitor has is a reference number and a hope.
 *
 * Accepting a quote and paying are both here because that is the path the
 * emails describe; doing it on this page saves the visitor digging the
 * email out. Neither charges anything — there is no provider behind it.
 */

const TONE: Record<BoxRequest["status"], string> = {
  review: "bg-white/5 text-content-secondary",
  quoted: "bg-brand/15 text-brand",
  accepted: "bg-[#ff7f29]/10 text-[#ff7f29]",
  paid: "bg-[#4ade80]/10 text-[#4ade80]",
  declined: "bg-white/5 text-content-secondary",
};

export function RequestsPanel({
  /** The Bookings screen already has a title, so the tab body drops it. */
  heading = true,
}: {
  heading?: boolean;
} = {}) {
  const requests = useRequests();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        {heading && (
          <h1 className="m-0 font-[family-name:var(--font-display)] text-[22px] font-bold uppercase leading-7 tracking-[-0.11px] text-content-primary">
            {requestsCopy.title}
          </h1>
        )}
        <p className="m-0 font-[family-name:var(--font-display)] text-[13px] leading-5 tracking-[0.13px] text-content-secondary">
          {requestsCopy.intro}
        </p>
      </div>

      {requests.length === 0 ? (
        <div className="flex flex-col items-start gap-4 border border-white/5 p-6">
          <p className="m-0 font-[family-name:var(--font-display)] text-[15px] leading-[22px] tracking-[0.19px] text-content-secondary">
            {requestsCopy.empty}
          </p>
          <Link
            href="/#festivals"
            className="btn-secondary flex items-center justify-center px-5 py-3 font-[family-name:var(--font-display)] text-[15px] font-semibold leading-[22px] tracking-[0.19px] text-content-primary"
          >
            {requestsCopy.emptyAction}
          </Link>
        </div>
      ) : (
        <ul className="m-0 flex list-none flex-col gap-4 p-0">
          {requests.map((request) => (
            <li
              key={request.reference}
              className="flex flex-col gap-4 border border-white/5 p-6"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex flex-col gap-1">
                  <span className="font-[family-name:var(--font-display)] text-[17px] font-bold uppercase leading-6 tracking-[0.19px] text-white">
                    {request.eventName}
                  </span>
                  <span className="font-[family-name:var(--font-display)] text-[13px] leading-5 tracking-[0.13px] text-content-secondary">
                    {request.nights} · {requestsCopy.guests(request.guests)}
                  </span>
                </div>
                <span
                  className={`flex shrink-0 items-center px-2 py-1 font-[family-name:var(--font-display)] text-[12px] font-semibold leading-4 tracking-[0.12px] ${TONE[request.status]}`}
                >
                  {requestsCopy.statuses[request.status]}
                </span>
              </div>

              {/* The quote, once there is one. */}
              {request.quote !== undefined && request.status !== "declined" && (
                <div className="flex flex-col gap-1 border-l-2 border-brand pl-4">
                  <span className="font-[family-name:var(--font-display)] text-[13px] leading-5 tracking-[0.13px] text-content-secondary">
                    {requestsCopy.quoteLabel}
                  </span>
                  <span className="font-[family-name:var(--font-display)] text-[22px] font-semibold leading-7 tabular-nums text-content-primary">
                    {formatMoney(request.quote)}
                  </span>
                  {request.quoteNote && (
                    <span className="font-[family-name:var(--font-display)] text-[13px] leading-5 tracking-[0.13px] text-content-secondary">
                      {request.quoteNote}
                    </span>
                  )}
                </div>
              )}

              {/* Who it is waiting on, in words. */}
              <p className="m-0 font-[family-name:var(--font-display)] text-[13px] leading-5 tracking-[0.13px] text-content-secondary">
                {requestsCopy.says[request.status]}
              </p>

              <div className="flex flex-wrap items-center gap-3">
                {request.status === "quoted" && (
                  <>
                    <button
                      type="button"
                      onClick={() =>
                        setRequestStatus(request.reference, "accepted")
                      }
                      className="flex cursor-pointer items-center justify-center bg-brand px-5 py-3 font-[family-name:var(--font-display)] text-[15px] font-semibold leading-[22px] tracking-[0.19px] text-[#18181b] transition-colors hover:bg-[#fff35a]"
                    >
                      {requestsCopy.accept}
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setRequestStatus(request.reference, "declined")
                      }
                      className="flex cursor-pointer items-center justify-center px-3 py-3 font-[family-name:var(--font-display)] text-[15px] font-semibold leading-[22px] tracking-[0.19px] text-content-secondary transition-colors hover:text-white"
                    >
                      {requestsCopy.decline}
                    </button>
                  </>
                )}

                {request.status === "accepted" && (
                  <button
                    type="button"
                    onClick={() => setRequestStatus(request.reference, "paid")}
                    className="flex cursor-pointer items-center justify-center bg-white px-5 py-3 font-[family-name:var(--font-display)] text-[15px] font-semibold leading-[22px] tracking-[0.19px] text-[#18181b] transition-colors hover:bg-white/90"
                  >
                    {requestsCopy.pay}
                  </button>
                )}

                <Link
                  href={`/events/${request.eventSlug}`}
                  className="btn-secondary flex items-center justify-center px-5 py-3 font-[family-name:var(--font-display)] text-[15px] font-semibold leading-[22px] tracking-[0.19px] text-content-primary"
                >
                  {requestsCopy.viewEvent}
                </Link>

                <span className="ml-auto font-[family-name:var(--font-display)] text-[12px] leading-4 tracking-[0.12px] text-content-secondary">
                  {requestsCopy.reference} {request.reference}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
