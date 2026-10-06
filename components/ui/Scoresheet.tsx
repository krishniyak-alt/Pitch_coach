"use client";

import { useEffect, useState, useRef } from "react";
import { samplePitch, RubricCategory } from "@/data/sample";
import { motion, useInView } from "framer-motion";

interface ScoresheetProps {
  variant?: "hero" | "full";
}

export default function Scoresheet({ variant = "hero" }: ScoresheetProps) {
  const [displayTimer, setDisplayTimer] = useState("00:00");
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.2 });

  useEffect(() => {
    if (variant !== "hero") return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      setDisplayTimer(samplePitch.recordedTime);
      return;
    }

    // Timer counts 00:00 to 02:47 over 2.4s with ease-out
    let startTime: number | null = null;
    const targetSeconds = samplePitch.recordedTimeSec; // 167 seconds = 02:47
    const duration = 2400;

    let animId: number;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutQuad
      const easedProgress = 1 - (1 - progress) * (1 - progress);
      const currentSec = Math.floor(easedProgress * targetSeconds);

      const m = Math.floor(currentSec / 60);
      const s = currentSec % 60;
      setDisplayTimer(
        `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
      );

      if (progress < 1) {
        animId = requestAnimationFrame(step);
      } else {
        setDisplayTimer(samplePitch.recordedTime);
      }
    };

    animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, [variant]);

  if (variant === "hero") {
    return (
      <div
        ref={containerRef}
        className="relative bg-paper-2 border border-ink p-5 sm:p-7 paper-shadow transform -rotate-[1.5deg] text-ink select-none w-full max-w-full overflow-hidden"
        style={{ borderRadius: "2px" }}
      >
        {/* Header Row */}
        <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 pb-3.5 border-b border-rule text-xs font-mono tracking-wider">
          <div className="flex items-center gap-2 min-w-0">
            <span className="bg-ink text-paper px-1.5 py-0.5 text-[11px] font-semibold shrink-0">
              SAMPLE PITCH
            </span>
            <span className="text-ink font-semibold truncate text-[11px] sm:text-xs">
              {samplePitch.name}: {samplePitch.tagline}
            </span>
          </div>
          <span className="text-ink-3 font-semibold shrink-0 text-[11px] sm:text-xs">
            {samplePitch.runShort}
          </span>
        </div>

        {/* Stopwatch row (stacks on small phone, inline on tablet/desktop) */}
        <div className="my-4 sm:my-5 flex flex-col sm:flex-row items-start sm:items-baseline justify-between gap-3 sm:gap-0 border-b border-rule pb-4">
          <div>
            <span className="text-[10px] sm:text-[11px] uppercase font-mono tracking-widest text-ink-3 block mb-1">
              RECORDED DURATION
            </span>
            <div className="text-2xl sm:text-4xl font-mono font-bold tracking-tight text-ink tabular-numbers">
              {displayTimer}{" "}
              <span className="text-ink-3 text-lg sm:text-xl font-normal font-mono">
                / {samplePitch.timeLimit}
              </span>
            </div>
          </div>
          <div className="text-left sm:text-right">
            <span className="text-[10px] sm:text-[11px] uppercase font-mono tracking-widest text-ink-3 block mb-1">
              TOTAL COMPOSITE
            </span>
            <div className="text-2xl sm:text-4xl font-serif font-bold text-ink tabular-numbers">
              {samplePitch.overallScore}
            </div>
          </div>
        </div>

        {/* Five Rubric Rows with dotted leader line and tick draw-in */}
        <div className="space-y-3 pt-1">
          {samplePitch.rubric.map((item, idx) => (
            <div key={item.category} className="relative flex items-center justify-between text-sm">
              {/* Category Name */}
              <div className="flex items-center gap-2 shrink-0">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  className="shrink-0 text-success"
                  fill="none"
                >
                  <motion.path
                    d="M3 8.5L6.5 12L13 4"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: isInView ? 1 : 0 }}
                    transition={{
                      duration: 0.5,
                      delay: 0.7 + idx * 0.18,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  />
                </svg>
                <span className="font-serif font-medium text-ink text-sm sm:text-base">
                  {item.category}
                </span>
              </div>

              {/* Dotted leader line */}
              <div className="mx-2 grow border-b border-dotted border-rule h-0 min-w-[12px]" />

              {/* Score */}
              <span className="font-mono font-bold text-ink shrink-0 tabular-numbers text-xs sm:text-sm">
                {item.score} / 10
              </span>
            </div>
          ))}
        </div>

        {/* Handwritten margin note in Caveat, rotated 2deg, in --danger with arrow pointing to Presentation */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 8 }}
          transition={{ duration: 0.6, delay: 1.8, ease: [0.22, 1, 0.36, 1] }}
          className="mt-5 sm:mt-6 pt-3 border-t border-rule flex flex-wrap items-center justify-between gap-2"
        >
          <div className="flex items-center gap-2 transform rotate-2 text-danger">
            <svg
              width="22"
              height="18"
              viewBox="0 0 24 20"
              fill="none"
              className="shrink-0 stroke-danger"
            >
              <path
                d="M3 15C8 14 14 11 18 4M18 4L13 5M18 4L17 9"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="font-handwriting text-lg sm:text-2xl font-bold tracking-wide">
              {samplePitch.marginNote}
            </span>
          </div>
          <span className="text-[10px] uppercase font-mono tracking-widest text-ink-3">
            SAMPLE REPORT
          </span>
        </motion.div>
      </div>
    );
  }

  // Full variant (Table format for Section 5.5 and Results page)
  return (
    <div className="w-full">
      {/* Mobile scroll hint */}
      <div className="md:hidden text-xs font-mono text-ink-3 pb-2 flex items-center justify-end gap-1 select-none">
        <span>Swipe horizontally to view full rubric</span>
        <span className="text-signal">→</span>
      </div>

      <div
        ref={containerRef}
        className="w-full border border-rule bg-paper overflow-x-auto overscroll-x-contain text-ink"
        style={{ borderRadius: "2px" }}
      >
        <table className="w-full min-w-[580px] text-left border-collapse">
          <thead>
            <tr className="border-b border-rule bg-paper-2 text-[12px] font-mono uppercase tracking-widest text-ink-3">
              <th className="py-3 px-4 sm:px-6 font-semibold">Category</th>
              <th className="py-3 px-3 sm:px-4 font-semibold w-20 sm:w-24">Weight</th>
              <th className="py-3 px-4 sm:px-6 font-semibold hidden lg:table-cell">
                What a judge looks for
              </th>
              <th className="py-3 px-4 sm:px-6 font-semibold">Sample comment</th>
              <th className="py-3 px-4 sm:px-6 font-semibold text-right w-24 sm:w-28">Score</th>
            </tr>
          </thead>
          <tbody>
            {samplePitch.rubric.map((item, idx) => (
              <tr
                key={item.category}
                className="border-b border-rule hover:bg-paper-2 transition-colors duration-150 group"
              >
                <td className="py-4 px-4 sm:px-6 align-top">
                  <div className="font-serif text-lg sm:text-2xl font-medium text-ink">
                    {item.category}
                  </div>
                  {/* Thin signal score bar (4px) under each row */}
                  <div className="mt-2.5 w-full bg-rule h-1 overflow-hidden" style={{ borderRadius: "2px" }}>
                    <motion.div
                      className="h-full bg-signal"
                      initial={{ width: 0 }}
                      animate={{ width: isInView ? `${(item.score / 10) * 100}%` : "0%" }}
                      transition={{
                        duration: 0.8,
                        delay: 0.1 + idx * 0.1,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                    />
                  </div>
                </td>
                <td className="py-4 px-3 sm:px-4 align-top font-mono text-xs sm:text-sm text-ink-3">
                  {item.weight}
                </td>
                <td className="py-4 px-4 sm:px-6 align-top text-sm text-ink-2 hidden lg:table-cell">
                  {item.criterion}
                </td>
                <td className="py-4 px-4 sm:px-6 align-top text-xs sm:text-sm text-ink-2 italic font-sans">
                  “{item.comment}”
                </td>
                <td className="py-4 px-4 sm:px-6 align-top text-right font-mono font-bold text-base sm:text-xl tabular-numbers text-ink">
                  {item.score} / 10
                </td>
              </tr>
            ))}
            {/* Total Row */}
            <tr className="bg-paper-2">
              <td colSpan={2} className="py-5 sm:py-6 px-4 sm:px-6 font-serif text-xl sm:text-3xl font-bold text-ink">
                Overall Score
              </td>
              <td className="py-5 sm:py-6 px-4 sm:px-6 hidden lg:table-cell font-mono text-xs uppercase tracking-wider text-ink-3">
                Weighted composite (Sample Run 4)
              </td>
              <td className="py-5 sm:py-6 px-4 sm:px-6 lg:hidden" />
              <td className="py-5 sm:py-6 px-4 sm:px-6 text-right font-serif text-2xl sm:text-4xl font-bold text-ink tabular-numbers">
                {samplePitch.overallScore}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
