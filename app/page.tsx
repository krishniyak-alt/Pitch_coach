"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import TheRun from "@/components/sections/TheRun";
import TheJudge from "@/components/sections/TheJudge";
import TheScoresheet from "@/components/sections/TheScoresheet";
import WhatYouGet from "@/components/sections/WhatYouGet";
import BuiltBy from "@/components/sections/BuiltBy";
import FAQ from "@/components/sections/FAQ";
import Closing from "@/components/sections/Closing";

export default function Home() {
  return (
    <main className="relative bg-paper text-ink min-h-screen">
      {/* 5.1 Header */}
      <Navbar />

      {/* 5.2 Hero (Asymmetric split, ghost 3:00 parallax, hero scoresheet) */}
      <Hero />

      {/* 5.3 01 / THE RUN (Sticky timeline, 5 real UI frames) */}
      <TheRun />

      {/* 5.4 02 / THE JUDGE (Inverted ink section, transcript, difficulty toggle) */}
      <TheJudge />

      {/* 5.5 03 / THE SCORESHEET (Hairline table with thin signal bars) */}
      <TheScoresheet />

      {/* 5.6 04 / WHAT YOU GET (Spec rows with hover shift) */}
      <WhatYouGet />

      {/* 5.7 05 / BUILT BY (Human section with team facts and TODO_REAL) */}
      <BuiltBy />

      {/* 5.8 FAQ (Visible Q&A pairs, no accordion) */}
      <FAQ />

      {/* 5.9 Closing */}
      <Closing />

      {/* Footer */}
      <Footer />
    </main>
  );
}
