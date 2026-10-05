import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/layout/SmoothScroll";
import CustomCursor from "@/components/layout/CustomCursor";
import ScrollProgress from "@/components/layout/ScrollProgress";
import PageLoader from "@/components/layout/PageLoader";
import { siteConfig } from "@/data/content";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: `${siteConfig.name} - ${siteConfig.tagline}`,
  description: siteConfig.description,
  keywords: [
    "hackathon pitch coach",
    "AI pitch rehearsal",
    "hackathon judge simulator",
    "speech cadence telemetry",
    "pitch deck timing",
    "ETHGlobal",
    "HackMIT",
    "TreeHacks",
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
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable} dark scroll-smooth`}
    >
      <body className="bg-[#07070B] text-[#F5F5FA] font-sans antialiased min-h-screen relative selection:bg-[#7C5CFF]/30 selection:text-white">
        {/* Subtle film grain noise overlay */}
        <div className="noise-overlay" aria-hidden="true" />

        {/* Global Progress Bar */}
        <ScrollProgress />

        {/* Custom Trailing Magnetic Cursor */}
        <CustomCursor />

        {/* Cinematic Intro Preloader */}
        <PageLoader />

        {/* Smooth Lenis Scrolling Provider */}
        <SmoothScroll>
          <div className="relative min-h-screen flex flex-col justify-between">
            {children}
          </div>
        </SmoothScroll>
      </body>
    </html>
  );
}
