import type { Metadata } from "next";
import { Playfair_Display, DM_Sans, DM_Mono } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const dmMono = DM_Mono({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-dm-mono",
  display: "swap",
});

const apiBase = process.env.NEXT_PUBLIC_API_URL ?? "";
const basePath = process.env.BUILD_MODE === "static" ? "/fyc-ballot" : "";

export const metadata: Metadata = {
  metadataBase: new URL("https://jerrysoer.github.io/fyc-ballot"),
  icons: {
    icon: [{ url: `${basePath}/icon.svg`, type: "image/svg+xml" }],
  },
  title: "For Your Consideration — 98th Oscars Ballot",
  description:
    "Fill out your 2026 Oscars ballot. Get roasted. See how chaotic your picks are. Bury your wrong predictions in a cemetery after the ceremony.",
  openGraph: {
    title: "For Your Consideration — 98th Oscars Ballot",
    description:
      "Fill out your 2026 Oscars ballot. Get roasted. See how chaotic your picks are.",
    type: "website",
    images: [{ url: `${apiBase}/api/og`, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "For Your Consideration — 98th Oscars Ballot",
    description:
      "Fill out your 2026 Oscars ballot. Get roasted. See how chaotic your picks are.",
    images: [`${apiBase}/api/og`],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${playfair.variable} ${dmSans.variable} ${dmMono.variable}`}
      >
        {children}
      </body>
    </html>
  );
}
