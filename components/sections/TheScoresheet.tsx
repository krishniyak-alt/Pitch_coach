"use client";

import { siteConfig } from "@/data/content";
import Scoresheet from "@/components/ui/Scoresheet";

export default function TheScoresheet() {
  return (
    <section
      id="scoresheet"
      className="relative section-rhythm px-5 sm:px-8 lg:px-12 bg-paper border-b border-rule"
    >
      <div className="max-w-[1200px] mx-auto pb-16 sm:pb-20">
        {/* Section Header: Mono label + H2 + body (Left-aligned) */}
        <div className="max-w-2xl mb-10 text-left">
          <span className="text-xs uppercase font-mono tracking-[0.08em] text-ink-3 mb-3 font-semibold block">
            {siteConfig.sectionScoresheet.label}
          </span>
          <h2 className="font-serif text-[clamp(2rem,3.8vw,3.25rem)] font-bold text-ink leading-[1.05] mb-4">
            {siteConfig.sectionScoresheet.h2}
          </h2>
          <p className="text-ink-2 text-base leading-relaxed">
            {siteConfig.sectionScoresheet.body}
          </p>
        </div>

        {/* Full Scoresheet Table */}
        <Scoresheet variant="full" />
      </div>
    </section>
  );
}
