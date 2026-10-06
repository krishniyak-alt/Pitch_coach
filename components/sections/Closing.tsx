"use client";

import Link from "next/link";
import { siteConfig } from "@/data/content";

export default function Closing() {
  return (
    <section className="relative section-rhythm px-5 sm:px-8 lg:px-12 bg-paper border-b border-rule">
      <div className="max-w-[1200px] mx-auto pb-20 sm:pb-28 text-left">
        {/* Left-aligned H2: "Run your pitch once before it counts." */}
        <h2 className="font-serif text-[clamp(2.5rem,5.5vw,4.75rem)] font-bold text-ink leading-[1.02] tracking-tight mb-8 max-w-2xl">
          {siteConfig.closing.h2}
        </h2>

        {/* The primary button */}
        <div>
          <Link href="/practice" className="btn-signal text-base py-3.5 px-6 font-semibold">
            <span>{siteConfig.closing.cta}</span>
            <span className="arrow-nudge text-lg">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
