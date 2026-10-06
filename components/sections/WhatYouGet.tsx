"use client";

import { siteConfig } from "@/data/content";
import { samplePitch } from "@/data/sample";

export default function WhatYouGet() {
  return (
    <section
      id="what-you-get"
      className="relative section-rhythm px-5 sm:px-8 lg:px-12 bg-paper border-b border-rule"
    >
      <div className="max-w-[1200px] mx-auto pb-16 sm:pb-20">
        {/* Section Header */}
        <div className="max-w-2xl mb-12 text-left">
          <span className="text-xs uppercase font-mono tracking-[0.08em] text-ink-3 mb-3 font-semibold block">
            {siteConfig.sectionWhatYouGet.label}
          </span>
          <h2 className="font-serif text-[clamp(2rem,3.8vw,3.25rem)] font-bold text-ink leading-[1.05]">
            {siteConfig.sectionWhatYouGet.h2}
          </h2>
        </div>

        {/* Spec Rows: Five rows, two columns each, separated by hairlines */}
        <div className="divide-y divide-rule border-t border-b border-rule">
          {samplePitch.specRows.map((row) => (
            <div
              key={row.title}
              className="py-6 sm:py-8 grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 items-baseline group transition-transform duration-150 ease-out hover:translate-x-1"
            >
              {/* Left Column (cols 1-5): Name in Fraunces 28px */}
              <div className="md:col-span-5">
                <h3 className="font-serif text-2xl sm:text-[28px] font-medium text-ink leading-tight">
                  {row.title}
                </h3>
              </div>

              {/* Right Column (cols 6-12): Mono sample output + plain sentence */}
              <div className="md:col-span-7 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 sm:gap-6">
                <p className="text-base text-ink-2 font-sans order-2 sm:order-1 max-w-md">
                  {row.description}
                </p>
                <div className="order-1 sm:order-2 font-mono text-sm sm:text-base font-bold text-ink bg-paper-2 px-3 py-1 border border-rule shrink-0 tabular-numbers" style={{ borderRadius: "2px" }}>
                  {row.mono}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
