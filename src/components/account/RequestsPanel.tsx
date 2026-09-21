"use client";

import Image from "next/image";
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
 * Bookings screen, from Figma 2452:38745. A box enquiry is a booking that has
 * not been priced yet, so the row is a booking row — poster, status tag,
 * event, when and where, the figure — with the two answers a quote is waiting
 * for on the right.
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

/** The tag that opens each row. Orange is the comp's "waiting on you". */
const TONE: Record<BoxRequest["status"], string> = {
  review: "bg-white/5 text-content-secondary",
  quoted: "bg-[#ff7f29]/10 text-[#ff7f29]",
  accepted: "bg-[#ff7f29]/10 text-[#ff7f29]",
  paid: "bg-[#4ade80]/10 text-[#4ade80]",
  declined: "bg-white/5 text-content-secondary",
};

/** A line of the row's metadata: 16px icon, 13/20 secondary text. */
function Meta({ icon, children }: { icon: string; children: React.ReactNode }) {
  return (
    <span className="flex w-full items-center gap-1 font-[family-name:var(--font-display)] text-[13px] leading-5 tracking-[0.13px] text-content-secondary">
      <Image
        src={icon}
        alt=""
        width={16}
        height={16}
        className="size-4 shrink-0"
      />
      {children}
    </span>
  );
}

export function RequestsPanel({
  /** The Bookings screen already has a title, so the tab body drops it. */
  heading = true,
}: {
  heading?: boolean;
} = {}) {
  const requests = useRequests();

  return (
    <div className="flex flex-col gap-6">
      {/* Under the Bookings title the screen already has a description, and
          the comp carries no second one. */}
      {heading && (
        <div className="flex flex-col gap-2">
          <h1 className="m-0 font-[family-name:var(--font-display)] text-[22px] font-bold uppercase leading-7 tracking-[-0.11px] text-content-primary">
            {requestsCopy.title}
          </h1>
          <p className="m-0 font-[family-name:var(--font-display)] text-[13px] leading-5 tracking-[0.13px] text-content-secondary">
            {requestsCopy.intro}
          </p>
        </div>
      )}

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
              className="flex w-full flex-col gap-4 border border-white/5 p-6 lg:flex-row lg:items-center"
            >
              {request.image && (
                <div className="relative size-[120px] shrink-0 overflow-hidden bg-ink-700">
                  <Image
                    src={request.image}
                    alt=""
                    fill
                    sizes="120px"
                    className="object-cover"
                  />
                </div>
              )}

              <div className="flex min-w-0 flex-1 flex-col items-start gap-3">
                <span
                  className={`flex items-center gap-[2px] px-[6px] py-[2px] font-[family-name:var(--font-display)] text-[10px] leading-[14px] tracking-[0.1px] ${TONE[request.status]}`}
                >
                  {(request.status === "quoted" ||
                    request.status === "accepted") && (
                    <Image
                      src="/assets/ic-tag-pending-12.svg"
                      alt=""
                      width={12}
                      height={12}
                      className="size-3"
                    />
                  )}
                  {requestsCopy.statuses[request.status]}
                </span>

                <h3 className="m-0 font-[family-name:var(--font-display)] text-[18px] font-bold uppercase leading-6 tracking-[-0.09px] text-white">
                  <Link
                    href={`/events/${request.eventSlug}`}
                    className="transition-colors hover:text-brand"
                  >
                    {request.eventName}
                  </Link>
                </h3>

                <div className="flex w-full flex-col gap-1">
                  <Meta icon="/assets/ic-clock-16.svg">
                    {request.nights} · {requestsCopy.guests(request.guests)}
                  </Meta>
                  {request.venue && (
                    <Meta icon="/assets/ic-pin-16.svg">
                      {request.venueUrl ? (
                        <a
                          href={request.venueUrl}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="underline decoration-solid underline-offset-2 transition-colors hover:text-white"
                        >
                          {request.venue}
                        </a>
                      ) : (
                        request.venue
                      )}
                    </Meta>
                  )}
                </div>

                {request.quote !== undefined &&
                request.status !== "declined" ? (
                  <p className="m-0 flex flex-col gap-1">
                    <span className="font-[family-name:var(--font-display)] text-[15px] font-semibold leading-[22px] tracking-[0.19px] tabular-nums text-content-primary">
                      {formatMoney(request.quote)}
                    </span>
                    {request.quoteNote && (
                      <span className="font-[family-name:var(--font-display)] text-[13px] leading-5 tracking-[0.13px] text-content-secondary">
                        {request.quoteNote}
                      </span>
                    )}
                  </p>
                ) : (
                  <p className="m-0 font-[family-name:var(--font-display)] text-[13px] leading-5 tracking-[0.13px] text-content-secondary">
                    {requestsCopy.says[request.status]}
                  </p>
                )}

                <span className="font-[family-name:var(--font-display)] text-[12px] leading-4 tracking-[0.12px] text-content-secondary">
                  {requestsCopy.reference} {request.reference}
                </span>
              </div>

              {/* The answer the row is waiting for. Tertiary beside primary,
                  as the comp pairs them. */}
              {(request.status === "quoted" ||
                request.status === "accepted") && (
                <div className="flex shrink-0 flex-wrap items-center gap-2 self-start lg:self-center">
                  {request.status === "quoted" ? (
                    <>
                      <button
                        type="button"
                        onClick={() =>
                          setRequestStatus(request.reference, "declined")
                        }
                        className="flex cursor-pointer items-center justify-center px-5 py-4 font-[family-name:var(--font-display)] text-[17px] font-semibold leading-6 text-content-primary transition-colors hover:text-white"
                      >
                        {requestsCopy.decline}
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setRequestStatus(request.reference, "accepted")
                        }
                        className="flex cursor-pointer items-center justify-center bg-white px-5 py-4 font-[family-name:var(--font-display)] text-[17px] font-semibold leading-6 text-[#18181b] transition-colors hover:bg-white/90"
                      >
                        {requestsCopy.accept}
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() =>
                        setRequestStatus(request.reference, "paid")
                      }
                      className="flex cursor-pointer items-center justify-center bg-white px-5 py-4 font-[family-name:var(--font-display)] text-[17px] font-semibold leading-6 text-[#18181b] transition-colors hover:bg-white/90"
                    >
                      {requestsCopy.pay}
                    </button>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
