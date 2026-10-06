"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { siteConfig } from "@/data/content";
import Scoresheet from "@/components/ui/Scoresheet";

export default function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollY } = useScroll();

  // Parallax: ghost numeral moves +/-80px, scoresheet moves +/-24px in opposite direction
  const ghostY = useTransform(scrollY, [0, 800], [0, 80]);
  const sheetY = useTransform(scrollY, [0, 800], [0, -24]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-[min(100svh,860px)] flex flex-col justify-center pt-16 sm:pt-20 lg:pt-24 pb-12 px-5 sm:px-8 lg:px-12 bg-paper overflow-clip border-b border-rule"
    >
      {/* Huge ghost numeral 3:00 in Fraunces clipped by the hero (parallax layer) */}
      <motion.div
        style={{ y: ghostY }}
        className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none select-none text-[clamp(14rem,30vw,28rem)] font-serif font-bold text-ink/[0.04] leading-none z-0 tracking-tighter"
        aria-hidden="true"
      >
        3:00
      </motion.div>

      <div className="relative z-10 w-full max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left: Columns 1-7 (Left-aligned, NOT centered) */}
        <div className="lg:col-span-7 flex flex-col items-start text-left">
          {/* Mono Eyebrow */}
          <span className="text-xs uppercase font-mono tracking-[0.08em] text-ink-3 mb-4 font-semibold block">
            {siteConfig.hero.eyebrow}
          </span>

          {/* H1 with marker-style signal highlight behind "stop listening" */}
          <h1 className="font-serif text-[clamp(2.75rem,6.2vw,5.5rem)] font-bold text-ink leading-[1.0] tracking-tight mb-5">
            Find out where the judges{" "}
            <span className="relative inline-block whitespace-nowrap">
              {/* Highlight bar about 0.38em tall sitting behind the baseline */}
              <motion.span
                className="absolute left-0 bottom-[0.1em] h-[0.38em] bg-signal -z-10"
                style={{ borderRadius: "2px" }}
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              />
              <span className="relative z-10 text-ink">stop listening.</span>
            </span>
          </h1>

          {/* Subtext */}
          <p className="text-[17px] sm:text-lg text-ink-2 max-w-[520px] leading-relaxed mb-8">
            {siteConfig.hero.subtext}
          </p>

          {/* CTA Row */}
          <div className="flex flex-wrap items-center gap-6 sm:gap-8 mb-6">
            <Link href="/practice" className="btn-signal">
              <span>{siteConfig.hero.primaryCta}</span>
              <span className="arrow-nudge text-base">→</span>
            </Link>

            <a href="#scoresheet" className="link-underline text-[15px] font-medium text-ink">
              {siteConfig.hero.secondaryCta}
            </a>
          </div>

          {/* Mono Requirement Line */}
          <div className="text-xs font-mono uppercase tracking-[0.08em] text-ink-3">
            {siteConfig.hero.requirementNote}
          </div>
        </div>

        {/* Right: Columns 8-12 */}
        <motion.div
          style={{ y: sheetY }}
          className="lg:col-span-5 w-full max-w-[480px] lg:max-w-none mx-auto lg:mx-0"
        >
          <Scoresheet variant="hero" />
        </motion.div>
      </div>
    </section>
  );
}
