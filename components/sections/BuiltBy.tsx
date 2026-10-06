"use client";

import { siteConfig } from "@/data/content";

export default function BuiltBy() {
  const content = siteConfig.sectionBuiltBy;

  return (
    <section
      id="built-by"
      className="relative section-rhythm px-5 sm:px-8 lg:px-12 bg-paper border-b border-rule"
    >
      <div className="max-w-[1200px] mx-auto pb-16 sm:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left: Mono Label */}
          <div className="lg:col-span-4">
            <span className="text-xs uppercase font-mono tracking-[0.08em] text-ink-3 mb-3 font-semibold block">
              {content.label}
            </span>
            <h2 className="font-serif text-2xl font-bold text-ink">
              {content.h2}
            </h2>
          </div>

          {/* Right: Paragraph in Fraunces 28-32px + Team list */}
          <div className="lg:col-span-8 flex flex-col space-y-10">
            {/* Paragraph in Fraunces 28-32px */}
            <p className="font-serif text-[clamp(1.5rem,2.8vw,2rem)] text-ink leading-[1.3] font-normal">
              {content.statement}
            </p>

            {/* Team list in two columns: name, role in mono, college (All TODO_REAL) */}
            <div className="pt-8 border-t border-rule grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
              {content.team.map((member, i) => (
                <div key={i} className="border-l-2 border-rule pl-4 space-y-1">
                  <div className="font-serif text-xl font-bold text-ink">
                    {member.name}
                  </div>
                  <div className="font-mono text-xs uppercase tracking-wider text-ink-3 font-semibold">
                    {member.role}
                  </div>
                  <div className="font-sans text-sm text-ink-2">
                    {member.college}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
