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
        className="relative bg-paper-2 border border-ink p-6 sm:p-7 paper-shadow transform -rotate-[1.5deg] text-ink select-none"
        style={{ borderRadius: "2px" }}
      >
        {/* Header Row */}
        <div className="flex items-center justify-between pb-3.5 border-b border-rule text-xs font-mono tracking-wider">
          <div className="flex items-center gap-2">
            <span className="bg-ink text-paper px-1.5 py-0.5 text-[11px] font-semibold">
              SAMPLE PITCH
            </span>
            <span className="text-ink font-semibold truncate max-w-[200px] sm:max-w-none">
              {samplePitch.name}: {samplePitch.tagline}
            </span>
          </div>
          <span className="text-ink-3 font-semibold">{samplePitch.runShort}</span>
        </div>

        {/* Stopwatch row */}
        <div className="my-5 flex items-baseline justify-between border-b border-rule pb-4">
          <div>
            <span className="text-[11px] uppercase font-mono tracking-widest text-ink-3 block mb-1">
              RECORDED DURATION
            </span>
            <div className="text-3xl sm:text-4xl font-mono font-bold tracking-tight text-ink tabular-numbers">
              {displayTimer}{" "}
              <span className="text-ink-3 text-xl font-normal font-mono">
                / {samplePitch.timeLimit}
              </span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[11px] uppercase font-mono tracking-widest text-ink-3 block mb-1">
              TOTAL COMPOSITE
            </span>
            <div className="text-3xl sm:text-4xl font-serif font-bold text-ink tabular-numbers">
              {samplePitch.overallScore}
            </div>
          </div>
        </div>

        {/* Five Rubric Rows with dotted leader line and tick draw-in */}
        <div className="space-y-3.5 pt-1">
          {samplePitch.rubric.map((item, idx) => (
            <div key={item.category} className="relative flex items-center justify-between text-sm">
              {/* Category Name */}
              <div className="flex items-center gap-2 shrink-0">
                {/* SVG hand-drawn tick */}
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
                <span className="font-serif font-medium text-ink text-base">
                  {item.category}
                </span>
              </div>

              {/* Dotted leader line */}
              <div className="mx-2 grow border-b border-dotted border-rule h-0 min-w-[20px]" />

              {/* Score */}
              <span className="font-mono font-bold text-ink shrink-0 tabular-numbers">
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
          className="mt-6 pt-3 border-t border-rule flex items-center justify-between"
        >
          <div className="flex items-center gap-2 transform rotate-2 text-danger">
            <svg
              width="24"
              height="20"
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
            <span className="font-handwriting text-xl sm:text-2xl font-bold tracking-wide">
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
    <div
      ref={containerRef}
      className="w-full border border-rule bg-paper overflow-x-auto text-ink"
      style={{ borderRadius: "2px" }}
    >
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-rule bg-paper-2 text-[12px] font-mono uppercase tracking-widest text-ink-3">
            <th className="py-3 px-4 sm:px-6 font-semibold">Category</th>
            <th className="py-3 px-3 sm:px-4 font-semibold w-24">Weight</th>
            <th className="py-3 px-4 sm:px-6 font-semibold hidden md:table-cell">
              What a judge looks for
            </th>
            <th className="py-3 px-4 sm:px-6 font-semibold">Sample comment</th>
            <th className="py-3 px-4 sm:px-6 font-semibold text-right w-28">Score</th>
          </tr>
        </thead>
        <tbody>
          {samplePitch.rubric.map((item, idx) => (
            <tr
              key={item.category}
              className="border-b border-rule hover:bg-paper-2 transition-colors duration-150 group"
            >
              <td className="py-4 px-4 sm:px-6 align-top">
                <div className="font-serif text-xl sm:text-2xl font-medium text-ink">
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
              <td className="py-4 px-3 sm:px-4 align-top font-mono text-sm text-ink-3">
                {item.weight}
              </td>
              <td className="py-4 px-4 sm:px-6 align-top text-sm text-ink-2 hidden md:table-cell">
                {item.criterion}
              </td>
              <td className="py-4 px-4 sm:px-6 align-top text-sm text-ink-2 italic font-sans">
                “{item.comment}”
              </td>
              <td className="py-4 px-4 sm:px-6 align-top text-right font-mono font-bold text-lg sm:text-xl tabular-numbers text-ink">
                {item.score} / 10
              </td>
            </tr>
          ))}
          {/* Total Row */}
          <tr className="bg-paper-2">
            <td colSpan={3} className="py-6 px-4 sm:px-6 font-serif text-2xl sm:text-3xl font-bold text-ink">
              Overall Score
            </td>
            <td className="py-6 px-4 sm:px-6 hidden sm:table-cell font-mono text-xs uppercase tracking-wider text-ink-3">
              Weighted composite (Sample Run 4)
            </td>
            <td className="py-6 px-4 sm:px-6 text-right font-serif text-3xl sm:text-4xl font-bold text-ink tabular-numbers">
              {samplePitch.overallScore}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
