import type { Metadata } from "next";
import { Figtree, Inter, Roboto } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

import { Experience } from "@/components/motion/Experience";
import { BASE_PATH } from "@/lib/basePath";

/* The six assets the stylesheets reach for by URL. `next/image` and the
   router prefix the base path themselves; CSS `url()` does not, so when the
   site is served from a sub-path the variables are redefined here. */
const CSS_ASSETS = `:root{
  --asset-arrow-right-24:url("${BASE_PATH}/assets/ic-arrow-right-24.svg");
  --asset-arrow-up-right-24:url("${BASE_PATH}/assets/ic-arrow-up-right-24.svg");
  --asset-arrow-right-20:url("${BASE_PATH}/assets/ic-arrow-right-20.svg");
  --asset-arrow-left-20:url("${BASE_PATH}/assets/ic-arrow-left-20.svg");
  --asset-chevron-down-16:url("${BASE_PATH}/assets/ic-chevron-down-16.svg");
  --asset-grain:url("${BASE_PATH}/assets/grain.png");
  --asset-hero-vinyl:url("${BASE_PATH}/assets/hero-vinyl.png");
}`;

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  variable: "--font-roboto",
  display: "swap",
});

const figtree = Figtree({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-figtree",
  display: "swap",
});

/** Daltown — the display face for every oversized heading. Licensed; the
 *  file is the one the team owns (see README, "Display type"). */
const daltown = localFont({
  src: "../fonts/Daltown.woff2",
  weight: "400",
  style: "normal",
  variable: "--font-daltown",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SEVENPM",
  description:
    "SEVENPM — live music, festivals and cultural events across Morocco.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    // The font variables live on <html>, not <body>: the @theme tokens in
    // globals.css are defined on :root and reference them, and a custom
    // property that points at an undefined variable resolves to nothing.
    <html
      lang="en"
      className={`${roboto.variable} ${figtree.variable} ${inter.variable} ${daltown.variable}`}
    >
      <head>{BASE_PATH ? <style>{CSS_ASSETS}</style> : null}</head>
      <body>
        {children}
        <Experience />
      </body>
    </html>
  );
}
