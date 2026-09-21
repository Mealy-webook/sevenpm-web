import { redirect } from "next/navigation";

/**
 * VIP box requests moved into Bookings as its third chip. The URL was handed
 * out by the enquiry form's confirmation, so it redirects rather than 404s.
 */
export default function RequestsPage() {
  redirect("/account?tab=requests");
}
