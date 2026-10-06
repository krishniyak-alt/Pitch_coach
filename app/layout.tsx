import type { Metadata, Viewport } from "next";
import { Fraunces, Instrument_Sans, IBM_Plex_Mono, Caveat } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/layout/SmoothScroll";
import { siteConfig } from "@/data/content";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["500", "600"],
  display: "swap",
});

const instrumentSans = Instrument_Sans({
  variable: "--font-instrument-sans",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  weight: ["600"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: `${siteConfig.name} - ${siteConfig.tagline}`,
  description: siteConfig.description,
  keywords: [
    "hackathon pitch coach",
    "pitch rehearsal",
    "scoresheet",
    "speech timer",
    "pitch deck practice",
  ],
  openGraph: {
    title: `${siteConfig.name} - ${siteConfig.tagline}`,
    description: siteConfig.description,
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${instrumentSans.variable} ${ibmPlexMono.variable} ${caveat.variable} scroll-smooth`}
    >
      <body className="bg-paper text-ink font-sans antialiased relative selection:bg-signal selection:text-on-signal min-h-[100svh]">
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
