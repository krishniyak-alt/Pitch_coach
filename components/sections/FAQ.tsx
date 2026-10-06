"use client";

import { siteConfig } from "@/data/content";

export default function FAQ() {
  return (
    <section
      id="faq"
      className="relative section-rhythm px-5 sm:px-8 lg:px-12 bg-paper border-b border-rule"
    >
      <div className="max-w-[1200px] mx-auto pb-16 sm:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column (cols 1-4): Label + H2 */}
          <div className="lg:col-span-4 lg:sticky lg:top-24">
            <span className="text-xs uppercase font-mono tracking-[0.08em] text-ink-3 mb-3 font-semibold block">
              QUESTIONS & PROTOCOLS
            </span>
            <h2 className="font-serif text-[clamp(2rem,3.8vw,3.25rem)] font-bold text-ink leading-[1.05]">
              Frequently asked questions.
            </h2>
          </div>

          {/* Right Column (cols 5-12): 5 Q&A pairs visible, separated by hairlines (NO accordion) */}
          <div className="lg:col-span-8 divide-y divide-rule border-t lg:border-t-0 border-rule">
            {siteConfig.faqs.map((faq) => (
              <div key={faq.question} className="py-7 first:pt-0 last:pb-0 space-y-2">
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-ink">
                  {faq.question}
                </h3>
                <p className="text-base text-ink-2 leading-relaxed font-sans max-w-xl">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
