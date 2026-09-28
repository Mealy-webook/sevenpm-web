import type { Metadata } from "next";

import { LegalPage } from "@/components/legal/LegalPage";
import { legal } from "@/data/legal";

export const metadata: Metadata = {
  title: "Privacy Policy — SEVENPM",
};

export default function Page() {
  return <LegalPage doc={legal.privacy} />;
}
